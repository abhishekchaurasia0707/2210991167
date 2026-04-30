const express = require('express');
const { body } = require('express-validator');
const { auth, adminAuth } = require('../middleware/auth');
const {
  createEvent,
  findEvent,
  joinEvent,
  leaveEvent,
  getUserEvents,
  getAllEvents,
  deleteEvent,
  getEventAvailableSeats
} = require('../controllers/eventController');

const router = express.Router();

// Create event validation
const createEventValidation = [
  body('eventName').trim().notEmpty().withMessage('Event name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('capacity').isInt({ min: 1 }).withMessage('Capacity must be at least 1'),
  body('dateTime').isISO8601().withMessage('Valid date and time is required')
];

// Find event validation
const findEventValidation = [
  body('eventName').trim().notEmpty().withMessage('Event name is required'),
  body('roomCode').trim().notEmpty().withMessage('Room code is required')
];

// Join event validation
const joinEventValidation = [
  body('eventName').trim().notEmpty().withMessage('Event name is required'),
  body('roomCode').trim().notEmpty().withMessage('Room code is required'),
  body('seats').optional().isArray().withMessage('Seats must be an array')
];

// Leave event validation
const leaveEventValidation = [
  body('eventId').notEmpty().withMessage('Event ID is required')
];

router.post('/', auth, createEventValidation, createEvent);
router.post('/find', auth, findEventValidation, findEvent);
router.post('/join', auth, joinEventValidation, joinEvent);
router.post('/leave', auth, leaveEventValidation, leaveEvent);
router.get('/my-events', auth, getUserEvents);
router.get('/all', auth, adminAuth, getAllEvents);
router.get('/:eventId/seats', auth, getEventAvailableSeats);
router.delete('/:id', auth, deleteEvent);

module.exports = router;
