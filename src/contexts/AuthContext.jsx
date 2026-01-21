// client/src/contexts/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { loginUser, registerUser, getCurrentUser, updateProfile } from '../utils/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(localStorage.getItem('token'));

    useEffect(() => {
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchUser = async () => {
        try {
            // Check if token exists
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await getCurrentUser();
            if (response.success) {
                setUser(response.user);
            } else {
                console.log('Token invalid, clearing storage');
                logout(); // Clear invalid token
            }
        } catch (error) {
            console.warn('Failed to fetch user:', error.message);
            if (error.response?.status === 401) {
                console.log('Token expired or invalid, clearing...');
                logout(); // Clear invalid token
            }
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await loginUser(email, password);
            if (response.success) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('user', JSON.stringify(response.user));
                setToken(response.token);
                setUser(response.user);

                // Check for admin role but let React Router handle navigation
                console.log('User role:', response.user.role);
                // Don't redirect here - let the ProtectedRoute handle it

                return { success: true };
            }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const register = async (userData) => {
        try {
            const response = await registerUser(userData);
            if (response.success) {
                localStorage.setItem('token', response.token);
                setToken(response.token);
                setUser(response.user);
                return { success: true };
            }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Registration failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
    };

    const updateUserProfile = async (profileData) => {
        try {
            const response = await updateProfile(profileData); // This should now work with the API function above
            if (response.success) {
                setUser(response.user);
                return { success: true, user: response.user };
            }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Update failed' };
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            login,
            register,
            logout,
            updateUserProfile,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
};