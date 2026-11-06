const { getLiveStats, getEsportsMetrics, getUsageHeatmap } = require('./controllers/analyticsController');
const { sequelize } = require('./config/db');

// Mock req and res
const req = {};
const res = {
    json: (data) => console.log('✅ JSON Output:', JSON.stringify(data, null, 2).substring(0, 100) + '...'),
    status: (code) => {
        console.log('❌ Status Code:', code);
        return {
            json: (data) => console.log('❌ Error Response:', data)
        };
    }
};

async function runTests() {
    try {
        await sequelize.authenticate();
        console.log('Database Connection Established.');

        console.log('\n----------------------------------------');
        console.log('Testing getLiveStats...');
        try {
            await getLiveStats(req, res);
        } catch (e) {
            console.error('CRITICAL FAILURE in getLiveStats:', e);
        }

        console.log('\n----------------------------------------');
        console.log('Testing getEsportsMetrics...');
        try {
            await getEsportsMetrics(req, res);
        } catch (e) {
            console.error('CRITICAL FAILURE in getEsportsMetrics:', e);
        }

        console.log('\n----------------------------------------');
        console.log('Testing getUsageHeatmap...');
        try {
            await getUsageHeatmap(req, res);
        } catch (e) {
            console.error('CRITICAL FAILURE in getUsageHeatmap:', e);
        }

        console.log('\n----------------------------------------');

    } catch (err) {
        console.error('Global Setup Error:', err);
    }
}

// Ensure models and associations are loaded
// Order matches server.js mostly
const User = require('./models/User');
const Equipment = require('./models/Equipment');
const Booking = require('./models/Booking');
const TournamentMatch = require('./models/TournamentMatch');
const TournamentParticipant = require('./models/TournamentParticipant');

runTests();
