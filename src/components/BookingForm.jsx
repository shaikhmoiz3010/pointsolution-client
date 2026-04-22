// client/src/components/BookingForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CreditCard, Banknote, AlertCircle, Info, FileText } from 'lucide-react';

const BookingForm = ({ service, onSubmit, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    additionalInfo: '',
    paymentMethod: 'cash', // Default to cash
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const paymentMethods = [
    { 
      id: 'cash', 
      name: 'Cash Payment', 
      description: 'Pay in cash at our office',
      icon: Banknote 
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
    <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Booking</h2>
      <p className="text-gray-600 mb-6">Review your details and confirm booking</p>
      
      {error && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-lg mb-6">
          <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium">{error}</p>
            <p className="text-sm mt-1">Please try again or contact support if issue persists</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* User Info Summary */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-gray-100 p-2 rounded-lg">
              <Info className="w-5 h-5 text-gray-700" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Your Information</h3>
          </div>
          <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                <p className="font-medium text-gray-900">{user?.fullName || 'Not provided'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
                <p className="font-medium text-gray-900">{user?.phone || 'Not provided'}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-1">Service</label>
                <p className="font-medium text-gray-900">{service?.name || 'Not specified'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method - Single Option */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-gray-100 p-2 rounded-lg">
              <CreditCard className="w-5 h-5 text-gray-700" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
          </div>
          <div className="max-w-md mx-auto">
            <div className="bg-gray-50 border-2 border-gray-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="bg-gray-100 p-3 rounded-lg">
                  <Banknote className="w-6 h-6 text-gray-700" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-gray-900 text-lg">Cash Payment</h4>
                  <p className="text-gray-600 text-sm mt-1">Pay in cash at our office after service completion</p>

                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-500">
                  Our office address: Adarsh Nagar, Gurgaon, Haryana, 122001
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-gray-100 p-2 rounded-lg">
              <FileText className="w-5 h-5 text-gray-700" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Additional Information (Optional)</h3>
          </div>
          <div>
            <textarea
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-gray-300 bg-white placeholder-gray-400"
              placeholder="Any special requirements, notes, or additional information you'd like to provide..."
            />
            <div className="mt-2 text-sm text-gray-500 flex justify-between">
              <span>Optional field</span>
              <span>{formData.additionalInfo.length}/500 characters</span>
            </div>
          </div>
        </div>

        {/* Summary */}

        {/* Buttons - Centered */}
        <div className="flex flex-col sm:flex-row justify-center gap-1">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-12 py-1 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors disabled:opacity-50 min-w-[140px]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <span>Confirm</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            )}
          </button>
        </div>


      </form>
    </div>
  );
};

export default BookingForm;