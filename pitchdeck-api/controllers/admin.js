const db = require('../db');
const mockStore = require('../services/mockStore');

const getAdminStats = async (req, res, next) => {
    try {
        if (db.isMockMode) {
            // Simple mock response
            const usersCount = mockStore.users.length;
            const ideasCount = mockStore.ideas.length;
            const feedbackCount = mockStore.feedback.length;
            const recentIdeas = mockStore.ideas
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .slice(0, 10)
                .map(id => {
                    const user = mockStore.users.find(u => u.id === id.user_id);
                    return {
                        ...id,
                        user_name: user ? user.name : 'Unknown'
                    };
                });

            return res.json({
                totalUsers: usersCount,
                totalIdeas: ideasCount,
                totalFeedback: feedbackCount,
                recentIdeas
            });
        }

        // Real database queries
        const queries = [
            db.query('SELECT COUNT(*) FROM users'),
            db.query('SELECT COUNT(*) FROM ideas'),
            db.query('SELECT COUNT(*) FROM feedback'),
            db.query(`
                SELECT i.id, i.title, i.category, i.created_at, u.name as user_name 
                FROM ideas i 
                JOIN users u ON i.user_id = u.id 
                ORDER BY i.created_at DESC 
                LIMIT 10
            `)
        ];

        const [usersRes, ideasRes, feedbackRes, recentIdeasRes] = await Promise.all(queries);

        res.json({
            totalUsers: parseInt(usersRes.rows[0].count, 10),
            totalIdeas: parseInt(ideasRes.rows[0].count, 10),
            totalFeedback: parseInt(feedbackRes.rows[0].count, 10),
            recentIdeas: recentIdeasRes.rows
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { getAdminStats };
