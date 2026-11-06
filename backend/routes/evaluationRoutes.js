const express = require('express');
const router = express.Router();
const { ratePlayer, getPlayerEvaluations, balanceTeams } = require('../controllers/evaluationController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Post a rating (Coach only)
router.post('/rate', protect, authorize('coach', 'admin'), ratePlayer);

// Get player evaluations (Any authenticated user)
router.get('/player/:player_id', protect, getPlayerEvaluations);

// Team balancing (Coach and Admin only)
router.get('/team-balance', protect, authorize('coach', 'admin'), balanceTeams);

module.exports = router;
