const User = require('./models/User');
const bcrypt = require('bcryptjs');
const { sequelize } = require('./config/db');

async function testAuth() {
    try {
        await sequelize.authenticate();

        const testRoll = 'TESTUSER';
        const testPass = 'password123';

        // Clean up
        await User.destroy({ where: { roll_no: testRoll } });

        // Register
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(testPass, salt);

        await User.create({
            roll_no: testRoll,
            email: 'test@example.com',
            password_hash: hash,
            full_name: 'Test User'
        });

        console.log(`User ${testRoll} created.`);

        // Login test
        const user = await User.findOne({ where: { roll_no: testRoll } });
        const matches = await user.matchPassword(testPass);

        console.log(`Login match: ${matches}`);

        if (matches) {
            console.log('SUCCESS: Auth system is working correctly.');
        } else {
            console.log('FAILURE: Password comparison failed.');
        }

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

testAuth();
