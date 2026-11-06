const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = 5001; // distinct port

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/equipment', require('./routes/equipmentRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/audit', require('./routes/auditRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));
// Add other routes if strictly needed for auth/rec, but these should suffice

sequelize.sync().then(() => {
    console.log('✅ Test Server Models synced');
    app.listen(PORT, () => {
        console.log(`Test Server running on http://localhost:${PORT}`);
    });
});
