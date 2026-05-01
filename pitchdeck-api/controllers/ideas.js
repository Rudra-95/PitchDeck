const db = require('../db');
const mockStore = require('../services/mockStore');

const getAllIdeas = async (req, res, next) => {
    try {
        const { category, sort, looking_for } = req.query;

        if (db.isMockMode) {
            return res.json(mockStore.listIdeas({ category, sort, looking_for }));
        }

        let query =
            'SELECT ideas.*, users.name AS author_name, users.email AS author_email, COUNT(votes.id)::int AS vote_count FROM ideas JOIN users ON ideas.user_id = users.id LEFT JOIN votes ON ideas.id = votes.idea_id';
        const params = [];
        const wheres = [];

        if (category) {
            params.push(category);
            wheres.push(`category = $${params.length}`);
        }
        if (looking_for) {
            params.push(looking_for);
            wheres.push(`looking_for = $${params.length}`);
        }

        if (wheres.length > 0) {
            query += ` WHERE ${wheres.join(' AND ')}`;
        }
        query += ' GROUP BY ideas.id, users.id';

        if (sort === 'trending') {
            query += ' ORDER BY vote_count DESC, created_at DESC';
        } else {
            query += ' ORDER BY created_at DESC';
        }

        const result = await db.query(query, params);
        res.json(result.rows);
    } catch (err) {
        next(err);
    }
};

const getIdeaById = async (req, res, next) => {
    try {
        if (db.isMockMode) {
            const idea = mockStore.getIdeaById(req.params.id);
            if (!idea) return res.status(404).json({ error: 'Idea not found' });
            return res.json(idea);
        }

        const result = await db.query(
            'SELECT ideas.*, users.name AS author_name, users.email AS author_email, COUNT(votes.id)::int AS vote_count FROM ideas JOIN users ON ideas.user_id = users.id LEFT JOIN votes ON ideas.id = votes.idea_id WHERE ideas.id = $1 GROUP BY ideas.id, users.id',
            [req.params.id]
        );
        if (result.rows.length === 0) return res.status(404).json({ error: 'Idea not found' });
        res.json(result.rows[0]);
    } catch (err) {
        next(err);
    }
};

const createIdea = async (req, res, next) => {
    try {
        const { title, description, category, looking_for } = req.body;
        if (!title || !description) {
            return res.status(400).json({ error: 'Title and description are required' });
        }

        if (db.isMockMode) {
            const row = mockStore.createIdea(req.user.userId, { title, description, category, looking_for });
            return res.status(201).json(row);
        }

        const result = await db.query(
            'INSERT INTO ideas (user_id, title, description, category, looking_for) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [req.user.userId, title, description, category || 'Tech', looking_for || '']
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        next(err);
    }
};

const updateIdea = async (req, res, next) => {
    try {
        const { title, description, category, looking_for } = req.body;
        if (!title || !description) {
            return res.status(400).json({ error: 'Title and description are required' });
        }

        if (db.isMockMode) {
            try {
                const row = mockStore.updateIdea(req.params.id, req.user.userId, {
                    title,
                    description,
                    category,
                    looking_for,
                });
                return res.json(row);
            } catch (e) {
                const status = e.status || 500;
                return res.status(status).json({ error: e.message });
            }
        }

        const result = await db.query(
            `UPDATE ideas
             SET title = $1, description = $2, category = $3, looking_for = $4
             WHERE id = $5 AND user_id = $6
             RETURNING *`,
            [title, description, category || 'Tech', looking_for || '', req.params.id, req.user.userId]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Idea not found or not owned by you' });
        }
        const voteRow = await db.query(
            'SELECT COUNT(*)::int AS vote_count FROM votes WHERE idea_id = $1',
            [req.params.id]
        );
        res.json({ ...result.rows[0], vote_count: voteRow.rows[0].vote_count });
    } catch (err) {
        next(err);
    }
};

module.exports = { getAllIdeas, getIdeaById, createIdea, updateIdea };
