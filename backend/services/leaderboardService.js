const Expense = require('../models/expenseModel');
const User = require('../models/userModel');
const sequelize = require('../utils/database');

async function getLeaderboard() {
  const expenseAggregates = await Expense.findAll({
    attributes: [
      'UserId',
      [sequelize.fn('SUM', sequelize.col('amount')), 'totalExpenses']
    ],
    group: ['UserId'],
    raw: true
  });

  expenseAggregates.sort((a, b) => b.totalExpenses - a.totalExpenses);

  const userIds = expenseAggregates.map(item => item.UserId);
  const users = await User.findAll({
    where: {
      id: userIds,
      isPremium: true
    },
    attributes: ['id', 'fullName'],
    raw: true
  });

  const userMap = {};
  users.forEach(user => {
    userMap[user.id] = user.fullName;
  });

  return expenseAggregates.map(item => ({
    userId: item.UserId,
    name: userMap[item.UserId] || 'Unknown',
    totalExpenses: parseFloat(item.totalExpenses)
  }));
}

module.exports = { getLeaderboard };