const bcrypt = require('bcryptjs');

const hashPassword = async () => {
    const password = 'adminpassword';
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password:', hashedPassword);
};

hashPassword();
