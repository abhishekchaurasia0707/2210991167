import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface Booking {
  _id: string;
  resourceType: string;
  date: string;
  time: string;
  endTime: string;
  capacity: number;
  purpose: string;
  status: string;
  seats?: string[];
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
  const [pastEvents, setPastEvents] = useState<any[]>([]);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

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
      
      const allEvents = eventsResponse.data.events || [];
      const now = new Date();
      const upcoming = allEvents.filter((event: any) => new Date(event.dateTime) >= now);
      const past = allEvents.filter((event: any) => new Date(event.dateTime) < now);
      setEvents(upcoming);
      setPastEvents(past);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="mt-4 text-lg text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className={`mb-10 transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="relative bg-gradient-to-br from-white to-slate-50 rounded-3xl shadow-lg overflow-hidden border border-slate-200">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-100/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            
            <div className="relative p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                      <span className="text-white font-semibold text-2xl">{user?.name?.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-white shadow-lg"></div>
                  </div>
                  <div>
                    <h1 className="text-3xl font-semibold text-slate-800 mb-1">
                      Welcome back, {user?.name}
                    </h1>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-3 py-1 bg-indigo-100 rounded-full text-indigo-700 text-xs font-medium border border-indigo-200">
                        {user?.role === 'admin' ? 'Administrator' : 'Student'}
                      </span>
                      <span className="text-slate-400 text-xs">•</span>
                      <span className="text-slate-500 text-sm">Ready to book</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Link
                    to="/booking"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white text-sm font-medium rounded-2xl hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Booking
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm flex items-center shadow-sm">
            <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Quick Stats */}
        <div className={`mb-10 transform transition-all duration-700 delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {statsCards.map((stat, index) => (
              <div
                key={index}
                className={`bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-5 border border-slate-100 hover:-translate-y-1`}
                style={{ borderTop: `3px solid ${stat.color.split(' ')[1]}` }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{stat.title}</p>
                    <p className="text-2xl font-semibold text-slate-800 mt-2">{stat.value}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-lg shadow-md`}>
                    {stat.icon}
                  </div>
                </div>
                <div className="mt-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${stat.positive ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`mb-10 transform transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h2 className="text-sm font-semibold text-slate-600 uppercase tracking-wider mb-5">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.to}
                className="group relative flex items-center gap-4 bg-gradient-to-br from-white to-slate-50 p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200 hover:border-blue-300 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-xl shadow-md group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  {action.icon}
                </div>
                <span className="relative font-medium text-slate-700 text-sm group-hover:text-blue-600 transition-colors">
                  {action.label}
                </span>
                <div className="absolute right-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 transform translate-x-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>

        
        {/* Recent Activity */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 transform transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Recent Bookings */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="font-semibold text-slate-800">Recent Bookings ({bookings.length})</h2>
              <Link to="/booking" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1">
                View all
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="p-4">
              {bookings.length === 0 ? (
                <div className="text-center py-12 px-6">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-slate-500 text-sm mb-4">No bookings yet</p>
                  <Link
                    to="/booking"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    Book Now
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {bookings.slice(0, 5).map((booking) => (
                    <div
                      key={booking._id}
                      className="px-4 py-3 hover:bg-slate-50 transition-colors rounded-lg"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-800 text-sm capitalize">
                              {booking.resourceType.replace('_', ' ')}
                            </span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBg(booking.status)}`}>
                              {booking.status}
                            </span>
                          </div>
                          <p className="text-slate-500 text-xs mt-1.5">
                            {formatDate(booking.date)} at {booking.time} {booking.endTime ? `- ${booking.endTime}` : ''}
                          </p>
                          {booking.seats && booking.seats.length > 0 && (
                            <p className="text-slate-500 text-xs mt-1">
                              Seats: <span className="font-mono text-slate-600">{booking.seats.join(', ')}</span>
                            </p>
                          )}
                        </div>
                        {booking.status === 'pending' && (
                          <button
                            onClick={() => cancelBooking(booking._id)}
                            disabled={cancelLoading === booking._id}
                            className="ml-3 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {cancelLoading === booking._id ? '...' : 'Cancel'}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="font-semibold text-slate-800">Upcoming Events ({events.length})</h2>
              <Link to="/events" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center gap-1">
                View all
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
            <div className="p-4">
              {events.length === 0 ? (
                <div className="text-center py-12 px-6">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-slate-500 text-sm mb-4">No events yet</p>
                  <div className="flex flex-col gap-2">
                    <Link
                      to="/create-event"
                      className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Create Event
                    </Link>
                    <Link
                      to="/join-event"
                      className="text-sm text-slate-500 hover:text-indigo-600 font-medium"
                    >
                      Join an existing event
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {events.slice(0, 5).map((event) => (
                    <div
                      key={event._id}
                      className="px-4 py-3 hover:bg-slate-50 transition-colors rounded-lg cursor-pointer"
                      onClick={() => event.organizerId._id === user?.id && setExpandedEvent(expandedEvent === event._id ? null : event._id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-800 text-sm truncate">
                              {event.eventName}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-indigo-100 text-indigo-700 text-xs font-mono font-medium">
                              {event.roomCode}
                            </span>
                            {event.organizerId._id === user?.id && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded bg-purple-100 text-purple-700 text-xs">
                                Organizer
                              </span>
                            )}
                          </div>
                          <p className="text-slate-500 text-xs mt-1.5">
                            {formatDateTime(event.dateTime)}{event.endTime ? ` - ${formatDateTime(event.endTime)}` : ''}
                          </p>
                          <p className="text-slate-400 text-xs mt-1">
                            {event.participants.length}/{event.capacity} participants
                          </p>
                          {(() => {
                            const myParticipant = event.participants?.find((p: any) => 
                              p.user?._id === user?.id || p.user === user?.id
                            );
                            if (myParticipant?.seats && myParticipant.seats.length > 0) {
                              return (
                                <p className="text-slate-500 text-xs mt-1">
                                  Your seats: <span className="font-mono text-slate-600">{myParticipant.seats.join(', ')}</span>
                                </p>
                              );
                            }
                            return null;
                          })()}
                          {event.organizerId._id === user?.id && (
                            <p className="text-purple-600 text-xs mt-1">
                              Click to view participants {expandedEvent === event._id ? '▲' : '▼'}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center ml-3">
                          {event.organizerId._id === user?.id ? (
                            <button
                              onClick={(e) => { e.stopPropagation(); cancelEvent(event._id); }}
                              disabled={cancelEventLoading === event._id}
                              className="px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                            >
                              {cancelEventLoading === event._id ? '...' : 'Cancel'}
                            </button>
                          ) : (
                            <button
                              onClick={(e) => { e.stopPropagation(); leaveEvent(event._id); }}
                              disabled={leaveEventLoading === event._id}
                              className="px-3 py-1.5 text-xs font-medium text-amber-600 hover:bg-amber-50 rounded-lg transition-colors disabled:opacity-50"
                            >
                              {leaveEventLoading === event._id ? '...' : 'Leave'}
                            </button>
                          )}
                        </div>
                      </div>
                      
                      {/* Expanded Participants View */}
                      {expandedEvent === event._id && event.organizerId._id === user?.id && (
                        <div className="mt-3 pt-3 border-t border-slate-200">
                          <h4 className="text-xs font-semibold text-slate-700 mb-2">
                            Participants ({event.participants.length}):
                          </h4>
                          {event.participants.length === 0 ? (
                            <p className="text-slate-400 text-xs italic">No participants yet</p>
                          ) : (
                            <div className="space-y-2">
                              {event.participants.map((participant: any, index: number) => (
                                <div key={index} className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-medium">
                                      {participant.user?.name?.charAt(0).toUpperCase() || '?'}
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-slate-700">
                                        {participant.user?.name || 'Unknown User'}
                                      </span>
                                      <span className="text-slate-400 text-[10px]">
                                        {participant.user?.email || 'No email'}
                                      </span>
                                    </div>
                                  </div>
                                  {participant.seats && participant.seats.length > 0 && (
                                    <span className="text-slate-500 font-mono">
                                      Seats: {participant.seats.join(', ')}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Past Events History */}
        {pastEvents.length > 0 && (
          <div className={`mt-8 transform transition-all duration-700 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gray-50/50">
                <h2 className="font-semibold text-slate-800">Event History ({pastEvents.length})</h2>
                <span className="text-xs text-slate-500">Completed events</span>
              </div>
              <div className="p-4">
                <div className="divide-y divide-slate-100">
                  {pastEvents.slice(0, 5).map((event) => (
                    <div
                      key={event._id}
                      className="px-4 py-3 hover:bg-slate-50 transition-colors rounded-lg cursor-pointer"
                      onClick={() => event.organizerId._id === user?.id && setExpandedEvent(expandedEvent === `past-${event._id}` ? null : `past-${event._id}`)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-600 text-sm truncate">
                              {event.eventName}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-xs font-mono font-medium">
                              {event.roomCode}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-200 text-gray-600 text-xs">
                              Completed
                            </span>
                            {event.organizerId._id === user?.id && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded bg-purple-100 text-purple-600 text-xs">
                                Organizer
                              </span>
                            )}
                          </div>
                          <p className="text-slate-400 text-xs mt-1.5">
                            {formatDateTime(event.dateTime)}
                          </p>
                          <p className="text-slate-400 text-xs mt-1">
                            {event.participants.length}/{event.capacity} attended
                          </p>
                          {(() => {
                            const myParticipant = event.participants?.find((p: any) => 
                              p.user?._id === user?.id || p.user === user?.id
                            );
                            if (myParticipant?.seats && myParticipant.seats.length > 0) {
                              return (
                                <p className="text-slate-400 text-xs mt-1">
                                  Your seats: <span className="font-mono">{myParticipant.seats.join(', ')}</span>
                                </p>
                              );
                            }
                            return null;
                          })()}
                          {event.organizerId._id === user?.id && (
                            <p className="text-purple-600 text-xs mt-1">
                              Click to view attendees {expandedEvent === `past-${event._id}` ? '▲' : '▼'}
                            </p>
                          )}
                        </div>
                        <div className="ml-3">
                          <span className="text-xs text-slate-400">Ended</span>
                        </div>
                      </div>
                      
                      {/* Expanded Attendees View for Past Events */}
                      {expandedEvent === `past-${event._id}` && event.organizerId._id === user?.id && (
                        <div className="mt-3 pt-3 border-t border-slate-200">
                          <h4 className="text-xs font-semibold text-slate-600 mb-2">
                            Attendees ({event.participants.length}):
                          </h4>
                          {event.participants.length === 0 ? (
                            <p className="text-slate-400 text-xs italic">No attendees</p>
                          ) : (
                            <div className="space-y-2">
                              {event.participants.map((participant: any, index: number) => (
                                <div key={index} className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium">
                                      {participant.user?.name?.charAt(0).toUpperCase() || '?'}
                                    </div>
                                    <div className="flex flex-col">
                                      <span className="text-slate-600">
                                        {participant.user?.name || 'Unknown User'}
                                      </span>
                                      <span className="text-slate-400 text-[10px]">
                                        {participant.user?.email || 'No email'}
                                      </span>
                                    </div>
                                  </div>
                                  {participant.seats && participant.seats.length > 0 && (
                                    <span className="text-slate-400 font-mono">
                                      Seats: {participant.seats.join(', ')}
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                {pastEvents.length > 5 && (
                  <div className="text-center mt-4 pt-4 border-t border-slate-100">
                    <span className="text-sm text-slate-500">
                      +{pastEvents.length - 5} more past events
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
