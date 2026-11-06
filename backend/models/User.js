const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
    roll_no: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
            isEmail: true
        }
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    full_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    department: {
        type: DataTypes.STRING,
        allowNull: true // Optional for coaches/admins
    },
    year: {
        type: DataTypes.STRING,
        allowNull: true // Optional for coaches/admins
    },
    role: {
        type: DataTypes.ENUM('student', 'admin', 'sub_admin', 'coach'),
        defaultValue: 'student'
    },
    reset_password_token: {
        type: DataTypes.STRING,
        allowNull: true
    },
    reset_password_expiry: {
        type: DataTypes.DATE,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'approved'
    },
    sports_interests: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
        {
            unique: true,
            fields: ['roll_no']
        },
        {
            unique: true,
            fields: ['email']
        }
    ]
});

// Method to verify password
User.prototype.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password_hash);
};

// Associations
const Evaluation = require('./Evaluation');
const Tournament = require('./Tournament');
const TournamentMatch = require('./TournamentMatch');
const TournamentParticipant = require('./TournamentParticipant');

User.hasMany(Evaluation, { as: 'evaluations', foreignKey: 'player_id' });
Evaluation.belongsTo(User, { as: 'player', foreignKey: 'player_id' });
Evaluation.belongsTo(User, { as: 'coach', foreignKey: 'coach_id' });

// Tournament Associations
Tournament.hasMany(TournamentParticipant, { foreignKey: 'tournament_id' });
TournamentParticipant.belongsTo(Tournament, { foreignKey: 'tournament_id' });

User.hasMany(TournamentParticipant, { foreignKey: 'user_id' });
TournamentParticipant.belongsTo(User, { foreignKey: 'user_id' });

Tournament.hasMany(TournamentMatch, { foreignKey: 'tournament_id' });
TournamentMatch.belongsTo(Tournament, { foreignKey: 'tournament_id' });

TournamentMatch.belongsTo(User, { as: 'Participant1', foreignKey: 'participant1_id' });
TournamentMatch.belongsTo(User, { as: 'Participant2', foreignKey: 'participant2_id' });
TournamentMatch.belongsTo(User, { as: 'Winner', foreignKey: 'winner_id' });

module.exports = User;
