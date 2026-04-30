import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Booking {
  _id: string;
  resourceType: string;
  date: string;
  time: string;
  capacity: number;
  purpose: string;
  status: string;
}

interface Event {
  _id: string;
  eventName: string;
  description: string;
  roomCode: string;
  capacity: number;
  participants: any[];
  dateTime: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [cancelLoading, setCancelLoading] = useState<string | null>(null);
  const [cancelEventLoading, setCancelEventLoading] = useState<string | null>(null);
  const [leaveEventLoading, setLeaveEventLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
    setIsVisible(true);
  }, []);

  const fetchDashboardData = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      
      const [bookingsResponse, eventsResponse] = await Promise.all([
        axios.get(`${API_URL}/bookings/my-bookings`),
        axios.get(`${API_URL}/events/my-events`)
      ]);

      setBookings(bookingsResponse.data.bookings || []);
      setEvents(eventsResponse.data.events || []);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (bookingId: string) => {
    setCancelLoading(bookingId);
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      await axios.delete(`${API_URL}/bookings/${bookingId}`);
      
      // Remove the cancelled booking from the list
      setBookings(prev => prev.filter(booking => booking._id !== bookingId));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to cancel booking');
    } finally {
      setCancelLoading(null);
    }
  };

  const cancelEvent = async (eventId: string) => {
    setCancelEventLoading(eventId);
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      await axios.delete(`${API_URL}/events/${eventId}`);
      
      // Remove the cancelled event from the list
      setEvents(prev => prev.filter(event => event._id !== eventId));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to cancel event');
    } finally {
      setCancelEventLoading(null);
    }
  };

  const leaveEvent = async (eventId: string) => {
    setLeaveEventLoading(eventId);
    try {
      const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      await axios.post(`${API_URL}/events/leave`, { eventId });
      
      // Remove the left event from the list
      setEvents(prev => prev.filter(event => event._id !== eventId));
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to leave event');
    } finally {
      setLeaveEventLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'from-green-400 to-green-600';
      case 'rejected':
        return 'from-red-400 to-red-600';
      default:
        return 'from-yellow-400 to-orange-500';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-50 text-green-700';
      case 'rejected':
        return 'bg-red-50 text-red-700';
      default:
        return 'bg-yellow-50 text-orange-700';
    }
  };

  const statsCards = [
    {
      title: 'Total Bookings',
      value: bookings.length,
      icon: '📅',
      color: 'from-blue-400 to-blue-600',
      bgLight: 'bg-blue-50',
      change: '+12%',
      positive: true
    },
    {
      title: 'Approved',
      value: bookings.filter(b => b.status === 'approved').length,
      icon: '✅',
      color: 'from-green-400 to-green-600',
      bgLight: 'bg-green-50',
      change: '+8%',
      positive: true
    },
    {
      title: 'Events Joined',
      value: events.length,
      icon: '🎉',
      color: 'from-purple-400 to-purple-600',
      bgLight: 'bg-purple-50',
      change: '+15%',
      positive: true
    },
    {
      title: 'Pending',
      value: bookings.filter(b => b.status === 'pending').length,
      icon: '⏳',
      color: 'from-orange-400 to-orange-600',
      bgLight: 'bg-orange-50',
      change: '-3%',
      positive: false
    }
  ];

  const quickActions = [
    { to: '/booking', label: 'New Booking', icon: '➕', color: 'from-blue-500 to-blue-600' },
    { to: '/create-event', label: 'Create Event', icon: '✨', color: 'from-purple-500 to-purple-600' },
    { to: '/join-event', label: 'Join Event', icon: '🎯', color: 'from-green-500 to-green-600' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-purple-200 border-b-purple-600 rounded-full animate-spin animation-delay-150"></div>
          </div>
          <p className="mt-6 text-lg font-medium text-gray-600 animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-20 relative overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className={`mb-10 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 border border-white/50">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Welcome back, {user?.name}! 👋
                </h1>
                <p className="text-lg text-gray-600">
                  Here's your campus activity overview
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">{user?.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 capitalize">{user?.role}</div>
                    <div className="text-sm text-gray-500">Active User</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl shadow-lg">
            {error}
          </div>
        )}

        {/* Quick Actions */}
        <div className={`mb-8 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/50">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.to}
                  className={`group relative p-6 rounded-xl bg-gradient-to-br ${action.color} text-white shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden`}
                >
                  <div className="relative z-10">
                    <div className="text-3xl mb-3">{action.icon}</div>
                    <div className="font-bold text-lg">{action.label}</div>
                  </div>
                  <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className={`mb-8 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsCards.map((stat, index) => (
              <div
                key={index}
                className="group bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-white/50 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300`}>
                      <span className="text-2xl">{stat.icon}</span>
                    </div>
                    <div className={`text-sm font-medium px-2 py-1 rounded-full ${stat.positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {stat.change}
                    </div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-600">{stat.title}</div>
                  </div>
                </div>
                <div className={`h-1 bg-gradient-to-r ${stat.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500`}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Recent Bookings */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 overflow-hidden">
            <div className="p-6 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Recent Bookings</h2>
                <Link to="/booking" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  View All →
                </Link>
              </div>
            </div>
            <div className="p-6">
              {bookings.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📅</span>
                  </div>
                  <p className="text-gray-500 mb-4">No bookings yet</p>
                  <Link
                    to="/booking"
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Make Your First Booking
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.slice(0, 5).map((booking, index) => (
                    <div
                      key={booking._id}
                      className="group relative bg-gray-50/50 rounded-xl p-4 hover:bg-gray-100/50 transition-all duration-300 border border-gray-200/50 hover:border-gray-300/50"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-lg font-bold text-gray-900 capitalize">
                              {booking.resourceType.replace('_', ' ')}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBg(booking.status)}`}>
                              {booking.status}
                            </span>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-gray-600">
                              📅 {formatDate(booking.date)} at {booking.time}
                            </p>
                            <p className="text-sm text-gray-600">
                              👥 Capacity: {booking.capacity}
                            </p>
                            <p className="text-sm text-gray-500 line-clamp-1">
                              📝 {booking.purpose}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {booking.status === 'pending' && (
                            <button
                              onClick={() => cancelBooking(booking._id)}
                              disabled={cancelLoading === booking._id}
                              className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                              {cancelLoading === booking._id ? (
                                <span className="flex items-center space-x-1">
                                  <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                                  <span>Cancel</span>
                                </span>
                              ) : (
                                'Cancel'
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                      <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${getStatusColor(booking.status)} rounded-r-full`}></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/50 overflow-hidden">
            <div className="p-6 border-b border-gray-200/50">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Upcoming Events</h2>
                <Link to="/join-event" className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                  Join Event →
                </Link>
              </div>
            </div>
            <div className="p-6">
              {events.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎉</span>
                  </div>
                  <p className="text-gray-500 mb-4">No events yet</p>
                  <div className="space-y-2">
                    <Link
                      to="/create-event"
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                    >
                      Create Event
                    </Link>
                    <Link
                      to="/join-event"
                      className="block text-sm text-purple-600 hover:text-purple-700 font-medium"
                    >
                      or Join Existing Event
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {events.slice(0, 5).map((event, index) => (
                    <div
                      key={event._id}
                      className="group relative bg-gradient-to-r from-purple-50/50 to-pink-50/50 rounded-xl p-4 hover:from-purple-100/50 hover:to-pink-100/50 transition-all duration-300 border border-purple-200/50 hover:border-purple-300/50"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors duration-300">
                          {event.eventName}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold">
                            {event.roomCode}
                          </span>
                          {event.organizerId._id === user?.id ? (
                            <button
                              onClick={() => cancelEvent(event._id)}
                              disabled={cancelEventLoading === event._id}
                              className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                              {cancelEventLoading === event._id ? (
                                <span className="flex items-center space-x-1">
                                  <div className="w-2 h-2 border border-white border-t-transparent rounded-full animate-spin"></div>
                                  <span>Cancel</span>
                                </span>
                              ) : (
                                'Cancel'
                              )}
                            </button>
                          ) : (
                            <button
                              onClick={() => leaveEvent(event._id)}
                              disabled={leaveEventLoading === event._id}
                              className="px-2 py-1 bg-orange-500 text-white text-xs font-medium rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                            >
                              {leaveEventLoading === event._id ? (
                                <span className="flex items-center space-x-1">
                                  <div className="w-2 h-2 border border-white border-t-transparent rounded-full animate-spin"></div>
                                  <span>Leave</span>
                                </span>
                              ) : (
                                'Leave'
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">
                          📅 {formatDateTime(event.dateTime)}
                        </p>
                        <p className="text-sm text-gray-600">
                          👥 {event.participants.length}/{event.capacity} participants
                        </p>
                        <p className="text-sm text-gray-500 line-clamp-1">
                          📝 {event.description}
                        </p>
                      </div>
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 to-pink-400 rounded-r-full"></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
