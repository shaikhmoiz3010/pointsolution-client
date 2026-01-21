// client/src/pages/admin/AdminBookings.jsx
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import {
    Search,
    Filter,
    Download,
    Eye,
    Edit,
    CheckCircle,
    XCircle,
    Clock,
    Calendar,
    User,
    Phone,
    Mail,
    Trash2,
    AlertCircle,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import {
    getAllBookings,
    updateBookingStatus,
    deleteBooking,
    updateBookingDetails
} from '../../utils/adminApi';

const AdminBookings = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [filteredBookings, setFilteredBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Filters
    const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
    const [selectedStatus, setSelectedStatus] = useState(searchParams.get('status') || 'all');
    const [selectedDate, setSelectedDate] = useState(searchParams.get('date') || '');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalBookings, setTotalBookings] = useState(0);

    // Edit modal
    const [editingBooking, setEditingBooking] = useState(null);
    const [editForm, setEditForm] = useState({
        serviceFee: '',
        additionalInfo: '',
        paymentMethod: ''
    });
    const [showEditModal, setShowEditModal] = useState(false);
    const [editLoading, setEditLoading] = useState(false);

    useEffect(() => {
        fetchBookings();
    }, [currentPage, selectedStatus]);

    useEffect(() => {
        filterBookings();
    }, [bookings, searchTerm, selectedStatus, selectedDate]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            setError('');

            const params = {
                page: currentPage,
                limit: 20,
                status: selectedStatus !== 'all' ? selectedStatus : undefined,
                search: searchTerm || undefined
            };

            const response = await getAllBookings(params);

            if (response.success) {
                setBookings(response.bookings);
                setFilteredBookings(response.bookings);
                setTotalPages(response.totalPages);
                setTotalBookings(response.total);

                // Update URL params
                const newParams = new URLSearchParams();
                if (selectedStatus !== 'all') newParams.set('status', selectedStatus);
                if (searchTerm) newParams.set('search', searchTerm);
                setSearchParams(newParams);
            }
        } catch (error) {
            console.error('Failed to fetch bookings:', error);
            setError(error.message || 'Failed to load bookings');
        } finally {
            setLoading(false);
        }
    };

    const filterBookings = () => {
        let filtered = [...bookings];

        // Apply search filter
        if (searchTerm) {
            filtered = filtered.filter(booking =>
                booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.userDetails?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.userDetails?.email?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply date filter
        if (selectedDate) {
            const filterDate = new Date(selectedDate).setHours(0, 0, 0, 0);
            filtered = filtered.filter(booking => {
                const bookingDate = new Date(booking.createdAt).setHours(0, 0, 0, 0);
                return bookingDate === filterDate;
            });
        }

        setFilteredBookings(filtered);
    };

    const handleStatusChange = async (bookingId, newStatus) => {
        if (!window.confirm(`Are you sure you want to change status to ${newStatus}?`)) {
            return;
        }

        try {
            const response = await updateBookingStatus(bookingId, {
                status: newStatus,
                message: `Status changed to ${newStatus}`
            });

            if (response.success) {
                setSuccess(`Booking status updated to ${newStatus}`);

                // Refresh bookings
                fetchBookings();

                // Clear success message after 3 seconds
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (error) {
            console.error('Failed to update status:', error);
            setError(error.message || 'Failed to update status');
            setTimeout(() => setError(''), 5000);
        }
    };

    const handleDeleteBooking = async (bookingId) => {
        if (!window.confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
            return;
        }

        try {
            const response = await deleteBooking(bookingId);

            if (response.success) {
                setSuccess('Booking deleted successfully');

                // Refresh bookings
                fetchBookings();

                // Clear success message
                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (error) {
            console.error('Failed to delete booking:', error);
            setError(error.message || 'Failed to delete booking');
            setTimeout(() => setError(''), 5000);
        }
    };

    const handleEditBooking = (booking) => {
        setEditingBooking(booking);
        setEditForm({
            serviceFee: booking.serviceFee || '',
            additionalInfo: booking.additionalInfo || '',
            paymentMethod: booking.paymentMethod || 'cash'
        });
        setShowEditModal(true);
    };

    const handleUpdateBooking = async () => {
        if (!editingBooking) return;

        try {
            setEditLoading(true);

            const response = await updateBookingDetails(editingBooking._id, editForm);

            if (response.success) {
                setSuccess('Booking updated successfully');
                setShowEditModal(false);
                fetchBookings();

                setTimeout(() => setSuccess(''), 3000);
            }
        } catch (error) {
            console.error('Failed to update booking:', error);
            setError(error.message || 'Failed to update booking');
        } finally {
            setEditLoading(false);
        }
    };

    const statusOptions = [
        { value: 'all', label: 'All Bookings', icon: null },
        { value: 'pending', label: 'Pending', icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
        { value: 'processing', label: 'Processing', icon: Clock, color: 'bg-blue-100 text-blue-800' },
        { value: 'completed', label: 'Completed', icon: CheckCircle, color: 'bg-green-100 text-green-800' },
        { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'bg-red-100 text-red-800' }
    ];

    const getStatusBadge = (status) => {
        const option = statusOptions.find(opt => opt.value === status);
        if (!option || option.value === 'all') return null;

        const Icon = option.icon;
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${option.color}`}>
                {Icon && <Icon className="w-3 h-3" />}
                {option.label}
            </span>
        );
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const exportToCSV = () => {
        const headers = ['Booking ID', 'Service', 'Customer', 'Email', 'Phone', 'Amount', 'Status', 'Date', 'Payment Method'];
        const csvData = filteredBookings.map(booking => [
            booking.bookingId,
            booking.serviceName,
            booking.userDetails?.fullName || 'N/A',
            booking.userDetails?.email || 'N/A',
            booking.userDetails?.phone || 'N/A',
            `₹${booking.serviceFee}`,
            booking.status,
            formatDate(booking.createdAt),
            booking.paymentMethod
        ]);

        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const handlePageChange = (page) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    if (loading && currentPage === 1) {
        return (
            <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading bookings...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Bookings Management</h1>
                    <p className="text-gray-600">Manage and track all customer bookings</p>
                </div>
                <button
                    onClick={exportToCSV}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                    <Download className="w-4 h-4" />
                    Export CSV
                </button>
            </div>

            {/* Messages */}
            {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <div className="flex items-center">
                        <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                        <div>
                            <p className="text-sm text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            )}

            {success && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                    <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                        <div>
                            <p className="text-sm text-green-700">{success}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search bookings..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    setCurrentPage(1);
                                    fetchBookings();
                                }
                            }}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Status Filter */}
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <select
                            value={selectedStatus}
                            onChange={(e) => {
                                setSelectedStatus(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                        >
                            {statusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Date Filter */}
                    <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => {
                                setSearchTerm('');
                                setSelectedStatus('all');
                                setSelectedDate('');
                                setCurrentPage(1);
                            }}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                            Clear
                        </button>
                        <button
                            onClick={() => {
                                setCurrentPage(1);
                                fetchBookings();
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Apply
                        </button>
                    </div>
                </div>
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <th className="px-6 py-3">Booking Details</th>
                                <th className="px-6 py-3">Customer</th>
                                <th className="px-6 py-3">Service</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {filteredBookings.map((booking) => (
                                <tr key={booking._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <div className="font-mono font-semibold text-gray-900">
                                                {booking.bookingId}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {booking.paymentStatus === 'paid' ? (
                                                    <span className="text-green-600 flex items-center gap-1">
                                                        <CheckCircle className="w-3 h-3" />
                                                        Paid
                                                    </span>
                                                ) : (
                                                    <span className="text-yellow-600 flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {booking.paymentStatus || 'Pending'}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                                <User className="w-4 h-4 text-gray-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">
                                                    {booking.userDetails?.fullName || 'N/A'}
                                                </div>
                                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                                    <Mail className="w-3 h-3" />
                                                    {booking.userDetails?.email}
                                                </div>
                                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                                    <Phone className="w-3 h-3" />
                                                    {booking.userDetails?.phone}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {booking.serviceName}
                                        </div>
                                        <div className="text-xs text-gray-500 capitalize">
                                            {booking.category?.replace('-', ' ') || 'General'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-lg font-bold text-gray-900">
                                            ₹{booking.serviceFee}
                                        </div>
                                        <div className="text-xs text-gray-500 capitalize">
                                            {booking.paymentMethod?.replace('_', ' ') || 'Not specified'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {getStatusBadge(booking.status)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">
                                            {formatDate(booking.createdAt)}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {new Date(booking.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                to={`/admin/bookings/${booking._id}`}
                                                onClick={(e) => {
                                                    console.log('🔗 Navigating to booking:', {
                                                        id: booking._id,
                                                        bookingId: booking.bookingId,
                                                        path: `/admin/bookings/${booking._id}`
                                                    });
                                                }}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="View Details"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </Link>

                                            <button
                                                onClick={() => handleEditBooking(booking)}
                                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                title="Edit Booking"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>

                                            {/* Status Update Dropdown */}
                                            <div className="relative group">
                                                <button
                                                    className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                    title="Update Status"
                                                >
                                                    <CheckCircle className="w-4 h-4" />
                                                </button>
                                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                                    <div className="p-2 space-y-1">
                                                        {['pending', 'processing', 'completed', 'cancelled'].map((status) => (
                                                            <button
                                                                key={status}
                                                                onClick={() => handleStatusChange(booking._id, status)}
                                                                className={`w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-100 capitalize ${booking.status === status ? 'bg-gray-100 font-medium' : ''
                                                                    }`}
                                                            >
                                                                {status}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleDeleteBooking(booking._id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete Booking"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {filteredBookings.length === 0 && !loading && (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center">
                                        <div className="text-gray-500">
                                            <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                                            <p className="text-lg font-medium">No bookings found</p>
                                            <p className="text-sm">Try changing your search or filters</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                            Showing <span className="font-medium">{(currentPage - 1) * 20 + 1}</span> to{' '}
                            <span className="font-medium">{Math.min(currentPage * 20, totalBookings)}</span> of{' '}
                            <span className="font-medium">{totalBookings}</span> bookings
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Previous
                            </button>

                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum;
                                    if (totalPages <= 5) {
                                        pageNum = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i;
                                    } else {
                                        pageNum = currentPage - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => handlePageChange(pageNum)}
                                            className={`w-8 h-8 rounded-md text-sm ${currentPage === pageNum
                                                    ? 'bg-blue-600 text-white'
                                                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}

                                {totalPages > 5 && currentPage < totalPages - 2 && (
                                    <>
                                        <span className="px-2">...</span>
                                        <button
                                            onClick={() => handlePageChange(totalPages)}
                                            className="w-8 h-8 rounded-md text-sm border border-gray-300 text-gray-700 hover:bg-gray-50"
                                        >
                                            {totalPages}
                                        </button>
                                    </>
                                )}
                            </div>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                            >
                                Next
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {showEditModal && editingBooking && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900">Edit Booking</h3>
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Service Fee (₹)
                                    </label>
                                    <input
                                        type="number"
                                        value={editForm.serviceFee}
                                        onChange={(e) => setEditForm({ ...editForm, serviceFee: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter service fee"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Payment Method
                                    </label>
                                    <select
                                        value={editForm.paymentMethod}
                                        onChange={(e) => setEditForm({ ...editForm, paymentMethod: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="cash">Cash</option>
                                        <option value="online">Online</option>
                                        <option value="bank_transfer">Bank Transfer</option>
                                        <option value="upi">UPI</option>
                                        <option value="not_paid">Not Paid</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Additional Information
                                    </label>
                                    <textarea
                                        value={editForm.additionalInfo}
                                        onChange={(e) => setEditForm({ ...editForm, additionalInfo: e.target.value })}
                                        rows="3"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        placeholder="Enter additional information"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                                <button
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUpdateBooking}
                                    disabled={editLoading}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {editLoading ? 'Updating...' : 'Update Booking'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBookings;