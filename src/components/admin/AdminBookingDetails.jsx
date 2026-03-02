// client/src/components/admin/AdminBookingDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Calendar,
    User,
    Phone,
    Mail,
    MapPin,
    FileText,
    Upload,
    CheckCircle,
    XCircle,
    Clock,
    DollarSign,
    Download,
    Send,
    MessageSquare,
    History,
    AlertCircle
} from 'lucide-react';
import { getBookingDetails, updateBookingStatus, sendNotification } from '../../utils/adminApi';

const AdminBookingDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [newStatus, setNewStatus] = useState('');
    const [updating, setUpdating] = useState(false);
    const [notification, setNotification] = useState('');

    useEffect(() => {
        fetchBookingDetails();
    }, [id]);

    useEffect(() => {
        if (booking) {
            console.log('📊 Booking data received:', {
                id: booking._id,
                category: booking.category,
                serviceName: booking.serviceName,

                hasCategory: !!booking.category,
                bookingKeys: Object.keys(booking)
            });
        }
    }, [booking]);

    const fetchBookingDetails = async () => {
        try {
            setLoading(true);
            setError('');

            if (!id || id === 'undefined' || id === 'null') {
                setError('Invalid booking ID');
                setLoading(false);
                return;
            }

            console.log('🔍 Fetching booking details for ID:', id);

            const response = await getBookingDetails(id);

            if (response.success) {
                console.log('✅ Booking found:', response.booking);
                setBooking(response.booking);
            } else {
                setError(response.message || 'Booking not found');
            }
        } catch (error) {
            console.error('❌ Failed to fetch booking:', error);
            setError(error.message || 'Failed to load booking details');
        } finally {
            setLoading(false);
        }
    };

    const getFormattedCategory = () => {
        if (!booking?.category) {
            if (booking?.service?.category) {
                return booking.service.category.replace(/-/g, ' ').toUpperCase();
            }
            return 'General';
        }
        return booking.category.replace(/-/g, ' ').toUpperCase();
    };

    const handleStatusUpdate = async () => {
        if (!newStatus || newStatus === booking.status) return;

        try {
            setUpdating(true);
            const response = await updateBookingStatus(id, {
                status: newStatus,
                message: `Status changed to ${newStatus} by admin`
            });

            if (response.success) {
                setBooking(response.booking);
                setNewStatus('');
                alert('Booking status updated successfully!');
            }
        } catch (error) {
            console.error('Failed to update status:', error);
            alert('Failed to update status');
        } finally {
            setUpdating(false);
        }
    };


    const getStatusColor = (status) => {
        const statusStr = status || 'pending';
        switch (statusStr) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getPaymentColor = (status) => {
        const statusStr = status || 'pending';
        switch (statusStr) {
            case 'paid': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'failed': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Invalid date';
        }
    };

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading booking details...</p>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <XCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Booking Not Found</h3>
                <p className="text-gray-600 mb-6">The booking you're looking for doesn't exist.</p>
                <button
                    onClick={() => navigate('/admin/bookings')}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Back to Bookings
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <button
                        onClick={() => navigate('/admin/bookings')}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Bookings
                    </button>
                    <h1 className="text-3xl font-bold text-gray-900">Booking Details</h1>
                    <div className="flex items-center gap-3 mt-2">
                        <div className="font-mono font-semibold text-gray-700">{booking.bookingId || 'N/A'}</div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                            {(booking.status || 'PENDING').toUpperCase()}
                        </span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Left Column - Booking Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Status Update Card */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <CheckCircle className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Update Status</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {['pending', 'processing', 'completed', 'cancelled'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => setNewStatus(status)}
                                        className={`px-4 py-3 rounded-lg text-center transition-colors ${newStatus === status
                                                ? getStatusColor(status)
                                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        <div className="font-medium capitalize">{status}</div>
                                    </button>
                                ))}
                            </div>

                            {newStatus && newStatus !== booking.status && (
                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-600">From:</span>
                                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(booking.status)}`}>
                                            {(booking.status || 'pending').toUpperCase()}
                                        </span>
                                        <span className="text-gray-400">→</span>
                                        <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(newStatus)}`}>
                                            {newStatus.toUpperCase()}
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleStatusUpdate}
                                        disabled={updating}
                                        className="mt-4 w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                                    >
                                        {updating ? 'Updating...' : 'Confirm Status Update'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Customer Information */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <User className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Customer Information</h3>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-2">Full Name</label>
                                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                        <User className="w-4 h-4 text-gray-400" />
                                        <span className="font-medium">{booking.userDetails?.fullName || 'Not provided'}</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600 mb-2">Email</label>
                                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <span className="font-medium">{booking.userDetails?.email || 'Not provided'}</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600 mb-2">Phone</label>
                                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <span className="font-medium">{booking.userDetails?.phone || 'Not provided'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {booking.userDetails?.address && (
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-2">Address</label>
                                        <div className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                                            <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                                            <div>
                                                <p className="font-medium">{booking.userDetails.address.street || ''}</p>
                                                <p className="text-sm text-gray-600">
                                                    {booking.userDetails.address.city || ''}, {booking.userDetails.address.state || ''}
                                                </p>
                                                <p className="text-sm text-gray-600">Pincode: {booking.userDetails.address.pincode || ''}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {booking.userDetails?.aadhaarNumber && (
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-2">Aadhaar Number</label>
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <span className="font-medium">{booking.userDetails.aadhaarNumber}</span>
                                        </div>
                                    </div>
                                )}

                                {booking.userDetails?.panNumber && (
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-2">PAN Number</label>
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <span className="font-medium">{booking.userDetails.panNumber}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Service Information */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <FileText className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Service Information</h3>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-2">Service Name</label>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <span className="font-bold text-lg">{booking.serviceName || 'Not specified'}</span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600 mb-2">Category</label>
                                    <p className="font-medium text-gray-900">
                                        {getFormattedCategory()}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-600 mb-2">Booking Date</label>
                                    <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span className="font-medium">{formatDate(booking.createdAt)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">

                                <div>
                                    <label className="block text-sm text-gray-600 mb-2">Payment Method</label>
                                    <div className="p-3 bg-gray-50 rounded-lg">
                                        <span className="font-medium capitalize">
                                            {(booking.paymentMethod || 'Not specified').replace('_', ' ')}
                                        </span>
                                    </div>
                                </div>

                                {booking.transactionId && (
                                    <div>
                                        <label className="block text-sm text-gray-600 mb-2">Transaction ID</label>
                                        <div className="p-3 bg-gray-50 rounded-lg">
                                            <span className="font-mono text-sm">{booking.transactionId}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {booking.additionalInfo && (
                            <div className="mt-6 pt-6 border-t border-gray-200">
                                <label className="block text-sm font-medium text-gray-600 mb-2">Additional Information</label>
                                <div className="p-4 bg-blue-50 rounded-lg">
                                    <p className="text-gray-700">{booking.additionalInfo}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tracking Timeline */}
                    {booking.tracking && booking.tracking.length > 0 && (
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <History className="w-6 h-6 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900">Tracking Timeline</h3>
                            </div>

                            <div className="space-y-4">
                                {booking.tracking.map((track, index) => (
                                    <div key={index} className="flex">
                                        <div className="flex flex-col items-center mr-4">
                                            <div className={`w-3 h-3 rounded-full ${track.status === 'completed' ? 'bg-green-500' :
                                                    track.status === 'cancelled' ? 'bg-red-500' :
                                                        track.status === 'processing' ? 'bg-blue-500' : 'bg-gray-300'
                                                }`}></div>
                                            {index < booking.tracking.length - 1 && (
                                                <div className="w-px h-full bg-gray-300 mt-1"></div>
                                            )}
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="font-medium text-gray-800 capitalize">{track.status || 'update'}</span>
                                                <span className="text-sm text-gray-500">
                                                    {formatDate(track.timestamp || track.date)}
                                                </span>
                                            </div>
                                            <p className="text-gray-600 text-sm">{track.message || 'Status updated'}</p>
                                            {track.updatedBy && (
                                                <p className="text-gray-500 text-xs mt-1">By: {track.updatedBy}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Actions & Communication */}
                <div className="space-y-6">
                    {/* Send Notification */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">




                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <FileText className="w-5 h-5 text-purple-600" />
                                </div>
                                <h4 className="font-semibold text-gray-900">Documents</h4>
                            </div>

                            <div className="space-y-3">
                                <p className="text-sm text-gray-600">
                                    View and verify documents uploaded by the user for this booking.
                                </p>

                                <Link
                                    to={`/admin/bookings/${booking._id}/documents`}
                                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    <Upload className="w-4 h-4" />
                                    Manage Documents
                                </Link>
                            </div>
                        </div>

                    </div>


                    {/* Booking Summary */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h4 className="font-semibold text-gray-900 mb-4">Booking Summary</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600">Booking ID</span>
                                <span className="font-mono font-medium">{booking.bookingId || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600">Created On</span>
                                <span className="font-medium">{formatDate(booking.createdAt)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                <span className="text-gray-600">Last Updated</span>
                                <span className="font-medium">{formatDate(booking.updatedAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminBookingDetails;