// client/src/pages/admin/AdminAnalytics.jsx
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  FileText, 
  DollarSign,
  Calendar,
  Download,
  Filter,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { getServiceAnalytics, getAdminStats } from '../../utils/adminApi';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30days');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const [analyticsResponse, statsResponse] = await Promise.all([
        getServiceAnalytics(),
        getAdminStats()
      ]);

      if (analyticsResponse.success) setAnalytics(analyticsResponse.analytics);
      if (statsResponse.success) setStats(statsResponse.stats);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const timeRanges = [
    { value: '7days', label: 'Last 7 days' },
    { value: '30days', label: 'Last 30 days' },
    { value: '90days', label: 'Last 90 days' },
    { value: 'year', label: 'This year' }
  ];

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Track platform performance and metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
            >
              {timeRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          </div>
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Download className="w-4 h-4" />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {formatCurrency(stats?.totalRevenue || 0)}
              </p>
              <div className="flex items-center gap-2">
                {/* <ArrowUpRight className="w-4 h-4 text-green-500" /> */}
                <span className="text-sm font-medium text-green-600"></span>
                <span className="text-sm text-gray-500"></span>
              </div>
            </div>

          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">Total Bookings</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {formatNumber(stats?.totalBookings || 0)}
              </p>
              <div className="flex items-center gap-2">
                {/* <ArrowUpRight className="w-4 h-4 text-green-500" /> */}
                <span className="text-sm font-medium text-green-600"></span>
                <span className="text-sm text-gray-500"></span>
              </div>
            </div>

          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">Total Users</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {formatNumber(stats?.totalUsers || 0)}
              </p>
              <div className="flex items-center gap-2">
                {/* <ArrowUpRight className="w-4 h-4 text-green-500" /> */}
                <span className="text-sm font-medium text-green-600"></span>
                <span className="text-sm text-gray-500"></span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">Avg. Order Value</p>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {formatCurrency(stats?.totalRevenue / (stats?.totalBookings || 1) || 0)}
              </p>
              <div className="flex items-center gap-2">
                {/* <ArrowUpRight className="w-4 h-4 text-green-500" /> */}
                {/* <span className="text-sm font-medium text-green-600">+5%</span> */}
                {/* <span className="text-sm text-gray-500">from last month</span> */}
              </div>
            </div>
            {/* <div className="p-3 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div> */}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Popular Services */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Popular Services</h3>
              <p className="text-sm text-gray-600">Most booked services</p>
            </div>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {analytics?.popularServices?.slice(0, 5).map((service, index) => (
              <div key={service._id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{service._id}</div>
                    <div className="text-xs text-gray-500 capitalize">
                      {service.category?.replace('-', ' ') || 'General'}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">{service.count} bookings</div>
                  <div className="text-sm text-green-600">
                    {formatCurrency(service.totalRevenue)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Status Distribution */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Booking Status</h3>
              <p className="text-sm text-gray-600">Current status distribution</p>
            </div>
            <FileText className="w-5 h-5 text-gray-400" />
          </div>

          <div className="space-y-4">
            {stats?.statusBreakdown?.map((item) => (
              <div key={item._id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 capitalize">{item._id}</span>
                  <span className="text-sm font-bold text-gray-900">{item.count} bookings</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      item._id === 'pending' ? 'bg-yellow-500' :
                      item._id === 'processing' ? 'bg-blue-500' :
                      item._id === 'completed' ? 'bg-green-500' :
                      'bg-red-500'
                    }`}
                    style={{ 
                      width: `${(item.count / stats.totalBookings) * 100}%` 
                    }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 text-right">
                  {((item.count / stats.totalBookings) * 100).toFixed(1)}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by Category */}
        {analytics?.bookingsByCategory && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Revenue by Category</h3>
                <p className="text-sm text-gray-600">Earnings across service categories</p>
              </div>
              <DollarSign className="w-5 h-5 text-gray-400" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analytics.bookingsByCategory.map((category) => (
                <div key={category._id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-900 capitalize">
                      {category._id?.replace('-', ' ') || 'Other'}
                    </span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(category.totalRevenue)}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {category.count} bookings • {((category.totalRevenue / stats.totalRevenue) * 100).toFixed(1)}% of total
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <p className="text-sm text-gray-600">Latest platform activities</p>
          </div>
          <Calendar className="w-5 h-5 text-gray-400" />
        </div>

        <div className="space-y-4">
          {stats?.recentActivity?.map((activity, index) => (
            <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <div className={`p-2 rounded-lg ${
                activity.type === 'booking' ? 'bg-blue-100' :
                activity.type === 'payment' ? 'bg-green-100' :
                'bg-purple-100'
              }`}>
                {activity.type === 'booking' ? (
                  <FileText className="w-5 h-5 text-blue-600" />
                ) : activity.type === 'payment' ? (
                  <DollarSign className="w-5 h-5 text-green-600" />
                ) : (
                  <Users className="w-5 h-5 text-purple-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{activity.message}</p>
                <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;