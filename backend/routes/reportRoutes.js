const express = require('express');
const router = express.Router();
const { getStats, getLeaderboard } = require('../controllers/reportController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/stats', protect, authorize('admin', 'subadmin'), getStats);
router.get('/leaderboard', protect, getLeaderboard);

module.exports = router;
