const Order = require('../models/Order');

exports.placeOrder = async (req, res) => {
    try {
        const { userId, products, totalAmount } = req.body;
        const order = new Order({ userId, products, totalAmount });
        await order.save();
        res.status(201).json({ msg: 'Order placed successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).populate('products');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};
