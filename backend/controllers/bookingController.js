const { Op } = require('sequelize');
const Booking = require('../models/Booking');
const Equipment = require('../models/Equipment');
const { sequelize } = require('../config/db');
const { createLog } = require('./auditController');

// Helper to check slot availability and user overlap
const getSlotAvailability = async (equipment_id, booking_date, time_slot, user_id = null) => {
    // 1. Check if user already has ANY booking for this date and slot
    if (user_id) {
        const userOverlap = await Booking.findOne({
            where: {
                user_id,
                booking_date,
                time_slot,
                status: { [Op.notIn]: ['cancelled', 'rejected', 'returned'] }
            }
        });
        if (userOverlap) return { available: false, reason: 'USER_OVERLAP', message: 'You already have an active booking for this time slot.' };
    }

    // 2. Check equipment stock for this slot
    const equipment = await Equipment.findByPk(equipment_id);
    if (!equipment) return { available: false, reason: 'NOT_FOUND', message: 'Equipment not found.' };

    const activeBookingsCount = await Booking.count({
        where: {
            equipment_id,
            booking_date,
            time_slot,
            status: { [Op.notIn]: ['cancelled', 'rejected', 'returned'] }
        }
    });

    const isAvailable = activeBookingsCount < equipment.total_quantity;

    if (!isAvailable) {
        // Suggest other slots for the same day
        const allSlots = ['Morning (9-11 AM)', 'Afternoon (2-4 PM)', 'Evening (5-7 PM)'];
        const suggestions = [];

        for (const slot of allSlots) {
            if (slot === time_slot) continue;
            const count = await Booking.count({
                where: {
                    equipment_id,
                    booking_date,
                    time_slot: slot,
                    status: { [Op.notIn]: ['cancelled', 'rejected', 'returned'] }
                }
            });
            if (count < equipment.total_quantity) {
                suggestions.push({
                    slot,
                    available: equipment.total_quantity - count,
                    demand: count / equipment.total_quantity > 0.7 ? 'High' : 'Normal'
                });
            }
        }

        return {
            available: false,
            reason: 'SLOT_FULL',
            message: 'This slot is fully booked for this equipment.',
            suggestions
        };
    }

    return { available: true, equipment };
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private/Student
const createBooking = async (req, res) => {
    const { equipment_id, booking_date, time_slot, skill_level } = req.body;

    try {
        const availability = await getSlotAvailability(equipment_id, booking_date, time_slot, req.user.id);

        if (!availability.available) {
            return res.status(400).json({
                message: availability.message,
                reason: availability.reason,
                suggestions: availability.suggestions
            });
        }

        const equipment = availability.equipment;

        const booking = await Booking.create({
            user_id: req.user.id,
            equipment_id,
            booking_date,
            time_slot,
            skill_level
        });

        // Note: We don't necessarily need to deduct from global available_quantity 
        // if we are using slot-based validation, but for compatibility with existing 
        // admin dashboards that might show "current stock", we can keep it.
        // However, a smarter way is to use slot validation.

        // For now, let's keep the available_quantity reduction to not break existing admin views
        await equipment.update({
            available_quantity: equipment.available_quantity - 1
        });

        await createLog(req.user.id, 'CREATE_BOOKING', `Student booked item ${equipment_id} for ${booking_date} ${time_slot}`, req.ip);
        res.status(201).json(booking);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get user bookings
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            where: { user_id: req.user.id },
            include: [Equipment]
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin/SubAdmin
const getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.findAll({
            include: [Equipment]
        });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update booking status (Issue/Return)
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin/SubAdmin
const updateBookingStatus = async (req, res) => {
    const { status, remarks } = req.body;

    const t = await sequelize.transaction();

    try {
        const booking = await Booking.findByPk(req.params.id, { transaction: t });
        if (!booking) {
            await t.rollback();
            return res.status(404).json({ message: 'Booking not found' });
        }

        const equipment = await Equipment.findByPk(booking.equipment_id, { transaction: t });

        // If returning, increment stock
        if (status === 'returned' && booking.status !== 'returned') {
            await equipment.update({
                available_quantity: equipment.available_quantity + 1
            }, { transaction: t });
        }

        // If cancelled/rejected after being pending (stock already deducted)
        if ((status === 'cancelled' || status === 'rejected') && booking.status === 'pending') {
            await equipment.update({
                available_quantity: equipment.available_quantity + 1
            }, { transaction: t });
        }

        await booking.update({ status, remarks }, { transaction: t });

        await t.commit();
        await createLog(req.user.id, 'UPDATE_BOOKING_STATUS', `Booking ${req.params.id} status changed to ${status}`, req.ip);
        res.json(booking);
    } catch (error) {
        await t.rollback();
        res.status(400).json({ message: error.message });
    }
};

const getBookingStats = async (req, res) => {
    try {
        const { equipment_id, booking_date } = req.query;

        if (!equipment_id || !booking_date) {
            return res.status(400).json({ message: 'Equipment ID and date are required' });
        }

        const equipment = await Equipment.findByPk(equipment_id);
        if (!equipment) return res.status(404).json({ message: 'Equipment not found' });

        const slots = ['Morning (9-11 AM)', 'Afternoon (2-4 PM)', 'Evening (5-7 PM)'];
        const stats = await Promise.all(slots.map(async (slot) => {
            const count = await Booking.count({
                where: {
                    equipment_id,
                    booking_date,
                    time_slot: slot,
                    status: { [Op.notIn]: ['cancelled', 'rejected', 'returned'] }
                }
            });
            return {
                slot,
                booked: count,
                available: equipment.total_quantity - count,
                demand: count / equipment.total_quantity > 0.8 ? 'Critical' : (count / equipment.total_quantity > 0.5 ? 'High' : 'Normal')
            };
        }));

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createBooking, getMyBookings, getAllBookings, updateBookingStatus, getBookingStats };
