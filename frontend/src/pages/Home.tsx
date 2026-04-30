import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const services = [
    {
      name: 'Canteen',
      description: 'Book tables and arrange meals',
      icon: '🍽️',
      color: 'from-orange-400 to-orange-600',
      bgLight: 'bg-orange-50',
      iconBg: 'bg-orange-100'
    },
    {
      name: 'Seminar Hall',
      description: 'Reserve seminar halls for presentations',
      icon: '🎤',
      color: 'from-purple-400 to-purple-600',
      bgLight: 'bg-purple-50',
      iconBg: 'bg-purple-100'
    },
    {
      name: 'Lecture Hall',
      description: 'Book lecture halls for classes',
      icon: '📚',
      color: 'from-blue-400 to-blue-600',
      bgLight: 'bg-blue-50',
      iconBg: 'bg-blue-100'
    },
    {
      name: 'Exploratorium',
      description: 'Access innovation labs',
      icon: '🔬',
      color: 'from-green-400 to-green-600',
      bgLight: 'bg-green-50',
      iconBg: 'bg-green-100'
    },
    {
      name: 'Library',
      description: 'Reserve study spaces',
      icon: '📖',
      color: 'from-indigo-400 to-indigo-600',
      bgLight: 'bg-indigo-50',
      iconBg: 'bg-indigo-100'
    },
    {
      name: 'Events',
      description: 'Create and join campus events',
      icon: '🎉',
      color: 'from-pink-400 to-pink-600',
      bgLight: 'bg-pink-50',
      iconBg: 'bg-pink-100'
    }
  ];

  const features = [
    {
      icon: '⚡',
      title: 'Lightning Fast',
      description: 'Book resources in seconds with our intuitive interface',
      color: 'from-blue-400 to-cyan-400'
    },
    {
      icon: '📱',
      title: 'Mobile First',
      description: 'Access the platform from any device, anywhere',
      color: 'from-green-400 to-emerald-400'
    },
    {
      icon: '🔒',
      title: 'Enterprise Security',
      description: 'Your data is protected with bank-level encryption',
      color: 'from-purple-400 to-pink-400'
    },
    {
      icon: '🎯',
      title: 'Smart Booking',
      description: 'AI-powered recommendations and conflict prevention',
      color: 'from-orange-400 to-red-400'
    },
    {
      icon: '📊',
      title: 'Real-time Analytics',
      description: 'Track usage patterns and optimize resources',
      color: 'from-indigo-400 to-blue-400'
    },
    {
      icon: '🌟',
      title: '24/7 Support',
      description: 'Round-the-clock assistance for all users',
      color: 'from-yellow-400 to-orange-400'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none max-w-screen">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6 leading-tight">
              Smart Campus
              <br />
              <span className="text-4xl md:text-6xl">Booking System</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed">
              Transform your campus experience with seamless resource booking and 
              <span className="font-semibold text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text"> intelligent event management</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link
                to="/login"
                className="group relative px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              <Link
                to="/signup"
                className="group px-10 py-4 bg-white text-blue-600 font-bold text-lg rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border-2 border-blue-100 hover:border-blue-300"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Campus Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need, right at your fingertips
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className={`group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 overflow-hidden border border-gray-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${600 + index * 100}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                <div className="relative p-8">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <span className="text-3xl filter drop-shadow-md">{service.icon}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className={`text-center mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Smart Campus?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of campus resource management
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 border border-gray-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${800 + index * 100}ms` }}
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600">
        <div className="relative max-w-4xl mx-auto text-center">
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Campus Experience?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Join thousands of students and faculty who are already using Smart Campus
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                to="/signup"
                className="group px-10 py-4 bg-white text-blue-600 font-bold text-lg rounded-xl shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                Get Started Free
                <span className="block text-sm font-normal text-gray-500 mt-1">No credit card required</span>
              </Link>
              <div className="flex items-center gap-4 text-white">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center text-sm font-bold backdrop-blur-sm"
                    >
                      {i}
                    </div>
                  ))}
                </div>
                <span className="text-blue-100">k+ Active Users</span>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;
