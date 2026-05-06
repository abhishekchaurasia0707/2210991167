import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Hero Section */}
      <div className="relative py-20 md:py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className={`transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="text-center">
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-slate-100 rounded-full border border-slate-200">
                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                <span className="text-sm font-medium text-slate-600">AI-Powered Smart Booking</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                AI-Powered Campus
                <span className="block text-indigo-600">Booking System</span>
              </h1>
                            
              <p className="text-lg md:text-xl text-slate-500 mb-10 max-w-2xl mx-auto">
                Smart booking and event management powered by AI. Create events with natural language, get intelligent recommendations, and manage resources effortlessly.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                >
                  Get Started
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-8 py-3 bg-white text-slate-700 font-medium rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
                >
                  Create Account
                </Link>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-16">
                {[
                  { value: '10K+', label: 'Users' },
                  { value: '50K+', label: 'Bookings' },
                  { value: '100+', label: 'Venues' },
                  { value: '99%', label: 'Satisfaction' }
                ].map((stat, i) => (
                  <div key={i} className="text-center p-4">
                    <div className="text-2xl md:text-3xl font-bold text-slate-900">{stat.value}</div>
                    <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-12 transform transition-all duration-700 delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto">
              Manage campus resources efficiently with our comprehensive platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🤖', title: 'AI Event Creation', description: 'Describe your event in plain English and let AI generate the details' },
              { icon: '📅', title: 'Easy Booking', description: 'Book study rooms, labs, and event spaces in just a few clicks' },
              { icon: '✨', title: 'Event Management', description: 'Create and manage campus events with built-in room codes' },
              { icon: '🎯', title: 'Smart Recommendations', description: 'AI-powered suggestions for optimal time slots and resources' },
              { icon: '💬', title: 'AI Chatbot Assistant', description: 'Get instant help with booking questions from our AI assistant' },
              { icon: '🔒', title: 'Secure Access', description: 'Protected user authentication and data privacy' }
            ].map((feature, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${200 + index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center text-2xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className={`bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 md:p-12 text-center transform transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join thousands of students who are already using Smart Campus to manage their bookings and events.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors"
              >
                Create Free Account
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center px-8 py-3 bg-transparent text-white font-medium rounded-lg border border-white/30 hover:bg-white/10 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
