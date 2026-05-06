const express = require('express');
const { body, query } = require('express-validator');
const { auth, adminAuth } = require('../middleware/auth');
const {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
  getAvailableSeats
} = require('../controllers/bookingController');

const router = express.Router();

// Create booking validation
const createBookingValidation = [
  body('resourceType').isIn(['canteen', 'seminar_hall', 'lecture_hall', 'exploratorium', 'library'])
    .withMessage('Invalid resource type'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('time').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Time must be in HH:MM format'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  body('purpose').trim().notEmpty().withMessage('Purpose is required'),
  body('seats').isArray().withMessage('Seats must be an array'),
  body('seats.*').isString().withMessage('Each seat must be a string')
];

// Update status validation
const updateStatusValidation = [
  body('status').isIn(['pending', 'approved', 'rejected']).withMessage('Invalid status')
];

// Get available seats validation
const getAvailableSeatsValidation = [
  query('resourceType').isIn(['canteen', 'seminar_hall', 'lecture_hall', 'exploratorium', 'library'])
    .withMessage('Invalid resource type'),
  query('date').isISO8601().withMessage('Valid date is required'),
  query('time').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage('Time must be in HH:MM format')
];

router.post('/', auth, createBookingValidation, createBooking);
router.get('/my-bookings', auth, getUserBookings);
router.get('/all', auth, adminAuth, getAllBookings);
router.get('/available-seats', auth, getAvailableSeatsValidation, getAvailableSeats);
router.put('/:id/status', auth, adminAuth, updateStatusValidation, updateBookingStatus);
router.delete('/:id', auth, deleteBooking);

module.exports = router;
