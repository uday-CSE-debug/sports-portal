const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/equipment', require('./routes/equipmentRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/audit', require('./routes/auditRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/evaluations', require('./routes/evaluationRoutes'));
app.use('/api/tournaments', require('./routes/tournamentRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));

app.get('/', (req, res) => {
    res.send('College Sports Portal API is Running!');
});

// Sync Models
sequelize.sync().then(() => {
    console.log('✅ Models synced with database');
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});
