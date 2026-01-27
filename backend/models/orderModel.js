const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Order = sequelize.define("Order", {
    orderId : {
        type: Sequelize.STRING,
        primaryKey: true
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false
    },
    orderCurrency :{
        type: Sequelize.STRING,
        allowNull:false
    },
    paymentSessionId:{
        type: Sequelize.STRING,
        allowNull:false
    }


});

module.exports = Order;
