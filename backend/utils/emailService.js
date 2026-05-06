const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: process.env.EMAIL_SERVICE || 'gmail',
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send booking confirmation email
const sendBookingConfirmation = async (userEmail, userName, bookingDetails) => {
  try {
    const transporter = createTransporter();
    
    const { resourceType, date, time, endTime, seats, purpose, status } = bookingDetails;
    
    const mailOptions = {
      from: `"Smart Campus" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Booking Confirmation - ${resourceType.replace('_', ' ').toUpperCase()}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Smart Campus</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Booking Confirmation</p>
          </div>
          
          <div style="padding: 30px; background: #f9fafb;">
            <p style="font-size: 16px; color: #374151;">Hello <strong>${userName}</strong>,</p>
            
            <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
              Your booking has been received and is currently <strong>${status}</strong>.
            </p>
            
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 16px;">Booking Details</h3>
              
              <table style="width: 100%; font-size: 14px;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Resource:</td>
                  <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">${resourceType.replace('_', ' ').toUpperCase()}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Date:</td>
                  <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">${new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Time:</td>
                  <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">${time}${endTime ? ` - ${endTime}` : ''}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Seats:</td>
                  <td style="padding: 8px 0; color: #1f2937; font-weight: 500; font-family: monospace;">${seats && seats.length > 0 ? seats.join(', ') : 'No seats selected'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Purpose:</td>
                  <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">${purpose || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Status:</td>
                  <td style="padding: 8px 0;">
                    <span style="background: ${status === 'approved' ? '#dcfce7' : status === 'rejected' ? '#fee2e2' : '#fef3c7'}; color: ${status === 'approved' ? '#166534' : status === 'rejected' ? '#991b1b' : '#92400e'}; padding: 4px 12px; border-radius: 20px; font-size: 12px; text-transform: uppercase;">
                      ${status}
                    </span>
                  </td>
                </tr>
              </table>
            </div>
            
            <p style="font-size: 13px; color: #9ca3af; margin-top: 20px;">
              You will receive another email when your booking status changes.
            </p>
          </div>
          
          <div style="background: #1f2937; padding: 20px; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              Smart Campus Booking System<br>
              This is an automated email. Please do not reply.
            </p>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log('Booking confirmation email sent to:', userEmail);
  } catch (error) {
    console.error('Error sending booking email:', error);
  }
};

// Send event join confirmation email
const sendEventJoinConfirmation = async (userEmail, userName, eventDetails, seats) => {
  try {
    const transporter = createTransporter();
    
    const { eventName, roomCode, dateTime, endTime, organizer } = eventDetails;
    
    const mailOptions = {
      from: `"Smart Campus" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Event Join Confirmation - ${eventName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Smart Campus</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Event Join Confirmation</p>
          </div>
          
          <div style="padding: 30px; background: #f9fafb;">
            <p style="font-size: 16px; color: #374151;">Hello <strong>${userName}</strong>,</p>
            
            <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
              You have successfully joined the event! Here are your event details:
            </p>
            
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #10b981;">
              <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 18px;">${eventName}</h3>
              
              <table style="width: 100%; font-size: 14px;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Room Code:</td>
                  <td style="padding: 8px 0; color: #1f2937; font-weight: 500; font-family: monospace; font-size: 16px;">${roomCode}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Date & Time:</td>
                  <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">${new Date(dateTime).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}${endTime ? ` - ${new Date(endTime).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' })}` : ''}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Organizer:</td>
                  <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">${organizer?.name || 'Unknown'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Your Seats:</td>
                  <td style="padding: 8px 0; color: #1f2937; font-weight: 500; font-family: monospace;">${seats && seats.length > 0 ? seats.join(', ') : 'General Admission'}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="margin: 0; font-size: 13px; color: #065f46;">
                <strong>Reminder:</strong> Please arrive 10 minutes early. Don't forget to bring your room code: <strong>${roomCode}</strong>
              </p>
            </div>
            
            <p style="font-size: 13px; color: #9ca3af; margin-top: 20px;">
              We look forward to seeing you at the event!
            </p>
          </div>
          
          <div style="background: #1f2937; padding: 20px; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              Smart Campus Event System<br>
              This is an automated email. Please do not reply.
            </p>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log('Event join confirmation email sent to:', userEmail);
  } catch (error) {
    console.error('Error sending event email:', error);
  }
};

// Send notification to organizer when someone joins
const sendOrganizerNotification = async (organizerEmail, organizerName, eventDetails, participantName, seats) => {
  try {
    const transporter = createTransporter();
    
    const { eventName, roomCode, dateTime, endTime } = eventDetails;
    
    const mailOptions = {
      from: `"Smart Campus" <${process.env.EMAIL_USER}>`,
      to: organizerEmail,
      subject: `New Participant Joined - ${eventName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Smart Campus</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">New Participant Alert</p>
          </div>
          
          <div style="padding: 30px; background: #f9fafb;">
            <p style="font-size: 16px; color: #374151;">Hello <strong>${organizerName}</strong>,</p>
            
            <p style="font-size: 14px; color: #6b7280; line-height: 1.6;">
              Someone has joined your event!
            </p>
            
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0; border-left: 4px solid #f59e0b;">
              <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 16px;">Event: ${eventName}</h3>
              
              <table style="width: 100%; font-size: 14px;">
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">New Participant:</td>
                  <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">${participantName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Seats Booked:</td>
                  <td style="padding: 8px 0; color: #1f2937; font-weight: 500; font-family: monospace;">${seats && seats.length > 0 ? seats.join(', ') : 'General Admission'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Room Code:</td>
                  <td style="padding: 8px 0; color: #1f2937; font-weight: 500; font-family: monospace;">${roomCode}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #6b7280;">Date & Time:</td>
                  <td style="padding: 8px 0; color: #1f2937; font-weight: 500;">${new Date(dateTime).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}${endTime ? ` - ${new Date(endTime).toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' })}` : ''}</td>
                </tr>
              </table>
            </div>
            
            <p style="font-size: 13px; color: #9ca3af; margin-top: 20px;">
              You can view all participants in your dashboard.
            </p>
          </div>
          
          <div style="background: #1f2937; padding: 20px; text-align: center;">
            <p style="color: #9ca3af; font-size: 12px; margin: 0;">
              Smart Campus Event System<br>
              This is an automated email. Please do not reply.
            </p>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log('Organizer notification email sent to:', organizerEmail);
  } catch (error) {
    console.error('Error sending organizer email:', error);
  }
};

module.exports = {
  sendBookingConfirmation,
  sendEventJoinConfirmation,
  sendOrganizerNotification
};
