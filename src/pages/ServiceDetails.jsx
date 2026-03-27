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
  Briefcase,
  Info,
  ListChecks,
  AlertCircle,
  Star,
  ThumbsUp,
  HelpCircle,
  DollarSign,
  RefreshCw,
  MessageCircle
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
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    fetchServiceDetails();
  }, [id]);

  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      const response = await getServiceById(id);
      if (response.success) {
        setService(response.service);
      }
    } catch (error) {
      console.error('Failed to fetch service:', error);
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

  // Generate comprehensive description based on service category and name
  const getComprehensiveDescription = () => {
    // Add null check at the beginning
    if (!service) {
      return {
        overview: '',
        process: [],
        benefits: [],
        documents: [],
        timeline: '',
        faqs: []
      };
    }
    
    const category = service.category?.toLowerCase() || '';
    const name = service.name?.toLowerCase() || '';
    
    if (category.includes('rto') || name.includes('vehicle') || name.includes('license')) {
      return {
        overview: `Looking for ${service.name} service, 1 Point 1 Solution provides end-to-end assistance for all your vehicle and driving license related needs. We understand that dealing with RTO (Regional Transport Office) can be time-consuming and complex. Our expert team handles the entire process, saving you valuable time and ensuring all documentation is correctly prepared and submitted.`,
        process: [
          'Initial consultation to understand your specific requirements',
          'Document verification and checklist preparation',
          'Form filling and application preparation',
          'Document submission to the concerned RTO',
          'Follow-up with RTO officials for processing',
          'Regular status updates via SMS and email',
          'Collection and delivery of documents/license'
        ],
        benefits: [
          'Save time and avoid multiple trips to RTO',
          'Expert handling of complex documentation',
          'Guaranteed error-free applications',
          'Regular updates on application status',
          'Doorstep document pickup and delivery',
          'Professional assistance throughout the process'
        ],
        documents: [
          'Proof of identity (Aadhaar, PAN, Voter ID)',
          'Proof of address (Utility bills, Rent agreement)',
          'Passport size photographs',
          'Age proof (Birth certificate, School certificate)',
          'Existing license (if applicable)',
          'Form 1A (Medical certificate for commercial vehicles)'
        ],
        timeline: 'Typically 7-15 working days depending on RTO processing time',
        faqs: [
          { q: 'Is this service available for all types of vehicles?', a: 'Yes, we assist with all types of vehicles including cars, bikes, and commercial vehicles.' },
          { q: 'Do I need to visit the RTO?', a: 'In most cases, no. Our representatives handle the submission and follow-up. However, for biometric verification, your presence might be required.' }
        ]
      };
    }
    
    if (category.includes('passport') || name.includes('passport')) {
      return {
        overview: `${service.name} service simplifies the passport application process. We provide complete guidance and assistance from application form filling to appointment booking and document verification. Our experts ensure your application meets all requirements to avoid delays or rejections.`,
        process: [
          'Assessment of your passport requirement (fresh/renewal)',
          'Document checklist and verification',
          'Online application form filling assistance',
          'Appointment booking at Passport Seva Kendra (PSK)',
          'Document preparation and organization',
          'Guidance for PSK visit and interview',
          'Post-submission follow-up and tracking'
        ],
        benefits: [
          'Hassle-free application process',
          'Expert document verification',
          'Priority appointment booking',
          'Assistance with police verification if needed',
          'End-to-end support until passport delivery'
        ],
        documents: [
          'Proof of date of birth (Birth certificate, School certificate)',
          'Proof of identity (Aadhaar, Voter ID, PAN)',
          'Proof of address (Utility bills, Bank statement)',
          'Passport size photographs (with specific specifications)',
          'Existing passport (for renewal)',
          'Police verification form (if applicable)'
        ],
        timeline: 'Typically 7-30 days depending on application type and verification status',
        faqs: [
          { q: 'What is the difference between fresh and renewal application?', a: 'Fresh applications are for first-time applicants, while renewal is for those whose passport has expired or is about to expire.' },
          { q: 'Will I need to visit the passport office?', a: 'Yes, you need to visit PSK for document verification and biometrics. We help you prepare for this visit.' }
        ]
      };
    }
    
    if (category.includes('certificate') || name.includes('birth') || name.includes('marriage') || name.includes('death')) {
      return {
        overview: ` ${service.name} service provides comprehensive assistance in obtaining and managing vital certificates. Whether you need a birth certificate, marriage certificate, or death certificate, our team ensures a smooth process from application to delivery.`,
        process: [
          'Requirement analysis and document assessment',
          'Application form preparation and verification',
          'Submission to concerned municipal office/registrar',
          'Follow-up with authorities for processing',
          'Status tracking and regular updates',
          'Certificate collection and delivery'
        ],
        benefits: [
          'Avoid bureaucratic hassles',
          'Timely processing and delivery',
          'Expert documentation handling',
          'Doorstep service available',
          'Multi-language support'
        ],
        documents: [
          'Proof of event date and place',
          'Hospital records (for birth)',
          'Marriage invitation/affidavit (for marriage)',
          'Identity proof of applicants',
          'Address proof',
          'Photographs as required'
        ],
        timeline: 'Typically 15-30 working days depending on municipality processing',
        faqs: [
          { q: 'Can I get certificates for events that happened years ago?', a: 'Yes, we can assist with delayed registrations. Additional documents may be required.' },
          { q: 'Are these certificates valid for international use?', a: 'Yes, but they may need apostille or attestation for international use, which we can also assist with.' }
        ]
      };
    }
    
    if (category.includes('property') || name.includes('land') || name.includes('mutation')) {
      return {
        overview: `${service.name} service helps you navigate the complex property registration and documentation process. We assist with property mutation, title verification, and all related documentation to ensure legal compliance and smooth transactions.`,
        process: [
          'Property document verification',
          'Title search and due diligence',
          'Application preparation for mutation/registration',
          'Document submission to sub-registrar office',
          'Stamp duty and registration fee calculation',
          'Follow-up for registration completion',
          'Document collection and delivery'
        ],
        benefits: [
          'Legal document verification',
          'Avoid title disputes',
          'Accurate valuation and stamp duty calculation',
          'Expert guidance on legal requirements',
          'Quick processing and tracking'
        ],
        documents: [
          'Title deeds and chain of documents',
          'Sale agreement',
          'Property tax receipts',
          'Encumbrance certificate',
          'Identity and address proof of parties',
          'PAN card of all parties'
        ],
        timeline: 'Typically 15-45 days depending on property type and location',
        faqs: [
          { q: 'What is property mutation?', a: 'Property mutation is the process of transferring property ownership records in government records after a sale or inheritance.' },
          { q: 'Do I need legal verification before buying property?', a: 'Yes, title verification is crucial to ensure the seller has clear ownership rights and there are no legal disputes.' }
        ]
      };
    }
    
    // Default comprehensive description
    return {
      overview: `${service.name} service is designed to provide you with professional, reliable, and efficient assistance. We understand that government documentation can be complex and time-consuming. Our expert team ensures that your application is processed smoothly, with minimal hassle on your part.`,
      process: [
        'Initial consultation to understand your requirements',
        'Document verification and checklist preparation',
        'Application form filling and preparation',
        'Document submission to concerned authorities',
        'Regular follow-up and status tracking',
        'Final document collection and delivery'
      ],
      benefits: [
        'Save time and effort',
        'Expert guidance throughout the process',
        'Hassle-free documentation',
        'Regular updates on application status',
        'Professional and reliable service'
      ],
      documents: [
        'Identity proof (Aadhaar, PAN, Voter ID)',
        'Address proof (Utility bills, Bank statement)',
        'Photographs as required',
        'Any existing documents related to the service',
        'Additional documents as per service requirements'
      ],
      timeline: 'Processing time varies based on government department and application complexity',
      faqs: [
        { q: 'How long does the process take?', a: 'Processing time depends on the specific service and government department. Our team will provide you with an estimated timeline during consultation.' },
        { q: 'Do I need to visit government offices?', a: 'In most cases, our representatives handle submissions. However, for certain services like biometric verification, your presence might be required.' },
        { q: 'What if my application gets rejected?', a: 'We review all applications thoroughly to minimize rejection risk. In case of rejection, we help you understand the reason and assist with reapplication.' }
      ]
    };
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

  // Call getComprehensiveDescription only after service is confirmed to exist
  const comprehensiveDetails = getComprehensiveDescription();
  
  const serviceCategory = service.category || '';
  const displayCategory = serviceCategory.replace(/-/g, ' ').toUpperCase();
  const ServiceIcon = getServiceIcon(service.name);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-orange-500 transition-colors">Home</Link>
            <ArrowLeft className="w-4 h-4 mx-2 rotate-180" />
            <Link to="/services" className="hover:text-orange-500 transition-colors">Services</Link>
            <ArrowLeft className="w-4 h-4 mx-2 rotate-180" />
            <Link to={`/services/category/${serviceCategory}`} className="hover:text-orange-500 transition-colors capitalize">
              {serviceCategory.replace(/-/g, ' ')}
            </Link>
            <ArrowLeft className="w-4 h-4 mx-2 rotate-180" />
            <span className="text-orange-500 font-medium">{service.name}</span>
          </nav>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Service Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Service Header */}
            <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="inline-block mb-4 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                    {displayCategory}
                  </div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{service.name}</h1>
                  <p className="text-lg text-gray-600">{service.description || 'No description available'}</p>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden">
              <div className="flex border-b border-gray-200">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                    activeTab === 'description'
                      ? 'text-orange-500 border-b-2 border-orange-500 bg-orange-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Info className="w-5 h-5 inline-block mr-2" />
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('process')}
                  className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                    activeTab === 'process'
                      ? 'text-orange-500 border-b-2 border-orange-500 bg-orange-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <ListChecks className="w-5 h-5 inline-block mr-2" />
                  Process
                </button>
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                    activeTab === 'documents'
                      ? 'text-orange-500 border-b-2 border-orange-500 bg-orange-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <FileText className="w-5 h-5 inline-block mr-2" />
                  Documents
                </button>
                <button
                  onClick={() => setActiveTab('faq')}
                  className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                    activeTab === 'faq'
                      ? 'text-orange-500 border-b-2 border-orange-500 bg-orange-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <HelpCircle className="w-5 h-5 inline-block mr-2" />
                  FAQs
                </button>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'description' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Service Overview</h3>
                      <p className="text-gray-700 leading-relaxed">{comprehensiveDetails.overview}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Key Benefits</h3>
                      <div className="grid md:grid-cols-2 gap-3">
                        {comprehensiveDetails.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-700">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">Estimated Timeline</h3>
                      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
                        <Clock className="w-6 h-6 text-blue-600 flex-shrink-0" />
                        <div>
                          <p className="text-gray-900 font-medium">Processing Time</p>
                          <p className="text-gray-700">{comprehensiveDetails.timeline}</p>
                          <p className="text-sm text-gray-600 mt-1">*Actual time may vary based on government processing</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'process' && (
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">How It Works</h3>
                    <div className="space-y-4">
                      {comprehensiveDetails.process.map((step, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-700">{step}</p>
                            {index < comprehensiveDetails.process.length - 1 && (
                              <div className="ml-4 mt-2 w-px h-4 bg-gray-300"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div className="space-y-6">
                    <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg mb-6">
                      <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0" />
                      <div>
                        <p className="text-gray-900 font-medium">Document Requirements</p>
                        <p className="text-sm text-gray-600">Please ensure all documents are clear and valid</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-3">
                      {comprehensiveDetails.documents.map((doc, index) => (
                        <div key={index} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                          <FileText className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{doc}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">
                        <strong>Note:</strong> Additional documents may be required based on your specific case. Our team will guide you through the complete document checklist during consultation.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'faq' && (
                  <div className="space-y-4">
                    {comprehensiveDetails.faqs.map((faq, index) => (
                      <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                        <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-start gap-2">
                          <HelpCircle className="w-5 h-5 text-orange-500 mt-1 flex-shrink-0" />
                          {faq.q}
                        </h4>
                        <p className="text-gray-700 ml-7">{faq.a}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Service Guarantee */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <Shield className="w-12 h-12 text-green-600 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">Our Service Guarantee</h3>
                  <p className="text-gray-700 mb-3">
                    We are committed to providing you with the highest quality service. Our team ensures:
                  </p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <ThumbsUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700">100% Professional Service</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700">Timely Updates & Follow-ups</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700">Free Re-submission if Required</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-green-600" />
                      <span className="text-sm text-gray-700">24/7 Customer Support</span>
                    </div>
                  </div>
                </div>
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

              {/* Pricing Info */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Service Fee</span>
                  <span className="text-2xl font-bold text-gray-900">₹{service.price || 499}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>Processing time: {comprehensiveDetails.timeline}</span>
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
                      <a href="tel:+91 83681 61577" className="text-gray-900 font-medium">+91 83681 61577</a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Email us at</p>
                      <a href="mailto:info@1p1s.com" className="text-gray-900 font-medium">info@1p1s.com</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Button */}
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