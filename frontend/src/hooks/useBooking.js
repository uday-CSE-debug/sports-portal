import { useState, useEffect } from 'react';
import { fetchSlotStatistics, fetchRecommendationSlots, createBooking } from '../services/bookingService';

export const useBooking = (token) => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [bookingDate, setBookingDate] = useState('');
    const [timeSlot, setTimeSlot] = useState('');
    const [skillLevel, setSkillLevel] = useState('Intermediate');
    const [slotStats, setSlotStats] = useState([]);
    const [conflictInfo, setConflictInfo] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Reset state when modal closes
    const closeBookingModal = () => {
        setSelectedItem(null);
        setBookingDate('');
        setTimeSlot('');
        setConflictInfo(null);
        setSlotStats([]);
    };

    // Fetch stats when date/item changes
    useEffect(() => {
        if (!bookingDate || !selectedItem || !token) return;

        const loadStats = async () => {
            try {
                const [stats, recs] = await Promise.all([
                    fetchSlotStatistics(token, selectedItem.id, bookingDate),
                    fetchRecommendationSlots(token, selectedItem.id, bookingDate)
                ]);

                const mergedStats = stats.map(s => {
                    const rec = recs.slots?.find(r => r.time_slot === s.slot);
                    return {
                        ...s,
                        isRecommended: rec && rec.status === 'Available' && rec.remaining_qty > 0
                    };
                });
                setSlotStats(mergedStats);
            } catch (err) {
                console.error("Failed to load slot stats", err);
            }
        };

        loadStats();
    }, [bookingDate, selectedItem, token]);

    const submitBooking = async (onSuccess) => {
        if (!selectedItem || !token) return;
        setIsSubmitting(true);
        setConflictInfo(null);

        try {
            await createBooking(token, {
                equipment_id: selectedItem.id,
                booking_date: bookingDate,
                time_slot: timeSlot,
                skill_level: skillLevel
            });

            if (onSuccess) onSuccess();
            closeBookingModal();
            return { success: true };
        } catch (err) {
            const data = err.response?.data;
            if (data?.reason) {
                setConflictInfo(data);
            } else {
                alert(data?.message || 'Booking failed');
            }
            return { success: false, error: err };
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        selectedItem,
        setSelectedItem,
        bookingDate,
        setBookingDate,
        timeSlot,
        setTimeSlot,
        skillLevel,
        setSkillLevel,
        slotStats,
        conflictInfo,
        setConflictInfo,
        isSubmitting,
        submitBooking,
        closeBookingModal
    };
};
