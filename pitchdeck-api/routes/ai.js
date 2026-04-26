const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai');

// Open endpoint for the execution engine demo
router.post('/stress-test', aiController.stressTestIdea);
router.post('/founder-dna', aiController.analyzeFounder);
router.post('/compare', aiController.compareIdeas);
router.post('/pitchdeck', aiController.generatePitchDeck);

module.exports = router;
