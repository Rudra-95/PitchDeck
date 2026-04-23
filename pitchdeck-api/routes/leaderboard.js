const express = require('express');
const router = express.Router();
const leaderboardController = require('../controllers/leaderboard');

router.get('/weekly', leaderboardController.getWeeklyLeaderboard);

module.exports = router;
