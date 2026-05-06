const { body, validationResult } = require('express-validator');
const Event = require('../models/Event');
const User = require('../models/User');
const generateRoomCode = require('../utils/roomCodeGenerator');
const { getAvailableSeats } = require('../utils/seatManager');
const { sendEventJoinConfirmation, sendOrganizerNotification } = require('../utils/emailService');

// Create event
const createEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { eventName, description, capacity, dateTime, endTime } = req.body;

    // Generate unique room code
    let roomCode;
    let isUnique = false;
    let attempts = 0;
    
    while (!isUnique && attempts < 10) {
      roomCode = generateRoomCode();
      const existing = await Event.findOne({ roomCode });
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return res.status(500).json({ message: 'Unable to generate unique room code' });
    }

    const event = new Event({
      eventName,
      description,
      organizerId: req.user.id,
      roomCode,
      capacity,
      dateTime: new Date(dateTime),
      endTime: new Date(endTime),
      totalSeats: capacity,
      resourceType: 'event_hall',
      participants: [] // Start with empty participants, organizer not automatically added
    });

    await event.save();
    await event.populate('organizerId participants', 'name email');

    res.status(201).json({
      success: true,
      event
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Join event
const joinEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { eventName, roomCode, seats } = req.body;

    const event = await Event.findOne({ 
      eventName, 
      roomCode: roomCode.toUpperCase() 
    }).populate('organizerId participants.user', 'name email');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if event has already passed
    if (new Date(event.dateTime) < new Date()) {
      return res.status(400).json({ message: 'This event has already ended' });
    }

    // Check if user is already a participant
    const isAlreadyParticipant = event.participants.some(p => {
      if (p.user && p.user._id) {
        return p.user._id.toString() === req.user.id.toString();
      }
      return false;
    });
    if (isAlreadyParticipant) {
      return res.status(400).json({ message: 'Already joined this event' });
    }

    // Check capacity
    if (event.participants.length >= event.capacity) {
      return res.status(400).json({ message: 'Event is full' });
    }

    // Validate seats if provided - check against existing participant seats in this event
    if (seats && seats.length > 0) {
      const bookedSeats = event.participants.flatMap(p => p.seats || []);
      const unavailableSeats = seats.filter(seat => bookedSeats.includes(seat));
      
      if (unavailableSeats.length > 0) {
        return res.status(400).json({ 
          message: `The following seats are already booked: ${unavailableSeats.join(', ')}` 
        });
      }
    }

    // Add user to participants with seats
    event.participants.push({
      user: req.user.id,
      seats: seats || []
    });
    await event.save();
    await event.populate('organizerId participants.user', 'name email');

    // Send email notifications
    try {
      const participant = event.participants.find(p => 
        p.user?._id?.toString() === req.user.id || p.user?.toString() === req.user.id
      );
      
      if (participant && participant.user && participant.user.email) {
        // Send confirmation to participant
        await sendEventJoinConfirmation(
          participant.user.email,
          participant.user.name,
          {
            eventName: event.eventName,
            roomCode: event.roomCode,
            dateTime: event.dateTime,
            endTime: event.endTime,
            organizer: event.organizerId
          },
          seats || []
        );
      }

      // Send notification to organizer
      if (event.organizerId && event.organizerId.email && participant && participant.user) {
        await sendOrganizerNotification(
          event.organizerId.email,
          event.organizerId.name,
          {
            eventName: event.eventName,
            roomCode: event.roomCode,
            dateTime: event.dateTime,
            endTime: event.endTime
          },
          participant.user.name || 'Unknown',
          seats || []
        );
      }
    } catch (emailError) {
      console.error('Error sending join event emails:', emailError);
      // Don't fail the request if email fails
    }

    res.json({
      success: true,
      event,
      message: 'Successfully joined the event'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user events
const getUserEvents = async (req, res) => {
  try {
    const events = await Event.find({
      $or: [
        { organizerId: req.user.id },
        { 'participants.user': req.user.id }
      ]
    })
    .populate('organizerId participants.user', 'name email')
    .sort({ dateTime: 1 });

    res.json({
      success: true,
      events
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all events (admin)
const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('organizerId participants.user', 'name email')
      .sort({ dateTime: 1 });

    res.json({
      success: true,
      events
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete event
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is organizer or admin
    if (event.organizerId.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await event.deleteOne();

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get available seats for event
const getEventAvailableSeats = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { eventId } = req.params;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Get all seats that are already booked for this event
    const bookedSeats = event.participants.flatMap(p => p.seats || []);
    
    // Get available seats using the seat manager
    const seatData = await getAvailableSeats(
      event.resourceType, 
      event.dateTime.toISOString().split('T')[0], 
      event.dateTime.toTimeString().split(' ')[0]
    );

    // Filter out already booked seats
    const totalSeats = seatData.availableSeats || [];
    const remainingSeats = totalSeats.filter(seat => !bookedSeats.includes(seat));

    res.json({
      success: true,
      availableSeats: remainingSeats,
      bookedSeats: bookedSeats,
      totalSeats: totalSeats.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Find event (without joining)
const findEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { eventName, roomCode } = req.body;

    const event = await Event.findOne({ 
      eventName, 
      roomCode: roomCode.toUpperCase() 
    }).populate('organizerId participants.user', 'name email');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if event has already passed
    if (new Date(event.dateTime) < new Date()) {
      return res.status(400).json({ message: 'This event has already ended' });
    }

    // Check if user is already a participant
    const isAlreadyParticipant = event.participants.some(p => {
      if (p.user && p.user._id) {
        return p.user._id.toString() === req.user.id;
      }
      // Handle old schema where participants might be just user IDs
      return p.toString() === req.user.id;
    });
    
    if (isAlreadyParticipant) {
      return res.status(400).json({ message: 'Already joined this event' });
    }

    // Check capacity
    if (event.participants.length >= event.capacity) {
      return res.status(400).json({ message: 'Event is full' });
    }

    res.json({
      success: true,
      event,
      message: 'Event found successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Leave event
const leaveEvent = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { eventId } = req.body;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if user is a participant
    const participantIndex = event.participants.findIndex(p => 
      p.user && p.user.toString() === req.user.id.toString()
    );

    if (participantIndex === -1) {
      return res.status(400).json({ message: 'You are not a participant in this event' });
    }

    // Remove user from participants
    event.participants.splice(participantIndex, 1);
    await event.save();
    await event.populate('organizerId participants.user', 'name email');

    res.json({
      success: true,
      event,
      message: 'Successfully left the event'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createEvent,
  findEvent,
  joinEvent,
  leaveEvent,
  getUserEvents,
  getAllEvents,
  deleteEvent,
  getEventAvailableSeats
};
