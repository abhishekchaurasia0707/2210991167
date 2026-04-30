import React, { useState, FormEvent } from 'react';
import axios from 'axios';
import EventSeatMap from '../components/EventSeatMap';

interface JoinForm {
  eventName: string;
  roomCode: string;
  seats: string[];
}

const JoinEvent: React.FC = () => {
  const [formData, setFormData] = useState<JoinForm>({
    eventName: '',
    roomCode: '',
    seats: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [joinedEvent, setJoinedEvent] = useState<any>(null);
  const [showSeats, setShowSeats] = useState(false);
  const [seatData, setSeatData] = useState<any>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'roomCode' ? value.toUpperCase() : value
    }));
  };

  const handleSeatsChange = (seats: string[]) => {
    setSelectedSeats(seats);
    setFormData(prev => ({
      ...prev,
      seats
    }));
  };

  const findEvent = async () => {
    if (!formData.eventName || !formData.roomCode) return;
    
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await axios.post(`${API_URL}/events/find`, {
        eventName: formData.eventName,
        roomCode: formData.roomCode
      });
      
      if (response.data.event) {
        const event = response.data.event;
        setSeatData(event);
        setShowSeats(true);
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Event not found');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      const response = await axios.post(`${API_URL}/events/join`, formData);
      setJoinedEvent(response.data.event);
      setSuccess('🎉 Successfully joined the event!');
      setFormData({
        eventName: '',
        roomCode: '',
        seats: []
      });
      setShowSeats(false);
      setSelectedSeats([]);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to join event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8 relative overflow-x-hidden">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Join Event</h1>
          <p className="mt-2 text-gray-600">
            Enter the event name and room code to join an existing event
          </p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded">
            {success}
          </div>
        )}

        {joinedEvent && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-3">Successfully Joined Event!</h3>
            <div className="space-y-2">
              <p className="text-green-800">
                <strong>Event Name:</strong> {joinedEvent.eventName}
              </p>
              <p className="text-green-800">
                <strong>Description:</strong> {joinedEvent.description}
              </p>
              <p className="text-green-800">
                <strong>Date & Time:</strong> {new Date(joinedEvent.dateTime).toLocaleString()}
              </p>
              <p className="text-green-800">
                <strong>Participants:</strong> {joinedEvent.participants.length}/{joinedEvent.capacity}
              </p>
            </div>
          </div>
        )}

        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Event Name */}
            <div>
              <label htmlFor="eventName" className="block text-sm font-medium text-gray-700">
                Event Name
              </label>
              <input
                type="text"
                id="eventName"
                name="eventName"
                value={formData.eventName}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter event name"
                required
              />
            </div>

            {/* Room Code */}
            <div>
              <label htmlFor="roomCode" className="block text-sm font-medium text-gray-700">
                Room Code
              </label>
              <input
                type="text"
                id="roomCode"
                name="roomCode"
                value={formData.roomCode}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter room code"
                required
              />
            </div>

            {/* Find Event Button */}
            {!showSeats && (
              <button
                type="button"
                onClick={findEvent}
                disabled={loading || !formData.eventName || !formData.roomCode}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
              >
                Find Event & Select Seats
              </button>
            )}

            {/* Seat Selection */}
            {showSeats && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Your Seats</h3>
                <EventSeatMap
                  selectedSeats={selectedSeats}
                  onSeatsChange={handleSeatsChange}
                  eventData={seatData}
                />
              </div>
            )}

            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={loading || !showSeats}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Joining...' : 'Join Event'}
              </button>
            </div>
          </form>
        </div>

        {/* How to Join */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">How to Join an Event</h3>
          <div className="space-y-3 text-blue-800">
            <div className="flex items-start">
              <span className="font-semibold mr-2">1.</span>
              <p>Get the exact event name and 6-character room code from the event organizer</p>
            </div>
            <div className="flex items-start">
              <span className="font-semibold mr-2">2.</span>
              <p>Enter the event name exactly as it was created (case-sensitive)</p>
            </div>
            <div className="flex items-start">
              <span className="font-semibold mr-2">3.</span>
              <p>Enter the room code (automatically converted to uppercase)</p>
            </div>
            <div className="flex items-start">
              <span className="font-semibold mr-2">4.</span>
              <p>Click "Join Event" - you'll be added if the event isn't full</p>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-900 mb-3">Important Notes</h3>
          <ul className="list-disc list-inside space-y-2 text-yellow-800">
            <li>Both event name and room code must match exactly</li>
            <li>You cannot join an event that's already at full capacity</li>
            <li>You can only join an event once</li>
            <li>Event organizers can see all participants</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default JoinEvent;
