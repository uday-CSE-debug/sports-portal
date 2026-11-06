const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { createLog } = require('./auditController');

exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password_hash'] }
        });
        res.json(users);
    } catch (err) {
        console.error('Error in getUsers:', err);
        res.status(500).json({ message: err.message });
    }
};

exports.createSubAdmin = async (req, res) => {
    const { roll_no, email, password, full_name } = req.body;
    try {
        const userExists = await User.findOne({ where: { roll_no } });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const subAdmin = await User.create({
            roll_no,
            email,
            password_hash,
            full_name,
            role: 'sub_admin'
        });

        res.status(201).json(subAdmin);
        await createLog(req.user.id, 'CREATE_SUB_ADMIN', `Created sub-admin: ${full_name} (${roll_no})`, req.ip);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.createCoach = async (req, res) => {
    const { roll_no, email, password, full_name } = req.body;
    try {
        const userExists = await User.findOne({ where: { roll_no } });
        if (userExists) return res.status(400).json({ message: 'User already exists' });

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const coach = await User.create({
            roll_no,
            email,
            password_hash,
            full_name,
            role: 'coach'
        });

        res.status(201).json(coach);
        await createLog(req.user.id, 'CREATE_COACH', `Created coach: ${full_name} (${roll_no})`, req.ip);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.role === 'admin') return res.status(403).json({ message: 'Cannot delete primary admin' });

        await user.destroy();
        await createLog(req.user.id, 'DELETE_USER', `Deleted user ${req.params.id}`, req.ip);
        res.json({ message: 'User removed' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.approveUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.status = 'approved';
        await user.save();

        await createLog(req.user.id, 'APPROVE_USER', `Approved user: ${user.full_name} (${user.roll_no})`, req.ip);
        res.json({ message: 'User approved successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.rejectUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.status = 'rejected';
        await user.save();

        await createLog(req.user.id, 'REJECT_USER', `Rejected user: ${user.full_name} (${user.roll_no})`, req.ip);
        res.json({ message: 'User rejected' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
