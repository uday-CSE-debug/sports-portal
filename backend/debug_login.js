const User = require('./models/User');
const { sequelize } = require('./config/db');
const bcrypt = require('bcryptjs');

async function testLogin() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to DB');

        const tests = [
            { roll: 'ADMIN01', pass: 'admin123' },
            { roll: 'COACH01', pass: 'coach123' }
        ];

        for (const t of tests) {
            console.log(`\nTesting ${t.roll} / ${t.pass}`);
            const user = await User.findOne({ where: { roll_no: t.roll } });

            if (!user) {
                console.log(`❌ User ${t.roll} NOT FOUND in database.`);
                continue;
            }

            console.log(`Found User: ${user.full_name}, Role: ${user.role}, Hash: ${user.password_hash.substring(0, 10)}...`);

            const isMatch = await bcrypt.compare(t.pass, user.password_hash);
            if (isMatch) {
                console.log(`✅ Password VALID.`);
            } else {
                console.log(`❌ Password INVALID.`);
                // Force reset for debugging
                console.log(`--> Forced Resetting password for ${t.roll}...`);

                const salt = await bcrypt.genSalt(10);
                user.password_hash = await bcrypt.hash(t.pass, salt);
                await user.save();
                console.log(`✅ Password force reset to '${t.pass}'`);
            }
        }

    } catch (err) {
        console.error('Test Failed:', err);
    } finally {
        // process.exit();
    }
}

testLogin();
