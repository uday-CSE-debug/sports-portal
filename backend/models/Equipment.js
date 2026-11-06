const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Equipment = sequelize.define('Equipment', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.ENUM('Cricket', 'Football', 'Indoor', 'Outdoor', 'eSports', 'Other', 'PUBG', 'FF', 'COD'),
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('physical', 'esports'),
        defaultValue: 'physical'
    },
    description: {
        type: DataTypes.TEXT
    },
    total_quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    available_quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    image_url: {
        type: DataTypes.STRING
    },
    item_condition: {
        type: DataTypes.ENUM('Good', 'Damaged', 'Lost'),
        defaultValue: 'Good'
    }
}, {
    tableName: 'equipment',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
});

module.exports = Equipment;
