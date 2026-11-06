const User = require('./models/User');
const bcrypt = require('bcryptjs');
const { sequelize } = require('./config/db');

async function createCoach() {
    try {
        await sequelize.authenticate();
        console.log('Database connected...');

        const roll = 'COACH01';
        const pass = 'coach123';
        const email = 'coach@college.edu';

        // Check if exists
        const existing = await User.findOne({ where: { roll_no: roll } });
        if (existing) {
            console.log('Coach user already exists.');
            // Optionally update password
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(pass, salt);
            existing.password_hash = hash;
            await existing.save();
            console.log('Password reset to: coach123');
            process.exit(0);
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(pass, salt);

        await User.create({
            roll_no: roll,
            email: email,
            password_hash: hash,
            full_name: 'Head Coach',
            role: 'coach',
            department: 'Physical Education'
        });

        console.log(`\n--- COACH ACCOUNT CREATED ---`);
        console.log(`Roll No: ${roll}`);
        console.log(`Email: ${email}`);
        console.log(`Password: ${pass}`);
        console.log(`-----------------------------\n`);

        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

createCoach();
