const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/userController');
const auth = require('../middleware/auth');

// Public routes
router.post('/signup', signup);
router.post('/login', login);

// Protected routes
router.get('/profile', auth, (req, res) => {
    res.send('User profile route');
});

module.exports = router;
