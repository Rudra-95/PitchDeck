const { Pool } = require('pg');
require('dotenv').config();

let pool;
let isMockMode = false;
let didLogFallback = false;

if (process.env.DATABASE_URL) {
    const isLocal =
        process.env.DATABASE_URL.includes('localhost') ||
        process.env.DATABASE_URL.includes('127.0.0.1');

    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: isLocal ? false : { rejectUnauthorized: false },
    });

    pool.on('connect', () => {
        console.log('Connected to PostgreSQL Database');
    });

    pool.on('error', (err) => {
        console.error('PostgreSQL pool error. Switching to mock mode:', err.message);
        isMockMode = true;
    });
} else {
    console.warn('\n⚠️ DATABASE_URL not set — running in in-memory mock mode.');
    console.warn('⚠️ Optional: run `docker compose up -d` from the repo root, then set DATABASE_URL in pitchdeck-api/.env\n');
    isMockMode = true;
}

const shouldFallbackToMock = (error) =>
    ['ECONNREFUSED', 'ENOTFOUND', 'ETIMEDOUT', '57P01'].includes(error?.code);

const query = async (text, params) => {
    if (isMockMode) {
        console.warn(
            '[DB] query() called while in mock mode — controllers should use services/mockStore instead.',
            String(text).slice(0, 100)
        );
        return { rows: [] };
    }

    try {
        return await pool.query(text, params);
    } catch (error) {
        if (shouldFallbackToMock(error)) {
            isMockMode = true;
            if (!didLogFallback) {
                console.warn('PostgreSQL unreachable — switched to in-memory mock mode.');
                didLogFallback = true;
            }
            return { rows: [] };
        }
        throw error;
    }
};

module.exports = {
    query,
    pool,
    get isMockMode() {
        return isMockMode;
    },
};
