const express = require('express');
const router = express.Router();
const { getUsers, createSubAdmin, createCoach, deleteUser, approveUser, rejectUser } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes here protected and admin only
router.use(protect);
router.use(authorize('admin'));

router.get('/users', getUsers);
router.post('/users/subadmin', createSubAdmin);
router.post('/users/coach', createCoach);
router.delete('/users/:id', deleteUser);
router.post('/users/approve/:id', approveUser);
router.post('/users/reject/:id', rejectUser);

module.exports = router;
