const Tournament = require('../models/Tournament');
const TournamentMatch = require('../models/TournamentMatch');
const TournamentParticipant = require('../models/TournamentParticipant');
const User = require('../models/User');
const { createLog } = require('./auditController');
const { Op } = require('sequelize');

// @desc    Create a new tournament
// @route   POST /api/tournaments
// @access  Admin/Coach
const createTournament = async (req, res) => {
    try {
        const { name, sport, type, max_participants, start_date } = req.body;
        const tournament = await Tournament.create({
            name,
            sport,
            type,
            max_participants,
            start_date
        });

        await createLog(req.user.id, 'TOURNAMENT_CREATED', `Created tournament: ${name}`, req.ip);
        res.status(201).json({ success: true, data: tournament });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Register for a tournament
// @route   POST /api/tournaments/:id/register
// @access  Protected
const registerForTournament = async (req, res) => {
    try {
        const tournament = await Tournament.findByPk(req.params.id);
        if (!tournament) return res.status(404).json({ message: 'Tournament not found' });
        if (tournament.status !== 'registration') return res.status(400).json({ message: 'Registration closed' });

        const participantCount = await TournamentParticipant.count({ where: { tournament_id: tournament.id } });
        if (participantCount >= tournament.max_participants) {
            return res.status(400).json({ message: 'Tournament is full' });
        }

        const alreadyRegistered = await TournamentParticipant.findOne({
            where: { tournament_id: tournament.id, user_id: req.user.id }
        });
        if (alreadyRegistered) return res.status(400).json({ message: 'Already registered' });

        await TournamentParticipant.create({
            tournament_id: tournament.id,
            user_id: req.user.id,
            seed: participantCount + 1
        });

        res.status(200).json({ success: true, message: 'Successfully registered' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Start tournament and generate brackets
// @route   POST /api/tournaments/:id/start
// @access  Admin
const startTournament = async (req, res) => {
    try {
        const tournament = await Tournament.findByPk(req.params.id);
        if (!tournament) return res.status(404).json({ message: 'Tournament not found' });

        const participants = await TournamentParticipant.findAll({
            where: { tournament_id: tournament.id },
            order: [['seed', 'ASC']]
        });

        if (participants.length < 2) return res.status(400).json({ message: 'Need at least 2 participants' });

        // Generate Single Elimination Bracket
        if (tournament.type === 'single_elimination') {
            await generateSingleElimination(tournament, participants);
        } else {
            // Placeholder for Double Elimination
            await generateSingleElimination(tournament, participants); // Fallback for now
        }

        tournament.status = 'ongoing';
        await tournament.save();

        res.status(200).json({ success: true, message: 'Tournament started and bracket generated' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const generateSingleElimination = async (tournament, participants) => {
    const numParticipants = participants.length;
    const numRounds = Math.ceil(Math.log2(numParticipants));
    const bracketSize = Math.pow(2, numRounds); // Total slots in first round

    // 1. Create all matches for all rounds
    for (let r = 1; r <= numRounds; r++) {
        const matchesInRound = Math.pow(2, numRounds - r);
        for (let i = 0; i < matchesInRound; i++) {
            await TournamentMatch.create({
                tournament_id: tournament.id,
                round: r,
                match_index: i,
                bracket_type: 'winners',
                status: 'pending'
            });
        }
    }

    // 2. Populate Round 1 with participants
    const round1Matches = await TournamentMatch.findAll({
        where: { tournament_id: tournament.id, round: 1 },
        order: [['match_index', 'ASC']]
    });

    for (let i = 0; i < bracketSize / 2; i++) {
        const match = round1Matches[i];
        const p1_idx = i * 2;
        const p2_idx = i * 2 + 1;

        if (p1_idx < numParticipants) match.participant1_id = participants[p1_idx].user_id;
        if (p2_idx < numParticipants) match.participant2_id = participants[p2_idx].user_id;

        // If only one participant, they auto-win (Bye)
        if (match.participant1_id && !match.participant2_id) {
            match.winner_id = match.participant1_id;
            match.status = 'finished';
            match.score1 = 1; match.score2 = 0;
        }

        await match.save();

        // If match is finished (Bye), advance the winner
        if (match.status === 'finished') {
            await advanceWinner(match);
        }
    }
};

const advanceWinner = async (match) => {
    const nextRound = match.round + 1;
    const nextMatchIndex = Math.floor(match.match_index / 2);
    const isParticipant1 = match.match_index % 2 === 0;

    const nextMatch = await TournamentMatch.findOne({
        where: {
            tournament_id: match.tournament_id,
            round: nextRound,
            match_index: nextMatchIndex,
            bracket_type: match.bracket_type
        }
    });

    if (nextMatch) {
        if (isParticipant1) nextMatch.participant1_id = match.winner_id;
        else nextMatch.participant2_id = match.winner_id;

        // Check if next match ALSO becomes a Bye (though unlikely in standard start)
        await nextMatch.save();
    }
};

// @desc    Update match score
// @route   PUT /api/tournaments/matches/:id
// @access  Admin/Coach
const updateMatchScore = async (req, res) => {
    try {
        const { score1, score2, winner_id, status } = req.body;
        const match = await TournamentMatch.findByPk(req.params.id);
        if (!match) return res.status(404).json({ message: 'Match not found' });

        match.score1 = score1;
        match.score2 = score2;
        match.winner_id = winner_id;
        match.status = status || 'finished';

        await match.save();

        if (match.status === 'finished' && match.winner_id) {
            await advanceWinner(match);
        }

        res.status(200).json({ success: true, data: match });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get bracket data
// @route   GET /api/tournaments/:id/bracket
// @access  Public
const getBracketData = async (req, res) => {
    try {
        const matches = await TournamentMatch.findAll({
            where: { tournament_id: req.params.id },
            include: [
                { model: User, as: 'Participant1', attributes: ['id', 'full_name', 'roll_no'] },
                { model: User, as: 'Participant2', attributes: ['id', 'full_name', 'roll_no'] },
                { model: User, as: 'Winner', attributes: ['id', 'full_name'] }
            ],
            order: [['round', 'ASC'], ['match_index', 'ASC']]
        });

        // Group by round for easier frontend consumption
        const bracket = {};
        matches.forEach(m => {
            if (!bracket[m.round]) bracket[m.round] = [];
            bracket[m.round].push(m);
        });

        res.status(200).json({ success: true, data: bracket });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createTournament,
    registerForTournament,
    startTournament,
    updateMatchScore,
    getBracketData
};
