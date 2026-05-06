import React, { useState, FormEvent, useEffect } from 'react';
import axios from 'axios';
import SeatMap from '../components/SeatMap';

interface BookingForm {
  resourceType: string;
  date: string;
  time: string;
  endTime: string;
  capacity: number;
  purpose: string;
  seats: string[];
}

const Booking: React.FC = () => {
  const [formData, setFormData] = useState<BookingForm>({
    resourceType: 'canteen',
    date: '',
    time: '',
    endTime: '',
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
    '00:00', '00:15', '00:30', '00:45',
    '01:00', '01:15', '01:30', '01:45',
    '02:00', '02:15', '02:30', '02:45',
    '03:00', '03:15', '03:30', '03:45',
    '04:00', '04:15', '04:30', '04:45',
    '05:00', '05:15', '05:30', '05:45',
    '06:00', '06:15', '06:30', '06:45',
    '07:00', '07:15', '07:30', '07:45',
    '08:00', '08:15', '08:30', '08:45',
    '09:00', '09:15', '09:30', '09:45',
    '10:00', '10:15', '10:30', '10:45',
    '11:00', '11:15', '11:30', '11:45',
    '12:00', '12:15', '12:30', '12:45',
    '13:00', '13:15', '13:30', '13:45',
    '14:00', '14:15', '14:30', '14:45',
    '15:00', '15:15', '15:30', '15:45',
    '16:00', '16:15', '16:30', '16:45',
    '17:00', '17:15', '17:30', '17:45',
    '18:00', '18:15', '18:30', '18:45',
    '19:00', '19:15', '19:30', '19:45',
    '20:00', '20:15', '20:30', '20:45',
    '21:00', '21:15', '21:30', '21:45',
    '22:00', '22:15', '22:30', '22:45',
    '23:00', '23:15', '23:30', '23:45'
  ];

  const isTimeBefore = (time1: string, time2: string) => {
    const [h1, m1] = time1.split(':').map(Number);
    const [h2, m2] = time2.split(':').map(Number);
    const minutes1 = h1 * 60 + m1;
    const minutes2 = h2 * 60 + m2;
    return minutes1 <= minutes2;
  };

  const isTimePast = (time: string) => {
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Check if selected date is today
    if (formData.date) {
      const selectedDate = new Date(formData.date);
      selectedDate.setHours(0, 0, 0, 0);
      
      if (selectedDate.getTime() === today.getTime()) {
        // If booking for today, check if time is past
        const [h, m] = time.split(':').map(Number);
        const timeMinutes = h * 60 + m;
        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        // Add 15 minutes buffer to avoid booking for times that are about to pass
        return timeMinutes < nowMinutes;
      }
    }
    return false;
  };

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
        endTime: '',
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
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className={`mb-8 transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-100 rounded-2xl mb-4">
              <span className="text-2xl">📅</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Book a Resource
            </h1>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              Reserve campus facilities for your events and activities
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl flex items-center">
            <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl flex items-center">
            <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">{success}</span>
          </div>
        )}

        {/* Booking Form */}
        <div className={`bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden transform transition-all duration-700 delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Resource Type Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">
                What would you like to book?
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {resourceTypes.map((resource) => (
                  <label
                    key={resource.value}
                    className="relative cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="resourceType"
                      value={resource.value}
                      checked={formData.resourceType === resource.value}
                      onChange={handleChange}
                      className="sr-only peer"
                    />
                    <div className={`p-4 rounded-xl border-2 transition-all duration-200 text-center ${
                      formData.resourceType === resource.value
                        ? `border-indigo-500 bg-indigo-50 shadow-sm`
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}>
                      <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${resource.color} flex items-center justify-center text-xl mx-auto mb-2`}>
                        {resource.icon}
                      </div>
                      <h3 className={`font-medium text-sm ${formData.resourceType === resource.value ? 'text-indigo-900' : 'text-slate-700'}`}>
                        {resource.label}
                      </h3>
                      <p className={`text-xs mt-1 ${formData.resourceType === resource.value ? 'text-indigo-600' : 'text-slate-500'}`}>
                        {resource.description}
                      </p>
                    </div>
                    {formData.resourceType === resource.value && (
                      <div className="absolute top-2 right-2">
                        <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Date and Time Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min={getMinDate()}
                  required
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors text-sm"
                />
              </div>

              <div>
                <label htmlFor="time" className="block text-sm font-medium text-slate-700 mb-2">
                  Start Time
                </label>
                <select
                  id="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white text-sm"
                  style={{ maxHeight: '200px', overflowY: 'auto' }}
                >
                  <option value="">Select start time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time} disabled={isTimePast(time)}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-slate-700 mb-2">
                  End Time
                </label>
                <select
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white text-sm"
                  style={{ maxHeight: '200px', overflowY: 'auto' }}
                >
                  <option value="">Select end time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time} disabled={formData.time ? isTimeBefore(time, formData.time) : false}>
                      {time}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Seat Map */}
            {formData.date && formData.time && formData.endTime && (
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
            <div>
              <label htmlFor="purpose" className="block text-sm font-medium text-slate-700 mb-2">
                Purpose
              </label>
              <textarea
                id="purpose"
                name="purpose"
                value={formData.purpose}
                onChange={handleChange}
                rows={3}
                required
                placeholder="Briefly describe the purpose of this booking..."
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none text-sm"
              />
              <div className="text-right mt-1">
                <span className="text-xs text-slate-400">
                  {formData.purpose.length}/500
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || !formData.date || !formData.time || !formData.purpose}
                className="w-full flex items-center justify-center px-6 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <span>Submit Request</span>
                )}
              </button>
              <p className="text-center text-xs text-slate-400 mt-3">
                Your booking will be reviewed by an administrator
              </p>
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
