import axios from 'axios';

/**
 * @typedef {Object} Equipment
 * @property {string} id
 * @property {string} name
 * @property {string} category
 * @property {string} description
 * @property {number} available_quantity
 * @property {number} total_quantity
 */

/**
 * Fetches all equipment from the API.
 * @param {string} token - Auth token
 * @returns {Promise<Equipment[]>}
 */
export const fetchAllEquipment = async (token) => {
    const { data } = await axios.get('/api/equipment', {
        headers: { Authorization: `Bearer ${token}` }
    });
    return data;
};
