const User = require('../models/userModel');

async function getLeaderboard() {
  const users = await User.findAll({
    where: {
      isPremium: true
    },
    attributes: ['id', 'fullName', 'totalExpense'],
    order: [['totalExpense', 'DESC']],
    raw: true
  });

  return users.map(user => ({
    userId: user.id,
    name: user.fullName,
    totalExpenses: user.totalExpense
  }));
}

module.exports = { getLeaderboard };