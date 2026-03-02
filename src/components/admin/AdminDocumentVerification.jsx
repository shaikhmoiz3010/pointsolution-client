import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  FileText,
  Image,
  File,
  AlertCircle,
  Loader,
  User,
  Calendar,
  Mail,
  Phone
} from 'lucide-react';
import { getBookingDocuments, getDocument } from '../../utils/documentApi';
import { verifyDocument } from '../../utils/adminApi';

const AdminDocumentVerification = () => {
  const { bookingId } = useParams();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, [bookingId]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await getBookingDocuments(bookingId);
      
      if (response.success) {
        setDocuments(response.documents);
      } else {
        setError(response.message || 'Failed to fetch documents');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };


// Update handleVerify function
const handleVerify = async (docId, status, rejectionReason = '') => {
  setVerifying(docId);
  try {
    console.log(`🔄 Verifying document ${docId} with status: ${status}`);
    
    const response = await verifyDocument(docId, status, rejectionReason);
    
    if (response.success) {
      console.log('✅ Document verified successfully');
      await fetchDocuments(); // Refresh the list
      setSelectedDoc(null);
      alert(`Document ${status === 'verified' ? 'approved' : 'rejected'} successfully!`);
    } else {
      alert(response.message || `Failed to ${status} document`);
    }
  } catch (err) {
    console.error('❌ Verification error:', err);
    
    // Handle the error properly
    if (err.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      alert(err.response.data?.message || `Failed to ${status} document`);
    } else if (err.request) {
      // The request was made but no response was received
      alert('No response from server. Please check your connection.');
    } else {
      // Something happened in setting up the request that triggered an Error
      alert(err.message || `Failed to ${status} document`);
    }
  } finally {
    setVerifying(false);
  }
};

  const getFileIcon = (mimeType) => {
    if (mimeType?.startsWith('image/')) return <Image className="w-6 h-6" />;
    if (mimeType === 'application/pdf') return <FileText className="w-6 h-6" />;
    return <File className="w-6 h-6" />;
  };

  const getDocumentTypeLabel = (type) => {
    const labels = {
      'aadhaar': 'Aadhaar Card',
      'pan': 'PAN Card',
      'passport': 'Passport',
      'driving_licence': 'Driving Licence',
      'birth_certificate': 'Birth Certificate',
      'marriage_certificate': 'Marriage Certificate',
      'address_proof': 'Address Proof',
      'income_certificate': 'Income Certificate',
      'caste_certificate': 'Caste Certificate',
      'educational_certificate': 'Educational Certificate',
      'property_document': 'Property Document',
      'vehicle_rc': 'Vehicle RC',
      'insurance': 'Insurance',
      'photograph': 'Photograph',
      'signature': 'Signature',
      'other': 'Other Document'
    };
    return labels[type] || type.replace(/_/g, ' ').toUpperCase();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'verified':
        return (
          <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Verified
          </span>
        );
      case 'rejected':
        return (
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            Pending
          </span>
        );
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading documents...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-600 mb-4">{error}</p>
        <Link
          to="/admin/bookings"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Bookings
        </Link>
      </div>
    );
  }

  if (selectedDoc) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSelectedDoc(null)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Documents
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {getDocumentTypeLabel(selectedDoc.documentType)}
              </h2>
              <p className="text-gray-600">{selectedDoc.documentName}</p>
            </div>
            {getStatusBadge(selectedDoc.status)}
          </div>

          {/* Document Preview */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            {selectedDoc.mimeType?.startsWith('image/') ? (
              <img
                src={selectedDoc.fileUrl}
                alt={selectedDoc.documentName}
                className="max-w-full max-h-[500px] mx-auto object-contain"
              />
            ) : (
              <iframe
                src={selectedDoc.fileUrl}
                title={selectedDoc.documentName}
                className="w-full h-[500px] border-0"
              />
            )}
          </div>

          {/* Document Details */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-medium text-gray-700 mb-3">Document Details</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Uploaded By:</span>
                  <span className="font-medium">{selectedDoc.user?.fullName || 'N/A'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Uploaded At:</span>
                  <span className="font-medium">{formatDate(selectedDoc.createdAt)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">File Size:</span>
                  <span className="font-medium">
                    {(selectedDoc.fileSize / 1024).toFixed(1)} KB
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">File Type:</span>
                  <span className="font-medium">{selectedDoc.mimeType}</span>
                </div>
              </div>
            </div>

            {selectedDoc.user && (
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Uploader Information</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>{selectedDoc.user.fullName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>{selectedDoc.user.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{selectedDoc.user.phone}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Verification Actions */}
          {selectedDoc.status === 'pending' && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-medium text-gray-900 mb-4">Verify Document</h3>
              <div className="flex gap-3">
                <button
                  onClick={() => handleVerify(selectedDoc._id, 'verified')}
                  disabled={verifying === selectedDoc._id}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {verifying === selectedDoc._id ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4" />
                  )}
                  Approve Document
                </button>
                <button
                  onClick={() => {
                    const reason = prompt('Please enter rejection reason:');
                    if (reason) {
                      handleVerify(selectedDoc._id, 'rejected', reason);
                    }
                  }}
                  disabled={verifying === selectedDoc._id}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject Document
                </button>
              </div>
            </div>
          )}

          {selectedDoc.rejectionReason && (
            <div className="mt-6 p-4 bg-red-50 rounded-lg">
              <p className="text-sm text-red-700">
                <strong>Rejection Reason:</strong> {selectedDoc.rejectionReason}
              </p>
            </div>
          )}

          {selectedDoc.verifiedBy && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-green-700">
                <strong>Verified By:</strong> Admin on {formatDate(selectedDoc.verifiedAt)}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Document Verification
        </h1>
        <Link
          to="/admin/bookings"
          className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Bookings
        </Link>
      </div>

      {documents.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Documents Uploaded
          </h3>
          <p className="text-gray-600">
            This booking has no documents uploaded yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {documents.map((doc) => (
            <div
              key={doc._id}
              className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    {getFileIcon(doc.mimeType)}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {getDocumentTypeLabel(doc.documentType)}
                      </h3>
                      <p className="text-sm text-gray-600">{doc.documentName}</p>
                    </div>
                    {getStatusBadge(doc.status)}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    <span>Uploaded {formatDate(doc.createdAt)}</span>
                    <span>•</span>
                    <span>{(doc.fileSize / 1024).toFixed(1)} KB</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <a
                      href={doc.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View Document
                    </a>
                    <a
                      href={doc.fileUrl}
                      download
                      className="inline-flex items-center gap-1 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                    {doc.status === 'pending' && (
                      <button
                        onClick={() => setSelectedDoc(doc)}
                        className="inline-flex items-center gap-1 px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Verify
                      </button>
                    )}
                  </div>
                  {doc.rejectionReason && (
                    <div className="mt-4 p-3 bg-red-50 rounded-lg">
                      <p className="text-sm text-red-700">
                        <strong>Rejection Reason:</strong> {doc.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDocumentVerification;