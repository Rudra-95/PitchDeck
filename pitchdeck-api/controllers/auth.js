const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const mockStore = require('../services/mockStore');

const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({ error: 'All fields required' });
        }

        if (db.isMockMode) {
            try {
                const user = await mockStore.registerUser(name, email, password);
                const token = jwt.sign(
                    { userId: user.id, email: user.email },
                    process.env.JWT_SECRET || 'fallback_secret_for_dev',
                    { expiresIn: '7d' }
                );
                return res.status(201).json({ message: 'User registered successfully', token, user });
            } catch (e) {
                const status = e.status || 500;
                return res.status(status).json({ error: e.message });
            }
        }

        const existing = await db.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existing.rows.length > 0) {
            return res.status(400).json({ error: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.query(
            'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
            [name, email, hashedPassword]
        );

        const user = result.rows[0];
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || 'fallback_secret_for_dev',
            { expiresIn: '7d' }
        );

        res.status(201).json({ message: 'User registered successfully', token, user });
    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        if (db.isMockMode) {
            const user = await mockStore.verifyLogin(email, password);
            if (!user) {
                return res.status(401).json({ error: 'Invalid credentials' });
            }
            const token = jwt.sign(
                { userId: user.id, email: user.email },
                process.env.JWT_SECRET || 'fallback_secret_for_dev',
                { expiresIn: '7d' }
            );
            return res.json({ message: 'Login successful', token, user });
        }

        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result.rows[0];
        const isValid = await bcrypt.compare(password, user.password_hash);

        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET || 'fallback_secret_for_dev',
            { expiresIn: '7d' }
        );

        res.json({ message: 'Login successful', token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (err) {
        next(err);
    }
};

const getMe = async (req, res, next) => {
    try {
        if (db.isMockMode) {
            const user = mockStore.getUserById(req.user.userId);
            if (!user) return res.status(404).json({ error: 'User not found' });
            return res.json({ user });
        }

        const result = await db.query('SELECT id, name, email, created_at FROM users WHERE id = $1', [req.user.userId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ user: result.rows[0] });
    } catch (err) {
        next(err);
    }
};

module.exports = { register, login, getMe };
