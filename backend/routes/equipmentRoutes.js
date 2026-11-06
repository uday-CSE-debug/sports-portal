const express = require('express');
const router = express.Router();
const { getEquipment, addEquipment, updateEquipment, deleteEquipment } = require('../controllers/equipmentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(getEquipment)
    .post(protect, authorize('admin'), addEquipment);

router.route('/:id')
    .put(protect, authorize('admin', 'sub_admin'), updateEquipment)
    .delete(protect, authorize('admin'), deleteEquipment);

module.exports = router;
