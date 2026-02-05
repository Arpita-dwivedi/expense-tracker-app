const Expense = require("../models/expenseModel");
const User = require("../models/userModel");

exports.addExpense = async ({ amount, description, category, userId }) => {
    await User.increment('totalExpense', {
        by: amount,
        where: { id: userId }
    });
    return await Expense.create({
        amount,
        description,
        category,
        UserId: userId
    });
};

exports.getExpenses = async (userId) => {
    return await Expense.findAll({
        where:{ UserId:userId}
    });
};

exports.deleteExpense = async (expenseId, userId) => {
    const expense = await Expense.findOne({
        where: {
            id: expenseId,
            UserId: userId
        }
    });

    if (!expense) {
        throw new Error("NOT_ALLOWED");
    }

    await User.decrement('totalExpense', {
        by: expense.amount,
        where: { id: userId }
    });
    await expense.destroy();
};
