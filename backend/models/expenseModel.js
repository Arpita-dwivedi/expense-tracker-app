const { DataTypes } = require("sequelize");
const sequelize = require("../utils/database");

const Expense = sequelize.define("Expense", {
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    note: {
        type: DataTypes.STRING,
        allowNull: true
    }
});

module.exports = Expense;
