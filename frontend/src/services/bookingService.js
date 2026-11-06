import axios from 'axios';

/**
 * Fetches slot statistics for a specific date and equipment.
 * @param {string} token
 * @param {string} equipmentId
 * @param {string} date
 * @returns {Promise<Object[]>}
 */
export const fetchSlotStatistics = async (token, equipmentId, date) => {
    const response = await axios.get(`/api/bookings/stats?equipment_id=${equipmentId}&booking_date=${date}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

/**
 * Fetches recommendation slots.
 * @param {string} token
 * @param {string} equipmentId
 * @param {string} date
 * @returns {Promise<Object>}
 */
export const fetchRecommendationSlots = async (token, equipmentId, date) => {
    try {
        const response = await axios.get(`/api/recommendations/slots?equipment_id=${equipmentId}&date=${date}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        return { slots: [] };
    }
};

/**
 * Creates a new booking.
 * @param {string} token
 * @param {Object} bookingData
 * @returns {Promise<void>}
 */
export const createBooking = async (token, bookingData) => {
    await axios.post('/api/bookings', bookingData, {
        headers: { Authorization: `Bearer ${token}` }
    });
};
