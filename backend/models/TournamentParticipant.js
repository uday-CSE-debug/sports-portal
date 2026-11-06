const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const TournamentParticipant = sequelize.define('TournamentParticipant', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    tournament_id: {
        type: DataTypes.UUID,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    seed: {
        type: DataTypes.INTEGER,
        allowNull: true,
    }
}, {
    timestamps: true,
    underscored: true,
});

module.exports = TournamentParticipant;
