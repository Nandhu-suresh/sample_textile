const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Multer Config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Appending extension
    }
});

const upload = multer({ storage: storage });

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
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const productId = req.params.productId;

        // Check if product is already in wishlist
        if (user.wishlist.some(id => id.toString() === productId)) {
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

// Upload User Avatar
router.post('/upload-avatar', auth, upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Construct the file path (assuming server serves 'uploads' folder statically)
        // If your server is at localhost:5000, and you serve 'uploads', url is:
        // http://localhost:5000/uploads/filename
        // Ideally, store the relative path or full URL. Storing relative path is flexible.
        // Let's store the full URL or consistent relative path.
        // Based on server.js: app.use('/uploads', express.static('uploads'));

        const avatarUrl = `http://localhost:5000/uploads/${req.file.filename}`;

        user.avatar = avatarUrl;
        await user.save();

        res.json({ avatar: avatarUrl });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
