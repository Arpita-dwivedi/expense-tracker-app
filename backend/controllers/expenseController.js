const expenseService = require("../services/expenseService");

exports.addExpense = async (req, res) => {
    const { amount, description, category } = req.body;

    await expenseService.addExpense({ amount, description, category });

    res.status(201).json({ message: "Expense added" });
};

exports.getExpenses = async (req, res) => {
    const expenses = await expenseService.getExpenses();
    res.json(expenses);
};
