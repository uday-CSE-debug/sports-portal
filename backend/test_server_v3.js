process.env.JWT_SECRET = 'testsecret';
console.log('SET JWT_SECRET:', process.env.JWT_SECRET);

const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/db');
require('dotenv').config();

console.log('AFTER DOTENV:', process.env.JWT_SECRET);

const app = express();
const PORT = 5003;

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
    console.log('✅ Test Server v3 running');
    app.listen(PORT, () => {
        console.log(`Test Server v3 running on http://localhost:${PORT}`);
    });
});
