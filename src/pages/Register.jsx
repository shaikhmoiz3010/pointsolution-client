// client/src/pages/Register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Phone, Lock, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Check password strength
    if (name === 'password') {
      const strength = getPasswordStrength(value);
      setPasswordStrength(strength);
    }

    setError('');
    setSuccess('');
  };

  const getPasswordStrength = (password) => {
    if (password.length === 0) return '';
    if (password.length < 6) return 'Weak';
    if (password.length < 8) return 'Fair';
    if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
      return 'Strong';
    }
    return 'Good';
  };

  const getPasswordStrengthColor = (strength) => {
    switch (strength) {
      case 'Weak': return 'bg-red-500';
      case 'Fair': return 'bg-yellow-500';
      case 'Good': return 'bg-blue-500';
      case 'Strong': return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const validateForm = () => {
    // Check if fullName is provided
    if (!formData.fullName?.trim()) {
      setError('Full name is required');
      return false;
    }

    // Check if fullName has at least 2 characters
    if (formData.fullName.trim().length < 2) {
      setError('Full name must be at least 2 characters');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.phone.length < 10 || !/^\d+$/.test(formData.phone)) {
      setError('Please enter a valid 10-digit phone number');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const userData = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password,
    };

    const result = await register(userData);

    if (result.success) {
      setSuccess('Registration successful! Redirecting...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } else {
      setError(result.message || 'Registration failed. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col justify-center py-12 px-4">
      <div className="max-w-md mx-auto w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="bg-gray-800 text-white px-4 py-3 rounded-xl">
              <span className="font-bold text-2xl">1P1S</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">1Point 1Solution</h1>
              <p className="text-sm text-gray-600">Your Documentation Partner</p>
            </div>
          </div>
          <div className="inline-block mb-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm">
            Create Your Account
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            Join Our Community
          </h2>
          <p className="text-gray-600">
            Start your journey with India's trusted documentation services
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 md:p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-lg">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">{error}</p>
                </div>
              </div>
            )}

            {success && (
              <div className="flex items-start gap-3 p-4 bg-green-50 border-2 border-green-200 text-green-700 rounded-lg">
                <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">{success}</p>
                </div>
              </div>
            )}

            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                autoComplete="name"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 bg-white placeholder-gray-400"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
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
                placeholder="your.email@example.com"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 bg-white placeholder-gray-400"
                placeholder="+91 XXXXXXXXXX"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 bg-white placeholder-gray-400"
                placeholder="Create a strong password"
              />
              {formData.password && (
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Strength: <span className={`font-medium ${passwordStrength === 'Weak' ? 'text-red-600' :
                        passwordStrength === 'Fair' ? 'text-yellow-600' :
                          passwordStrength === 'Good' ? 'text-blue-600' :
                            passwordStrength === 'Strong' ? 'text-green-600' : ''
                      }`}>
                      {passwordStrength}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className={`w-16 h-1 rounded-full ${getPasswordStrengthColor(passwordStrength)}`}></div>
                  </div>
                </div>
              )}
              <ul className="text-xs text-gray-500 space-y-1 mt-2">
                <li>• Minimum 6 characters</li>
                <li>• Include uppercase & lowercase letters</li>
                <li>• Include numbers for stronger security</li>
              </ul>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 bg-white placeholder-gray-400"
                placeholder="Re-enter your password"
              />
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-5 w-5 border-2 border-gray-300 rounded mt-0.5 focus:ring-0 focus:border-gray-800"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{' '}
                <Link to="/terms" className="text-gray-800 hover:text-gray-900 font-medium underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-gray-800 hover:text-gray-900 font-medium underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Creating Account...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Create Account</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-gray-600 mb-4">
              Already have an account?
            </p>
            <Link
              to="/login"
              className="w-full py-3 border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            >
              Sign in to your account
            </Link>
          </div>

          {/* Benefits */}
          <div className="mt-8 bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-3">Why Register With Us?</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Track all your documentation services in one place</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Quick booking for future services</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Priority customer support</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Secure and confidential handling of your data</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            By creating an account, you agree to our transparent documentation process and services
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Need help?{' '}
            <Link to="/contact" className="text-gray-700 hover:text-gray-900 font-medium">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;