const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./src/models/User');  // Ensure this path is correct
const path = require('path');
const multer = require('multer');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Configure Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/made4you';
const jwtSecret = process.env.JWT_SECRET || '7f6f575c71353e196cd284692baf67f9d67a12244a99b9a60a0c5b32d0a54a24';

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/img', express.static(path.join(__dirname, 'src/img')));
//sign route
app.post('/api/users/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }
        user = new User({ email, password });
        await user.save();
        res.status(201).json({ msg: 'User created successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});
/// login route
app.post('/api/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const payload = { user: { id: user.id, isAdmin: user.isAdmin } };
        jwt.sign(payload, jwtSecret, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            res.json({ token });
        });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Middleware to verify token
const auth = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded.user;
        console.log('Authenticated user:', req.user); // Log the authenticated user
        next();
    } catch (err) {
        console.error('Token verification error:', err); // Log token verification errors
        res.status(401).json({ msg: 'Token is not valid' });
    }
};


// Middleware to check admin privileges
const adminAuth = (req, res, next) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ msg: 'Access denied, admin only' });
    }
    console.log('Admin access granted'); // Log admin access
    next();
};


// Order schema and model
const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
            price: { type: Number, required: true } // Ensure price is included
        }
    ],
    totalPrice: { type: Number, required: true },
    address: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    status: { type: String, default: 'Pending' },
    name: { type: String, required: true }, // Add name
    email: { type: String, required: true }, // Add email
    phone: { type: String, required: true }  // Add phone
},{timestamps: true });

const Order = mongoose.model('Order', orderSchema);

// Place a new order
app.post('/api/orders', auth, async (req, res) => {
    try {
        const { items, name, email, phone, address, paymentMethod } = req.body;
        const userId = req.user.id;

        console.log('Received payload:', req.body);
        // Validate request body
            if (!items || !name || !email || !phone || !address || !paymentMethod) {
                     return res.status(400).json({ msg: 'Please provide all required fields' });
            }

            // Ensure all items have quantity
        items.forEach(item => {
            if (!item.quantity) {
                throw new Error('Item quantity is required');
            }
        });
        // Calculate total price
        const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        const newOrder = new Order({
            userId,
            items,
            name,
            email,
            phone,
            address,
            paymentMethod,
            totalPrice,
        });

        await newOrder.save();

        res.status(201).json({ msg: 'Order placed successfully', order: newOrder });
    } catch (err) {
        console.error('Error placing order:', err); // Log detailed error
        res.status(500).json({ msg: 'Server error', error: err.message, stack: err.stack });
    }
});

// Get all orders for admin
app.get('/api/orders', auth, adminAuth, async (req, res) => {
    try {
        const orders = await Order.find().populate('userId', 'email').populate('items.productId', 'name');
        res.json(orders);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Get orders for user
app.get('/api/orders/user', auth, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).populate('items.productId', 'name price images');
        console.log('Orders being returned:', JSON.stringify(orders, null, 2)); // Log the orders
        res.json(orders);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Delete order (requires admin)
app.delete('/api/orders/:id', auth, adminAuth, async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({ msg: 'Order not found' });
        }
        res.status(200).json({ msg: 'Order deleted successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Protected route example
app.get('/api/protected', auth, (req, res) => {
    res.json({ msg: 'This is a protected route', user: req.user });
});

// Product schema and model
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    brand: { type: String, required: true },
    price: { type: Number, required: true },
    actualPrice: { type: Number, required: true },
    discount: { type: Number, required: true },
    images: [{ type: String, required: true }], 
    description: { type: String, required: true },
    pageCategory: { type: String, required: true }, // New field for page category
    productType: { type: String, required: true }, // New field for product type
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }]
});

// Create a text index on the fields you want to search
productSchema.index({ name: 'text', description: 'text', brand: 'text', pageCategory: 'text' });
const Product = mongoose.model('Product', productSchema);

// Review schema and model
const reviewSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

const Review = mongoose.model('Review', reviewSchema);

// Products route to get all products
app.get('/api/products', async (req, res) => {
    try {
        const { pageCategory, productType, discount } = req.query;
        let query = {};
        if (pageCategory) {
            query.pageCategory = pageCategory;
        }
        if (productType) {
            query.productType = productType;
        }
        if (discount) {
            query.discount = { $gt: parseFloat(discount) };
        }
        const products = await Product.find(query).populate('reviews');
        res.json(products);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Add new product (requires admin)
app.post('/api/products', auth, upload.array('images', 4), async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ msg: 'Access denied' });
    }
    try {
        const { name, brand, price, actualPrice, description, pageCategory, productType } = req.body;
        const discount = Math.round(((actualPrice - price) / actualPrice) * 100);
        const images = req.files.map(file => file.path); // Get file paths from uploaded files

        const newProduct = new Product({ name, brand, price, actualPrice, discount, description, pageCategory, productType, images });
        await newProduct.save();
        res.status(201).json({ msg: 'Product created successfully', product: newProduct });
    } catch (err) {
        console.error('Server error:', err);  // Log the error details
        res.status(500).json({ msg: 'Server error' });
    }
});
// Get product by ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.json(product);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Search products
app.get('/api/products/search', async (req, res) => {
    const { query } = req.query;
    try {
        if (!query) {
            return res.status(400).json({ msg: 'Query parameter is required' });
        }

        console.log('Search query:', query); // Log the search query

        const products = await Product.find({
            $text: { $search: query }
        });

        console.log('Search results:', products); // Log the search results

        res.json(products);
    } catch (err) {
        console.error('Error fetching search results:', err.message, err.stack);
        res.status(500).json({ msg: 'Server error', error: err.message, stack: err.stack });
    }
});

// Update product (requires admin)
app.put('/api/products/:id', auth, upload.array('images', 4), async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ msg: 'Access denied' });
    }
    try {
        const { name, brand, price, actualPrice, description, pageCategory, productType } = req.body;
        const images = req.files ? req.files.map(file => file.path) : undefined;
        const discount = Math.round(((actualPrice - price) / actualPrice) * 100);
        const updateFields = { name, brand, price, actualPrice, discount, description, pageCategory, productType };
        if (images) updateFields.images = images;
        const product = await Product.findByIdAndUpdate(req.params.id, updateFields, { new: true });
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.status(200).json({ msg: 'Product updated successfully', product });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});



// Delete product (requires admin)
app.delete('/api/products/:id', auth, async (req, res) => {
    if (!req.user.isAdmin) {
        return res.status(403).json({ msg: 'Access denied' });
    }
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ msg: 'Product not found' });
        }
        res.status(200).json({ msg: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

//Wishlist
app.post('/api/wishlist', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const { productId } = req.body;
        if (!user.wishlist.includes(productId)) {
            user.wishlist.push(productId);
            await user.save();
        }
        res.json(user.wishlist);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

app.get('/api/wishlist', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('wishlist');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user.wishlist);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

app.delete('/api/wishlist/:productId', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const productId = req.params.productId;
        user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
        await user.save();
        res.json(user.wishlist);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Get all users (requires admin)
app.get('/api/users', auth, adminAuth, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Delete user (requires admin)
app.delete('/api/users/:id', auth, adminAuth, async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.status(200).json({ msg: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

// Update user address
app.put('/api/users/address', auth, async (req, res) => {
    try {
        const { address } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        user.address = address;
        await user.save();

        res.status(200).json({ msg: 'Address updated successfully', address: user.address });
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});
// Get user profile
app.get('/api/users/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
});

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));