document.addEventListener("DOMContentLoaded", async () => {

    const token = localStorage.getItem("token");
    if (!token) {
        window.location.replace("/login.html");
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('paymentDone')) {
        const orderId = sessionStorage.getItem("lastOrderId");
        if (orderId) {
            const token = localStorage.getItem("token");
            try {
                await axios.get(
                    `http://localhost:3000/api/order/premium/${orderId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } catch (err) {
                console.error("Order verification error:", err);
            }
            sessionStorage.removeItem("lastOrderId");
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
    }

    const expenseForm = document.getElementById("expenseForm");
    const transactionBody = document.getElementById("transactionBody");
    const periodSelect = document.getElementById("periodSelect");
    const downloadBtn = document.getElementById("downloadBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const descriptionInput = document.getElementById("description");
    const categoryInput = document.getElementById("category");
    const categorySuggestions = document.getElementById("categorySuggestions");

    const staticCategories = ["Food", "Groceries", "Transport", "Petrol", "Utilities", "Entertainment", "Health", "Rent", "Salary", "Miscellaneous"];

    if (!expenseForm || !transactionBody || !logoutBtn) {
        console.error("Dashboard DOM elements not found");
        return;
    }

    if (descriptionInput) {
        descriptionInput.addEventListener('input', async () => {
            const text = descriptionInput.value.trim();
            if (!text) {
                categorySuggestions.innerHTML = staticCategories.map(c => `<option value="${c}"></option>`).join('');
                return;
            }
            try {
                const res = await axios.post('/api/ai/suggest-category', { description: text });
                const cat = res.data?.category;
                if (cat) {
                    categorySuggestions.innerHTML = staticCategories.map(c => `<option value="${c}"></option>`).join('') + `<option value="${cat}"></option>`;
                    if (categoryInput && !categoryInput.value) {
                        categoryInput.value = cat;
                    }
                } else {
                    categorySuggestions.innerHTML = staticCategories.map(c => `<option value="${c}"></option>`).join('');
                }
            } catch (err) {
                console.error('Suggestion error:', err);
                categorySuggestions.innerHTML = staticCategories.map(c => `<option value="${c}"></option>`).join('');
            }
        });
    }

    expenseForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const amount = document.getElementById("amount").value;
        const description = document.getElementById("description").value;
        const category = document.getElementById("category").value;

        try {
            await axios.post(
                "http://localhost:3000/api/expenses/add",
                { amount, description, category },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            expenseForm.reset();
            loadExpenses();

        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 401) {
                alert("Session expired. Please log in again.");
                localStorage.removeItem("token");
                window.location.replace("/login.html");
            } else {
                alert("Failed to add expense");
            }
        }
    });
    async function loadExpenses(period = 'all') {
        try {
            const res = await axios.get(
                `http://localhost:3000/api/expenses?period=${period}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            transactionBody.innerHTML = "";

            res.data.forEach(exp => {
                const tr = document.createElement("tr");

                const date = new Date(exp.createdAt).toLocaleDateString();
                const debit = exp.category === 'Salary' ? '' : exp.amount;
                const credit = exp.category === 'Salary' ? exp.amount : '';

                tr.innerHTML = `
                    <td style="border: 1px solid #ddd; padding: 8px;">${date}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${debit}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${credit}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${exp.description}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;">${exp.category}</td>
                    <td style="border: 1px solid #ddd; padding: 8px;"><button class="delete-btn" data-id="${exp.id}">Delete</button></td>
                `;

                transactionBody.appendChild(tr);
            });

            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = e.target.getAttribute('data-id');
                    try {
                        await axios.delete(
                            `http://localhost:3000/api/expenses/${id}`,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        loadExpenses(period);
                    } catch (err) {
                        console.error(err.response?.data || err.message);
                        if (err.response && err.response.status === 401) {
                            alert("Session expired. Please log in again.");
                            localStorage.removeItem("token");
                            window.location.replace("/login.html");
                        } else {
                            alert("Failed to delete expense");
                        }
                    }
                });
            });

        } catch (err) {
            console.error(err);
            if (err.response && err.response.status === 401) {
                alert("Session expired. Please log in again.");
                localStorage.removeItem("token");
                window.location.replace("/login.html");
            } else {
                alert("Failed to load expenses");
            }
        }
    }

    loadExpenses();

    periodSelect.addEventListener("change", () => {
        loadExpenses(periodSelect.value);
    });

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.replace("/login.html");
    });

    const buyPremiumBtn = document.getElementById("buyPremiumBtn");
    if (buyPremiumBtn) {
        buyPremiumBtn.addEventListener("click", async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    alert("Please log in first.");
                    window.location.replace("/login.html");
                    return;
                }

                const res = await axios.post(
                    "http://localhost:3000/api/order/premium",
                    {},
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                sessionStorage.setItem("lastOrderId", res.data.orderId);

                const cashfree = Cashfree({
                    mode: "sandbox"
                });

                cashfree.checkout({
                    paymentSessionId: res.data.paymentSessionId,
                    redirectTarget: "_self"
                });
            } catch (err) {
                console.error("Buy Premium error:", err);
                if (err.response && err.response.status === 401) {
                    alert("Session expired. Please log in again.");
                    localStorage.removeItem("token");
                    window.location.replace("/login.html");
                } else {
                    alert("Failed to initiate premium purchase. Please try again.");
                }
            }
        });
    }
    async function checkPremiumStatus() {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                console.error("No token found!");
                return;
            }

            const res = await axios.get(
                "http://localhost:3000/api/users/me",
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.isPremium) {
                const msgBox = document.getElementById("premiumMessage");
                if (msgBox) msgBox.style.display = "block";
                const btn = document.getElementById("buyPremiumBtn");
                if (btn) btn.style.display = "none";
                if (downloadBtn) downloadBtn.disabled = false;
            } else {
                if (downloadBtn) downloadBtn.disabled = true;
            }
        } catch (err) {
            console.error("checkPremiumStatus error:", err.response?.data || err.message);
        }
    }

    if (downloadBtn) {
        downloadBtn.addEventListener("click", async () => {
            try {
                const res = await axios.get(
                    `http://localhost:3000/api/expenses?period=${periodSelect.value}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const csvContent = "data:text/csv;charset=utf-8,"
                    + "Date,Debit,Credit,Description,Category\n"
                    + res.data.map(exp => {
                        const date = new Date(exp.createdAt).toLocaleDateString();
                        const debit = exp.category === 'Salary' ? '' : exp.amount;
                        const credit = exp.category === 'Salary' ? exp.amount : '';
                        return `${date},${debit},${credit},"${exp.description}",${exp.category}`;
                    }).join("\n");

                const encodedUri = encodeURI(csvContent);
                const link = document.createElement("a");
                link.setAttribute("href", encodedUri);
                link.setAttribute("download", "expenses.csv");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } catch (err) {
                console.error("Download error:", err);
                alert("Failed to download expenses");
            }
        });
    }
    checkPremiumStatus();
});
