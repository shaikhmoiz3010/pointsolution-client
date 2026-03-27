// client/src/pages/BookingSuccess.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPaymentMethods } from '../utils/api';
import { 
  CheckCircle, 
  Home, 
  CreditCard, 
  FileText, 
  Phone, 
  Mail, 
  ArrowRight, 
  Download, 
  Printer, 
  Calendar,
  Clock,
  Bell,
  Share2,
  Copy,
  ChevronRight,
  Sparkles,
  Shield,
  Gift
} from 'lucide-react';

const BookingSuccess = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [copySuccess, setCopySuccess] = useState(false);

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

  const copyToClipboard = () => {
    navigator.clipboard.writeText(bookingId);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 pt-24 pb-12">
      {/* Confetti Effect Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Success Card */}
        <div className="max-w-4xl mx-auto">
          {/* Animated Success Badge */}
          <div className="text-center mb-6 animate-bounce">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full shadow-lg">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Booking Confirmed!</span>
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
            {/* Success Header with Gradient */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500"></div>
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative px-6 sm:px-8 py-10 sm:py-12 text-center text-white">
                {/* Animated Checkmark */}
                <div className="relative mb-8">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 bg-white/20 rounded-full animate-ping"></div>
                  </div>
                  <div className="relative w-24 h-24 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto border-4 border-white/50">
                    <CheckCircle className="w-12 h-12 text-white animate-scaleIn" />
                  </div>
                </div>
                
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 animate-slideUp">
                  Booking Confirmed! 🎉
                </h1>
                <p className="text-white/90 text-lg max-w-2xl mx-auto animate-slideUp animation-delay-200">
                  Your booking has been successfully created and is now being processed. 
                  We're excited to help you with your service!
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 sm:p-8">
              {/* Booking ID Card with Copy */}
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border-2 border-emerald-100 p-6 mb-8 shadow-lg">
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-2 mb-4 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium">
                    <Bell className="w-4 h-4" />
                    Your Booking ID - Save this for tracking
                  </div>
                  
                  <div className="flex items-center justify-center gap-3">
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 font-mono tracking-wider bg-white px-6 py-3 rounded-xl border-2 border-emerald-200 shadow-inner">
                      {bookingId}
                    </div>
                    <button
                      onClick={copyToClipboard}
                      className="relative group"
                    >
                      <div className="p-3 bg-white border-2 border-gray-200 rounded-xl hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-300">
                        {copySuccess ? (
                          <CheckCircle className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <Copy className="w-5 h-5 text-gray-500 group-hover:text-emerald-500" />
                        )}
                      </div>
                      {copySuccess && (
                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                          Copied!
                        </span>
                      )}
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4 text-emerald-500" />
                    <span>Booked on {new Date().toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric' 
                    })}</span>
                  </div>
                  <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  <button className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
                    <Share2 className="w-3 h-3" />
                    Share
                  </button>
                  <button className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
                    <Printer className="w-3 h-3" />
                    Print
                  </button>
                  <button className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors">
                    <Download className="w-3 h-3" />
                    Save PDF
                  </button>
                </div>
              </div>

              {/* Next Steps Section */}
              <div className="mb-10">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 mb-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                    <Sparkles className="w-4 h-4" />
                    Your Journey Ahead
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    What's Next?
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Step 1 */}
                  <div className="group relative bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                      1
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                      <CreditCard className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Complete Payment</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Choose your preferred payment method. Our team will contact you for payment details.
                    </p>
                    <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                      <span>Expected: 24 hours</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                  
                  {/* Step 2 */}
                  <div className="group relative bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 border-2 border-emerald-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                      2
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                      <FileText className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Document Submission</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Submit required documents. We'll guide you through the exact documentation needed.
                    </p>
                    <div className="mt-4 flex items-center text-emerald-600 text-sm font-medium">
                      <span>Within 3 days</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                  
                  {/* Step 3 */}
                  <div className="group relative bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-lg">
                      3
                    </div>
                    <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform">
                      <Clock className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="text-lg font-bold text-gray-900 mb-2">Track Progress</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Monitor real-time status updates in your dashboard. We'll keep you informed at every step.
                    </p>
                    <div className="mt-4 flex items-center text-purple-600 text-sm font-medium">
                      <span>Real-time updates</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  to="/dashboard"
                  className="flex-1 inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl group"
                >
                  <Home className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Go to Dashboard
                </Link>
                <button
                  onClick={() => navigate('/services')}
                  className="flex-1 inline-flex items-center justify-center px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl group"
                >
                  Book Another Service
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center gap-6 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2 text-gray-600">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Secure Payment</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                  <span className="text-sm">Verified Process</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Gift className="w-4 h-4 text-purple-500" />
                  <span className="text-sm">Special Offers</span>
                </div>
              </div>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-8">
            <Link
              to="/"
              className="inline-flex items-center text-gray-600 hover:text-gray-900 font-medium group"
            >
              <ArrowRight className="w-4 h-4 mr-2 rotate-180 group-hover:-translate-x-1 transition-transform" />
              Back to Homepage
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-scaleIn {
          animation: scaleIn 0.5s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.5s ease-out;
        }
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default BookingSuccess;