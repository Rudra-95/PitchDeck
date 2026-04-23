const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai');

// Open endpoint for the execution engine demo
router.post('/stress-test', aiController.stressTestIdea);

module.exports = router;
