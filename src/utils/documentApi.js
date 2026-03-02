import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://your-frontend-app.vercel.app/api';

const documentApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// Request interceptor to add token
documentApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
documentApi.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('Document API error:', error.response?.data || error.message);
    return Promise.reject(error.response?.data || { 
      success: false, 
      message: error.message || 'Network error' 
    });
  }
);

// Upload single document
export const uploadDocument = async (formData) => {
  try {
    const response = await documentApi.post('/documents/upload', formData);
    return response;
  } catch (error) {
    return { 
      success: false, 
      message: error.message || 'Upload failed' 
    };
  }
};

// Upload multiple documents
export const uploadMultipleDocuments = async (formData) => {
  try {
    const response = await documentApi.post('/documents/upload-multiple', formData);
    return response;
  } catch (error) {
    return { 
      success: false, 
      message: error.message || 'Upload failed' 
    };
  }
};

// Get documents for a booking
export const getBookingDocuments = async (bookingId) => {
  try {
    const response = await documentApi.get(`/documents/booking/${bookingId}`);
    return response;
  } catch (error) {
    return { 
      success: false, 
      message: error.message || 'Failed to fetch documents' 
    };
  }
};

// Get single document
export const getDocument = async (documentId) => {
  try {
    const response = await documentApi.get(`/documents/${documentId}`);
    return response;
  } catch (error) {
    return { 
      success: false, 
      message: error.message || 'Failed to fetch document' 
    };
  }
};

// Delete document
export const deleteDocument = async (documentId) => {
  try {
    const response = await documentApi.delete(`/documents/${documentId}`);
    return response;
  } catch (error) {
    return { 
      success: false, 
      message: error.message || 'Failed to delete document' 
    };
  }
};

// Get required document types for a booking
export const getRequiredDocumentTypes = async (bookingId) => {
  try {
    const response = await documentApi.get(`/documents/types/${bookingId}`);
    return response;
  } catch (error) {
    return { 
      success: false, 
      message: error.message || 'Failed to fetch document types' 
    };
  }
};