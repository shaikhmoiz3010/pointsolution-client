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
    
    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`👑 ADMIN ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Admin API request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
adminApi.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`✅ Admin Response ${response.status}:`, response.config.url);
    }
    return response.data;
  },
  (error) => {
    const errorMessage = error.response?.data?.message || error.message;
    
    // Log error details
    console.error('❌ Admin API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: errorMessage,
      data: error.response?.data
    });
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      console.log('🛡️ 401 Unauthorized - Token invalid or expired');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    } else if (error.response?.status === 403) {
      console.log('🚫 403 Forbidden - Not an admin');
      // Redirect non-admin users to dashboard
      if (!window.location.pathname.includes('/dashboard')) {
        window.location.href = '/dashboard';
      }
      throw new Error('You do not have admin privileges');
    }
    
    // Handle network errors
    if (error.code === 'ECONNABORTED' || !error.response) {
      console.error('🌐 Network error - Server might be down');
      throw new Error('Unable to connect to server. Please check your internet connection.');
    }
    
    // Return the error response data if available
    return Promise.reject(error.response?.data || { 
      success: false, 
      message: errorMessage || 'Network error' 
    });
  }
);

// Admin Dashboard Stats
export const getAdminStats = () => adminApi.get('/stats');

// Get all bookings
export const getAllBookings = (params = {}) => 
  adminApi.get('/bookings', { params });

// Get recent bookings
export const getRecentBookings = () => 
  adminApi.get('/bookings/recent');

// Get single booking - ADMIN VERSION
export const getBookingDetails = async (id) => {
  try {
    console.log('🔍 Admin fetching booking ID:', id);
    
    // Validate ID
    if (!id || id === 'undefined' || id === 'null') {
      throw new Error('Invalid booking ID');
    }
    
    const response = await adminApi.get(`/bookings/${id}`);
    console.log('✅ Admin booking response:', response);
    return response;
  } catch (error) {
    console.error('❌ Admin getBookingDetails error:', error);
    
    // Try alternative endpoint if main one fails
    if (error.response?.status === 404) {
      try {
        console.log('🔄 Trying alternative endpoint...');
        // Try to get all bookings and find the specific one
        const allBookings = await getAllBookings();
        if (allBookings.success && allBookings.bookings) {
          const foundBooking = allBookings.bookings.find(b => b._id === id || b.bookingId === id);
          if (foundBooking) {
            return { success: true, booking: foundBooking };
          }
        }
      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError);
      }
    }
    
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

// Utility function to check admin permissions
export const checkAdminAccess = async () => {
  try {
    const response = await adminApi.get('/check-access');
    return { success: true, ...response };
  } catch (error) {
    return { 
      success: false, 
      message: error.message || 'Not authorized as admin'
    };
  }
};