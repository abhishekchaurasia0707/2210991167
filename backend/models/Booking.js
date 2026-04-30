const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  resourceType: {
    type: String,
    enum: ['canteen', 'seminar_hall', 'lecture_hall', 'exploratorium', 'library'],
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  seats: [{
    type: String,
    required: true
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  purpose: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// Index for querying available seats
bookingSchema.index({ resourceType: 1, date: 1, time: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
