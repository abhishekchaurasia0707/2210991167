const cron = require('node-cron');
const { cleanExpiredBookings } = require('./seatManager');

/**
 * Schedule periodic cleanup of expired bookings
 */
const scheduleCleanup = () => {
  // Run every 5 minutes to clean expired bookings
  cron.schedule('*/5 * * * *', async () => {
    console.log('Running expired bookings cleanup...');
    try {
      await cleanExpiredBookings();
    } catch (error) {
      console.error('Error during expired bookings cleanup:', error);
    }
  });

  // Also run once at startup
  cleanExpiredBookings().catch(console.error);
  
  console.log('Booking cleanup scheduler started (runs every 5 minutes)');
};

module.exports = { scheduleCleanup };
