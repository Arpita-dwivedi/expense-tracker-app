const Expense = require("../models/expenseModel");
const User = require("../models/userModel");
const sequelize = require("../utils/database");
const { Op } = require("sequelize");

exports.addExpense = async ({ amount, description, category, note, userId }) => {
    const t = await sequelize.transaction();
    try {
        const adjustedAmount = category === 'Salary' ? -Math.abs(amount) : amount;

        await User.increment('totalExpense', {
            by: adjustedAmount,
            where: { id: userId },
            transaction: t
        });
        const expense = await Expense.create({
            amount,
            description,
            category,
            note,
            UserId: userId
        }, { transaction: t });
        await t.commit();
        return expense;
    } catch (error) {
        await t.rollback();
        throw error;
    }
};

exports.getExpenses = async (userId, period = 'all', page = 1, limit = 10) => {
    let whereClause = { UserId: userId };

    if (period !== 'all') {
        const now = new Date();
        let startDate;

        if (period === 'daily') {
            startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        } else if (period === 'weekly') {
            const dayOfWeek = now.getDay(); 
            startDate = new Date(now.getTime() - dayOfWeek * 24 * 60 * 60 * 1000);
            startDate.setHours(0, 0, 0, 0);
        } else if (period === 'monthly') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        }

        if (startDate) {
            whereClause.createdAt = { [Op.gte]: startDate };
        }
    }

    const offset = (page - 1) * limit;

    const result = await Expense.findAndCountAll({
        where: whereClause,
        order: [['createdAt', 'DESC']],
        limit: limit,
        offset: offset
    });

    return {
        expenses: result.rows,
        totalCount: result.count
    };
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

        const adjustedAmount = expense.category === 'Salary' ? -Math.abs(expense.amount) : expense.amount;

        await User.decrement('totalExpense', {
            by: adjustedAmount,
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
