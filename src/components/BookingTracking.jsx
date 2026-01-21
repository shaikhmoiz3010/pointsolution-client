// client/src/components/BookingTracking.jsx
import React from 'react';

const BookingTracking = ({ booking }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return '🔄';
      case 'processing': return '⚙️';
      case 'completed': return '✅';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'processing': return 'text-blue-600 bg-blue-100';
      case 'completed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Booking Tracking</h3>
      
      {/* Current Status */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-700">Current Status</h4>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
            {getStatusIcon(booking.status)} {booking.status.toUpperCase()}
          </span>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-600">
            {booking.tracking && booking.tracking.length > 0
              ? booking.tracking[booking.tracking.length - 1]?.message
              : 'Booking created successfully'}
          </p>
        </div>
      </div>

      {/* Timeline */}
      {booking.tracking && booking.tracking.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-700 mb-4">Timeline</h4>
          <div className="space-y-4">
            {booking.tracking.map((track, index) => (
              <div key={index} className="flex">
                <div className="flex flex-col items-center mr-4">
                  <div className={`w-3 h-3 rounded-full ${
                    index === 0 ? 'bg-blue-600' : 
                    track.status === 'completed' ? 'bg-green-500' :
                    track.status === 'cancelled' ? 'bg-red-500' : 'bg-gray-300'
                  }`}></div>
                  {index < booking.tracking.length - 1 && (
                    <div className="w-px h-full bg-gray-300 mt-1"></div>
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-gray-800 capitalize">{track.status}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(track.timestamp || track.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{track.message}</p>
                  {track.updatedBy && (
                    <p className="text-gray-500 text-xs mt-1">By: {track.updatedBy}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Status */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="font-semibold text-gray-700 mb-3">Payment Information</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Payment Status</label>
            <div className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${
              booking.paymentStatus === 'paid' ? 'bg-green-100 text-green-600' :
              booking.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-600' :
              'bg-red-100 text-red-600'
            }`}>
              {booking.paymentStatus.toUpperCase()}
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-600">Payment Method</label>
            <p className="font-medium capitalize">{booking.paymentMethod?.replace('_', ' ') || 'Not specified'}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Amount</label>
            <p className="font-medium">₹{booking.serviceFee}</p>
          </div>
          {booking.paymentDate && (
            <div>
              <label className="text-sm text-gray-600">Payment Date</label>
              <p className="font-medium">{new Date(booking.paymentDate).toLocaleDateString()}</p>
            </div>
          )}
        </div>
      </div>

      {/* Help Section */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="font-semibold text-gray-700 mb-3">Need Help?</h4>
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-blue-700 mb-2">
            For updates or assistance with your booking:
          </p>
          <div className="text-sm space-y-1">
            <div className="flex items-center">
              <span className="w-4 mr-2">📞</span>
              <span>Call: +91 98765 43210</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 mr-2">✉️</span>
              <span>Email: support@1point1solution.com</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 mr-2">📋</span>
              <span>Reference: {booking.bookingId}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingTracking;