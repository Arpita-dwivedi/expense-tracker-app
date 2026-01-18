const User = require("./userModel");
const Expense = require("./expenseModel");

User.hasMany(Expense, { foreignKey: 'UserId' });
Expense.belongsTo(User, { foreignKey: 'UserId' });

module.exports = {
    User,
    Expense
};
