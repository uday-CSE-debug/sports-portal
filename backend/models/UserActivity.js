const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');

const UserActivity = sequelize.define('UserActivity', {
    activity_type: {
        type: DataTypes.ENUM('VIEW', 'SEARCH', 'BOOK', 'CLICK'),
        allowNull: false
    },
    target_type: {
        type: DataTypes.ENUM('EQUIPMENT', 'CATEGORY', 'TOURNAMENT'),
        allowNull: false
    },
    target_id: {
        type: DataTypes.STRING, // Can be ID or Category Name
        allowNull: false
    },
    metadata: {
        type: DataTypes.JSON, // For extra details like filtering params
        allowNull: true
    }
}, {
    tableName: 'user_activities',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

// Associations
User.hasMany(UserActivity, { foreignKey: 'user_id' });
UserActivity.belongsTo(User, { foreignKey: 'user_id' });

module.exports = UserActivity;
