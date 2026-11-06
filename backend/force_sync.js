const { sequelize } = require('./config/db');
const User = require('./models/User');

async function forceSync() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB...');

        // Try to sync with alter: true and log specific error
        await sequelize.sync({ alter: true });
        console.log('Sync Successful!');
        process.exit(0);
    } catch (err) {
        console.error('Sync Failed!');
        console.error(err);
        process.exit(1);
    }
}

forceSync();
