import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getServiceById } from '../utils/api';
import { createBooking } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import BookingForm from '../components/BookingForm';
import { 
  ArrowLeft, 
  Clock, 
  Shield, 
  FileText, 
  CheckCircle, 
  Users, 
  Award,
  Calendar,
  Phone,
  Mail,
  Home,
  Briefcase
} from 'lucide-react';

// Icon mapping function
const getServiceIcon = (serviceName) => {
  const name = serviceName?.toLowerCase() || '';
  
  if (name.includes('vehicle') || name.includes('rto') || name.includes('driving') || name.includes('license')) {
    return Car;
  }
  if (name.includes('passport')) {
    return FileText;
  }
  if (name.includes('certificate') || name.includes('birth') || name.includes('marriage') || name.includes('death')) {
    return Award;
  }
  if (name.includes('document') || name.includes('verification') || name.includes('attestation')) {
    return FolderOpen;
  }
  if (name.includes('pan') || name.includes('aadhaar')) {
    return CreditCard;
  }
  if (name.includes('property') || name.includes('land') || name.includes('mutatio')) {
    return Home;
  }
  if (name.includes('identity') || name.includes('voter') || name.includes('ration') || name.includes('id')) {
    return User;
  }
  if (name.includes('business') || name.includes('gst') || name.includes('company') || name.includes('registration')) {
    return Briefcase;
  }
  
  return FileText;
};

// Import icons
import {
  Car,
  FolderOpen,
  CreditCard,
  Home as HomeIcon,
  User
} from 'lucide-react';

