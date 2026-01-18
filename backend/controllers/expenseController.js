const expenseService = require("../services/expenseService");

exports.addExpense = async (req, res) => {
    try{
        const { amount, description, category } = req.body;

        await expenseService.addExpense({
            amount: parseInt(amount),
            description,
            category,
            userId: req.user.id
        });
        res.status(201).json({ message: "Expense added" });  
    } catch(err){
        res.status(500).json({message:"server error"});
    }
};

exports.getExpenses = async (req, res) => {
    try{
        const expenses = await expenseService.getExpenses(req.user.id);
        res.json(expenses);
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
