const express = require('express');
const router = express.Router();
const {
    createTournament,
    registerForTournament,
    startTournament,
    updateMatchScore,
    getBracketData
} = require('../controllers/tournamentController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, admin, createTournament);
router.get('/:id/bracket', getBracketData);
router.post('/:id/register', protect, registerForTournament);
router.post('/:id/start', protect, admin, startTournament);
router.put('/matches/:id', protect, updateMatchScore);

module.exports = router;
