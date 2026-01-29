const express = require('express');
const { getLeaderboardController } = require('../controllers/leaderboardController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, getLeaderboardController);

module.exports = router;