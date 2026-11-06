const { sequelize } = require('./config/db');

async function check() {
    try {
        const [results] = await sequelize.query("DESCRIBE users");
        console.log('Columns in users table:', results.map(r => r.Field));
        process.exit(0);
    } catch (err) {
        console.error('Error describing table:', err.message);
        process.exit(1);
    }
}

check();
