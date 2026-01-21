// client/src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, Phone, Mail } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Add this

  // Hide navbar on admin routes
  if (location.pathname.startsWith('/admin')) {
    return null;
  }  
  

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      {/* Top Bar */}
      <div className="bg-gray-700 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <a href="tel:+911234567890" className="flex items-center gap-2 hover:text-gray-100">
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">+91 123 456 7890</span>
            </a>
            <a href="mailto:info@1point1solution.com" className="flex items-center gap-2 hover:text-gray-100">
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">info@1point1solution.com</span>
            </a>
          </div>
          <div className="hidden md:block">
            <span>Trusted Government Documentation Services</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
            {/* <div className="bg-gray-700 text-white px-3 py-2 rounded-lg">
              <span className="font-bold text-xl">1P1S</span>
            </div> */}
            <div>
              <Link to="/" className="text-xl font-bold text-gray-900 hover:text-gray-700">
                1Point 1Solution
              </Link>
              <p className="text-xs text-gray-600">Your Documentation Partner</p>
            </div>
          </div>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
            >
              Home
            </Link>
            <Link 
              to="/services" 
              className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
            >
              Services
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
            >
              About Us
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
            >
              Contact
            </Link>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <Link 
                  to="/dashboard" 
                  className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {user?.fullName?.charAt(0)}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors font-medium"
                >
                  Get Started
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-3">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-gray-900 transition-colors py-2 text-left font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/services" 
              className="text-gray-700 hover:text-gray-900 transition-colors py-2 text-left font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              to="/about" 
              className="text-gray-700 hover:text-gray-900 transition-colors py-2 text-left font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              About Us
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 hover:text-gray-900 transition-colors py-2 text-left font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-gray-700 hover:text-gray-900 transition-colors py-2 text-left font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <div className="pt-4 space-y-3">
                  <div className="flex items-center gap-3 py-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium">
                        {user?.fullName?.charAt(0)}
                      </span>
                    </div>
                    <span className="text-gray-700">{user?.fullName}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors text-center font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-4 space-y-3">
                <Link 
                  to="/login" 
                  className="block px-4 py-2 text-blue-600 border border-blue-600 rounded-lg text-center hover:bg-blue-50 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="block px-4 py-2 bg-gray-800 text-white rounded-lg text-center hover:bg-gray-900 transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;