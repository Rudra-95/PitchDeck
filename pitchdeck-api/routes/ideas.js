const express = require('express');
const router = express.Router();
const ideasController = require('../controllers/ideas');
const feedbackController = require('../controllers/feedback');
const votesController = require('../controllers/votes');
const mentorController = require('../controllers/mentor');
const authMiddleware = require('../middleware/auth');

// Ideas
router.get('/', ideasController.getAllIdeas);
router.post('/', authMiddleware, ideasController.createIdea);
router.get('/:id', ideasController.getIdeaById);
router.put('/:id', authMiddleware, ideasController.updateIdea);

// Votes
router.post('/:ideaId/vote', authMiddleware, votesController.toggleVote);

// Feedback
router.post('/:ideaId/feedback', authMiddleware, feedbackController.submitFeedback);
router.get('/:ideaId/feedback', feedbackController.getFeedbackForIdea);

// Mentor
router.post('/:ideaId/mentor-request', authMiddleware, mentorController.requestMentorFeedback);
router.post('/:ideaId/mentor-verify', authMiddleware, mentorController.verifyMentorPayment);

module.exports = router;
