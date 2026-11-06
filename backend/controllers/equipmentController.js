const Equipment = require('../models/Equipment');
const { createLog } = require('./auditController');

// @desc    Get all equipment
// @route   GET /api/equipment
// @access  Public
const getEquipment = async (req, res) => {
    try {
        const equipment = await Equipment.findAll();
        res.json(equipment);
    } catch (error) {
        console.error('Error in getEquipment:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add new equipment
// @route   POST /api/equipment
// @access  Private/Admin
const addEquipment = async (req, res) => {
    const { name, category, description, total_quantity, image_url } = req.body;

    try {
        const item = await Equipment.create({
            name,
            category,
            description,
            total_quantity,
            available_quantity: total_quantity,
            image_url
        });

        await createLog(req.user.id, 'ADD_EQUIPMENT', `Added item: ${name} (${category})`, req.ip);

        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update equipment
// @route   PUT /api/equipment/:id
// @access  Private/Admin/SubAdmin
const updateEquipment = async (req, res) => {
    try {
        const item = await Equipment.findByPk(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        const oldData = { ...item.toJSON() };
        const updates = req.body;

        // Smart Quantity Adjustment
        if (updates.total_quantity !== undefined && updates.total_quantity !== item.total_quantity) {
            const diff = updates.total_quantity - item.total_quantity;
            updates.available_quantity = item.available_quantity + diff;

            if (updates.available_quantity < 0) {
                return res.status(400).json({
                    message: `Cannot reduce total quantity by ${Math.abs(diff)}. Only ${item.available_quantity} units are currently available.`
                });
            }
        }

        await item.update(updates);

        await createLog(req.user.id, 'UPDATE_EQUIPMENT', `Updated item ${item.name} (${item.id}). Changes: ${JSON.stringify(updates)}`, req.ip);

        res.json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteEquipment = async (req, res) => {
    try {
        const item = await Equipment.findByPk(req.params.id);
        if (item) {
            const data = JSON.stringify(item);
            await item.destroy();
            await createLog(req.user.id, 'DELETE_EQUIPMENT', `Deleted item ${req.params.id}: ${data}`, req.ip);
            res.json({ message: 'Equipment removed' });
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getEquipment, addEquipment, updateEquipment, deleteEquipment };
