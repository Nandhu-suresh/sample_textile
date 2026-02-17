const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

// Get user's wishlist
router.get('/wishlist', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('wishlist');
        res.json(user.wishlist);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Toggle product in wishlist (Add/Remove)
router.post('/wishlist/:productId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const productId = req.params.productId;

        // Check if product is already in wishlist
        if (user.wishlist.includes(productId)) {
            // Remove
            user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
        } else {
            // Add
            user.wishlist.push(productId);
        }

        await user.save();

        // Return updated wishlist (could populate if needed immediately, but IDs are usually enough for toggle state)
        res.json(user.wishlist);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
