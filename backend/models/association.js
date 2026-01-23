const User = require("./userModel");
const Expense = require("./expenseModel");
const Order = require("./orderModel");

User.hasMany(Expense, { foreignKey: 'UserId' });
Expense.belongsTo(User, { foreignKey: 'UserId' });

User.hasMany(Order);
Order.belongsTo(User);

module.exports = {
    User,
    Expense,
    Order
};
