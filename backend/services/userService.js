const User = require("../models/userModel");

exports.registerUser = async ({ fullName, email, password }) => {

    const existingUser = await User.findOne({
        where: { email }
    });

    if (existingUser) {
        throw new Error("EMAIL_EXISTS");
    }

    await User.create({
        fullName,
        email,
        password 
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

    if (user.password !== password) {
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

