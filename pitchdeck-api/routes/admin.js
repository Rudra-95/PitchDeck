const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin');
const authMiddleware = require('../middleware/auth');

router.get('/stats', authMiddleware, adminController.getAdminStats);
router.get('/ideas', authMiddleware, adminController.getAllIdeas);
router.get('/users', authMiddleware, adminController.getAllUsers);
router.get('/feedback', authMiddleware, adminController.getAllFeedback);
router.get('/ideas/:id', authMiddleware, adminController.getIdeaDetails);

module.exports = router;
