const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Tournament = sequelize.define('Tournament', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sport: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    type: {
        type: DataTypes.ENUM('single_elimination', 'double_elimination'),
        defaultValue: 'single_elimination',
    },
    status: {
        type: DataTypes.ENUM('registration', 'ongoing', 'finished'),
        defaultValue: 'registration',
    },
    start_date: {
        type: DataTypes.DATE,
    },
    max_participants: {
        type: DataTypes.INTEGER,
        defaultValue: 16,
    },
}, {
    timestamps: true,
    underscored: true,
});

module.exports = Tournament;
