const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventName: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  roomCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    seats: [String],
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  dateTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: false
  },
  totalSeats: {
    type: Number,
    default: 100
  },
  resourceType: {
    type: String,
    default: 'event_hall'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Event', eventSchema);
