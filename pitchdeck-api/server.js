require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cron = require('node-cron');
const nodemailer = require('nodemailer');
const { updateLeaderboardCache } = require('./controllers/leaderboard');

const authRoutes = require('./routes/auth');
const ideasRoutes = require('./routes/ideas');
const leaderboardRoutes = require('./routes/leaderboard');
const profileRoutes = require('./routes/profile');
const adminRoutes = require('./routes/admin');
const aiRoutes = require('./routes/ai');
const { errorHandler } = require('./middleware/errorHandler');
const { notFound } = require('./middleware/notFound');

const app = express();
const server = http.createServer(app);
const db = require('./db');

// --- Socket.io Setup for Deal Flow Messaging ---
const io = new Server(server, {
    cors: {
        origin: "*", // allow frontend access
        methods: ["GET", "POST"]
    }
});

io.on('connection', (socket) => {
    console.log('A user connected to Deal Flow WebSockets:', socket.id);
    
    // We emit a system welcoming message (optional)
    // Receive message from a client
    socket.on('send_message', (data) => {
        // Broadcast the message globally to all OTHER clients instantly
        socket.broadcast.emit('receive_message', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

// Lightweight health check
app.get('/api/health', (req, res) => {
    res.json({
        ok: true,
        service: 'pitchdeck-api',
        time: new Date().toISOString(),
        dbMode: db.isMockMode ? 'mock' : 'postgres',
    });
});

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100 
});
app.use('/api', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ideas', ideasRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);

app.use('/api', notFound);
app.use(errorHandler);

// --- Nodemailer Email Newsletter Logic ---
async function sendTrendNewsletter() {
    console.log("Preparing to dispatch PitchDeck Weekly Newsletter...");
    try {
        // We use Ethereal Mail (transparent test SMTP) so we don't need real API keys right now.
        let testAccount = await nodemailer.createTestAccount();
        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });

        let info = await transporter.sendMail({
            from: '"PitchDeck Deals" <deals@pitchdeck.com>', 
            to: "community@pitchdeck.com", 
            subject: "🚀 Top 3 Trending Startups You Must See", 
            html: `
                <div style="font-family: sans-serif; padding: 20px;">
                    <h2 style="color: #ea580c;">Weekly Top Startups</h2>
                    <p>Here are the top heavily validated startups on the PitchDeck platform right now!</p>
                    <p>Log in to view Deal Flow and connect directly with the founders.</p>
                    <br/>
                    <a href="http://localhost:5173/leaderboard" style="background-color: #ea580c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Leaderboard</a>
                </div>
            `, 
        });

        console.log("Newsletter sent! Preview URL: %s", nodemailer.getTestMessageUrl(info));
    } catch (e) {
        console.error("Failed to send newsletter:", e);
    }
}

// Cron Jobs
// Update Leaderboard cache every hour
cron.schedule('0 * * * *', () => {
    console.log('Running scheduled leaderboard cache update...');
    updateLeaderboardCache();
});

// Dispatch the Top 3 Newsletter Email every Monday at 9:00 AM
cron.schedule('0 9 * * 1', () => {
    sendTrendNewsletter().catch(console.error);
});

// For immediate simulation purposes, dispatch it 5 seconds after server start so user can verify it
setTimeout(() => sendTrendNewsletter(), 5000);


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // Initial leaderboard load
    updateLeaderboardCache();
});
