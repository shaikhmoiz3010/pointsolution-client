// client/src/components/BookingForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  CreditCard, 
  Banknote, 
  AlertCircle, 
  Info, 
  FileText,
  User,
  Phone,
  Calendar,
  CheckCircle,
  MapPin,
  Shield,
  Clock
} from 'lucide-react';

const BookingForm = ({ service, onSubmit, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    additionalInfo: '',
    paymentMethod: 'cash',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const paymentMethods = [
    { 
      id: 'cash', 
      name: 'Cash Payment', 
      description: 'Pay in cash at our office',
      icon: Banknote,
      color: 'from-emerald-500 to-teal-500',
      badge: 'Most Convenient'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await onSubmit(formData);
    } catch (error) {
      setError('Failed to create booking. Please try again.');
      console.error('Booking error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-2xl shadow-xl p-8 border border-blue-100">
      {/* Header with Gradient */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Complete Your Booking
            </h2>
            <p className="text-gray-600 mt-1">Review your details and confirm your appointment</p>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="animate-slideDown mb-6">
          <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-r-xl shadow-md">
            <div className="bg-red-100 p-2 rounded-full">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-red-800">{error}</p>
              <p className="text-sm text-red-600 mt-1">Please try again or contact support if issue persists</p>
            </div>
            <button 
              onClick={() => setError('')}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* User Info Summary - Colorful Card */}
        <div className="group">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-2 rounded-lg shadow-md">
              <Info className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Your Information</h3>
          </div>
          
          <div className="bg-white rounded-xl border-2 border-blue-100 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2"></div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="bg-blue-50 p-2 rounded-lg">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                    <p className="font-semibold text-gray-800 text-lg">{user?.fullName || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="bg-green-50 p-2 rounded-lg">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                    <p className="font-semibold text-gray-800 text-lg">{user?.phone || 'Not provided'}</p>
                  </div>
                </div>
                
                <div className="md:col-span-2 flex items-start gap-3">
                  <div className="bg-purple-50 p-2 rounded-lg">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Selected Service</label>
                    <p className="font-semibold text-gray-800 text-lg">{service?.name || 'Not specified'}</p>
                    {service?.description && (
                      <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method - Enhanced with Colors */}
        <div className="group">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-lg shadow-md">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Payment Method</h3>
          </div>
          
          <div className="max-w-md mx-auto transform hover:scale-105 transition-transform duration-300">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border-2 border-emerald-200 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2"></div>
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-3 rounded-xl shadow-lg">
                    <Banknote className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-gray-800 text-xl">Cash Payment</h4>
                      <span className="px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-semibold rounded-full shadow-md">
                        Recommended
                      </span>
                    </div>
                    <p className="text-gray-600">Pay in cash at our office after service completion</p>
                    
                    <div className="mt-4 flex items-start gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>Our office: <span className="font-medium">Adarsh Nagar, Gurgaon, Haryana, 122001</span></span>
                    </div>
                    
                    <div className="mt-3 flex items-center gap-2 text-xs text-emerald-600">
                      <Shield className="w-3 h-3" />
                      <span>Secure & hassle-free payment at our office</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information - Colorful Textarea */}
        <div className="group">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-2 rounded-lg shadow-md">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">Additional Information</h3>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Optional</span>
          </div>
          
          <div className="relative">
            <textarea
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              rows="4"
              className="w-full px-6 py-4 bg-white border-2 border-purple-200 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all duration-300 placeholder-gray-400 text-gray-700 shadow-sm"
              placeholder="Any special requirements, notes, or additional information you'd like to provide..."
              maxLength="500"
            />
            <div className="mt-3 flex justify-between items-center">
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-purple-500" />
                <span className="text-gray-500">You can add special requests or notes</span>
              </div>
              <div className={`text-sm font-medium px-3 py-1 rounded-full ${
                formData.additionalInfo.length > 400 
                  ? 'bg-orange-100 text-orange-600' 
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {formData.additionalInfo.length}/500
              </div>
            </div>
          </div>
        </div>

        {/* Summary Card with Pricing if available */}
        {service?.price && (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Total Amount</p>
                <p className="text-3xl font-bold">₹{service.price}</p>
              </div>
              <div className="bg-white/20 p-3 rounded-xl">
                <CheckCircle className="w-8 h-8" />
              </div>
            </div>
            <p className="text-blue-100 text-sm mt-2">No hidden charges • Pay after service</p>
          </div>
        )}

        {/* Buttons - Enhanced with Gradients */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-8 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-all duration-300 disabled:opacity-50 min-w-[140px] hover:border-gray-300 hover:shadow-md"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="group relative px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px] shadow-lg hover:shadow-xl overflow-hidden"
          >
            <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>Confirm Booking</span>
                <CheckCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
            )}
          </button>
        </div>
      </form>

      {/* Trust Badge */}
      <div className="mt-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-full">
          <Shield className="w-4 h-4 text-green-500" />
          <span className="text-sm text-gray-600">Your information is secure and encrypted</span>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;