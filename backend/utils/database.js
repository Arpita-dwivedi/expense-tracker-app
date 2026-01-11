const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("expense_tracker", "root", "Arpita@1234", {
    host: "localhost",
    dialect: "mysql",
});

module.exports = sequelize;
