const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, getAllBookings, updateBookingStatus, getBookingStats } = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, authorize('student'), createBooking)
    .get(protect, authorize('admin', 'sub_admin'), getAllBookings);

router.route('/my')
    .get(protect, getMyBookings);

router.route('/stats')
    .get(protect, getBookingStats);

router.route('/:id/status')
    .put(protect, authorize('admin', 'sub_admin'), updateBookingStatus);

module.exports = router;
