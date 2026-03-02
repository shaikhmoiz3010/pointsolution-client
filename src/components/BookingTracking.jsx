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
      case 'pending': return 'text-amber-700 bg-amber-100 border-amber-200';
      case 'processing': return 'text-blue-700 bg-blue-100 border-blue-200';
      case 'completed': return 'text-emerald-700 bg-emerald-100 border-emerald-200';
      case 'cancelled': return 'text-rose-700 bg-rose-100 border-rose-200';
      default: return 'text-gray-700 bg-gray-100 border-gray-200';
    }
  };

  const getTimelineDotColor = (status, index) => {
    if (index === 0) return 'bg-blue-500 ring-4 ring-blue-100';
    switch (status) {
      case 'completed': return 'bg-emerald-500';
      case 'cancelled': return 'bg-rose-500';
      case 'processing': return 'bg-blue-500 animate-pulse';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <span>📦</span> Booking Tracking
          </h3>
          {booking.createdAt && (
            <span className="text-white/80 text-sm bg-white/20 px-3 py-1 rounded-full w-fit">
              {new Date(booking.createdAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      <div className="p-4 sm:p-6">
        {/* Current Status */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
            <h4 className="font-semibold text-gray-700">Current Status</h4>
            <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(booking.status)} w-fit`}>
              {getStatusIcon(booking.status)} {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
          </div>
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-200">
            <p className="text-gray-700">
              {booking.tracking && booking.tracking.length > 0
                ? booking.tracking[booking.tracking.length - 1]?.message
                : 'Booking created successfully'}
            </p>
          </div>
        </div>

        {/* Timeline */}
        {booking.tracking && booking.tracking.length > 0 && (
          <div>
            <h4 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <span className="w-1 h-5 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></span>
              Timeline
            </h4>
            <div className="space-y-4">
              {booking.tracking.map((track, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                  {/* Timeline dot and line - hidden on mobile, shown on sm and up */}
                  <div className="hidden sm:flex sm:flex-col sm:items-center">
                    <div className={`w-3 h-3 rounded-full ${getTimelineDotColor(track.status, index)}`}></div>
                    {index < booking.tracking.length - 1 && (
                      <div className="w-0.5 h-full bg-gradient-to-b from-gray-300 to-gray-200 mt-1"></div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`inline-block w-2 h-2 rounded-full sm:hidden ${
                          index === 0 ? 'bg-blue-500' : 
                          track.status === 'completed' ? 'bg-emerald-500' :
                          track.status === 'cancelled' ? 'bg-rose-500' : 'bg-gray-400'
                        }`}></span>
                        <span className="font-medium text-gray-800 capitalize flex items-center gap-1">
                          {getStatusIcon(track.status)} {track.status}
                        </span>
                        {index === 0 && (
                          <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                            Latest
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500 ml-4 sm:ml-0">
                        {new Date(track.timestamp || track.date).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 text-sm sm:text-base">{track.message}</p>
                    
                    {track.updatedBy && (
                      <p className="text-gray-400 text-xs mt-2 flex items-center gap-1">
                        <span>👤</span> By: {track.updatedBy}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!booking.tracking || booking.tracking.length === 0) && (
          <div className="text-center py-8 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-gray-600">No tracking updates available</p>
            <p className="text-sm text-gray-500 mt-1">Check back later for updates</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingTracking;