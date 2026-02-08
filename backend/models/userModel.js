const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const User = sequelize.define("User", {
    fullName: {
        type: DataTypes.STRING,
        allowNull: false
    },

    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },

    password: {
        type: DataTypes.STRING,
        allowNull: false
    },

    isPremium: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },

    totalExpense: {
        type: DataTypes.FLOAT,
        defaultValue: 0
    },

    resetToken: {
        type: DataTypes.STRING,
        allowNull: true
    },

    resetTokenExpiry: {
        type: DataTypes.DATE,
        allowNull: true
    }
});

module.exports = User;
