const { getLiveStats, getEsportsMetrics, getUsageHeatmap } = require('./controllers/analyticsController');
const { sequelize } = require('./config/db');

// Mock req and res
const req = {};
const res = {
    json: (data) => console.log('JSON Output:', JSON.stringify(data, null, 2)),
    status: (code) => {
        console.log('Status Code:', code);
        return res; // chainable
    }
};

async function runTests() {
    try {
        await sequelize.authenticate();
        console.log('DB Connected');

        console.log('\n--- Testing getLiveStats ---');
        await getLiveStats(req, res);

        console.log('\n--- Testing getEsportsMetrics ---');
        await getEsportsMetrics(req, res);

        console.log('\n--- Testing getUsageHeatmap ---');
        await getUsageHeatmap(req, res);

    } catch (err) {
        console.error('Test Script Error:', err);
    } finally {
        // process.exit(); 
        // Don't exit immediately, let async finish
    }
}

// Ensure models are loaded
require('./models/User');
require('./models/Equipment');
require('./models/Booking');
require('./models/TournamentMatch');
require('./models/TournamentParticipant');

runTests();
