import axios from 'axios';

// Detect environment and set API URL
const getApiUrl = () => {
  // For production - use the deployed server URL
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL || 'https://pointsolution-server.vercel.app/api/admin';
  }
  // For development - use localhost
  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api/admin';
};

const API_URL = getApiUrl();

console.log('🌍 Admin API URL:', API_URL); // For debugging

// Create axios instance
const adminApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // 15 second timeout for admin operations
});

// Request interceptor to add token
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`👑 ADMIN ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Admin API request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
adminApi.interceptors.response.use(
  (response) => {
    console.log(`✅ Admin Response ${response.status}: ${response.config.url}`);
    return response.data;
  },
  (error) => {
    console.error('❌ Admin API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      console.log('Unauthorized - Redirecting to login');
      localStorage.removeItem('token');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      console.log('Forbidden - Not an admin');
      window.location.href = '/dashboard';
    }
    
    return Promise.reject(error.response?.data || { 
      success: false, 
      message: error.message || 'Network error' 
    });
  }
);

// Admin Dashboard Stats
export const getAdminStats = () => adminApi.get('/stats');

// Get all bookings - THIS IS THE KEY FIX
// The URL should be '/bookings' not '/api/bookings' because baseURL already includes '/api/admin'
export const getAllBookings = (params = {}) => 
  adminApi.get('/bookings', { params });

// Get recent bookings
export const getRecentBookings = () => 
  adminApi.get('/bookings/recent');

// client/src/utils/adminApi.js
// Add this function

// Verify document
export const verifyDocument = async (documentId, status, rejectionReason = '') => {
  try {
    console.log(`🔍 Verifying document ${documentId} with status: ${status}`);
    
    const response = await adminApi.put(`/documents/${documentId}/verify`, {
      status,
      rejectionReason
    });
    
    console.log('✅ Document verification response:', response);
    return response;
  } catch (error) {
    console.error('❌ Document verification error:', error);
    throw error;
  }
};

// Get single booking
export const getBookingDetails = async (id) => {
  try {
    console.log('🔍 Admin fetching booking ID:', id);
    
    if (!id || id === 'undefined' || id === 'null') {
      throw new Error('Invalid booking ID');
    }
    
    const response = await adminApi.get(`/bookings/${id}`);
    console.log('✅ Admin booking response:', response);
    return response;
  } catch (error) {
    console.error('❌ Admin getBookingDetails error:', error);
    throw error;
  }
};

// Update booking status
export const updateBookingStatus = (id, data) => 
  adminApi.put(`/bookings/${id}/status`, data);

// Update booking details
export const updateBookingDetails = (id, data) => 
  adminApi.put(`/bookings/${id}`, data);

// Delete booking
export const deleteBooking = (id) => 
  adminApi.delete(`/bookings/${id}`);

// Send notification
export const sendNotification = (bookingId, data) => 
  adminApi.post(`/bookings/${bookingId}/notify`, data);

// Get all users
export const getAllUsers = (params = {}) => 
  adminApi.get('/users', { params });

// Update user
export const updateUser = (id, data) => 
  adminApi.put(`/users/${id}`, data);

// Delete user
export const deleteUser = (id) => 
  adminApi.delete(`/users/${id}`);

// Get service analytics
export const getServiceAnalytics = () => 
  adminApi.get('/analytics/services');