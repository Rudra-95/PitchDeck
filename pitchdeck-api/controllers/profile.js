const db = require('../db');
const mockStore = require('../services/mockStore');

/**
 * GET /api/profile/me — current user's ideas + feedback left on those ideas.
 */
const getMyDashboard = async (req, res, next) => {
    try {
        const userId = req.user.userId;

        if (db.isMockMode) {
            return res.json({
                ideas: mockStore.listIdeasForUser(userId),
                feedbackReceived: mockStore.listFeedbackOnUserIdeas(userId),
            });
        }

        const ideasResult = await db.query(
            `SELECT ideas.*,
              (SELECT COUNT(*)::int FROM votes v WHERE v.idea_id = ideas.id) AS vote_count
             FROM ideas WHERE user_id = $1 ORDER BY created_at DESC`,
            [userId]
        );

        const feedbackResult = await db.query(
            `SELECT f.*, i.title AS idea_title, u.name AS reviewer_name
             FROM feedback f
             JOIN ideas i ON f.idea_id = i.id
             JOIN users u ON f.user_id = u.id
             WHERE i.user_id = $1
             ORDER BY f.created_at DESC`,
            [userId]
        );

        res.json({
            ideas: ideasResult.rows,
            feedbackReceived: feedbackResult.rows,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { getMyDashboard };
