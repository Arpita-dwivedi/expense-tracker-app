const User = require("../models/userModel");
const bcrypt = require("bcrypt");


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

