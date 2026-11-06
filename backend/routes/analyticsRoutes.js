const express = require('express');
const router = express.Router();
const { getLiveStats, getEsportsMetrics, getUsageHeatmap } = require('../controllers/analyticsController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin', 'coach'));

router.get('/live', getLiveStats);
router.get('/esports', getEsportsMetrics);
router.get('/heatmap', getUsageHeatmap);

module.exports = router;
