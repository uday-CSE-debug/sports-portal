const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/db');
require('dotenv').config();

// FORCE SECRET for test
process.env.JWT_SECRET = 'testsecret';

const app = express();
const PORT = 5002;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/equipment', require('./routes/equipmentRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/audit', require('./routes/auditRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));

sequelize.sync().then(() => {
    console.log('✅ Test Server v2 running');
    app.listen(PORT, () => {
        console.log(`Test Server v2 running on http://localhost:${PORT}`);
    });
});
