import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Image, 
  File, 
  CheckCircle, 
  XCircle, 
  Clock,
  Eye,
  Download,
  Trash2,
  AlertCircle,
  Loader
} from 'lucide-react';
import { getBookingDocuments, deleteDocument } from '../utils/documentApi';

const DocumentList = ({ bookingId, onDocumentDeleted, onDocumentClick }) => {
  const [documents, setDocuments] = useState([]);
  const [groupedDocs, setGroupedDocs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchDocuments();
  }, [bookingId]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await getBookingDocuments(bookingId);
      
      if (response.success) {
        setDocuments(response.documents);
        setGroupedDocs(response.grouped || {});
      } else {
        setError(response.message || 'Failed to fetch documents');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch documents');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    setDeleting(documentId);
    try {
      const response = await deleteDocument(documentId);
      
      if (response.success) {
        await fetchDocuments();
        if (onDocumentDeleted) onDocumentDeleted(documentId);
      } else {
        alert(response.message || 'Failed to delete document');
      }
    } catch (err) {
      alert(err.message || 'Failed to delete document');
    } finally {
      setDeleting(null);
    }
  };

  const getFileIcon = (mimeType) => {
    if (mimeType?.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (mimeType === 'application/pdf') return <FileText className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
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

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-3" />
        <p className="text-gray-600">Loading documents...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
        <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
        <h3 className="text-lg font-medium text-gray-900 mb-1">
          No Documents Uploaded
        </h3>
        <p className="text-gray-600">
          Upload required documents to proceed with your application
        </p>
      </div>
    );
  }

  // If grouped by type
  if (Object.keys(groupedDocs).length > 0) {
    return (
      <div className="space-y-6">
        {Object.entries(groupedDocs).map(([type, docs]) => (
          <div key={type} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
              <h4 className="font-medium text-gray-900">
                {getDocumentTypeLabel(type)}
              </h4>
            </div>
            <div className="divide-y divide-gray-200">
              {docs.map((doc) => (
                <div key={doc._id} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        {getFileIcon(doc.mimeType)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900 truncate">
                            {doc.documentName}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                            <span>{formatFileSize(doc.fileSize)}</span>
                            <span>•</span>
                            <span>Uploaded {formatDate(doc.createdAt)}</span>
                          </div>
                          {doc.rejectionReason && (
                            <p className="text-sm text-red-600 mt-2">
                              Rejection reason: {doc.rejectionReason}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(doc.status)}
                              {doc.status.toUpperCase()}
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </a>
                        <a
                          href={doc.fileUrl}
                          download
                          className="inline-flex items-center gap-1 px-3 py-1 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors text-sm"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </a>
                        <button
                          onClick={() => handleDelete(doc._id)}
                          disabled={deleting === doc._id}
                          className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm disabled:opacity-50"
                        >
                          {deleting === doc._id ? (
                            <Loader className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Flat list fallback
  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <div key={doc._id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                {getFileIcon(doc.mimeType)}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900 truncate">
                    {doc.documentName}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    {getDocumentTypeLabel(doc.documentType)}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(doc.status)}`}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(doc.status)}
                    {doc.status.toUpperCase()}
                  </span>
                </span>
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span>{formatFileSize(doc.fileSize)}</span>
                <span>•</span>
                <span>{formatDate(doc.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <a
                  href={doc.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  View
                </a>
                <a
                  href={doc.fileUrl}
                  download
                  className="inline-flex items-center gap-1 px-3 py-1 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
                <button
                  onClick={() => handleDelete(doc._id)}
                  disabled={deleting === doc._id}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                >
                  {deleting === doc._id ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                  Delete
                </button>
              </div>
              {doc.rejectionReason && (
                <div className="mt-3 p-2 bg-red-50 rounded-lg text-sm text-red-600">
                  <strong>Rejected:</strong> {doc.rejectionReason}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DocumentList;