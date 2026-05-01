/**
 * In-memory data store when PostgreSQL is unavailable (no DATABASE_URL or connection failure).
 * Controllers call these methods explicitly — no brittle SQL string matching.
 */
const bcrypt = require('bcryptjs');

let nextUserId = 1;
let nextIdeaId = 1;
let nextVoteId = 1;
let nextFeedbackId = 1;
let nextMentorId = 1;

const users = [];
const ideas = [];
const votes = [];
const feedback = [];
const mentorRequests = [];

function now() {
    return new Date();
}

function voteCountForIdea(ideaId) {
    return votes.filter((v) => v.idea_id === ideaId).length;
}

function seed() {
    const hash = bcrypt.hashSync('password123', 8);
    const u1 = { id: nextUserId++, name: 'Alex Thompson', email: 'alex@example.com', password_hash: hash, created_at: now() };
    const u2 = { id: nextUserId++, name: 'Sarah Chen', email: 'sarah@example.com', password_hash: hash, created_at: now() };
    const u3 = { id: nextUserId++, name: 'Marcus Johnson', email: 'marcus@example.com', password_hash: hash, created_at: now() };
    users.push(u1, u2, u3);

    const seedIdeas = [
        { user_id: u1.id, title: 'Ares: AI for Legal Discovery', description: 'LLM-powered discovery for law firms.', category: 'Tech', looking_for: 'Tech Co-founder', validation_score: 0 },
        { user_id: u2.id, title: 'PayPulse — Micro-payments for Creators', description: 'Low-fee creator micro-payments.', category: 'Fintech', looking_for: 'Business/Marketing', validation_score: 0 },
        { user_id: u3.id, title: 'VitaScan', description: 'Nutrition from a dinner photo.', category: 'Health', looking_for: 'Design/Product', validation_score: 0 },
        { user_id: u1.id, title: 'NomadNet', description: 'Bandwidth sharing for travelers.', category: 'Tech', looking_for: 'Tech Co-founder', validation_score: 0 },
        { user_id: u2.id, title: 'Zenith CRM', description: 'CRM for solo agencies.', category: 'Consumer', looking_for: '', validation_score: 0 },
    ];
    for (const row of seedIdeas) {
        ideas.push({
            id: nextIdeaId++,
            ...row,
            created_at: now(),
        });
    }
    const [i0, i1, i2] = [ideas[0].id, ideas[1].id, ideas[2].id];
    const addVote = (idea_id, user_id) => {
        votes.push({ id: nextVoteId++, idea_id, user_id, created_at: now() });
    };
    addVote(i0, u1.id);
    addVote(i0, u2.id);
    addVote(i0, u3.id);
    addVote(i1, u2.id);
    addVote(i1, u3.id);
    addVote(i2, u1.id);

    feedback.push({
        id: nextFeedbackId++,
        idea_id: i0,
        user_id: u3.id,
        structured_data: {
            problem_clarity: 8,
            market_size: 9,
            uniqueness: 7,
            solution_quality: 8,
            comments: 'Strong wedge; watch hallucination risk in legal.',
        },
        created_at: now(),
    });
}

seed();

function findUserByEmail(email) {
    return users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
}

async function registerUser(name, email, password) {
    if (findUserByEmail(email)) {
        const err = new Error('Email already in use');
        err.status = 400;
        throw err;
    }
    const password_hash = await bcrypt.hash(password, 10);
    const user = {
        id: nextUserId++,
        name,
        email,
        password_hash,
        created_at: now(),
    };
    users.push(user);
    return { id: user.id, name: user.name, email: user.email };
}

async function verifyLogin(email, password) {
    const user = findUserByEmail(email);
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return null;
    return { id: user.id, name: user.name, email: user.email };
}

function getUserById(id) {
    const u = users.find((x) => x.id === Number(id));
    if (!u) return null;
    return { id: u.id, name: u.name, email: u.email, created_at: u.created_at };
}

function listIdeas({ category, sort, looking_for } = {}) {
    let list = ideas.map((idea) => {
        const u = users.find((x) => x.id === idea.user_id);
        return {
            ...idea,
            author_name: u ? u.name : 'Unknown',
            author_email: u ? u.email : '',
            vote_count: voteCountForIdea(idea.id),
        };
    });
    if (category) list = list.filter((i) => i.category === category);
    if (looking_for) list = list.filter((i) => i.looking_for === looking_for);
    if (sort === 'trending') {
        list.sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0) || new Date(b.created_at) - new Date(a.created_at));
    } else {
        list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }
    return list;
}

function getIdeaById(id) {
    const idea = ideas.find((i) => i.id === Number(id));
    if (!idea) return null;
    const u = users.find((x) => x.id === idea.user_id);
    return { ...idea, author_name: u ? u.name : 'Unknown', author_email: u ? u.email : '', vote_count: voteCountForIdea(idea.id) };
}

