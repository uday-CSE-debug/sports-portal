try {
    console.log('Requiring config/db...');
    const db = require('./config/db');
    console.log('Requiring models/User...');
    const User = require('./models/User');
    console.log('Requiring authRoutes...');
    require('./routes/authRoutes');
    console.log('Requiring equipmentRoutes...');
    require('./routes/equipmentRoutes');
    console.log('Requiring bookingRoutes...');
    require('./routes/bookingRoutes');
    console.log('Requiring adminRoutes...');
    require('./routes/adminRoutes');
    console.log('Requiring auditRoutes...');
    require('./routes/auditRoutes');
    console.log('Requiring reportRoutes...');
    require('./routes/reportRoutes');
    console.log('Requiring evaluationRoutes...');
    require('./routes/evaluationRoutes');
    console.log('Requiring tournamentRoutes...');
    require('./routes/tournamentRoutes');
    console.log('Success!');
} catch (err) {
    console.error('FAILED TO REQUIRE:', err);
}
