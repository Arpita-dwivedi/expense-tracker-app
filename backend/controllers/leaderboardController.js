const { getLeaderboard } = require('../services/leaderboardService');

async function getLeaderboardController(req, res) {
  try {
    if (!req.user.isPremium) {
      return res.status(403).json({ error: 'Access denied. Premium feature.' });
    }

    const leaderboard = await getLeaderboard();
    res.json(leaderboard);
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Server error' });
  }
}

module.exports = { getLeaderboardController };