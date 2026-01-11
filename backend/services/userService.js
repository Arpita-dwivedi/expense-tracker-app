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
