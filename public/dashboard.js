document.addEventListener("DOMContentLoaded", async () => {

    const token = localStorage.getItem("token");
    if (!token) {
        window.location.replace("/login.html");
        return;
    }

    // Check if coming back from payment
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('paymentDone')) {
        const orderId = sessionStorage.getItem("lastOrderId");
        if (orderId) {
            console.log("Payment completed, verifying order:", orderId);
            const token = localStorage.getItem("token");
            try {
                await axios.get(
                    `http://localhost:3000/api/order/premium/${orderId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                console.log("Order status verified");
            } catch (err) {
                console.error("Order verification error:", err);
            }
            sessionStorage.removeItem("lastOrderId");
            await new Promise(resolve => setTimeout(resolve, 1500));
        }
    }

    const expenseForm = document.getElementById("expenseForm");
    const expenseList = document.getElementById("expenseList");
    const logoutBtn = document.getElementById("logoutBtn");

    if (!expenseForm || !expenseList || !logoutBtn) {
        console.error("Dashboard DOM elements not found");
        return;
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
    async function loadExpenses() {
        try {
            const res = await axios.get(
                "http://localhost:3000/api/expenses",
                { headers: { Authorization: `Bearer ${token}` } }
            );

            expenseList.innerHTML = "";

            res.data.forEach(exp => {
                const li = document.createElement("li");
                li.textContent = `${exp.amount} - ${exp.description} (${exp.category})`;

                const btn = document.createElement("button");
                btn.textContent = "Delete";
                btn.classList.add("delete-btn");

                btn.onclick = async () => {
                    try {
                        await axios.delete(
                            `http://localhost:3000/api/expenses/${exp.id}`,
                            { headers: { Authorization: `Bearer ${token}` } }
                        );
                        loadExpenses();
                    } catch (err) {
                        console.error(err);
                        if (err.response && err.response.status === 401) {
                            alert("Session expired. Please log in again.");
                            localStorage.removeItem("token");
                            window.location.replace("/login.html");
                        } else {
                            alert("Failed to delete expense");
                        }
                    }
                };

                li.appendChild(btn);
                expenseList.appendChild(li);
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
                
                // Store orderId for later use
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
            console.log("checkPremiumStatus - Token:", token ? "Present" : "MISSING");
            
            if (!token) {
                console.error("No token found!");
                return;
            }

            const res = await axios.get(
                "http://localhost:3000/api/users/me",
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log("Premium status response:", res.data);

            if (res.data.isPremium) {
                const msgBox = document.getElementById("premiumMessage");
                if (msgBox) msgBox.style.display = "block";
            }
            if (res.data.isPremium) {
                const btn = document.getElementById("buyPremiumBtn");
                if (btn) btn.style.display = "none";
            }
        } catch (err) {
            console.error("checkPremiumStatus error:", err.response?.data || err.message);
        }
    }
    checkPremiumStatus();
});
