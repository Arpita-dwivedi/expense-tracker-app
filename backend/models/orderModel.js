const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Order = sequelize.define("Order", {
    id: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = Order;
