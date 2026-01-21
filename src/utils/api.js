import axios from 'axios';

// Detect environment and set API URL
const getApiUrl = () => {
  // For production - use the deployed server URL
  if (import.meta.env.PROD) {
    return import.meta.env.VITE_API_URL || 'https://pointsolution-server.vercel.app/api';
  }
  // For development - use localhost
  return import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

console.log('🌍 API URL:', API_URL); // For debugging

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`🚀 ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`✅ Response ${response.status}:`, response.config.url);
    }
    return response.data;
  },
  (error) => {
    const errorMessage = error.response?.data?.message || error.message;
    
    // Log error details
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: errorMessage,
      data: error.response?.data
    });
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      console.log('🛡️ 401 Unauthorized - Token invalid');
      // Clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    // Handle network errors
    if (error.code === 'ECONNABORTED' || !error.response) {
      console.error('🌐 Network error - Server might be down');
      throw new Error('Unable to connect to server. Please check your internet connection.');
    }
    
    // Re-throw the error with a user-friendly message
    throw new Error(errorMessage || 'Something went wrong. Please try again.');
  }
);

// Auth APIs
export const loginUser = (email, password) => 
  api.post('/auth/login', { email, password });

export const registerUser = (userData) => 
  api.post('/auth/register', userData);

export const getCurrentUser = () => 
  api.get('/auth/me');

export const updateUserProfile = (profileData) => 
  api.put('/auth/update-profile', profileData);

export const updateProfile = (profileData) => 
  api.put('/auth/update-profile', profileData);

// Services APIs
export const getAllServices = () => 
  api.get('/services');

export const getServiceById = (id) => 
  api.get(`/services/id/${id}`);

export const getServicesByCategory = (category) => 
  api.get(`/services/category/${category}`);

export const getServiceDetails = (category, serviceId) => 
  api.get(`/services/${category}/${serviceId}`);

export const getCategories = () => 
  api.get('/services/categories');

// Bookings APIs
export const createBooking = (bookingData) => 
  api.post('/bookings', bookingData);

export const getUserBookings = () => 
  api.get('/bookings/my-bookings');

export const getBookingDetails = (id) => 
  api.get(`/bookings/${id}`);

export const cancelBooking = (id) => 
  api.put(`/bookings/${id}/cancel`);

export const getBookingStats = () => 
  api.get('/bookings/stats');

// Payments APIs
export const getPaymentMethods = () => 
  api.get('/payments/methods');

export const getPaymentDetails = (bookingId) => 
  api.get(`/payments/${bookingId}`);

export const updatePaymentStatus = (bookingId, paymentData) => 
  api.put(`/payments/${bookingId}`, paymentData);

export const createTestPayment = (bookingId) => 
  api.post(`/payments/test/${bookingId}`);

// Health check
export const checkHealth = () => 
  api.get('/health');

// Utility function to check if server is reachable
export const checkServerConnection = async () => {
  try {
    const response = await api.get('/health', { timeout: 5000 });
    return { 
      success: true, 
      message: 'Server is reachable',
      url: API_URL,
      data: response
    };
  } catch (error) {
    return { 
      success: false, 
      message: error.message,
      url: API_URL,
      error: error.message
    };
  }
};