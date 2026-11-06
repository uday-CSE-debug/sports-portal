const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { createLog } = require('./auditController');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { roll_no, email, password, full_name, role, department, year, sports_interests } = req.body;

    try {
        const userExists = await User.findOne({ where: { roll_no } });

        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const user = await User.create({
            roll_no,
            email,
            password_hash,
            full_name,
            department,
            year,
            sports_interests,
            role: role || 'student', // Default to student
        });

        if (user) {
            res.status(201).json({
                id: user.id,
                roll_no: user.roll_no,
                email: user.email,
                full_name: user.full_name,
                role: user.role,
                token: generateToken(user.id),
            });
            // Audit Log
            await createLog(user.id, 'USER_REGISTRATION', `New account created: ${user.full_name} (${user.roll_no})`, req.ip);
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const { Op } = require('sequelize');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { roll_no, password } = req.body;

    try {
        const user = await User.findOne({
            where: {
                [Op.or]: [
                    { roll_no: roll_no },
                    { email: roll_no }
                ]
            }
        });

        console.log(`Login attempt for Roll No: ${roll_no}`);
        if (!user) {
            console.log('User not found in database');
        } else {
            console.log(`User found: ${user.roll_no}, Role: ${user.role}`);
        }

        if (user && (await user.matchPassword(password))) {
            // Admin approval check removed per request
            if (user.status === 'rejected') {
                return res.status(403).json({ message: 'Your account registration has been rejected.' });
            }

            res.json({
                id: user.id,
                roll_no: user.roll_no,
                email: user.email,
                full_name: user.full_name,
                role: user.role,
                status: user.status,
                token: generateToken(user.id),
            });
            // Audit Log
            await createLog(user.id, 'LOGIN', `User logged in`, req.ip);
        } else {
            res.status(401).json({ message: 'Invalid roll number or password' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const crypto = require('crypto');

// @desc    Forgot Password - Generate reset token
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    const { roll_no } = req.body;
    console.log(`Password reset requested for: ${roll_no}`);

    try {
        const user = await User.findOne({ where: { roll_no } });

        if (!user) {
            console.log(`User ${roll_no} not found`);
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        user.reset_password_token = hashedToken;
        user.reset_password_expiry = new Date(Date.now() + 3600000); // 1 hour

        console.log(`Saving reset token for user ${user.id}`);
        await user.save();
        console.log(`Reset token saved successfully`);

        // In a real app, send email. Here, we just return the token for testing/demo
        res.status(200).json({
            message: 'Password reset token generated',
            resetToken: resetToken // Only returning for demo purposes
        });

    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reset Password
// @route   POST /api/auth/reset-password/:token
// @access  Public
const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    try {
        const user = await User.findOne({
            where: {
                reset_password_token: hashedToken,
                reset_password_expiry: { [Op.gt]: Date.now() }
            }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password_hash = await bcrypt.hash(password, salt);
        user.reset_password_token = null;
        user.reset_password_expiry = null;

        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
        await createLog(user.id, 'PASSWORD_RESET', 'User reset their password', req.ip);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);

        if (user) {
            user.full_name = req.body.full_name || user.full_name;
            user.email = req.body.email || user.email;
            user.sports_interests = req.body.sports_interests || user.sports_interests;

            if (req.body.password) {
                const salt = await bcrypt.genSalt(10);
                user.password_hash = await bcrypt.hash(req.body.password, salt);
            }

            const updatedUser = await user.save();

            res.json({
                id: updatedUser.id,
                roll_no: updatedUser.roll_no,
                email: updatedUser.email,
                full_name: updatedUser.full_name,
                role: updatedUser.role,
                sports_interests: updatedUser.sports_interests,
                token: generateToken(updatedUser.id),
            });

            // Audit Log
            await createLog(user.id, 'PROFILE_UPDATE', `Profile updated for ${user.full_name}`, req.ip);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword, updateUserProfile };
