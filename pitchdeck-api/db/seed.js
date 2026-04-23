require('dotenv').config();
const { pool, query } = require('./index');
const bcrypt = require('bcryptjs');

async function runSeed() {
    console.log('🌱 Starting database seed...');
    
    if (!process.env.DATABASE_URL) {
        console.error('❌ DATABASE_URL is missing in .env. Seed script cannot run on mock fallback mode.');
        process.exit(1);
    }

    try {
        // Clear existing data securely
        await query(
            'TRUNCATE TABLE idea_tags, tags, mentor_requests, feedback, votes, ideas, users RESTART IDENTITY CASCADE;'
        );
        console.log('🧹 Cleared existing data.');

        // Seed Users
        const passwordHash = await bcrypt.hash('password123', 10);
        const users = [
            { name: 'Alex Thompson', email: 'alex@example.com' },
            { name: 'Sarah Chen', email: 'sarah@example.com' },
            { name: 'Marcus Johnson', email: 'marcus@example.com' },
        ];

        let userIds = [];
        for (const user of users) {
             const res = await query('INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id', [user.name, user.email, passwordHash]);
             userIds.push(res.rows[0].id);
        }
        console.log(`✅ Seeded ${userIds.length} users.`);

        // Seed Ideas
        const ideas = [
            { user: userIds[0], title: 'Ares: AI for Legal Discovery', description: 'Transforming how law firms conduct discovery using advanced LLM reasoning to scan thousands of documents in seconds.', category: 'Tech', looking_for: 'Tech Co-founder' },
            { user: userIds[1], title: 'PayPulse - Micro-payments for Creators', description: 'A frictionless web3 backend that lets creators charge literally pennies for articles without taking a 30%+ stripe hit.', category: 'Fintech', looking_for: 'Business/Marketing' },
            { user: userIds[2], title: 'VitaScan', description: 'Computer vision app that scans your dinner plate and calculates precise nutritional data and macro breakdown.', category: 'Health', looking_for: 'Design/Product' },
            { user: userIds[0], title: 'NomadNet', description: 'A global LTE mesh network sharing platform where users earn tokens for sharing their bandwidth with travelers.', category: 'Tech', looking_for: 'Tech Co-founder' },
            { user: userIds[1], title: 'Zenith CRM', description: 'The absolute simplest CRM designed exclusively for one-person agencies and freelancers.', category: 'Consumer', looking_for: '' },
        ];

        let ideaIds = [];
        for (const idea of ideas) {
            const res = await query(
                'INSERT INTO ideas (user_id, title, description, category, looking_for) VALUES ($1, $2, $3, $4, $5) RETURNING id',
                [idea.user, idea.title, idea.description, idea.category, idea.looking_for]
            );
            ideaIds.push(res.rows[0].id);
        }
        console.log(`✅ Seeded ${ideaIds.length} startup ideas.`);

        // Seed Votes (so trending works!)
        // Idea 0 gets 3 votes, Idea 1 gets 2 votes, Idea 2 gets 1 vote
        await query('INSERT INTO votes (idea_id, user_id) VALUES ($1, $2)', [ideaIds[0], userIds[0]]);
        await query('INSERT INTO votes (idea_id, user_id) VALUES ($1, $2)', [ideaIds[0], userIds[1]]);
        await query('INSERT INTO votes (idea_id, user_id) VALUES ($1, $2)', [ideaIds[0], userIds[2]]);
        
        await query('INSERT INTO votes (idea_id, user_id) VALUES ($1, $2)', [ideaIds[1], userIds[1]]);
        await query('INSERT INTO votes (idea_id, user_id) VALUES ($1, $2)', [ideaIds[1], userIds[2]]);

        await query('INSERT INTO votes (idea_id, user_id) VALUES ($1, $2)', [ideaIds[2], userIds[0]]);
        
        // Update vote_count materialized equivalent (if we had a validation score increment)
        // Since we query COUNT(votes) for trending dynamically, this is already enough!
        console.log(`✅ Seeded community votes.`);

        // Seed Feedback
        const feedbackPayload = { problem_clarity: 8, market_size: 9, uniqueness: 7, solution_quality: 8, comments: "This changes the entire landscape of discovery. The addressable market is huge. Biggest risk is hallucination in legal context." };
        await query('INSERT INTO feedback (idea_id, user_id, structured_data) VALUES ($1, $2, $3)', [ideaIds[0], userIds[2], feedbackPayload]);
        
        console.log(`✅ Seeded structured feedback.`);
        console.log('🚀 Seed process entirely completed!');
        
    } catch (e) {
        console.error('❌ Seeding failed:', e);
    } finally {
        pool.end();
        process.exit();
    }
}

runSeed();
