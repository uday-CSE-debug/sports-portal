const Evaluation = require('../models/Evaluation');
const User = require('../models/User');
const { Op } = require('sequelize');

// Submit a rating for a player
exports.ratePlayer = async (req, res) => {
    try {
        const { player_id, sport, stamina, technique, teamwork, speed, remarks } = req.body;
        const coach_id = req.user.id;

        const overall_rating = (stamina + technique + teamwork + speed) / 4;

        const evaluation = await Evaluation.create({
            coach_id,
            player_id,
            sport,
            stamina,
            technique,
            teamwork,
            speed,
            overall_rating,
            remarks
        });

        res.status(201).json({
            success: true,
            message: 'Evaluation submitted successfully',
            data: evaluation
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error submitting evaluation',
            error: error.message
        });
    }
};

// Get evaluations for a specific player
exports.getPlayerEvaluations = async (req, res) => {
    try {
        const { player_id } = req.params;
        const evaluations = await Evaluation.findAll({
            where: { player_id },
            order: [['evaluation_date', 'ASC']]
        });

        res.status(200).json({
            success: true,
            data: evaluations
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching evaluations',
            error: error.message
        });
    }
};

// Team Balancing Logic
exports.balanceTeams = async (req, res) => {
    try {
        const { player_ids, team_count = 2 } = req.query;

        if (!player_ids) {
            return res.status(400).json({ success: false, message: 'Player IDs are required' });
        }

        const ids = player_ids.split(',').map(id => parseInt(id));

        // Get latest evaluation for each player
        const players = await User.findAll({
            where: { id: ids },
            include: [{
                model: Evaluation,
                as: 'evaluations',
                limit: 1,
                order: [['evaluation_date', 'DESC']]
            }]
        });

        // Map players with their rating (default to 5 if no evaluation)
        const playersWithRating = players.map(p => ({
            id: p.id,
            name: p.full_name,
            rating: p.evaluations && p.evaluations.length > 0 ? p.evaluations[0].overall_rating : 5
        }));

        // Sort by rating descending
        playersWithRating.sort((a, b) => b.rating - a.rating);

        // Snake draft balancing
        const teams = Array.from({ length: team_count }, () => []);
        playersWithRating.forEach((player, index) => {
            const teamIndex = Math.floor(index / team_count) % 2 === 0
                ? (index % team_count)
                : (team_count - 1 - (index % team_count));
            teams[teamIndex].push(player);
        });

        res.status(200).json({
            success: true,
            data: teams.map((team, idx) => ({
                team_number: idx + 1,
                players: team,
                average_rating: team.reduce((acc, p) => acc + p.rating, 0) / team.length
            }))
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error balancing teams',
            error: error.message
        });
    }
};
