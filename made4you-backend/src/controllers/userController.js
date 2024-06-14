const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const jwtSecret = 'your_jwt_secret';

// Signup controller
exports.signup = async (req, res) => {
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
};

// Login controller
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Login request received:', email); // Debugging

        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found for email:', email); // Debugging
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        console.log('User found:', user); // Debugging

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log('Password does not match for user:', email); // Debugging
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        const payload = { user: { id: user.id } };
        jwt.sign(payload, jwtSecret, { expiresIn: '1h' }, (err, token) => {
            if (err) throw err;
            console.log('Login successful, token generated'); // Debugging
            res.json({ token });
        });
    } catch (err) {
        console.error('Error during login process:', err); // Debugging
        res.status(500).json({ msg: 'Server error' });
    }
};
