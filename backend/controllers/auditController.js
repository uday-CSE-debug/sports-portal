const AuditLog = require('../models/AuditLog');

const createLog = async (userId, action, details, ip_address) => {
    try {
        await AuditLog.create({
            user_id: userId,
            action,
            details,
            ip_address
        });
    } catch (error) {
        console.error('Failed to create audit log:', error.message);
    }
};

const getLogs = async (req, res) => {
    try {
        const logs = await AuditLog.findAll({
            limit: 100,
            order: [['created_at', 'DESC']],
            include: ['User'] // Ensure association exists or remove if not needed
        });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createLog, getLogs };
