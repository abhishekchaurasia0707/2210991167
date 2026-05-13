
Project Title: Smart Campus Booking System


Team Member
2210991167 Abhishek Kumar


Project Type: Copyright


Current Status: Waiting
Files Included
IPR Submission Proof
Report
PPT
Source Code


#Project Explanation

A full-stack web application for booking campus resources and managing events using the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- **User Authentication**: JWT-based login/signup with role-based access (Student, Faculty, Admin)
- **Resource Booking**: Book campus resources (Canteen, Seminar Hall, Lecture Hall, Exploratorium, Library) with seat selection
- **Event Management**: Create events with unique room codes, join events with seat selection
- **Seat Selection**: Interactive seat maps for both resources and events
- **Leave Events**: Participants can leave events they've joined
- **Admin Panel**: Manage bookings, users, and events
- **Responsive Design**: Mobile-friendly UI built with Tailwind CSS
- **Real-time Updates**: Dashboard shows booking status and event participation

## Tech Stack

### Frontend
- React.js with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls
- Context API for state management

### Backend
- Node.js with Express.js
- MongoDB with Mongoose ODM
- JWT for authentication
- bcryptjs for password hashing
- Express validator for input validation

## Project Structure

```
SMARTCAMPUS/
├── backend/
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Custom middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── utils/           # Utility functions
│   ├── server.js        # Main server file
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── context/     # Context providers
│   │   ├── pages/       # Page components
│   │   └── App.tsx      # Main App component
│   └── package.json
└── README.md
```

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### 1. Clone the repository
```bash
git clone <repository-url>
cd SMARTCAMPUS
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your configuration
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install
```

### 4. Environment Configuration

Create a `.env` file in the backend directory with the following variables:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/smartcampus
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
```

For the frontend, create a `.env` file with:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 5. Database Setup

Make sure MongoDB is running on your system or use a cloud service like MongoDB Atlas.

### 6. Running the Application

#### Backend Server
```bash
cd backend
npm run dev
```
The backend will run on `http://localhost:5000`

#### Frontend Development Server
```bash
cd frontend
npm start
```
The frontend will run on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Bookings
- `POST /api/bookings` - Create booking request
- `GET /api/bookings/my-bookings` - Get user bookings
- `GET /api/bookings/all` - Get all bookings (admin)
- `PUT /api/bookings/:id/status` - Update booking status (admin)
- `DELETE /api/bookings/:id` - Delete booking

### Events
- `POST /api/events` - Create event
- `POST /api/events/join` - Join event
- `GET /api/events/my-events` - Get user events
- `GET /api/events/all` - Get all events (admin)
- `DELETE /api/events/:id` - Delete event

### Users
- `PUT /api/users/profile` - Update profile
- `GET /api/users/all` - Get all users (admin)
- `PUT /api/users/:id/role` - Update user role (admin)
- `DELETE /api/users/:id` - Delete user (admin)

## Demo Accounts

Use these accounts to test the application:

### Student Account
- **Email**: student@demo.com
- **Password**: password123

### Faculty Account
- **Email**: faculty@demo.com
- **Password**: password123

### Admin Account
- **Email**: admin@demo.com
- **Password**: password123

*Note: You need to create these accounts through the signup page first.*

## Usage Guide

### For Students/Faculty
1. **Register/Login**: Create an account or login with existing credentials
2. **Dashboard**: View your bookings and joined events
3. **Book Resources**: Select a resource type, date, time, and capacity
4. **Create Events**: Organize events with unique room codes
5. **Join Events**: Enter event name and room code to join

### For Admins
1. **Approve/Reject Bookings**: Review and manage booking requests
2. **User Management**: View all users and update roles
3. **Event Management**: Monitor and delete events if needed
4. **System Overview**: Access comprehensive admin panel

## Features in Detail

### Resource Booking System
- **Resource Types**: Canteen, Seminar Hall, Lecture Hall, Exploratorium, Library
- **Time Slots**: Predefined hourly slots from 8 AM to 6 PM
- **Approval System**: Admin approval required for all bookings
- **Conflict Prevention**: Automatic detection of double bookings

### Event Management
- **Unique Room Codes**: 6-character alphanumeric codes generated automatically
- **Capacity Management**: Prevents overbooking with participant limits
- **Real-time Updates**: Live participant count tracking
- **Secure Joining**: Requires both event name and room code

### User Roles & Permissions
- **Student**: Can book resources and join/create events
- **Faculty**: Same permissions as student
- **Admin**: Full system access including user management and booking approval

## Development

### Adding New Features
1. **Backend**: Add new routes, controllers, and models as needed
2. **Frontend**: Create new components and pages
3. **Database**: Update Mongoose schemas for new data structures

### Code Style
- **Backend**: Follow Express.js best practices
- **Frontend**: Use functional components with hooks
- **Styling**: Tailwind CSS utility classes
- **TypeScript**: Strong typing throughout the frontend

## Deployment

### Backend Deployment
1. Set up production environment variables
2. Configure MongoDB connection string
3. Deploy to services like Heroku, AWS, or DigitalOcean

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy the build folder to static hosting services
3. Configure API URL for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For any issues or questions, please create an issue in the repository or contact the development team.

---


