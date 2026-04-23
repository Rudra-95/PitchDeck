const db = require('../db');
const mockStore = require('../services/mockStore');

const submitFeedback = async (req, res, next) => {
    try {
        const { ideaId } = req.params;
        const { problem_clarity, market_size, uniqueness, solution_quality, comments } = req.body;
        const structured_data = { problem_clarity, market_size, uniqueness, solution_quality, comments };

        if (db.isMockMode) {
            try {
                mockStore.addFeedback(ideaId, req.user.userId, structured_data);
            } catch (e) {
                const status = e.status || 500;
                return res.status(status).json({ error: e.message });
            }
            return res.status(201).json({ message: 'Feedback submitted successfully' });
        }

        await db.query('INSERT INTO feedback (idea_id, user_id, structured_data) VALUES ($1, $2, $3)', [
            ideaId,
            req.user.userId,
            JSON.stringify(structured_data),
        ]);

        res.status(201).json({ message: 'Feedback submitted successfully' });
    } catch (err) {
        next(err);
    }
};

const getFeedbackForIdea = async (req, res, next) => {
    try {
        if (db.isMockMode) {
            return res.json(mockStore.listFeedbackForIdea(req.params.ideaId));
        }

        const result = await db.query(
            'SELECT feedback.*, users.name as user_name FROM feedback JOIN users ON feedback.user_id = users.id WHERE idea_id = $1 ORDER BY created_at DESC',
            [req.params.ideaId]
        );
        res.json(result.rows);
    } catch (err) {
        next(err);
    }
};

module.exports = { submitFeedback, getFeedbackForIdea };
