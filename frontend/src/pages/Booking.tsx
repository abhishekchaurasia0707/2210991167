import React, { useState, FormEvent, useEffect } from 'react';
import axios from 'axios';
import SeatMap from '../components/SeatMap';

interface BookingForm {
  resourceType: string;
  date: string;
  time: string;
  capacity: number;
  purpose: string;
  seats: string[];
}

const Booking: React.FC = () => {
  const [formData, setFormData] = useState<BookingForm>({
    resourceType: 'canteen',
    date: '',
    time: '',
    capacity: 100,
    purpose: '',
    seats: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const resourceTypes = [
    { 
      value: 'canteen', 
      label: 'Canteen', 
      icon: '🍽️',
      description: 'Book tables and arrange meals',
      color: 'from-orange-400 to-orange-600',
      bgLight: 'bg-orange-50'
    },
    { 
      value: 'seminar_hall', 
      label: 'Seminar Hall', 
      icon: '🎤',
      description: 'Reserve seminar halls for presentations',
      color: 'from-purple-400 to-purple-600',
      bgLight: 'bg-purple-50'
    },
    { 
      value: 'lecture_hall', 
      label: 'Lecture Hall', 
      icon: '📚',
      description: 'Book lecture halls for classes',
      color: 'from-blue-400 to-blue-600',
      bgLight: 'bg-blue-50'
    },
    { 
      value: 'exploratorium', 
      label: 'Exploratorium', 
      icon: '🔬',
      description: 'Access innovation labs',
      color: 'from-green-400 to-green-600',
      bgLight: 'bg-green-50'
    },
    { 
      value: 'library', 
      label: 'Library', 
      icon: '📖',
      description: 'Reserve study spaces',
      color: 'from-indigo-400 to-indigo-600',
      bgLight: 'bg-indigo-50'
    }
  ];

  const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'capacity' ? parseInt(value) || 1 : value
    }));
  };

  const handleSeatsChange = (seats: string[]) => {
    setFormData(prev => ({
      ...prev,
      seats
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      await axios.post(`${API_URL}/bookings`, formData);
      
      setSuccess('🎉 Booking request submitted successfully! It will be reviewed by admin.');
      setFormData({
        resourceType: 'canteen',
        date: '',
        time: '',
        capacity: 100,
        purpose: '',
        seats: []
      });
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to submit booking request');
    } finally {
      setLoading(false);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-20 relative overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none max-w-screen">
        <div className="absolute top-40 right-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-40 left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`mb-10 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/50">
            <div className="text-center">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                Book a Resource 📅
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Select a campus resource and provide details for your booking request. 
                Our admin team will review and approve your request promptly.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl shadow-lg transform transition-all duration-500">
            <div className="flex items-center">
              <span className="text-xl mr-3">⚠️</span>
              {error}
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-600 px-6 py-4 rounded-xl shadow-lg transform transition-all duration-500">
            <div className="flex items-center">
              <span className="text-xl mr-3">✅</span>
              {success}
            </div>
          </div>
        )}

        {/* Booking Form */}
        <div className={`bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 overflow-hidden transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Resource Type Selection */}
            <div>
              <label className="block text-lg font-bold text-gray-900 mb-6">
                Select Resource Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {resourceTypes.map((resource, index) => (
                  <label
                    key={resource.value}
                    className={`group relative cursor-pointer transform transition-all duration-300 ${
                      formData.resourceType === resource.value
                        ? 'scale-105'
                        : 'hover:scale-102'
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <input
                      type="radio"
                      name="resourceType"
                      value={resource.value}
                      checked={formData.resourceType === resource.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                      formData.resourceType === resource.value
                        ? `border-transparent bg-gradient-to-br ${resource.color} text-white shadow-2xl`
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-lg'
                    }`}>
                      <div className="text-center">
                        <div className={`text-4xl mb-3 transform transition-transform duration-300 ${
                          formData.resourceType === resource.value ? 'scale-110' : 'group-hover:scale-110'
                        }`}>
                          {resource.icon}
                        </div>
                        <h3 className={`font-bold text-lg mb-2 ${
                          formData.resourceType === resource.value ? 'text-white' : 'text-gray-900'
                        }`}>
                          {resource.label}
                        </h3>
                        <p className={`text-sm ${
                          formData.resourceType === resource.value ? 'text-white/90' : 'text-gray-600'
                        }`}>
                          {resource.description}
                        </p>
                      </div>
                      {formData.resourceType === resource.value && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-green-500 text-sm">✓</span>
                        </div>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Date and Time Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group">
                <label htmlFor="date" className="block text-sm font-bold text-gray-900 mb-3">
                  📅 Booking Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={getMinDate()}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-300"
                />
              </div>

              <div className="group">
                <label htmlFor="time" className="block text-sm font-bold text-gray-900 mb-3">
                  ⏰ Time Slot
                </label>
                <select
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-300"
                >
                  <option value="">Select a time slot</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Seat Map */}
            {formData.date && formData.time && (
              <div className="mt-6">
                <SeatMap
                  resourceType={formData.resourceType}
                  date={formData.date}
                  time={formData.time}
                  capacity={formData.capacity}
                  onSeatsChange={handleSeatsChange}
                />
              </div>
            )}

            {/* Purpose */}
            <div className="group">
              <label htmlFor="purpose" className="block text-sm font-bold text-gray-900 mb-3">
                📝 Purpose of Booking
              </label>
              <textarea
                id="purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                rows={4}
                required
                placeholder="Please describe the purpose of your booking in detail..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-300 resize-none"
              />
              <div className="text-right mt-2">
                <span className="text-sm text-gray-500">
                  {formData.purpose.length}/500 characters
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={loading || !formData.date || !formData.time || !formData.purpose}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Booking Request</span>
                      <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </form>
        </div>

        {/* Booking Guidelines */}
        <div className={`mt-8 bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 p-8 transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="text-2xl mr-3">📋</span>
            Booking Guidelines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Admin Approval Required</h4>
                  <p className="text-sm text-gray-600">All booking requests must be reviewed and approved by our admin team</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Subject to Availability</h4>
                  <p className="text-sm text-gray-600">Bookings are confirmed based on resource availability</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Accurate Capacity</h4>
                  <p className="text-sm text-gray-600">Please provide accurate number of participants</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-sm font-bold">4</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">24-Hour Cancellation</h4>
                  <p className="text-sm text-gray-600">Cancellations should be made at least 24 hours in advance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Booking;
