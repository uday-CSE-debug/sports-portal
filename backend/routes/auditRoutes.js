const express = require('express');
const router = express.Router();
const { getLogs } = require('../controllers/auditController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect);
router.use(authorize('admin'));

// @desc    Get all audit logs
// @route   GET /api/audit
// @access  Private/Admin
router.get('/', getLogs);

module.exports = router;
