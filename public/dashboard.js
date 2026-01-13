console.log("DASHBOARD JS LOADED");

document.addEventListener("DOMContentLoaded", () => {

    const expenseForm = document.getElementById("expenseForm");
    const expenseList = document.getElementById("expenseList");
    const logoutBtn = document.getElementById("logoutBtn");

    // Safety check
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
            await axios.post("http://localhost:3000/api/expenses/add", {
                amount,
                description,
                category
            });

            expenseForm.reset();
            loadExpenses();
        } catch (err) {
            console.error(err);
            alert("Failed to add expense");
        }
    });

    async function loadExpenses() {
        try {
            const res = await axios.get("http://localhost:3000/api/expenses");
            expenseList.innerHTML = "";

            res.data.forEach(exp => {
                const li = document.createElement("li");
                li.textContent = `${exp.amount} - ${exp.description} (${exp.category})`;
                expenseList.appendChild(li);
            });
        } catch (err) {
            console.error(err);
            alert("Failed to load expenses");
        }
    }

    loadExpenses();

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("isLoggedIn");
        window.location.replace("/login.html");
    });
});