function createIdea(userId, { title, description, category, looking_for }) {
    const row = {
        id: nextIdeaId++,
        user_id: userId,
        title,
        description,
        category: category || 'Tech',
        looking_for: looking_for || '',
        validation_score: 0,
        created_at: now(),
    };
    ideas.push(row);
    return { ...row, vote_count: 0 };
}

function updateIdea(ideaId, userId, { title, description, category, looking_for }) {
    const idea = ideas.find((i) => i.id === Number(ideaId));
    if (!idea) {
        const err = new Error('Idea not found');
        err.status = 404;
        throw err;
    }
    if (idea.user_id !== userId) {
        const err = new Error('Forbidden');
        err.status = 403;
        throw err;
    }
    if (title !== undefined) idea.title = title;
    if (description !== undefined) idea.description = description;
    if (category !== undefined) idea.category = category;
    if (looking_for !== undefined) idea.looking_for = looking_for;
    return { ...idea, vote_count: voteCountForIdea(idea.id) };
}

function toggleVote(ideaId, userId) {
    const idea = ideas.find((i) => i.id === Number(ideaId));
    if (!idea) {
        const err = new Error('Idea not found');
        err.status = 404;
        throw err;
    }
    const idx = votes.findIndex((v) => v.idea_id === Number(ideaId) && v.user_id === userId);
    if (idx >= 0) {
        votes.splice(idx, 1);
        return { action: 'removed', vote_count: voteCountForIdea(ideaId) };
    }
    votes.push({ id: nextVoteId++, idea_id: Number(ideaId), user_id: userId, created_at: now() });
    return { action: 'added', vote_count: voteCountForIdea(ideaId) };
}

function addFeedback(ideaId, userId, structured_data) {
    const idea = ideas.find((i) => i.id === Number(ideaId));
    if (!idea) {
        const err = new Error('Idea not found');
        err.status = 404;
        throw err;
    }
    const row = {
        id: nextFeedbackId++,
        idea_id: Number(ideaId),
        user_id: userId,
        structured_data,
        created_at: now(),
    };
    feedback.push(row);
    return row;
}

function listFeedbackForIdea(ideaId) {
    return feedback
        .filter((f) => f.idea_id === Number(ideaId))
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .map((f) => {
            const u = users.find((x) => x.id === f.user_id);
            return {
                ...f,
                user_name: u ? u.name : 'User',
            };
        });
}

function weeklyLeaderboard(limit = 10) {
    const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const counts = new Map();
    for (const v of votes) {
        if (new Date(v.created_at).getTime() < cutoff) continue;
        counts.set(v.idea_id, (counts.get(v.idea_id) || 0) + 1);
    }
    const rows = [...counts.entries()]
        .map(([idea_id, vote_count]) => {
            const idea = ideas.find((i) => i.id === idea_id);
            return idea ? { idea_id, title: idea.title, vote_count } : null;
        })
        .filter(Boolean)
        .sort((a, b) => b.vote_count - a.vote_count)
        .slice(0, limit);
    if (rows.length === 0) {
        return listIdeas({ sort: 'trending' }).slice(0, limit).map((i) => ({
            idea_id: i.id,
            title: i.title,
            vote_count: i.vote_count || 0,
        }));
    }
    return rows;
}

function addMentorRequest(ideaId, userId, paymentId, status = 'success') {
    mentorRequests.push({
        id: nextMentorId++,
        idea_id: Number(ideaId),
        user_id: userId,
        payment_id: paymentId,
        status,
        feedback_text: null,
        created_at: now(),
    });
}

function listIdeasForUser(userId) {
    return ideas
        .filter((i) => i.user_id === userId)
        .map((i) => ({ ...i, vote_count: voteCountForIdea(i.id) }))
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
}

function listFeedbackOnUserIdeas(userId) {
    const myIdeaIds = new Set(ideas.filter((i) => i.user_id === userId).map((i) => i.id));
    return feedback
        .filter((f) => myIdeaIds.has(f.idea_id))
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
        .map((f) => {
            const idea = ideas.find((i) => i.id === f.idea_id);
            const reviewer = users.find((u) => u.id === f.user_id);
            return {
                ...f,
                idea_title: idea ? idea.title : 'Idea',
                reviewer_name: reviewer ? reviewer.name : 'User',
            };
        });
}

module.exports = {
    registerUser,
    verifyLogin,
    getUserById,
    listIdeas,
    getIdeaById,
    createIdea,
    updateIdea,
    toggleVote,
    addFeedback,
    listFeedbackForIdea,
    weeklyLeaderboard,
    addMentorRequest,
    listIdeasForUser,
    listFeedbackOnUserIdeas,
    users,
    ideas,
    feedback,
};