const ServiceDetails = () => {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchServiceDetails();
  }, [id]);

  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await getServiceById(id);

      if (response && response.success) {
        setService(response.service);
      } else {
        setError(response.message || 'Service not found');
      }
    } catch (error) {
      console.error('Failed to fetch service:', error);
      setError('Failed to load service details');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: window.location.pathname } });
      return;
    }
    setShowBookingForm(true);
  };

  const handleBookingSubmit = async (bookingData) => {
    try {
      if (!service || !service._id) {
        setError('Service information is missing');
        return;
      }

      const serviceId = service._id;
      if (!serviceId || serviceId.length !== 24) {
        setError('Invalid service ID');
        return;
      }

      const bookingPayload = {
        serviceId: serviceId,
        userDetails: {
          fullName: user?.fullName || '',
          email: user?.email || '',
          phone: user?.phone || '',
          address: user?.address || {},
          aadhaarNumber: user?.aadhaarNumber || '',
          panNumber: user?.panNumber || ''
        },
        additionalInfo: bookingData.additionalInfo,
        paymentMethod: bookingData.paymentMethod || 'not_paid'
      };

      const response = await createBooking(bookingPayload);

      if (response.success) {
        navigate(`/booking-success/${response.booking.bookingId}`);
      } else {
        setError(response.message || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Booking failed:', error);
      
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 404) {
        setError('Service not found. Please try again.');
      } else if (error.request) {
        setError('Cannot connect to server. Please check your connection.');
      } else {
        setError('Failed to create booking. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="bg-white border-2 border-gray-200 rounded-xl p-8 max-w-md text-center">
          <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Service Not Found</h2>
          <p className="text-gray-600 mb-6">
            {error || 'The service you are looking for does not exist or has been removed.'}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/services')}
              className="w-full px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-semibold transition-colors"
            >
              Browse All Services
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

  const serviceCategory = service.category || '';
  const displayCategory = serviceCategory.replace(/-/g, ' ').toUpperCase();
  const ServiceIcon = getServiceIcon(service.name);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
            <ArrowLeft className="w-4 h-4 mx-2 rotate-180" />
            <Link to="/services" className="hover:text-gray-900 transition-colors">Services</Link>
            <ArrowLeft className="w-4 h-4 mx-2 rotate-180" />
            <Link to={`/services/category/${serviceCategory}`} className="hover:text-gray-900 transition-colors capitalize">
              {serviceCategory.replace(/-/g, ' ')}
            </Link>
            <ArrowLeft className="w-4 h-4 mx-2 rotate-180" />
            <span className="text-gray-900 font-medium">{service.name}</span>
          </nav>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Service Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Header */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="inline-block mb-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm">
                    {displayCategory}
                  </div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">{service.name}</h1>
                  <p className="text-xl text-gray-600">{service.description || 'No description available'}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <ServiceIcon className="w-8 h-8 text-gray-700" />
                </div>
              </div>
            </div>

            {/* Service Info Cards */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-gray-700" />
                  <h3 className="font-semibold text-gray-900">Processing Time</h3>
                </div>
                <p className="text-gray-600">{service.processingTime || '7-10 working days'}</p>
              </div>
              
              <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Shield className="w-5 h-5 text-gray-700" />
                  <h3 className="font-semibold text-gray-900">Security</h3>
                </div>
                <p className="text-gray-600">100% Secure & Confidential</p>
              </div>
              
              <div className="bg-white border-2 border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-3 mb-2">
                  <Users className="w-5 h-5 text-gray-700" />
                  <h3 className="font-semibold text-gray-900">Support</h3>
                </div>
                <p className="text-gray-600">24/7 Customer Support</p>
              </div>
            </div>

            {/* Detailed Description */}
            {service.detailedDescription && (
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Service Details</h2>
                <div className="prose max-w-none">
                  <p className="text-gray-600 leading-relaxed">{service.detailedDescription}</p>
                </div>
              </div>
            )}

            {/* Requirements/Features */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What's Included</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {(service.features || [
                  'Expert assistance throughout the process',
                  'Document verification and validation',
                  'Government department follow-up',
                  'Secure document handling',
                  'Regular status updates',
                  'Complete documentation support'
                ]).map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking & Actions */}
          <div className="space-y-6">
            {/* Booking Card */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6 sticky top-32">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Book This Service</h2>
                <p className="text-gray-600">Complete your booking in minutes</p>
              </div>

              {/* Pricing */}
              <div className="mb-6">
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-gray-900">₹{service.fee || 0}</div>
                  <div className="text-gray-600">Service Fee</div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-3 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Processing Time</span>
                    </div>
                    <span className="font-medium text-gray-900">{service.processingTime || '7-10 days'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">Service Type</span>
                    </div>
                    <span className="font-medium text-gray-900">{displayCategory}</span>
                  </div>
                </div>
              </div>

              {/* Booking Form/Button */}
              {showBookingForm ? (
                <BookingForm
                  service={service}
                  onSubmit={handleBookingSubmit}
                  onCancel={() => setShowBookingForm(false)}
                />
              ) : (
                <div>
                  <button
                    onClick={handleBookNow}
                    className="w-full py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-semibold text-lg transition-colors mb-4"
                  >
                    {isAuthenticated ? 'Book Now' : 'Login to Book'}
                  </button>

                  {!isAuthenticated && (
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-2">You need to login to book this service</p>
                      <Link to="/login" className="text-gray-700 hover:text-gray-900 text-sm font-medium">
                        Login to your account →
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* Contact Support */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Need Assistance?</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Call us at</p>
                      <a href="tel:+911234567890" className="text-gray-900 font-medium">+91 123 456 7890</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Email us at</p>
                      <a href="mailto:support@1point1solution.com" className="text-gray-900 font-medium">support@1point1solution.com</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Choose Us Card */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Why Choose 1Point 1Solution?</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-sm text-gray-600">Experienced documentation experts</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-sm text-gray-600">100% legitimate & transparent process</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-sm text-gray-600">Fast & hassle-free processing</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                  <span className="text-sm text-gray-600">Secure document handling</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Related Services/Back Button */}
        <div className="mt-12 text-center">
          <Link 
            to="/services" 
            className="inline-flex items-center px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to All Services
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;