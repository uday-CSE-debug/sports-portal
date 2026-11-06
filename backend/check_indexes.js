const { sequelize } = require('./config/db');

async function checkIndexes() {
    try {
        await sequelize.authenticate();
        const [results] = await sequelize.query("SHOW INDEX FROM users");
        console.log('--- INDEX DATA ---');
        console.table(results.map(i => ({ Table: i.Table, Column: i.Column_name, Key_name: i.Key_name })));
        console.log('--- END ---');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err);
        process.exit(1);
    }
}

checkIndexes();
