const expenseService = require("../services/expenseService");

exports.addExpense = async (req, res) => {
    try{
        const { amount, description, category, note } = req.body;

        await expenseService.addExpense({
            amount: parseInt(amount),
            description,
            category,
            note,
            userId: req.user.id
        });
        res.status(201).json({ message: "Expense added" });
    } catch(err){
        res.status(500).json({message:"server error"});
    }
};

exports.getExpenses = async (req, res) => {
    try{
        const period = req.query.period || 'all';
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = await expenseService.getExpenses(req.user.id, period, page, limit);
        const totalPages = Math.ceil(result.totalCount / limit);
        res.json({
            expenses: result.expenses,
            totalPages,
            currentPage: page
        });
    } catch (err){
        res.status(500).json({message:"server error"});
    }
};
exports.deleteExpense = async (req, res) => {
    try {
        await expenseService.deleteExpense(
            req.params.id,
            req.user.id
        );
        res.json({ message: "Expense deleted" });
    } catch {
        res.status(403).json({ message: "Not authorized" });
    }
};
