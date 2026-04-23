const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const authMiddleware = require('../middleware/auth'); // Optionally restrict later

// Right now we can just allow fetching stats without strict auth for demo purposes, 
// but let's add authMiddleware so at least logged-in users are required.
router.get('/stats', authMiddleware, adminController.getAdminStats);

module.exports = router;
