const UserService = require("../services/userService");

exports.signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields required" });
        }

        await UserService.registerUser({ fullName, email, password });

        res.status(201).json({ message: "Signup successful" });

    } catch (err) {
        if (err.message === "EMAIL_EXISTS") {
            return res.status(400).json({ message: "Email already exists" });
        }

        res.status(500).json({ message: "Server error" });
    }
};
