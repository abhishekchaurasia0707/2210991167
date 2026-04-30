const express = require('express');
const { body } = require('express-validator');
const { auth, adminAuth } = require('../middleware/auth');
const {
  updateProfile,
  getAllUsers,
  updateUserRole,
  deleteUser
} = require('../controllers/userController');

const router = express.Router();

// Update profile validation
const updateProfileValidation = [
  body('name').trim().notEmpty().withMessage('Name is required')
];

// Update role validation
const updateRoleValidation = [
  body('role').isIn(['student', 'faculty', 'admin']).withMessage('Invalid role')
];

router.put('/profile', auth, updateProfileValidation, updateProfile);
router.get('/all', auth, adminAuth, getAllUsers);
router.put('/:id/role', auth, adminAuth, updateRoleValidation, updateUserRole);
router.delete('/:id', auth, adminAuth, deleteUser);

module.exports = router;
