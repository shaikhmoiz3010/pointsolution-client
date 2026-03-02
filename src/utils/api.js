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
    console.log(`🚀 ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle responses
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response ${response.status}: ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error(`❌ Error ${error.response?.status}: ${error.config?.url}`, error.response?.data);
    if (error.response?.status === 401) {
      console.log('🛡️ 401 Unauthorized - Token invalid');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const loginUser = (email, password) => 
  api.post('/auth/login', { email, password }).then(res => res.data);

export const registerUser = (userData) => 
  api.post('/auth/register', userData).then(res => res.data);

export const getCurrentUser = () => 
  api.get('/auth/me').then(res => res.data);

export const updateUserProfile = (profileData) => 
  api.put('/auth/update-profile', profileData).then(res => res.data);

export const updateProfile = (profileData) => 
  api.put('/auth/update-profile', profileData).then(res => res.data);



// Services APIs
export const getAllServices = async (params = {}) => {
  try {
    const response = await api.get('/services', { params });
    return response.data;
  } catch (error) {
    console.error('getAllServices error:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to fetch services',
      services: {},
      allServices: []
    };
  }
};

export const getServiceById = async (id) => {
  try {
    const response = await api.get(`/services/${id}`);
    return response.data;
  } catch (error) {
    console.error('getServiceById error:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to fetch service',
      service: null
    };
  }
};

export const getServicesByCategory = async (category) => {
  try {
    const response = await api.get(`/services/category/${category}`);
    return response.data;
  } catch (error) {
    console.error('getServicesByCategory error:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to fetch services',
      services: []
    };
  }
};

export const getCategories = async () => {
  try {
    const response = await api.get('/services/categories');
    return response.data;
  } catch (error) {
    console.error('getCategories error:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to fetch categories',
      categories: []
    };
  }
};

// ADD THIS MISSING FUNCTION
export const getPopularServices = async () => {
  try {
    const response = await api.get('/services/popular');
    return response.data;
  } catch (error) {
    console.error('getPopularServices error:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to fetch popular services',
      services: []
    };
  }
};


// Bookings APIs
export const createBooking = (bookingData) => 
  api.post('/bookings', bookingData).then(res => res.data);

export const getUserBookings = () => 
  api.get('/bookings/my-bookings').then(res => res.data);

export const getBookingDetails = (id) => 
  api.get(`/bookings/${id}`).then(res => res.data);

export const cancelBooking = (id) => 
  api.put(`/bookings/${id}/cancel`).then(res => res.data);

export const getBookingStats = () => 
  api.get('/bookings/stats').then(res => res.data);

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