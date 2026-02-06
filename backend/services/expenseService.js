const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const sequelize = require("../utils/database");

exports.addExpense = async ({ amount, description, category, userId }) => {
    const t = await sequelize.transaction();
    try {
        await User.increment('totalExpense', {
            by: amount,
            where: { id: userId },
            transaction: t
        });
        const expense = await Expense.create({
            amount,
            description,
            category,
            UserId: userId
        }, { transaction: t });
        await t.commit();
        return expense;
    } catch (error) {
        await t.rollback();
        throw error;
    }
};

exports.getExpenses = async (userId) => {
    return await Expense.findAll({
        where:{ UserId:userId}
    });
};

exports.deleteExpense = async (expenseId, userId) => {
    const t = await sequelize.transaction();
    try {
        const expense = await Expense.findOne({
            where: {
                id: expenseId,
                UserId: userId
            },
            transaction: t
        });

        if (!expense) {
            await t.rollback();
            throw new Error("NOT_ALLOWED");
        }

        await User.decrement('totalExpense', {
            by: expense.amount,
            where: { id: userId },
            transaction: t
        });
        await expense.destroy({ transaction: t });
        await t.commit();
    } catch (error) {
        await t.rollback();
        throw error;
    }
};
