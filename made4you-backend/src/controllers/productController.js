const Product = require('../models/Product');

exports.addProduct = async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json({ msg: 'Product added successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
