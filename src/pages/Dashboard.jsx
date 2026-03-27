// client/src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  ChevronRight,
  Home,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Package,
  Eye,
  Edit
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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

  // Stats data with colors
  const dashboardStats = [
    {
      icon: FileText,
      label: "Total Applications",
      value: stats?.totalBookings || "0",
      change: "+0 this month",
      bg: "bg-blue-100",
      iconColor: "text-blue-600",
      border: "border-blue-200"
    },
    {
      icon: Clock,
      label: "In Progress",
      value: stats?.processingBookings || "0",
      change: "Active now",
      bg: "bg-amber-100",
      iconColor: "text-amber-600",
      border: "border-amber-200"
    },
    {
      icon: CheckCircle,
      label: "Completed",
      value: stats?.completedBookings || "0",
      change: "+0 this week",
      bg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      border: "border-emerald-200"
    },
    {
      icon: AlertCircle,
      label: "Needs Attention",
      value: stats?.pendingBookings || "0",
      change: "Requires action",
      bg: "bg-rose-100",
      iconColor: "text-rose-600",
      border: "border-rose-200"
    }
  ];

  const getStatusConfig = (status) => {
    const configs = {
      pending: { 
        bg: "bg-rose-100", 
        text: "text-rose-700", 
        border: "border-rose-200",
        label: "Needs Attention",
        icon: AlertCircle
      },
      processing: { 
        bg: "bg-amber-100", 
        text: "text-amber-700", 
        border: "border-amber-200",
        label: "In Progress",
        icon: Clock
      },
      completed: { 
        bg: "bg-emerald-100", 
        text: "text-emerald-700", 
        border: "border-emerald-200",
        label: "Completed",
        icon: CheckCircle
      },
      cancelled: { 
        bg: "bg-gray-100", 
        text: "text-gray-700", 
        border: "border-gray-200",
        label: "Cancelled",
        icon: FileText
      },
    };
    return configs[status] || configs.pending;
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: 'bg-amber-100 text-amber-700 border-amber-200',
      paid: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      failed: 'bg-rose-100 text-rose-700 border-rose-200',
      refunded: 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gray-50">

            <Link
              to="/"
              className="inline-flex items-center justify-center mx-8 my-3  px-6 py-3  bg-orange-400 text-gray-100 rounded-xl font-semibold hover:bg-orange-600 transition-all shadow-md hover:shadow-lg"
            >
              Back to Home
            </Link>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="bg-gray-800 rounded-2xl p-6 sm:p-8 mb-8 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Welcome back, {user?.fullName || 'User'}!
              </h1>
              <p className="text-gray-300 text-sm sm:text-base">
                Here's what's happening with your applications today.
              </p>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-900 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-md hover:shadow-lg"
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Start New Application
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {dashboardStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index} 
                className={`bg-white p-6 rounded-xl border-2 ${stat.border} shadow-sm hover:shadow-md transition-all hover:-translate-y-1`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bg}`}>
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.iconColor}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="mb-6 bg-white rounded-xl border-2 border-gray-200 p-1 inline-block">
          <nav className="flex space-x-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeTab === 'overview'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeTab === 'bookings'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              My Bookings
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                activeTab === 'profile'
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Profile
            </button>
          </nav>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="text-center py-12">
            <div className="relative inline-block">
              <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-gray-800 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Recent Applications */}
                <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <h2 className="text-xl font-bold text-gray-900">Recent Applications</h2>
                      <button
                        onClick={() => setActiveTab('bookings')}
                        className="inline-flex items-center px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium text-sm transition-colors"
                      >
                        View All
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    {bookings.slice(0, 4).map((booking) => {
                      const statusConfig = getStatusConfig(booking.status);
                      const StatusIcon = statusConfig.icon;
                      
                      return (
                        <div
                          key={booking._id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-200"
                        >
                          <div className="flex-1 mb-3 sm:mb-0">
                            <div className="flex items-center gap-2 mb-2">
                              <Package className="w-4 h-4 text-gray-500" />
                              <h3 className="font-semibold text-gray-900">{booking.serviceName}</h3>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(booking.createdAt).toLocaleDateString('en-IN')}
                              </span>
                              <span className="text-gray-300">•</span>
                              <span className="font-mono text-xs">{booking.bookingId}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border} flex items-center gap-1`}>
                              <StatusIcon className="w-3 h-3" />
                              {statusConfig.label}
                            </div>
                            <Link
                              to={`/bookings/${booking._id}`}
                              className="px-3 py-1 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-white font-medium text-sm transition-colors"
                            >
                              Track
                            </Link>
                          </div>
                        </div>
                      );
                    })}

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
                          Start your first application
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-white rounded-xl border-2 border-blue-200 p-6 hover:shadow-md transition-all hover:-translate-y-1">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <TrendingUp className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-2">Track Application</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Monitor the real-time status of your documentation requests.
                        </p>
                        <button
                          onClick={() => setActiveTab('bookings')}
                          className="px-4 py-2 border-2 border-blue-200 text-blue-700 rounded-lg hover:bg-blue-50 font-medium text-sm transition-colors"
                        >
                          View Progress
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border-2 border-purple-200 p-6 hover:shadow-md transition-all hover:-translate-y-1">
                    <div className="flex items-start gap-4">
                      <div className="bg-purple-100 p-3 rounded-lg">
                        <Upload className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 mb-2">Upload Documents</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Submit required documents for your pending applications.
                        </p>
                        <button
                          onClick={() => setActiveTab('bookings')}
                          className="px-4 py-2 border-2 border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 font-medium text-sm transition-colors"
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
              <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h3 className="text-xl font-bold text-gray-900">All Bookings</h3>
                    <Link
                      to="/services"
                      className="inline-flex items-center justify-center px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-semibold transition-colors text-sm"
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
                    {/* Mobile View (Cards) */}
                    <div className="block sm:hidden p-4 space-y-4">
                      {bookings.map((booking) => {
                        const statusConfig = getStatusConfig(booking.status);
                        const StatusIcon = statusConfig.icon;
                        
                        return (
                          <div key={booking._id} className="bg-gray-50 rounded-xl border border-gray-200 p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <span className="text-xs text-gray-500">Booking ID</span>
                                <p className="font-mono font-medium text-gray-900">{booking.bookingId}</p>
                              </div>
                              <div className={`px-2 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border} flex items-center gap-1`}>
                                <StatusIcon className="w-3 h-3" />
                                {statusConfig.label}
                              </div>
                            </div>
                            
                            <div className="space-y-2 mb-4">
                              <p className="font-semibold text-gray-900">{booking.serviceName}</p>
                              <p className="text-xs text-gray-500">{booking.category}</p>
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(booking.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            
                            <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(booking.paymentStatus)}`}>
                                {booking.paymentStatus}
                              </span>
                              <Link
                                to={`/bookings/${booking._id}`}
                                className="px-3 py-1 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Desktop View (Table) */}
                    <div className="hidden sm:block">
                      <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                        <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-600">
                          <div className="col-span-3">Booking Details</div>
                          <div className="col-span-3">Service</div>
                          <div className="col-span-2">Status</div>
                          <div className="col-span-2">Payment</div>
                          <div className="col-span-2">Actions</div>
                        </div>
                      </div>
                      <div className="divide-y divide-gray-200">
                        {bookings.map((booking) => {
                          const statusConfig = getStatusConfig(booking.status);
                          const StatusIcon = statusConfig.icon;
                          
                          return (
                            <div key={booking._id} className="px-6 py-4 hover:bg-gray-50 transition-colors">
                              <div className="grid grid-cols-12 gap-4 items-center">
                                <div className="col-span-3">
                                  <Link
                                    to={`/bookings/${booking._id}`}
                                    className="text-gray-900 hover:text-gray-700 font-medium"
                                  >
                                    {booking.bookingId}
                                  </Link>
                                  <div className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(booking.createdAt).toLocaleDateString()}
                                  </div>
                                </div>
                                <div className="col-span-3">
                                  <div className="font-medium text-gray-900">{booking.serviceName}</div>
                                  <div className="text-sm text-gray-500">{booking.category}</div>
                                </div>
                                <div className="col-span-2">
                                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border} inline-flex items-center gap-1`}>
                                    <StatusIcon className="w-3 h-3" />
                                    {statusConfig.label}
                                  </div>
                                </div>
                                <div className="col-span-2">
                                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPaymentStatusColor(booking.paymentStatus)}`}>
                                    {booking.paymentStatus}
                                  </span>
                                </div>
                                <div className="col-span-2">
                                  <Link
                                    to={`/bookings/${booking._id}`}
                                    className="inline-flex items-center px-3 py-1 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-900 transition-colors"
                                  >
                                    <Eye className="w-3 h-3 mr-1" />
                                    View
                                  </Link>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <h3 className="text-2xl font-bold text-gray-900">Profile Information</h3>
                    <button
                      onClick={() => setIsEditModalOpen(true)}
                      className="inline-flex items-center justify-center px-4 py-2 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  {/* Profile Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200 mb-6">
                    <div className="w-16 h-16 bg-gray-800 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                      {user?.fullName?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-gray-900">{user?.fullName || 'Not provided'}</h4>
                      <p className="text-gray-600">{user?.email}</p>
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          user?.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                            : 'bg-blue-100 text-blue-800 border border-blue-200'
                        }`}>
                          {user?.role === 'admin' ? 'Administrator' : 'Regular User'}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Member since {new Date(user?.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Profile Details */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-200">
                        <UserIcon className="w-4 h-4 text-blue-600" />
                        Personal Information
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Full Name</label>
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-gray-900">
                            {user?.fullName || 'Not provided'}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Phone Number</label>
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-gray-900">
                            {user?.phone || 'Not provided'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-200">
                        <Shield className="w-4 h-4 text-purple-600" />
                        Contact Information
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Email Address</label>
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-gray-900 flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-400" />
                            {user?.email}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Address</label>
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 min-h-[60px]">
                            {user?.address ? (
                              <div className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                                <div>
                                  <p className="text-gray-900">{user.address.street}</p>
                                  <p className="text-gray-600 text-sm">{user.address.city}, {user.address.state} - {user.address.pincode}</p>
                                </div>
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
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-200">
                        <Award className="w-4 h-4 text-emerald-600" />
                        Document Details
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Aadhaar Number</label>
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-gray-900">
                            {user?.aadhaarNumber || 'Not provided'}
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">PAN Number</label>
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-gray-900">
                            {user?.panNumber || 'Not provided'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Account Information */}
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center gap-2 pb-2 border-b border-gray-200">
                        <CreditCard className="w-4 h-4 text-amber-600" />
                        Account Information
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Account Type</label>
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              user?.role === 'admin' 
                                ? 'bg-purple-100 text-purple-800 border border-purple-200' 
                                : 'bg-blue-100 text-blue-800 border border-blue-200'
                            }`}>
                              {user?.role === 'admin' ? 'Administrator' : 'Regular User'}
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Account Created</label>
                          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 text-gray-900">
                            {new Date(user?.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            })}
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
            fetchDashboardData();
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;