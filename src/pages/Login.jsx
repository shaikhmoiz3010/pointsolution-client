// client/src/pages/Login.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Mail, Lock, AlertCircle, ArrowRight, Home, User, Shield, CheckCircle } from 'lucide-react';

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

  // Demo credentials for easy testing
  const demoCredentials = [
    { role: 'User', email: 'user@example.com', password: 'user123', color: 'blue' },
    { role: 'Admin', email: 'admin@example.com', password: 'admin123', color: 'purple' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center p-3 bg-gray-800 rounded-2xl mb-6">
          
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Welcome Back
        </h2>
        <p className="text-base sm:text-lg text-gray-600 max-w-md mx-auto">
          Sign in to access your account and manage your services
        </p>
      </div>

      {/* Login Card */}
      <div className="max-w-md mx-auto w-full">
        <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg overflow-hidden">
          {/* Card Header */}
          <div className="bg-gray-800 px-6 py-4">
            <div className="flex items-center gap-2">
              <LogIn className="w-5 h-5 text-white" />
              <h3 className="text-lg font-semibold text-white">Sign In</h3>
            </div>
            <p className="text-gray-300 text-sm mt-1">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Card Body */}
          <div className="p-6">
            {/* Demo Credentials */}


            {error && (
              <div className="mb-6 bg-rose-50 border-2 border-rose-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-rose-800">Login Failed</p>
                    <p className="text-rose-600 text-sm mt-0.5">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-500" />
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
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-700"
                  placeholder="you@example.com"
                />
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-purple-500" />
                      Password
                    </div>
                  </label>
                  <Link 
                    to="/forgot-password" 
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-gray-700"
                  placeholder="Enter your password"
                />
              </div>



              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-semibold transition-all disabled:opacity-50 shadow-lg hover:shadow-xl"
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
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Don't have an account yet?
                </p>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center w-full py-3 border-2 border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-300 transition-all"
                >
                  Create New Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>


          </div>
        </div>



        {/* Security Badge */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full">
            <Shield className="w-3 h-3 text-green-600" />
            <span className="text-xs text-gray-600">Your information is secure and encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;