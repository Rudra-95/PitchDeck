const Razorpay = require('razorpay');
const crypto = require('crypto');
const db = require('../db');
const mockStore = require('../services/mockStore');

let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
}

const requestMentorFeedback = async (req, res, next) => {
    try {
        const { ideaId } = req.params;

        if (!razorpay || db.isMockMode) {
            return res.status(200).json({
                mockMode: true,
                order: {
                    id: 'order_mock_' + Math.floor(Math.random() * 1000000),
                    amount: 19900,
                    currency: 'INR',
                },
            });
        }

        const options = {
            amount: 19900,
            currency: 'INR',
            receipt: `receipt_idea_${ideaId}_` + Date.now(),
        };

        const order = await razorpay.orders.create(options);
        res.json({ order, mockMode: false });
    } catch (error) {
        console.error('Razorpay Error:', error);
        next(error);
    }
};

const verifyMentorPayment = async (req, res, next) => {
    try {
        const { ideaId } = req.params;
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, mockMode } = req.body;

        if (mockMode || db.isMockMode) {
            const paymentId = razorpay_payment_id || razorpay_order_id || 'mock_payment';
            if (db.isMockMode) {
                mockStore.addMentorRequest(ideaId, req.user.userId, paymentId, 'success');
            } else {
                await db.query(
                    "INSERT INTO mentor_requests (idea_id, user_id, payment_id, status) VALUES ($1, $2, $3, 'success')",
                    [ideaId, req.user.userId, paymentId]
                );
            }
            return res.json({ message: 'Payment simulated and verified successfully' });
        }

        const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
        hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
        const generated_signature = hmac.digest('hex');

        if (generated_signature === razorpay_signature) {
            await db.query(
                "INSERT INTO mentor_requests (idea_id, user_id, payment_id, status) VALUES ($1, $2, $3, 'success')",
                [ideaId, req.user.userId, razorpay_payment_id]
            );
            res.json({ message: 'Payment verified successfully' });
        } else {
            res.status(400).json({ error: 'Invalid signature' });
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { requestMentorFeedback, verifyMentorPayment };
