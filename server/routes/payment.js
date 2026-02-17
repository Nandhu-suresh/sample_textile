const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const auth = require('../middleware/auth');

// Initialize Razorpay
// In production, keys should be in .env. For this test implementation, we'll read from process.env
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Order
router.post('/order', auth, async (req, res) => {
    try {
        const { amount } = req.body; // Amount in smallest currency unit (paise for INR)

        const options = {
            amount: amount * 100, // Razorpay expects amount in paise
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        if (!order) return res.status(500).send("Some error occured");

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

// Verify Payment (Optional but recommended)
// Simplified for this task: frontend handles success and then creates app order.
// Backend verification would involve checking razorpay_signature.

module.exports = router;
