const db = require('../db');
const mockStore = require('../services/mockStore');

const toggleVote = async (req, res, next) => {
    try {
        const { ideaId } = req.params;
        const userId = req.user.userId;

        if (db.isMockMode) {
            try {
                const result = mockStore.toggleVote(ideaId, userId);
                const code = result.action === 'added' ? 201 : 200;
                return res.status(code).json({
                    message: result.action === 'added' ? 'Vote added' : 'Vote removed',
                    vote_count: result.vote_count,
                });
            } catch (e) {
                const status = e.status || 500;
                return res.status(status).json({ error: e.message });
            }
        }

        const existing = await db.query('SELECT id FROM votes WHERE idea_id = $1 AND user_id = $2', [ideaId, userId]);
        if (existing.rows.length > 0) {
            await db.query('DELETE FROM votes WHERE id = $1', [existing.rows[0].id]);
            const countRes = await db.query('SELECT COUNT(*)::int AS vote_count FROM votes WHERE idea_id = $1', [ideaId]);
            return res.json({ message: 'Vote removed', vote_count: countRes.rows[0].vote_count });
        }
        await db.query('INSERT INTO votes (idea_id, user_id) VALUES ($1, $2)', [ideaId, userId]);
        const countRes = await db.query('SELECT COUNT(*)::int AS vote_count FROM votes WHERE idea_id = $1', [ideaId]);
        return res.status(201).json({ message: 'Vote added', vote_count: countRes.rows[0].vote_count });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({ error: 'You have already voted for this idea' });
        }
        next(error);
    }
};

module.exports = { toggleVote };
