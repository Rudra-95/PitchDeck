const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const profileController = require('../controllers/profile');

router.get('/me', authMiddleware, profileController.getMyDashboard);

module.exports = router;
