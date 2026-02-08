const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { Op } = require("sequelize");
const EmailService = require("./emailService");


exports.registerUser = async ({ fullName, email, password }) => {

    const existingUser = await User.findOne({
        where: { email }
    });

    if (existingUser) {
        throw new Error("EMAIL_EXISTS");
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    await User.create({
        fullName,
        email,
        password: hashedPassword
    });

    return true;
};
exports.loginUser = async (email, password) => {
    const user = await User.findOne({ where: { email } });

    if (!user) {
        return {
            success: false,
            message: "Email does not exist"
        };
    }

    const isPasswordMatch = await bcrypt.compare(
        password,
        user.password
    );

    if (!isPasswordMatch) {
        return {
            success: false,
            message: "Wrong password"
        };
    }

    return {
        success: true,
        user
    };
};

exports.forgotPassword = async (email) => {
    const user = await User.findOne({ where: { email } });

    if (user) {
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 3600000); 

        user.resetToken = resetToken;
        user.resetTokenExpiry = resetTokenExpiry;
        await user.save();

        try {
            await EmailService.sendResetEmail(email, resetToken);
        } catch (emailError) {
            console.error('Failed to send reset email:', emailError);
        }
        console.log('Reset link for', email, ':', `http://localhost:3000/reset.html?token=${resetToken}`);
        return { message: "Reset link generated", resetLink: `http://localhost:3000/reset.html?token=${resetToken}` };
    }
    return { message: "If the email exists, a reset link has been sent" };
};

exports.resetPassword = async (token, newPassword) => {
    console.log('Reset password attempt with token length:', token ? token.length : 'null');

    const user = await User.findOne({
        where: {
            resetToken: token,
            resetTokenExpiry: {
                [Op.gt]: new Date() 
            }
        }
    });
    console.log('User found for reset:', !!user);

    if (!user) {
        throw new Error("INVALID_TOKEN");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiry = null;
    await user.save();

    console.log('Password reset successful for user:', user.email);
    return { message: "Password reset successful" };
};

