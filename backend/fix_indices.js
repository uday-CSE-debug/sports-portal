const { sequelize } = require('./config/db');

async function fixIndices() {
    try {
        await sequelize.authenticate();
        const [results] = await sequelize.query("SHOW INDEX FROM users");

        // Find all unique indexes on roll_no and email that aren't the primary ones
        const redundantIndexes = results
            .filter(i => (i.Column_name === 'roll_no' || i.Column_name === 'email') && i.Key_name !== 'PRIMARY')
            .map(i => i.Key_name);

        // Use a Set to get unique index names
        const uniqueRedundant = [...new Set(redundantIndexes)];

        console.log(`Found ${uniqueRedundant.length} redundant indexes.`);

        for (const indexName of uniqueRedundant) {
            console.log(`Dropping index: ${indexName}`);
            await sequelize.query(`ALTER TABLE users DROP INDEX ${indexName}`).catch(err => console.log(`Failed to drop ${indexName}: ${err.message}`));
        }

        console.log('Index cleanup complete.');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

fixIndices();
