const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Create new order
router.post('/', auth, async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        totalPrice
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        return res.status(400).json({ message: 'No order items' });
    } else {
        try {
            // 1. Check stock availability for all items
            for (const item of orderItems) {
                const product = await Product.findById(item.product);
                if (!product) {
                    return res.status(404).json({ message: `Product not found: ${item.name}` });
                }
                if (product.stock < item.quantity) {
                    return res.status(400).json({ message: `Insufficient stock for ${product.title}. Available: ${product.stock}` });
                }
            }

            // 2. Decrement stock
            for (const item of orderItems) {
                const product = await Product.findById(item.product);
                if (product) {
                    product.stock = product.stock - item.quantity;
                    await product.save();
                }
            }

            // 3. Create Order
            const order = new Order({
                orderItems,
                user: req.user.id,
                shippingAddress,
                totalPrice
            });

            const createdOrder = await order.save();
            res.status(201).json(createdOrder);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server Error during order creation' });
        }
    }
});

// Get logged-in user's orders
router.get('/myorders', auth, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get single order by ID (User specific)
router.get('/:id', auth, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email').populate('orderItems.product', 'title image price');

        if (order) {
            // Ensure the user requesting the order is the one who placed it (or admin)
            if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
                return res.status(401).json({ message: 'Not authorized to view this order' });
            }
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        console.error(error);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.status(500).json({ message: 'Server Error' });
    }
});

// Admin: Get all orders
router.get('/admin/orders', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }
        const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Admin: Get single order by ID
router.get('/admin/orders/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }
        const order = await Order.findById(req.params.id).populate('user', 'name email').populate('orderItems.product', 'title image price');
        if (order) {
            res.json(order);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// Admin: Process order (Update status and expected delivery date)
router.put('/admin/order/:id/process', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const { expectedDeliveryDate } = req.body;
        const order = await Order.findById(req.params.id);

        if (order) {
            order.status = 'Shipped';
            order.expectedDeliveryDate = expectedDeliveryDate;

            const updatedOrder = await order.save();
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
