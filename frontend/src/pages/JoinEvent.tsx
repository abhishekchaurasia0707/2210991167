import React, { useState, FormEvent, useEffect } from 'react';
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
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
        
        // Check if event has already passed
        const eventDate = new Date(event.dateTime);
        const now = new Date();
        if (eventDate < now) {
          setError('This event has already ended. You cannot join past events.');
          return;
        }
        
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
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`text-center mb-8 transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4 animate-bounce">
            <span className="text-3xl">🎯</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Event</h1>
          <p className="text-gray-600">
            Enter the event details to join an existing event
          </p>
        </div>

        {error && (
          <div className={`mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center transform transition-all duration-500 ${error ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
            <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {success && (
          <div className={`mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center transform transition-all duration-500 ${success ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
            <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {success}
          </div>
        )}

        {joinedEvent && (
          <div className={`mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6 transform transition-all duration-700 ${joinedEvent ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-4 opacity-0 scale-95'}`}>
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Successfully Joined!</h3>
                <p className="text-gray-600 mb-1"><strong>Event:</strong> {joinedEvent.eventName}</p>
                <p className="text-gray-600 mb-1"><strong>Date:</strong> {new Date(joinedEvent.dateTime).toLocaleString()}</p>
                <p className="text-gray-600"><strong>Participants:</strong> {joinedEvent.participants.length}/{joinedEvent.capacity}</p>
              </div>
            </div>
          </div>
        )}

        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 transform transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div className={`space-y-5 transform transition-all duration-500 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {/* Event Name */}
            <div>
              <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-2">
                Event Name
              </label>
              <input
                type="text"
                id="eventName"
                name="eventName"
                value={formData.eventName}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                placeholder="Enter the event name"
                required
              />
            </div>

            {/* Room Code */}
            <div>
              <label htmlFor="roomCode" className="block text-sm font-medium text-gray-700 mb-2">
                Room Code
              </label>
              <input
                type="text"
                id="roomCode"
                name="roomCode"
                value={formData.roomCode}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors font-mono uppercase"
                placeholder="Enter 6-character code"
                required
                maxLength={6}
              />
            </div>

            {/* Find Event Button */}
            {!showSeats && (
              <div className={`pt-2 transform transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <button
                  type="button"
                  onClick={findEvent}
                  disabled={loading || !formData.eventName || !formData.roomCode}
                  className="w-full flex items-center justify-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed animate-pulse hover:animate-none"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Finding...</span>
                    </>
                  ) : (
                    <span>Find Event & Select Seats</span>
                  )}
                </button>
              </div>
            )}

            {/* Seat Selection */}
            {showSeats && (
              <div className={`pt-2 transform transition-all duration-500 ${showSeats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Select Your Seats</h3>
                <EventSeatMap
                  selectedSeats={selectedSeats}
                  onSeatsChange={handleSeatsChange}
                  eventData={seatData}
                />
              </div>
            )}

            {showSeats && (
              <div className={`pt-2 transform transition-all duration-500 ${showSeats ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed animate-pulse hover:animate-none"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Joining...</span>
                    </>
                  ) : (
                    <span>Join Event</span>
                  )}
                </button>
              </div>
            )}
            </div>
          </form>
        </div>

        {/* How to Join */}
        <div className={`mt-6 bg-blue-50 border border-blue-200 rounded-xl p-5 transform transition-all duration-700 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h3 className="text-sm font-semibold text-blue-900 mb-3">💡 How to Join</h3>
          <ul className="space-y-2 text-sm text-blue-800">
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
          </ul>
        </div>

        {/* Important Notes */}
        <div className={`mt-4 bg-yellow-50 border border-yellow-200 rounded-xl p-5 transform transition-all duration-700 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h3 className="text-sm font-semibold text-yellow-900 mb-3">⚠️ Important Notes</h3>
          <ul className="space-y-2 text-sm text-yellow-800">
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-0.5">•</span>
              <span>Both event name and room code must match exactly</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-0.5">•</span>
              <span>You cannot join an event that's already at full capacity</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-0.5">•</span>
              <span>You can only join an event once</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-600 mt-0.5">•</span>
              <span>Event organizers can see all participants</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default JoinEvent;
