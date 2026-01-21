// client/src/components/PaymentMethods.jsx
import React, { useState } from 'react';
import { updatePaymentStatus } from '../utils/api';

const PaymentMethods = ({ bookingId, currentMethod, onUpdate }) => {
  const [selectedMethod, setSelectedMethod] = useState(currentMethod || 'not_paid');
  const [transactionId, setTransactionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const paymentMethods = [
    {
      id: 'cash',
      name: 'Cash Payment',
      description: 'Pay in cash at our office',
      icon: '💵',
      requiresTransactionId: false
    },
    // {
    //   id: 'upi',
    //   name: 'UPI Payment',
    //   description: 'Pay via UPI (Google Pay, PhonePe, etc.)',
    //   icon: '📱',
    //   requiresTransactionId: true,
    //   placeholder: 'Enter UPI Transaction ID'
    // },
    // {
    //   id: 'bank_transfer',
    //   name: 'Bank Transfer',
    //   description: 'Direct bank transfer to our account',
    //   icon: '🏦',
    //   requiresTransactionId: true,
    //   placeholder: 'Enter Bank Transaction ID'
    // },
    // {
    //   id: 'not_paid',
    //   name: 'Pay Later',
    //   description: 'Pay after service completion',
    //   icon: '⏰',
    //   requiresTransactionId: false
    // }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const selected = paymentMethods.find(m => m.id === selectedMethod);
    
    if (selected?.requiresTransactionId && !transactionId.trim()) {
      setError('Please enter transaction ID');
      setLoading(false);
      return;
    }

    try {
      const paymentData = {
        paymentStatus: selectedMethod === 'not_paid' ? 'pending' : 'paid',
        paymentMethod: selectedMethod,
        transactionId: transactionId || undefined
      };

      const response = await updatePaymentStatus(bookingId, paymentData);
      
      if (response.success) {
        setSuccess('Payment status updated successfully!');
        if (onUpdate) {
          onUpdate(response.booking);
        }
        setTransactionId('');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update payment status');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Update Payment</h3>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Payment Methods */}
        <div className="mb-6">
          <h4 className="font-semibold text-gray-700 mb-4">Select Payment Method</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paymentMethods.map((method) => (
              <label
                key={method.id}
                className={`flex items-start p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedMethod === method.id
                    ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:bg-gray-50'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={method.id}
                  checked={selectedMethod === method.id}
                  onChange={(e) => {
                    setSelectedMethod(e.target.value);
                    setTransactionId('');
                  }}
                  className="mt-1 mr-3"
                />
                <div className="flex-1">
                  <div className="flex items-center mb-2">
                    <span className="text-2xl mr-3">{method.icon}</span>
                    <div>
                      <div className="font-medium text-gray-800">{method.name}</div>
                      <div className="text-sm text-gray-600">{method.description}</div>
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Transaction ID Input */}
        {paymentMethods.find(m => m.id === selectedMethod)?.requiresTransactionId && (
          <div className="mb-6">
            <label className="block font-medium text-gray-700 mb-2">
              Transaction ID *
            </label>
            <input
              type="text"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
              placeholder={paymentMethods.find(m => m.id === selectedMethod)?.placeholder}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-sm text-gray-500 mt-2">
              Please enter the transaction ID from your payment receipt
            </p>
          </div>
        )}

        {/* Bank Details for Transfer */}
        {selectedMethod === 'bank_transfer' && (
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-3">Bank Details</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Bank Name:</span>
                <span className="font-medium">State Bank of India</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account Name:</span>
                <span className="font-medium">1Point 1Solution Pvt Ltd</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Account Number:</span>
                <span className="font-medium">123456789012</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">IFSC Code:</span>
                <span className="font-medium">SBIN0001234</span>
              </div>
            </div>
          </div>
        )}

        {/* UPI Details */}
        {selectedMethod === 'upi' && (
          <div className="mb-6 bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-3">UPI Payment</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">UPI ID:</span>
                <span className="font-medium">1point1solution@oksbi</span>
              </div>
              <div className="text-gray-500 text-xs mt-2">
                Scan QR code or use UPI ID to make payment
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Updating...
            </div>
          ) : (
            'Update Payment Status'
          )}
        </button>
      </form>

      {/* Cash Payment Instructions */}
      {selectedMethod === 'cash' && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2">Cash Payment Instructions</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Visit our office during working hours</li>
            <li>• Bring your booking ID: {bookingId}</li>
            <li>• Payment will be confirmed immediately</li>
            <li>• Office hours: Mon-Fri 9 AM - 7 PM, Sat 10 AM - 5 PM</li>
          </ul>
        </div>
      )}

      {/* Contact Support */}

    </div>
  );
};

export default PaymentMethods;