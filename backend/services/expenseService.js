const Expense = require("../models/expenseModel");

exports.addExpense = async ({ amount, description, category }) => {
    return await Expense.create({ amount, description, category });
};

exports.getExpenses = async () => {
    return await Expense.findAll();
};
