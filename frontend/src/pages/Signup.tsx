import React, { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [isVisible, setIsVisible] = useState(false);
  const { signup, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    await signup(name, email, password, role);
    if (!error) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none max-w-screen">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl mb-4 transform hover:scale-110 transition-transform duration-300">
              <span className="text-white font-bold text-2xl">SC</span>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Join Smart Campus
            </h1>
            <p className="text-lg text-gray-600">
              Create your account and start booking resources
            </p>
          </div>

          {/* Signup Form */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/50">
            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center">
                <span className="text-xl mr-3">⚠️</span>
                {error}
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="group">
                <label htmlFor="name" className="block text-sm font-bold text-gray-900 mb-2">
                  👤 Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  autoComplete="name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-300 placeholder-gray-400"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="group">
                <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2">
                  📧 Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-300 placeholder-gray-400"
                  placeholder="Enter your email"
                />
              </div>

              <div className="group">
                <label htmlFor="password" className="block text-sm font-bold text-gray-900 mb-2">
                  🔒 Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:border-gray-300 placeholder-gray-400"
                  placeholder="Create a strong password"
                />
                <div className="mt-2 text-xs text-gray-500">
                  Must be at least 6 characters long
                </div>
              </div>

              <div className="group">
                <label htmlFor="role" className="block text-sm font-bold text-gray-900 mb-2">
                  🎓 Role
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <label className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="student"
                      checked={role === 'student'}
                      onChange={(e) => setRole(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`p-3 rounded-xl border-2 transition-all duration-300 text-center ${
                      role === 'student'
                        ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}>
                      <span className="text-lg mb-1">🎓</span>
                      <div>Student</div>
                    </div>
                  </label>
                  <label className="relative cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="faculty"
                      checked={role === 'faculty'}
                      onChange={(e) => setRole(e.target.value)}
                      className="sr-only"
                    />
                    <div className={`p-3 rounded-xl border-2 transition-all duration-300 text-center ${
                      role === 'faculty'
                        ? 'border-purple-500 bg-purple-50 text-purple-700 font-medium'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}>
                      <span className="text-lg mb-1">👨‍🏫</span>
                      <div>Faculty</div>
                    </div>
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  📝 Admin access is granted by existing administrators only
                </p>
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                  I agree to the{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-500 font-medium">
                    Terms and Conditions
                  </a>
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-0.5 transition-all duration-300 shadow-lg hover:shadow-xl overflow-hidden"
                >
                  <span className="relative z-10 flex items-center">
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Creating account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                      </>
                    )}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </button>
              </div>
            </form>

            {/* Benefits Section */}
            <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="font-semibold text-green-900 mb-3 text-center">🎉 What You Get</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-green-800">
                  <span className="mr-2">✓</span>
                  <span>Instant access to campus resources</span>
                </div>
                <div className="flex items-center text-green-800">
                  <span className="mr-2">✓</span>
                  <span>Create and join events</span>
                </div>
                <div className="flex items-center text-green-800">
                  <span className="mr-2">✓</span>
                  <span>Smart booking recommendations</span>
                </div>
                <div className="flex items-center text-green-800">
                  <span className="mr-2">✓</span>
                  <span>24/7 support and assistance</span>
                </div>
              </div>
            </div>
          </div>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-bold text-blue-600 hover:text-blue-500 transition-colors duration-300"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Signup;
