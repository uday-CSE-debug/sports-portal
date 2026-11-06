const Booking = require('../models/Booking');
const User = require('../models/User');
const Equipment = require('../models/Equipment');
const { sequelize } = require('../config/db');

// @desc    Get dashboard stats
// @route   GET /api/reports/stats
// @access  Private/Admin
const getStats = async (req, res) => {
    try {
        const totalBookings = await Booking.count();
        const activeBookings = await Booking.count({ where: { status: ['pending', 'issued'] } });
        const totalUsers = await User.count({ where: { role: 'student' } });

        // Count bookings by sport/category
        const bookingsBySport = await Booking.findAll({
            include: [{ model: Equipment, attributes: ['category'] }],
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('Booking.id')), 'count']
            ],
            group: ['Equipment.category'],
            raw: true
        });

        res.json({
            totalBookings,
            activeBookings,
            totalUsers,
            bookingsBySport
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get leaderboard data
// @route   GET /api/reports/leaderboard
// @access  Private
const getLeaderboard = async (req, res) => {
    try {
        // Mocking department stats based on user bookings
        const leaderboard = await Booking.findAll({
            include: [{
                model: User,
                attributes: ['full_name'],
                // Assuming department is not in schema, using a mock grouping or could add it to User model
            }],
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('Booking.id')), 'points']
            ],
            group: ['User.id'],
            order: [[sequelize.literal('points'), 'DESC']],
            limit: 10
        });

        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getStats, getLeaderboard };
