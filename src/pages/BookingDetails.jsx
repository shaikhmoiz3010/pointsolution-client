// client/src/pages/BookingDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getBookingDetails, cancelBooking } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import BookingTracking from '../components/BookingTracking';
import DocumentUploader from '../components/DocumentUploader';
import DocumentList from '../components/DocumentList';
import DocumentChecklist from '../components/DocumentChecklist';
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
  Clock,
  Upload,
  Package,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Shield,
  Info,
  FileCheck
} from 'lucide-react';

const BookingDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showDocumentUpload, setShowDocumentUpload] = useState(false);
  const [uploadingType, setUploadingType] = useState('');
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (id) {
      fetchBookingDetails();
    }
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
      } else {
        setError(response.message || 'Failed to cancel booking');
      }
    } catch (error) {
      console.error('Failed to cancel booking:', error);
      setError('Failed to cancel booking. Please try again.');
    }
  };

  const handleDocumentUploadComplete = () => {
    setShowDocumentUpload(false);
    setUploadingType('');
    fetchBookingDetails();
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        icon: AlertCircle,
        color: 'from-amber-500 to-orange-500',
        bg: 'bg-amber-100',
        text: 'text-amber-700',
        border: 'border-amber-200',
        lightBg: 'bg-amber-50'
      },
      processing: {
        icon: Clock,
        color: 'from-blue-500 to-cyan-500',
        bg: 'bg-blue-100',
        text: 'text-blue-700',
        border: 'border-blue-200',
        lightBg: 'bg-blue-50'
      },
      completed: {
        icon: CheckCircle,
        color: 'from-emerald-500 to-teal-500',
        bg: 'bg-emerald-100',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        lightBg: 'bg-emerald-50'
      },
      cancelled: {
        icon: XCircle,
        color: 'from-rose-500 to-red-500',
        bg: 'bg-rose-100',
        text: 'text-rose-700',
        border: 'border-rose-200',
        lightBg: 'bg-rose-50'
      }
    };
    return configs[status] || configs.pending;
  };

  const getFormattedCategory = () => {
    if (!booking?.category) return 'General';
    return booking.category.replace(/-/g, ' ').toUpperCase();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="mt-6 text-gray-600 font-medium">Loading booking details...</p>
          <p className="text-sm text-gray-500 mt-2">Please wait while we fetch your information</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
          <div className="bg-gradient-to-r from-rose-500 to-red-500 p-6 text-center">
            <div className="bg-white/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white">Booking Not Found</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600 text-center mb-6">
              {error || 'The booking you are looking for does not exist or has been removed.'}
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all shadow-lg"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => navigate(-1)}
                className="w-full px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-all"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(booking.status);
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="hover:text-blue-600 transition-colors"
                >
                  Dashboard
                </button>
                <span>•</span>
                <span className="text-gray-800">Booking Details</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Booking Details
              </h1>
              <div className="flex items-center gap-3 text-gray-600">
                <Package className="w-5 h-5 text-blue-500" />
                <span className="font-mono font-medium bg-gray-100 px-3 py-1 rounded-full">
                  {booking.bookingId || booking._id}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="inline-flex items-center justify-center px-4 py-2.5 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-white hover:border-gray-300 font-medium transition-all shadow-sm hover:shadow"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </button>
              
              {booking.status === 'pending' && (
                <button
                  onClick={() => setShowCancelConfirm(true)}
                  className="inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-600 hover:to-red-600 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
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
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-slideUp">
              <div className="bg-gradient-to-r from-rose-500 to-red-500 p-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Cancel Booking
                </h3>
              </div>
              <div className="p-6">
                <p className="text-gray-600 mb-6">
                  Are you sure you want to cancel this booking? This action cannot be undone.
                </p>
                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <button
                    onClick={() => setShowCancelConfirm(false)}
                    className="px-4 py-2.5 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-all order-2 sm:order-1"
                  >
                    No, Keep Booking
                  </button>
                  <button
                    onClick={handleCancelBooking}
                    className="px-4 py-2.5 bg-gradient-to-r from-rose-500 to-red-500 text-white rounded-xl hover:from-rose-600 hover:to-red-600 font-medium transition-all shadow-lg order-1 sm:order-2"
                  >
                    Yes, Cancel Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Banner */}
        <div className={`mb-6 rounded-xl border ${statusConfig.border} ${statusConfig.lightBg} p-4`}>
          <div className="flex items-center gap-3">
            <div className={`bg-gradient-to-r ${statusConfig.color} p-3 rounded-xl`}>
              <StatusIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Current Status</p>
              <p className={`font-semibold ${statusConfig.text}`}>
                {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="lg:hidden mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('details')}
              className={`flex-1 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'details'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('tracking')}
              className={`flex-1 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'tracking'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Tracking
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`flex-1 py-3 font-medium text-sm border-b-2 transition-colors ${
                activeTab === 'documents'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Documents
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Booking Info (shown on desktop, conditionally on mobile) */}
          <div className={`lg:col-span-2 space-y-6 ${activeTab !== 'details' ? 'hidden lg:block' : ''}`}>
            {/* Service Information */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Service Information
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl">
                    <label className="block text-xs text-gray-500 mb-1">Service Name</label>
                    <p className="font-bold text-gray-900 text-lg">{booking.serviceName || 'Not specified'}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-xl">
                    <label className="block text-xs text-gray-500 mb-1">Category</label>
                    <p className="font-medium text-gray-900">{getFormattedCategory()}</p>
                  </div>

                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-xl">
                    <label className="block text-xs text-gray-500 mb-1">Booking Date</label>
                    <p className="font-medium text-gray-900 flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-amber-500" />
                      {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      }) : 'N/A'}
                    </p>
                  </div>

                  {booking.service?.price && (
                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-4 rounded-xl">
                      <label className="block text-xs text-gray-500 mb-1">Service Price</label>
                      <p className="font-bold text-emerald-600 text-lg">₹{booking.service.price}</p>
                    </div>
                  )}
                </div>
                
                {booking.description && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <p className="text-gray-600 leading-relaxed">{booking.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* User Information */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Your Information
                </h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                    <User className="w-5 h-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Full Name</p>
                      <p className="font-medium text-gray-900">{booking.userDetails?.fullName || user?.fullName || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                    <Mail className="w-5 h-5 text-purple-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium text-gray-900">{booking.userDetails?.email || user?.email || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                    <Phone className="w-5 h-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="font-medium text-gray-900">{booking.userDetails?.phone || user?.phone || 'Not provided'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                    <div className={`p-1 rounded-lg ${statusConfig.lightBg}`}>
                      <StatusIcon className={`w-4 h-4 ${statusConfig.text}`} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Booking Status</p>
                      <p className={`font-medium ${statusConfig.text}`}>
                        {(booking.status || '').toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>
                
                {booking.userDetails?.address && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                      <MapPin className="w-5 h-5 text-amber-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Address</p>
                        <p className="text-gray-900">
                          {booking.userDetails.address.street}<br />
                          {booking.userDetails.address.city}, {booking.userDetails.address.state} - {booking.userDetails.address.pincode}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {booking.additionalInfo && (
                  <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                      <FileText className="w-5 h-5 text-purple-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-2">Additional Information</p>
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-100">
                          <p className="text-gray-700">{booking.additionalInfo}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Requirements */}
            {booking.service?.requirements && booking.service.requirements.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <FileCheck className="w-5 h-5" />
                    Required Documents
                  </h2>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {booking.service.requirements.map((req, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg border border-gray-100">
                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Tracking & Documents (shown on desktop, conditionally on mobile) */}
          <div className={`space-y-6 ${activeTab === 'details' ? 'hidden lg:block' : ''}`}>
            {/* Tracking Component */}
            {(activeTab === 'tracking' || window.innerWidth >= 1024) && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Booking Tracking
                  </h3>
                </div>
                <div className="p-4">
                  <BookingTracking booking={booking} />
                </div>
              </div>
            )}

            {/* Documents Section */}
            {(activeTab === 'documents' || window.innerWidth >= 1024) && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      Documents
                    </h3>
                    <button
                      onClick={() => setShowDocumentUpload(!showDocumentUpload)}
                      className="text-sm bg-white/20 text-white px-3 py-1.5 rounded-lg hover:bg-white/30 transition-colors"
                    >
                      {showDocumentUpload ? 'Hide Upload' : '+ Upload'}
                    </button>
                  </div>
                </div>
                
                <div className="p-4 space-y-4">
                  {/* Document Checklist */}
                  <DocumentChecklist bookingId={booking._id || booking.bookingId} />

                  {/* Document Upload Form */}
                  {showDocumentUpload && (
                    <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-blue-100">
                      <select
                        value={uploadingType}
                        onChange={(e) => setUploadingType(e.target.value)}
                        className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all mb-4"
                      >
                        <option value="">Select document type</option>
                        <option value="aadhaar">📇 Aadhaar Card</option>
                        <option value="pan">💳 PAN Card</option>
                        <option value="passport">🛂 Passport</option>
                        <option value="driving_licence">🚗 Driving Licence</option>
                        <option value="birth_certificate">👶 Birth Certificate</option>
                        <option value="marriage_certificate">💑 Marriage Certificate</option>
                        <option value="address_proof">🏠 Address Proof</option>
                        <option value="photograph">📸 Photograph</option>
                        <option value="other">📄 Other Document</option>
                      </select>

                      {uploadingType && (
                        <DocumentUploader
                          bookingId={booking._id || booking.bookingId}
                          documentType={uploadingType}
                          onUploadComplete={handleDocumentUploadComplete}
                          onUploadError={(error) => {
                            setError(error.message);
                          }}
                        />
                      )}
                    </div>
                  )}

                  {/* Document List */}
                  <div className="mt-4">
                    <DocumentList 
                      bookingId={booking._id || booking.bookingId}
                      onDocumentDeleted={fetchBookingDetails}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md">
            <Shield className="w-4 h-4 text-green-500" />
            <span className="text-sm text-gray-600">Your booking information is secure and encrypted</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default BookingDetails;