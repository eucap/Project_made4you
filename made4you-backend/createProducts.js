// made4you-backend/createProducts.js

const mongoose = require('mongoose');
const Product = require('./src/models/Product');  // Ensure the path is correct

const mongoUri = 'mongodb://localhost:27017/made4you';

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

const products = [
    {
        name: 'Product 1',
        brand: 'Brand 1',
        price: 100,
        actualPrice: 200,
        discount: 50,
        image: 'img/card1.png',
        description: 'A short line about the product.',
        category: 'men'
    },
    {
        name: 'Product 2',
        brand: 'Brand 2',
        price: 150,
        actualPrice: 250,
        discount: 40,
        image: 'img/card2.png',
        description: 'A short line about the product.',
        category: 'women'
    },
    {
        name: 'Product 3',
        brand: 'Brand 3',
        price: 200,
        actualPrice: 300,
        discount: 30,
        image: 'img/card3.png',
        description: 'A short line about the product.',
        category: 'kids'
    },
    // Add more products as needed
];

const createProducts = async () => {
    try {
        await Product.insertMany(products);
        console.log('Products added');
        mongoose.connection.close();
    } catch (err) {
        console.error('Error adding products:', err);
        mongoose.connection.close();
    }
};

createProducts();
