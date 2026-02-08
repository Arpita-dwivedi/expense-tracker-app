const UserService = require("../services/userService");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

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
exports.login = async (req, res) => {
    const { email, password } = req.body;

    const result = await UserService.loginUser(email, password);

    if (!result.success) {
        return res.status(401).json({ success: false, message: result.message });
    }
    const token = jwt.sign(
        { userId: result.user.id, email: result.user.email },
        "SECRET_KEY",
        { expiresIn: "1h" }
    );
    res.status(200).json({ success: true, message: "Login successful", token: token });
};

exports.getMe = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({
            isPremium: user.isPremium || false
        });
    } catch (err) {
        console.error("getMe error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const result = await UserService.forgotPassword(email);

        res.status(200).json({ message: result.message, resetLink: result.resetLink });

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({ message: "Token and new password are required" });
        }

        await UserService.resetPassword(token, newPassword);

        res.status(200).json({ message: "Password reset successful" });

    } catch (err) {
        if (err.message === "INVALID_TOKEN") {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        res.status(500).json({ message: "Server error" });
    }
};

