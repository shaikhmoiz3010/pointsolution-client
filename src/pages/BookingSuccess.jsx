// client/src/pages/BookingSuccess.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPaymentMethods } from '../utils/api';
import { CheckCircle, Home, CreditCard, FileText, Phone, Mail, ArrowRight, Download, Printer, Calendar } from 'lucide-react';

const BookingSuccess = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [paymentMethods, setPaymentMethods] = useState([]);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const response = await getPaymentMethods();
      if (response.success) {
        setPaymentMethods(response.methods);
      }
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Success Card */}
        <div className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden max-w-3xl mx-auto">
          {/* Success Header */}
          <div className="bg-gradient-to-r from-green-500 to-green-600 p-8 text-center text-white">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h1 className="text-4xl font-bold mb-4">
              Booking Confirmed! 🎉
            </h1>
            <p className="text-green-100 text-lg">
              Your booking has been successfully created and is now being processed.
            </p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Booking ID Card */}
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-6 mb-8">
              <div className="text-center mb-4">
                <div className="inline-block mb-3 px-4 py-2 bg-gray-800 text-white rounded-full text-sm font-medium">
                  Your Booking ID
                </div>
                <div className="text-3xl font-bold text-gray-900 font-mono tracking-wider">{bookingId}</div>
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
                <Calendar className="w-4 h-4" />
                <span>Booked on {new Date().toLocaleDateString('en-IN', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}</span>
              </div>
              <p className="text-center text-gray-500 text-sm mt-4">
                Save this ID for tracking your booking status in dashboard
              </p>
            </div>

            {/* Next Steps */}
            <div className="mb-8">
              <div className="text-center mb-6">
                <div className="inline-block mb-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  What's Next?
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Your Journey Ahead</h3>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-lg flex items-center justify-center text-xl font-bold">
                    1
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Complete Payment</h4>
                    <p className="text-gray-600">
                      Choose your preferred payment method. Our team will contact you for payment details.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex-shrink-0 w-12 h-12 bg-green-600 text-white rounded-lg flex items-center justify-center text-xl font-bold">
                    2
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Document Submission</h4>
                    <p className="text-gray-600">
                      Submit required documents. We'll guide you through the exact documentation needed.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-600 text-white rounded-lg flex items-center justify-center text-xl font-bold">
                    3
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Track Progress</h4>
                    <p className="text-gray-600">
                      Monitor real-time status updates in your dashboard. We'll keep you informed at every step.
                    </p>
                  </div>
                </div>
              </div>
            </div>



            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-semibold transition-colors text-lg"
              >
                <Home className="w-5 h-5 mr-2" />
                Go to Dashboard
              </Link>
              <button
                onClick={() => navigate('/services')}
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-semibold transition-colors text-lg"
              >
                Book Another Service
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>



            {/* Contact Support */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Need Assistance?</h3>
              <p className="text-gray-600 mb-6 text-center">
                Our support team is available 24/7 to help you with your booking
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <a
                  href="tel:+911234567890"
                  className="flex items-center justify-center gap-3 p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-gray-600">Call us at</div>
                    <div className="font-semibold text-gray-900">+91 123 456 7890</div>
                  </div>
                </a>
                <a
                  href="mailto:support@1point1solution.com"
                  className="flex items-center justify-center gap-3 p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                >
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm text-gray-600">Email us at</div>
                    <div className="font-semibold text-gray-900">support@1point1solution.com</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link
            to="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium"
          >
            <ArrowRight className="w-4 h-4 mr-2 rotate-180" />
            Back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;