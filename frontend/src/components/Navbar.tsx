import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/booking', label: 'Booking', icon: '📅' },
    { to: '/create-event', label: 'Create Event', icon: '✨' },
    { to: '/join-event', label: 'Join Event', icon: '🎯' },
  ];

  if (user?.role === 'admin') {
    navLinks.push({ to: '/admin', label: 'Admin Panel', icon: '⚙️' });
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-gradient-to-r from-white/95 via-white/90 to-white/95 backdrop-blur-xl shadow-2xl border-b border-gray-200/30' 
        : 'bg-gradient-to-r from-white/85 via-white/80 to-white/85 backdrop-blur-lg border-b border-gray-100/30'
    }`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-0 right-1/4 w-32 h-32 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-0 left-1/2 w-40 h-40 bg-pink-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="group flex items-center space-x-3 transition-all duration-500"
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                  <span className="text-white font-bold text-lg">SC</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-2xl blur-md transform scale-110 group-hover:scale-125 transition-all duration-500"></div>
              </div>
              <div className="group">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:via-purple-700 group-hover:to-pink-700 transition-all duration-300">
                  Smart Campus
                </span>
                <div className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                  ✨ Intelligent Booking System
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {user ? (
              <>
                {navLinks.map((link, index) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="group relative px-4 py-2.5 rounded-xl text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30 hover:shadow-lg hover:shadow-blue-500/20"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <span className="flex items-center space-x-2">
                      <span className="text-lg transform group-hover:scale-110 transition-transform duration-300">{link.icon}</span>
                      <span className="group-hover:scale-105 transition-transform duration-300">{link.label}</span>
                    </span>
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 group-hover:w-full transition-all duration-300"></div>
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-purple-600/0 group-hover:from-blue-500/10 group-hover:to-purple-600/10 transition-all duration-300"></div>
                  </Link>
                ))}
                
                {/* User Menu */}
                <div className="flex items-center space-x-3 ml-6 pl-6 border-l border-gray-200/50">
                  <div className="group flex items-center space-x-3 px-3 py-2 rounded-xl hover:bg-gradient-to-r hover:from-green-50/30 hover:to-blue-50/30 transition-all duration-300">
                    <div className="relative">
                      <div className="w-9 h-9 bg-gradient-to-br from-green-400 via-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                        <span className="text-white text-sm font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-md transform scale-110 group-hover:scale-125 transition-all duration-300"></div>
                    </div>
                    <div className="hidden lg:block">
                      <div className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">{user.name}</div>
                      <div className="text-xs text-gray-500 capitalize group-hover:text-gray-600 transition-colors duration-300">{user.role}</div>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="group relative px-5 py-2.5 bg-gradient-to-r from-red-500 via-pink-500 to-red-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-2xl hover:shadow-red-500/30 transform hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                  >
                    <span className="flex items-center space-x-2">
                      <span>Logout</span>
                      <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="group px-6 py-2.5 text-gray-700 hover:text-blue-600 font-semibold rounded-xl hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
                >
                  <span className="flex items-center space-x-2">
                    <span>🔐</span>
                    <span>Login</span>
                  </span>
                </Link>
                <Link
                  to="/signup"
                  className="group relative px-6 py-2.5 bg-gradient-to-r from-blue-500 via-purple-600 to-blue-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-2xl hover:shadow-purple-500/30 transform hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 group-hover:from-white/10 group-hover:to-white/0 transition-all duration-300"></div>
                  <span className="relative flex items-center space-x-2">
                    <span>✨</span>
                    <span>Sign Up</span>
                    <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="group relative p-3 rounded-xl bg-gradient-to-r from-gray-100/50 to-gray-200/50 hover:from-blue-100/50 hover:to-purple-100/50 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <div className="w-6 h-5 flex flex-col justify-center space-y-1">
                <div className={`w-full h-0.5 bg-gradient-to-r from-gray-700 to-gray-900 transform transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                <div className={`w-full h-0.5 bg-gradient-to-r from-gray-700 to-gray-900 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
                <div className={`w-full h-0.5 bg-gradient-to-r from-gray-700 to-gray-900 transform transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
              </div>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:to-purple-500/10 transition-all duration-300"></div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-500 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 py-4' : 'max-h-0'
        }`}>
          <div className="space-y-2">
            {user ? (
              <>
                {navLinks.map((link, index) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="group flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30 hover:shadow-lg hover:shadow-blue-500/20"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className="text-lg transform group-hover:scale-110 transition-transform duration-300">{link.icon}</span>
                    <span className="group-hover:scale-105 transition-transform duration-300">{link.label}</span>
                    <div className="ml-auto w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Link>
                ))}
                
                <div className="border-t border-gray-200/50 pt-3 mt-3">
                  <div className="flex items-center space-x-3 px-4 py-3 rounded-xl bg-gradient-to-r from-green-50/30 to-blue-50/30">
                    <div className="w-9 h-9 bg-gradient-to-br from-green-400 via-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-white text-sm font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                      <div className="text-xs text-gray-500 capitalize">{user.role}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full mx-4 mt-3 px-4 py-3 bg-gradient-to-r from-red-500 via-pink-500 to-red-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-2xl hover:shadow-red-500/30 transform hover:-translate-y-0.5 transition-all duration-300"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <span>Logout</span>
                      <span>→</span>
                    </span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="group flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-700 hover:text-blue-600 font-semibold transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-50/30 hover:to-purple-50/30 hover:shadow-lg hover:shadow-blue-500/20"
                >
                  <span>🔐</span>
                  <span>Login</span>
                  <span className="ml-auto w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block mx-4 px-4 py-3 bg-gradient-to-r from-blue-500 via-purple-600 to-blue-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-2xl hover:shadow-purple-500/30 transform hover:-translate-y-0.5 transition-all duration-300 text-center overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/20 group-hover:from-white/10 group-hover:to-white/0 transition-all duration-300"></div>
                  <span className="relative flex items-center justify-center space-x-2">
                    <span>✨</span>
                    <span>Sign Up</span>
                    <span>→</span>
                  </span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
