const db = require('../db');
const mockStore = require('../services/mockStore');

const getAdminStats = async (req, res, next) => {
    try {
        if (db.isMockMode) {
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

const getAllIdeas = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, category, search, sortBy = 'recent' } = req.query;
        const offset = (page - 1) * limit;

        if (db.isMockMode) {
            let ideas = [...mockStore.ideas];
            if (category) ideas = ideas.filter(i => i.category === category);
            if (search) ideas = ideas.filter(i => i.title.toLowerCase().includes(search.toLowerCase()) || i.description.toLowerCase().includes(search.toLowerCase()));
            
            if (sortBy === 'votes') ideas.sort((a, b) => (b.votes || 0) - (a.votes || 0));
            else ideas.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            const total = ideas.length;
            const paginatedIdeas = ideas.slice(offset, offset + limit).map(id => {
                const user = mockStore.users.find(u => u.id === id.user_id);
                return { ...id, user_name: user?.name || 'Unknown' };
            });

            return res.json({ ideas: paginatedIdeas, total, page: parseInt(page), limit: parseInt(limit) });
        }

        let query = `
            SELECT i.id, i.title, i.description, i.category, i.looking_for, i.validation_score, i.created_at, 
                   u.name as user_name, u.email, COUNT(v.id) as votes
            FROM ideas i 
            JOIN users u ON i.user_id = u.id 
            LEFT JOIN votes v ON i.id = v.idea_id
        `;
        const params = [];
        const conditions = [];

        if (category) {
            conditions.push(`i.category = $${params.length + 1}`);
            params.push(category);
        }
        if (search) {
            conditions.push(`(i.title ILIKE $${params.length + 1} OR i.description ILIKE $${params.length + 1})`);
            params.push(`%${search}%`);
            params.push(`%${search}%`);
        }

        if (conditions.length > 0) query += ` WHERE ${conditions.join(' AND ')}`;

        query += ` GROUP BY i.id, u.id`;
        query += sortBy === 'votes' ? ` ORDER BY votes DESC` : ` ORDER BY i.created_at DESC`;
        query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        const countRes = await db.query(`SELECT COUNT(*) FROM ideas ${conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''}`);
        const ideasRes = await db.query(query, params);

        res.json({
            ideas: ideasRes.rows,
            total: parseInt(countRes.rows[0].count, 10),
            page: parseInt(page),
            limit: parseInt(limit)
        });
    } catch (err) {
        next(err);
    }
};

const getAllUsers = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, search, sortBy = 'recent' } = req.query;
        const offset = (page - 1) * limit;

        if (db.isMockMode) {
            let users = [...mockStore.users];
            if (search) users = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));
            
            if (sortBy === 'ideas') {
                users.sort((a, b) => {
                    const countA = mockStore.ideas.filter(i => i.user_id === a.id).length;
                    const countB = mockStore.ideas.filter(i => i.user_id === b.id).length;
                    return countB - countA;
                });
            } else users.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            const total = users.length;
            const paginatedUsers = users.slice(offset, offset + limit).map(u => {
                const ideaCount = mockStore.ideas.filter(i => i.user_id === u.id).length;
                return { ...u, idea_count: ideaCount };
            });

            return res.json({ users: paginatedUsers, total, page: parseInt(page), limit: parseInt(limit) });
        }

        let query = `
            SELECT u.id, u.name, u.email, u.created_at, COUNT(i.id) as idea_count
            FROM users u 
            LEFT JOIN ideas i ON u.id = i.user_id
        `;
        const params = [];

        if (search) {
            query += ` WHERE (u.name ILIKE $1 OR u.email ILIKE $1)`;
            params.push(`%${search}%`);
        }

        query += ` GROUP BY u.id`;
        query += sortBy === 'ideas' ? ` ORDER BY idea_count DESC` : ` ORDER BY u.created_at DESC`;
        query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        const countRes = await db.query(`SELECT COUNT(*) FROM users`);
        const usersRes = await db.query(query, params);

        res.json({
            users: usersRes.rows,
            total: parseInt(countRes.rows[0].count, 10),
            page: parseInt(page),
            limit: parseInt(limit)
        });
    } catch (err) {
        next(err);
    }
};

const getAllFeedback = async (req, res, next) => {
    try {
        const { page = 1, limit = 20, ideaId, userId } = req.query;
        const offset = (page - 1) * limit;

        if (db.isMockMode) {
            let feedback = [...mockStore.feedback];
            if (ideaId) feedback = feedback.filter(f => f.idea_id === parseInt(ideaId));
            if (userId) feedback = feedback.filter(f => f.user_id === parseInt(userId));

            const total = feedback.length;
            const paginatedFeedback = feedback.slice(offset, offset + limit).map(f => {
                const idea = mockStore.ideas.find(i => i.id === f.idea_id);
                const user = mockStore.users.find(u => u.id === f.user_id);
                return { ...f, idea_title: idea?.title, user_name: user?.name };
            });

            return res.json({ feedback: paginatedFeedback, total, page: parseInt(page), limit: parseInt(limit) });
        }

        let query = `
            SELECT f.id, f.idea_id, f.user_id, f.structured_data, f.created_at, 
                   i.title as idea_title, u.name as user_name
            FROM feedback f
            JOIN ideas i ON f.idea_id = i.id
            JOIN users u ON f.user_id = u.id
        `;
        const params = [];
        const conditions = [];

        if (ideaId) {
            conditions.push(`f.idea_id = $${params.length + 1}`);
            params.push(ideaId);
        }
        if (userId) {
            conditions.push(`f.user_id = $${params.length + 1}`);
            params.push(userId);
        }

        if (conditions.length > 0) query += ` WHERE ${conditions.join(' AND ')}`;
        query += ` ORDER BY f.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        const countRes = await db.query(`SELECT COUNT(*) FROM feedback ${conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : ''}`);
        const feedbackRes = await db.query(query, params);

        res.json({
            feedback: feedbackRes.rows,
            total: parseInt(countRes.rows[0].count, 10),
            page: parseInt(page),
            limit: parseInt(limit)
        });
    } catch (err) {
        next(err);
    }
};

const getIdeaDetails = async (req, res, next) => {
    try {
        const { id } = req.params;

        if (db.isMockMode) {
            const idea = mockStore.ideas.find(i => i.id === parseInt(id));
            if (!idea) return res.status(404).json({ error: 'Idea not found' });

            const user = mockStore.users.find(u => u.id === idea.user_id);
            const feedbackList = mockStore.feedback.filter(f => f.idea_id === idea.id);
            const voteCount = mockStore.votes?.filter(v => v.idea_id === idea.id).length || 0;

            return res.json({ idea, user, feedback: feedbackList, vote_count: voteCount });
        }

        const ideaRes = await db.query(`SELECT * FROM ideas WHERE id = $1`, [id]);
        if (ideaRes.rows.length === 0) return res.status(404).json({ error: 'Idea not found' });

        const idea = ideaRes.rows[0];
        const [userRes, feedbackRes, votesRes] = await Promise.all([
            db.query(`SELECT * FROM users WHERE id = $1`, [idea.user_id]),
            db.query(`SELECT * FROM feedback WHERE idea_id = $1`, [id]),
            db.query(`SELECT COUNT(*) FROM votes WHERE idea_id = $1`, [id])
        ]);

        res.json({
            idea,
            user: userRes.rows[0],
            feedback: feedbackRes.rows,
            vote_count: parseInt(votesRes.rows[0].count, 10)
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { getAdminStats, getAllIdeas, getAllUsers, getAllFeedback, getIdeaDetails };
