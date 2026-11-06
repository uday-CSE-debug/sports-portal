const { sequelize } = require('./config/db');

async function checkIndexes() {
    try {
        const [results] = await sequelize.query("SHOW INDEX FROM users");
        console.log('Indexes on users table:', results.length);
        results.forEach(r => {
            console.log(`- ${r.Key_name} (${r.Column_name})`);
        });
        process.exit(0);
    } catch (err) {
        console.error('Error showing indexes:', err.message);
        process.exit(1);
    }
}

checkIndexes();
