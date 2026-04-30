const Booking = require('../models/Booking');

// Define seat configurations for each resource type
const resourceConfig = {
  canteen: {
    totalSeats: 100,
    rows: 10,
    cols: 10
  },
  seminar_hall: {
    totalSeats: 100,
    rows: 10,
    cols: 10
  },
  lecture_hall: {
    totalSeats: 100,
    rows: 10,
    cols: 10
  },
  exploratorium: {
    totalSeats: 100,
    rows: 10,
    cols: 10
  },
  library: {
    totalSeats: 100,
    rows: 10,
    cols: 10
  },
  event_hall: {
    totalSeats: 100,
    rows: 10,
    cols: 10
  }
};

/**
 * Get available seats for a resource at a specific date and time
 */
const getAvailableSeats = async (resourceType, date, time) => {
  const config = resourceConfig[resourceType];
  if (!config) {
    throw new Error('Invalid resource type');
  }

  // Get all bookings (pending and approved) for this resource, date, and time
  const bookings = await Booking.find({
    resourceType,
    date: new Date(date),
    time,
    status: { $in: ['pending', 'approved'] }
  });

  // Collect all booked seats
  const bookedSeats = new Set();
  bookings.forEach(booking => {
    booking.seats.forEach(seat => bookedSeats.add(seat));
  });

  // Generate all possible seats (simple numbering 1, 2, 3, etc.)
  const allSeats = [];
  for (let i = 1; i <= config.totalSeats; i++) {
    allSeats.push(i.toString());
  }

  // Filter available seats
  const availableSeats = allSeats.filter(seat => !bookedSeats.has(seat));

  return {
    totalSeats: config.totalSeats,
    availableSeats,
    bookedSeats: Array.from(bookedSeats),
    rows: config.rows,
    cols: config.cols
  };
};

/**
 * Validate if requested seats are available
 */
const validateSeats = async (resourceType, date, time, requestedSeats) => {
  const { availableSeats } = await getAvailableSeats(resourceType, date, time);
  
  const unavailableSeats = requestedSeats.filter(seat => !availableSeats.includes(seat));
  
  if (unavailableSeats.length > 0) {
    return {
      valid: false,
      unavailableSeats,
      message: `The following seats are already booked: ${unavailableSeats.join(', ')}`
    };
  }

  return {
    valid: true,
    message: 'All seats are available'
  };
};

/**
 * Get resource configuration
 */
const getResourceConfig = (resourceType) => {
  return resourceConfig[resourceType] || null;
};

module.exports = {
  getAvailableSeats,
  validateSeats,
  getResourceConfig,
  resourceConfig
};
