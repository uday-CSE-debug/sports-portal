const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const TournamentMatch = sequelize.define('TournamentMatch', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    tournament_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    round: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    match_index: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    bracket_type: {
        type: DataTypes.ENUM('winners', 'losers'),
        defaultValue: 'winners',
    },
    participant1_id: {
        type: DataTypes.INTEGER, // User ID
        allowNull: true,
    },
    participant2_id: {
        type: DataTypes.INTEGER, // User ID
        allowNull: true,
    },
    winner_id: {
        type: DataTypes.INTEGER, // User ID
        allowNull: true,
    },
    score1: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    score2: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    status: {
        type: DataTypes.ENUM('pending', 'live', 'finished'),
        defaultValue: 'pending',
    }
}, {
    timestamps: true,
    underscored: true,
});

module.exports = TournamentMatch;
