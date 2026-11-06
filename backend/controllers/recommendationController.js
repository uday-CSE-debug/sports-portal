const { sequelize } = require('../config/db');
const { Op } = require('sequelize');
const UserActivity = require('../models/UserActivity');
const Booking = require('../models/Booking');
const Equipment = require('../models/Equipment');
const Tournament = require('../models/Tournament');

exports.getRecommendations = async (req, res) => {
    try {
        const userId = req.user.id; // User ID from auth middleware

        // 1. Fetch User History (Activities & Bookings)
        const recentActivities = await UserActivity.findAll({
            where: { user_id: userId },
            order: [['created_at', 'DESC']],
            limit: 10
        });

        const recentBookings = await Booking.findAll({
            where: { user_id: userId },
            include: [{ model: Equipment }],
            order: [['created_at', 'DESC']],
            limit: 5
        });

        // 2. Extract Interests (Categories, specific items)
        let interestCategories = new Set();
        let interestKeywords = new Set();

        recentActivities.forEach(act => {
            if (act.target_type === 'CATEGORY') interestCategories.add(act.target_id);
            if (act.target_type === 'EQUIPMENT') interestKeywords.add(act.target_id); // Assuming target_id could be a name or we verify ID later
        });

        recentBookings.forEach(booking => {
            if (booking.Equipment) {
                interestCategories.add(booking.Equipment.category);
            }
        });

        // Default interest if new user
        if (interestCategories.size === 0) {
            interestCategories.add('Cricket');
            interestCategories.add('Football');
        }

        const categoriesArray = Array.from(interestCategories);

        // 3. Find Recommended Equipment
        const recommendedEquipment = await Equipment.findAll({
            where: {
                category: { [Op.in]: categoriesArray },
                available_quantity: { [Op.gt]: 0 } // Only recommend available items
            },
            limit: 5
        });

        // 4. Find Recommended Tournaments (Esports/Sports)
        // If user is interested in Esports, show Esports tournaments
        const isEsportsFan = categoriesArray.some(cat => ['eSports', 'PUBG', 'COD', 'FF'].includes(cat));

        // Mock logic for tournaments since model might be simple
        let recommendedTournaments = [];
        if (isEsportsFan) {
            recommendedTournaments = await Tournament.findAll({
                where: {
                    // status: 'Open', // Assuming status field exists
                    // name: { [Op.like]: '%Esports%' } 
                },
                limit: 3
            });
        }

        res.json({
            interests: categoriesArray,
            recommended_equipment: recommendedEquipment,
            recommended_tournaments: recommendedTournaments
        });

    } catch (error) {
        console.error('Error fetching recommendations:', error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

exports.logActivity = async (req, res) => {
    try {
        const { activity_type, target_type, target_id, metadata } = req.body;
        const userId = req.user.id;

        await UserActivity.create({
            user_id: userId,
            activity_type,
            target_type,
            target_id,
            metadata
        });

        res.status(201).json({ message: 'Activity logged' });
    } catch (error) {
        console.error('Error logging activity:', error);
        res.status(500).json({ message: 'Error logging activity' });
    }
};

exports.getOptimizedSlots = async (req, res) => {
    try {
        const { equipment_id, date } = req.query;

        if (!equipment_id || !date) {
            return res.status(400).json({ message: 'Equipment ID and Date are required' });
        }

        // 1. Get all bookings for that date
        const bookings = await Booking.findAll({
            where: {
                equipment_id,
                booking_date: date,
                status: { [Op.notIn]: ['rejected', 'cancelled'] }
            }
        });

        // 2. Define operational hours (e.g., 8 AM to 8 PM)
        const allSlots = [
            '08:00 AM - 09:00 AM', '09:00 AM - 10:00 AM', '10:00 AM - 11:00 AM',
            '11:00 AM - 12:00 PM', '12:00 PM - 01:00 PM', '01:00 PM - 02:00 PM',
            '02:00 PM - 03:00 PM', '03:00 PM - 04:00 PM', '04:00 PM - 05:00 PM',
            '05:00 PM - 06:00 PM', '06:00 PM - 07:00 PM', '07:00 PM - 08:00 PM'
        ];

        // 3. Mark occupied slots
        const occupiedSlots = bookings.map(b => b.time_slot);

        // 4. Determine Availability
        // Check equipment quantity. If total_quantity > occupied counts for that slot, it's still open.
        // Wait, standard logic is usually 1 booking = 1 item. 
        // We need to count how many items exist vs how many booked per slot.

        const equipment = await Equipment.findByPk(equipment_id);
        if (!equipment) return res.status(404).json({ message: 'Equipment not found' });

        const totalQty = equipment.total_quantity;

        const slotCounts = {}; // { '08:00...': 2 }
        occupiedSlots.forEach(slot => {
            slotCounts[slot] = (slotCounts[slot] || 0) + 1;
        });

        const optimizedSlots = allSlots.map(slot => {
            const bookedCount = slotCounts[slot] || 0;
            const remaining = totalQty - bookedCount;

            let status = 'Available';
            if (remaining <= 0) status = 'Full';
            else if (remaining < 3) status = 'Limited'; // "Hurry up!" logic

            return {
                time_slot: slot,
                status,
                remaining_qty: remaining > 0 ? remaining : 0
            };
        });

        res.json({
            date,
            equipment_name: equipment.name,
            slots: optimizedSlots
        });

    } catch (error) {
        console.error('Error fetching optimized slots:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};
