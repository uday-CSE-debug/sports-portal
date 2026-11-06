const User = require('./models/User');
const bcrypt = require('bcryptjs');
const { sequelize } = require('./config/db');

async function createFreshUser() {
    try {
        await sequelize.authenticate();

        const roll = 'U22CS001';
        const pass = 'password123';

        await User.destroy({ where: { roll_no: roll } });

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(pass, salt);

        await User.create({
            roll_no: roll,
            email: 'student@college.edu',
            password_hash: hash,
            full_name: 'Fresh Student',
            role: 'student',
            department: 'Computer Science',
            year: '3rd'
        });

        console.log(`\n--- ACCOUNT CREATED ---`);
        console.log(`Roll No: ${roll}`);
        console.log(`Password: ${pass}`);
        console.log(`-----------------------\n`);

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

createFreshUser();
