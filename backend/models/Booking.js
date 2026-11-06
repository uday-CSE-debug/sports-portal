const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Equipment = require('./Equipment');

const Booking = sequelize.define('Booking', {
    booking_date: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    time_slot: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'issued', 'returned', 'rejected', 'cancelled'),
        defaultValue: 'pending'
    },
    remarks: {
        type: DataTypes.TEXT
    },
    skill_level: {
        type: DataTypes.ENUM('Beginner', 'Intermediate', 'Advanced'),
        defaultValue: 'Intermediate'
    }
}, {
    tableName: 'bookings',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

// Associations
User.hasMany(Booking, { foreignKey: 'user_id' });
Booking.belongsTo(User, { foreignKey: 'user_id' });

Equipment.hasMany(Booking, { foreignKey: 'equipment_id' });
Booking.belongsTo(Equipment, { foreignKey: 'equipment_id' });

module.exports = Booking;
