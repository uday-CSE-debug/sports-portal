const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Evaluation = sequelize.define('Evaluation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    coach_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    player_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    sport: {
        type: DataTypes.STRING,
        allowNull: false
    },
    stamina: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: { min: 0, max: 10 }
    },
    technique: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: { min: 0, max: 10 }
    },
    teamwork: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: { min: 0, max: 10 }
    },
    speed: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: { min: 0, max: 10 }
    },
    overall_rating: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    remarks: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    evaluation_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'evaluations',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Evaluation;
