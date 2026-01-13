console.log("LOGIN JS LOADED");

const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", async () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        alert("Email and password required");
        return;
    }

    try {
        const res = await axios.post(
            "http://localhost:3000/api/users/login",
            { email, password }
        );

        console.log("LOGIN RESPONSE:", res.data);

        if (res.data.success === true) {
            localStorage.setItem("isLoggedIn", "true");
            window.location.href = "/dashboard.html";
        } else {
            alert(res.data.message || "Login failed");
        }

    } catch (err) {
        console.error(err);

        if (err.response) {
            alert(err.response.data.message || "Login error");
        } else {
            alert("Server not reachable");
        }
    }
});
