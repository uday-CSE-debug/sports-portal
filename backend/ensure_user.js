const { sequelize } = require('./config/db');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

async function createTestUser() {
    try {
        await sequelize.sync();
        const existing = await User.findOne({ where: { email: 'student@example.com' } });
        if (existing) {
            console.log('User exists');
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        await User.create({
            full_name: 'Test Student',
            email: 'student@example.com',
            password_hash: hashedPassword,
            roll_no: 'TEST101',
            role: 'student'
        });
        console.log('Test User Created');
    } catch (e) {
        console.error(e);
    }
}
createTestUser();
