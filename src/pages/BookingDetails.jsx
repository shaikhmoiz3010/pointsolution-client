// client/src/pages/BookingDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getBookingDetails, cancelBooking } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import BookingTracking from '../components/BookingTracking';
import PaymentMethods from '../components/PaymentMethods';
import { 
  ArrowLeft, 
  Calendar, 
  FileText, 
  User, 
  Home, 
  Download,
  Printer,
  XCircle,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

const BookingDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await getBookingDetails(id);
      if (response.success && response.booking) {
        setBooking(response.booking);
      } else {
        setError(response.message || 'Booking not found');
      }
    } catch (error) {
      console.error('Failed to fetch booking:', error);
      setError('Failed to load booking details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    try {
      const response = await cancelBooking(id);
      if (response.success) {
        setBooking(response.booking);
        setShowCancelConfirm(false);
        alert('Booking cancelled successfully!');
      } else {
        setError(response.message || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      setError('Failed to cancel booking. Please try again.');
    }
  };

  const handlePaymentUpdate = (updatedBooking) => {
    setBooking(updatedBooking);
  };

  // Safely format category
  const getFormattedCategory = () => {
    if (!booking?.category) return 'General';
    return booking.category.replace(/-/g, ' ').toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="bg-white border-2 border-gray-200 rounded-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || 'The booking you are looking for does not exist or has been removed.'}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-semibold transition-colors"
            >
              Go to Dashboard
            </button>
            <button
              onClick={() => navigate(-1)}
              className="w-full px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Booking Details</h1>
              <div className="flex items-center gap-3 text-gray-600">
                <FileText className="w-5 h-5" />
                <span className="font-mono font-medium">{booking.bookingId}</span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </button>
              {booking.status === 'pending' && (
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel Booking
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Cancel Confirmation Modal */}
        {showCancelConfirm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white border-2 border-gray-200 rounded-xl shadow-xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Cancel Booking</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to cancel this booking? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  className="px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  No, Keep Booking
                </button>
                <button
                  onClick={handleCancelBooking}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                >
                  Yes, Cancel Booking
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Booking Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Information */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Service Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Service Name</label>
                  <p className="font-bold text-gray-900 text-lg">{booking.serviceName || 'Not specified'}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Category</label>
                  <p className="font-medium text-gray-900">{getFormattedCategory()}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Service Fee</label>
                  <p className="text-2xl font-bold text-gray-900">₹{booking.serviceFee || 0}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Booking Date</label>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                  </p>
                </div>
              </div>
              {booking.description && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-gray-600 leading-relaxed">{booking.description}</p>
                </div>
              )}
            </div>

            {/* User Information */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Full Name</label>
                  <p className="font-medium text-gray-900 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {booking.userDetails?.fullName || user?.fullName || 'Not provided'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Email</label>
                  <p className="font-medium text-gray-900">{booking.userDetails?.email || user?.email || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Phone</label>
                  <p className="font-medium text-gray-900">{booking.userDetails?.phone || user?.phone || 'Not provided'}</p>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Booking Status</label>
                  <div className="flex items-center gap-2">
                    {booking.status === 'pending' && <AlertCircle className="w-5 h-5 text-yellow-600" />}
                    {booking.status === 'processing' && <Clock className="w-5 h-5 text-blue-600" />}
                    {booking.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-600" />}
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      booking.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {(booking.status || '').toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
              
              {booking.userDetails?.address && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    Address
                  </label>
                  <p className="text-gray-900">
                    {booking.userDetails.address.street}<br />
                    {booking.userDetails.address.city}, {booking.userDetails.address.state} - {booking.userDetails.address.pincode}
                  </p>
                </div>
              )}

              {booking.additionalInfo && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <label className="block text-sm font-medium text-gray-600 mb-2">Additional Information</label>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{booking.additionalInfo}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Requirements */}
            {booking.service?.requirements && booking.service.requirements.length > 0 && (
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Required Documents</h2>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                  <ul className="space-y-3">
                    {booking.service.requirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Tracking & Payment */}
          <div className="space-y-6">
            {/* Tracking Component */}
            {BookingTracking && (
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Booking Tracking</h3>
                <BookingTracking booking={booking} />
              </div>
            )}
            
            {/* Payment Component */}
            {booking.paymentStatus !== 'paid' && booking.status !== 'cancelled' && PaymentMethods && (
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Payment</h3>
                <PaymentMethods 
                  bookingId={booking.bookingId}
                  currentMethod={booking.paymentMethod}
                  onUpdate={handlePaymentUpdate}
                />
              </div>
            )}
            

          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetails;