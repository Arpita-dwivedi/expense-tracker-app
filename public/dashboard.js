document.addEventListener("DOMContentLoaded", () => {

    const token = localStorage.getItem("token");
    if (!token) {
        window.location.replace("/login.html");
        return; 
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
});
