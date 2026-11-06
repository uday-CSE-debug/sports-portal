const User = require('./models/User');
const { sequelize } = require('./config/db');

async function checkUsers() {
    try {
        await sequelize.authenticate();
        const users = await User.findAll();
        console.log('--- USER DATA ---');
        users.forEach(u => {
            console.log(`Roll: ${u.roll_no} | Email: ${u.email} | Role: ${u.role}`);
        });
        console.log('--- END ---');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkUsers();
