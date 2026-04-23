const db = require('../db');
const mockStore = require('../services/mockStore');

let cachedLeaderboard = [];

const getWeeklyLeaderboard = async (req, res, next) => {
    try {
        if (db.isMockMode) {
            return res.json(mockStore.weeklyLeaderboard(10));
        }

        if (cachedLeaderboard.length > 0) {
            return res.json(cachedLeaderboard);
        }

        const result = await db.query(`
            SELECT ideas.id as idea_id, ideas.title, COUNT(votes.id)::int as vote_count 
            FROM votes 
            JOIN ideas ON votes.idea_id = ideas.id
            WHERE votes.created_at > NOW() - INTERVAL '7 days' 
            GROUP BY ideas.id, ideas.title
            ORDER BY vote_count DESC 
            LIMIT 10
        `);
        res.json(result.rows);
    } catch (error) {
        next(error);
    }
};

const updateLeaderboardCache = async () => {
    if (db.isMockMode) {
        cachedLeaderboard = mockStore.weeklyLeaderboard(10);
        console.log('Leaderboard cache updated (mock)');
        return;
    }
    try {
        const result = await db.query(`
            SELECT ideas.id as idea_id, ideas.title, COUNT(votes.id)::int as vote_count 
            FROM votes 
            JOIN ideas ON votes.idea_id = ideas.id
            WHERE votes.created_at > NOW() - INTERVAL '7 days' 
            GROUP BY ideas.id, ideas.title
            ORDER BY vote_count DESC 
            LIMIT 10
        `);
        cachedLeaderboard = result.rows;
        console.log('Leaderboard cache updated');
    } catch (error) {
        console.error('Error updating leaderboard cache:', error);
    }
};

module.exports = { getWeeklyLeaderboard, updateLeaderboardCache };
