document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
        const res = await axios.post(
            "http://localhost:3000/api/users/login",
            { email, password }
        );

        alert(res.data.message);
        
    } catch (err) {
        alert(err.response?.data?.message || "Login failed");
    }
});
