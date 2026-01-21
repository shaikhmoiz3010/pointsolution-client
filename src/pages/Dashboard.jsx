// client/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Add useNavigate import
import { useAuth } from '../contexts/AuthContext';
import EditProfileModal from '../components/EditProfileModal';
import { getUserBookings, getBookingStats } from '../utils/api';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  Calendar,
  PlusCircle,
  Upload,
  User as UserIcon,
  Shield,
  Award,
  ChevronRight
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); // Add this line
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // If user is admin, redirect to admin panel
  useEffect(() => {
    if (user?.role === 'admin') {
      navigate('/admin');
    }
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      const [bookingsResponse, statsResponse] = await Promise.all([
        getUserBookings(),
        getBookingStats()
      ]);

      if (bookingsResponse.success) {
        setBookings(bookingsResponse.bookings);
      }

      if (statsResponse.success) {
        setStats(statsResponse.stats);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Stats data in Figma format
  const dashboardStats = [
    {
      icon: FileText,
      label: "Total Applications",
      value: stats?.totalBookings || "0",
      change: "+0 this month",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: Clock,
      label: "In Progress",
      value: stats?.processingBookings || "0",
      change: "Active now",
      color: "bg-yellow-100 text-yellow-600"
    },
    {
      icon: CheckCircle,
      label: "Completed",
      value: stats?.completedBookings || "0",
      change: "+0 this week",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: AlertCircle,
      label: "Needs Attention",
      value: stats?.pendingBookings || "0",
      change: "Requires action",
      color: "bg-red-100 text-red-600"
    }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: "bg-red-100", text: "text-red-700", label: "Needs Attention" },
      processing: { bg: "bg-yellow-100", text: "text-yellow-700", label: "In Progress" },
      completed: { bg: "bg-green-100", text: "text-green-700", label: "Completed" },
      cancelled: { bg: "bg-gray-100", text: "text-gray-700", label: "Cancelled" },
    };
    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-6 text-white mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.fullName || 'User'}!</h1>
          <p className="text-gray-200 mb-4">Here's what's happening with your applications today.</p>
          <Link
            to="/services"
            className="inline-flex items-center px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            Start New Application
          </Link>
        </div>

        {/* Stats Grid - Figma Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {dashboardStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white p-6 border-2 border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'overview'
                  ? 'border-gray-800 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'bookings'
                  ? 'border-gray-800 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                My Bookings
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className={`py-3 px-1 border-b-2 font-medium text-sm ${activeTab === 'profile'
                  ? 'border-gray-800 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                Profile
              </button>
            </nav>
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Recent Applications - Figma Style */}
                <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
                    <button
                      onClick={() => setActiveTab('bookings')}
                      className="px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors text-sm"
                    >
                      View All
                    </button>
                  </div>

                  <div className="space-y-4">
                    {bookings.slice(0, 4).map((booking) => (
                      <div
                        key={booking._id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1 mb-3 sm:mb-0">
                          <h3 className="font-semibold text-gray-900 mb-1">{booking.serviceName}</h3>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(booking.createdAt).toLocaleDateString('en-IN')}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span>{booking.bookingId}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getStatusBadge(booking.status)}
                          <Link
                            to={`/bookings/${booking._id}`}
                            className="px-3 py-1 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors"
                          >
                            Track
                          </Link>
                        </div>
                      </div>
                    ))}

                    {bookings.length === 0 && (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FileText className="w-8 h-8" />
                        </div>
                        <p className="text-gray-600 mb-4">No applications yet</p>
                        <Link
                          to="/services"
                          className="inline-flex items-center text-gray-700 hover:text-gray-900 font-medium"
                        >
                          Start your first application →
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions - Figma Style */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-gray-700" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-2">Track Application</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Monitor the real-time status of your documentation requests.
                        </p>
                        <button
                          onClick={() => setActiveTab('bookings')}
                          className="px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors"
                        >
                          View Progress
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors">
                    <div className="flex items-start gap-4">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <Upload className="w-6 h-6 text-gray-700" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-2">Upload Documents</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Submit required documents for your pending applications.
                        </p>
                        <button
                          onClick={() => setActiveTab('bookings')}
                          className="px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors"
                        >
                          Upload Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="bg-white border-2 border-gray-200 rounded-xl">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">All Bookings</h3>
                    <Link
                      to="/services"
                      className="inline-flex items-center px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-semibold transition-colors text-sm"
                    >
                      <PlusCircle className="w-4 h-4 mr-2" />
                      New Booking
                    </Link>
                  </div>
                </div>
                {bookings.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">
                      No bookings yet
                    </h3>
                    <p className="text-gray-500 mb-6">
                      Start by booking your first service
                    </p>
                    <Link
                      to="/services"
                      className="inline-flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-semibold transition-colors"
                    >
                      Browse Services
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Link>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <div className="min-w-full">
                      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600">
                          <div className="col-span-3">Booking Details</div>
                          <div className="col-span-2">Service</div>
                          <div className="col-span-2">Status</div>
                          <div className="col-span-2">Payment</div>
                          <div className="col-span-1">Amount</div>
                          <div className="col-span-2"></div>
                        </div>
                      </div>
                      <div className="divide-y divide-gray-200">
                        {bookings.map((booking) => (
                          <div key={booking._id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                            <div className="grid grid-cols-12 gap-4 items-center">
                              <div className="col-span-3">
                                <Link
                                  to={`/bookings/${booking._id}`}
                                  className="text-gray-900 hover:text-gray-700 font-medium"
                                >
                                  {booking.bookingId}
                                </Link>
                                <div className="text-sm text-gray-500 mt-1">
                                  {new Date(booking.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                              <div className="col-span-2">
                                <div className="font-medium text-gray-900">{booking.serviceName}</div>
                                <div className="text-sm text-gray-500">{booking.category}</div>
                              </div>
                              <div className="col-span-2">
                                {getStatusBadge(booking.status)}
                              </div>
                              <div className="col-span-2">
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(booking.paymentStatus)}`}>
                                  {booking.paymentStatus}
                                </span>
                              </div>
                              <div className="col-span-1 font-medium text-gray-900">
                                ₹{booking.serviceFee}
                              </div>
                              <div className="col-span-2">
                                <div className="flex items-center gap-2">
                                  <Link
                                    to={`/bookings/${booking._id}`}
                                    className="px-3 py-1 text-sm text-gray-700 hover:text-gray-900 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                                  >
                                    View
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Profile Information</h3>
                  <button
                    onClick={() => setIsEditModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                  >
                    Edit Profile
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Profile Header */}
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-16 h-16 bg-gray-800 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                      {user?.fullName?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{user?.fullName || 'Not provided'}</h4>
                      <p className="text-gray-600">{user?.email}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${user?.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                          {user?.role === 'admin' ? 'Administrator' : 'Regular User'}
                        </span>
                        <span className="text-sm text-gray-500">Member since {new Date(user?.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <UserIcon className="w-5 h-5" />
                        Personal Information
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            {user?.fullName || 'Not provided'}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            {user?.phone || 'Not provided'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Contact Information
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            {user?.email}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                          <div className="bg-gray-50 p-3 rounded-lg min-h-[60px]">
                            {user?.address ? (
                              <div>
                                <p>{user.address.street}</p>
                                <p>{user.address.city}, {user.address.state} - {user.address.pincode}</p>
                              </div>
                            ) : (
                              'Not provided'
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Document Information */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <Award className="w-5 h-5" />
                        Document Details
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Aadhaar Number</label>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            {user?.aadhaarNumber || 'Not provided'}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">PAN Number</label>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            {user?.panNumber || 'Not provided'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Account Information */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <FileText className="w-5 h-5" />
                        Account Information
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${user?.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                              {user?.role === 'admin' ? 'Administrator' : 'Regular User'}
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Account Created</label>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            {new Date(user?.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </>
        )}

        <EditProfileModal
          user={user}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onUpdate={(updatedUser) => {
            // You might want to update your AuthContext here
            fetchDashboardData(); // Refresh dashboard data
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;