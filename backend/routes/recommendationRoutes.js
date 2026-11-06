const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', protect, recommendationController.getRecommendations);
router.post('/activity', protect, recommendationController.logActivity);
router.get('/slots', protect, recommendationController.getOptimizedSlots);

module.exports = router;
