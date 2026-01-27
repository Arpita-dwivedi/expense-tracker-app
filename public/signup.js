document.getElementById("signupForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
        const res = await axios.post(
            "http://localhost:3000/api/users/signup",
            { fullName, email, password,isPremium: false }
        );

        alert(res.data.message);
        e.target.reset();

    } catch (err) {
        if (err.response) {
            alert(err.response.data.message);
        } else {
            alert("Server not reachable");
        }
    }
});
