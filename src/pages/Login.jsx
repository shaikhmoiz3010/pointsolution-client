// client/src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Mail, Lock, AlertCircle, ArrowRight, Home } from 'lucide-react';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.email, formData.password);

    if (result.success) {
      // Check user role and redirect accordingly
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      if (user.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(from || '/dashboard', { replace: true });
      }
    } else {
      setError(result.message || 'Invalid email or password');
    }

    setLoading(false);
  };

  return (
    <div className=" min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="p-7 text-center mb-8">

        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="bg-gray-800 text-white px-3 py-2 rounded-lg">
          </div>
        </div>

        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome Back
        </h2>
        <p className="text-xl text-gray-600 max-w-md mx-auto">
          Sign in to access your account and manage your services
        </p>
      </div>

      {/* Login Card */}
      <div className="max-w-md mx-auto w-full">
        <div className="bg-white border-2 border-gray-200 rounded-xl p-8 shadow-sm">
          <div className="text-center mb-8">
            <div className="inline-block mb-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm">
              <LogIn className="w-4 h-4 inline-block mr-2" />
              Sign In
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-lg mb-6">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">{error}</p>
                <p className="text-sm mt-1">Please check your credentials and try again</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </div>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 bg-white placeholder-gray-400"
                placeholder="you@example.com"
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Password
                  </div>
                </label>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 bg-white placeholder-gray-400"
                placeholder="Enter your password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Sign In</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </button>
          </form>

          {/* Register Link */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-gray-600 mb-4">
                Don't have an account yet?
              </p>
              <Link
                to="/register"
                className="inline-flex items-center justify-center w-full py-3 border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Create New Account
                <ArrowRight className="w-5 h-5 ml-2 rotate-180" />
              </Link>
            </div>
          </div>
        </div>

        {/* Additional Links */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            By signing in, you agree to our{' '}
            <Link to="/terms" className="text-gray-700 hover:text-gray-900 font-medium">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link to="/privacy" className="text-gray-700 hover:text-gray-900 font-medium">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;