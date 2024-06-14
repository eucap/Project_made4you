const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');  // Ensure this path is correct based on your directory structure

mongoose.connect('mongodb://localhost:27017/made4you', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected...'))
.catch(err => console.log(err));

const createAdmin = async () => {
    try {
        const email = 'admin@example.com';
        const password = 'adminpassword';
        const isAdmin = true;

        let user = await User.findOne({ email });
        if (user) {
            console.log('Admin already exists');
            process.exit(0);
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({
            email,
            password: hashedPassword,
            isAdmin
        });

        await user.save();
        console.log('Admin created successfully');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createAdmin();
