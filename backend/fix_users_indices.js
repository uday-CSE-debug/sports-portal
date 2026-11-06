const { sequelize } = require('./config/db');

async function fixIndexes() {
    try {
        const [results] = await sequelize.query("SHOW INDEX FROM users");
        console.log(`Found ${results.length} indexes.`);

        for (const index of results) {
            const keyName = index.Key_name;
            // Keep PRIMARY, and the first roll_no / email unique indexes
            if (keyName === 'PRIMARY' || keyName === 'roll_no' || keyName === 'email') {
                console.log(`Keeping ${keyName}`);
                continue;
            }

            // Drop redundant roll_no_N and email_N indexes
            if (keyName.startsWith('roll_no_') || keyName.startsWith('email_')) {
                console.log(`Dropping redundant index: ${keyName}`);
                await sequelize.query(`ALTER TABLE users DROP INDEX ${keyName}`);
            }
        }

        console.log('✅ Index cleanup complete.');
        process.exit(0);
    } catch (err) {
        console.error('Error fixing indexes:', err.message);
        process.exit(1);
    }
}

fixIndexes();
