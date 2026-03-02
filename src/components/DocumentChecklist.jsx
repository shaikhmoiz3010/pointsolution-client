import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, FileText, Clock, Shield } from 'lucide-react';
import { getRequiredDocumentTypes } from '../utils/documentApi';

const DocumentChecklist = ({ bookingId }) => {
  const [checklist, setChecklist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchChecklist();
  }, [bookingId]);

  const fetchChecklist = async () => {
    try {
      setLoading(true);
      const response = await getRequiredDocumentTypes(bookingId);
      
      if (response.success) {
        setChecklist(response.checklist || []);
      } else {
        setError(response.message || 'Failed to fetch document checklist');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch document checklist');
    } finally {
      setLoading(false);
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

  const getStatusConfig = (item) => {
    if (!item.uploaded) {
      return {
        icon: AlertCircle,
        text: 'Not Uploaded',
        color: 'text-gray-500',
        bg: 'bg-gray-100',
        iconColor: 'text-gray-400',
        border: 'border-gray-200'
      };
    }
    if (item.status === 'verified') {
      return {
        icon: CheckCircle,
        text: 'Verified',
        color: 'text-emerald-700',
        bg: 'bg-emerald-100',
        iconColor: 'text-emerald-600',
        border: 'border-emerald-200'
      };
    }
    if (item.status === 'rejected') {
      return {
        icon: XCircle,
        text: 'Rejected',
        color: 'text-rose-700',
        bg: 'bg-rose-100',
        iconColor: 'text-rose-600',
        border: 'border-rose-200'
      };
    }
    return {
      icon: Clock,
      text: 'Pending Verification',
      color: 'text-amber-700',
      bg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      border: 'border-amber-200'
    };
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-blue-200 rounded-full"></div>
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-gray-600 mt-4 font-medium">Loading checklist...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-rose-50 to-red-50 rounded-xl border border-rose-200 p-6">
        <div className="flex items-start gap-3">
          <div className="bg-rose-100 p-2 rounded-lg">
            <XCircle className="w-5 h-5 text-rose-600" />
          </div>
          <div>
            <h4 className="font-semibold text-rose-800 mb-1">Error Loading Checklist</h4>
            <p className="text-rose-600 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (checklist.length === 0) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border-2 border-dashed border-blue-200 p-8 text-center">
        <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm">
          <FileText className="w-8 h-8 text-blue-500" />
        </div>
        <h4 className="text-lg font-semibold text-gray-800 mb-2">No Documents Required</h4>
        <p className="text-gray-600 mb-3">This service doesn't require any specific documents</p>
        <p className="text-sm text-gray-500 bg-white/50 p-3 rounded-lg inline-block">
          You can still upload any supporting documents if needed
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header with Gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 py-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h4 className="font-semibold text-white flex items-center gap-2">
            <div className="bg-white/20 p-1.5 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            Required Documents Checklist
          </h4>
          <div className="flex items-center gap-2 text-xs bg-white/20 text-white px-3 py-1.5 rounded-full">
            <Shield className="w-3 h-3" />
            <span>{checklist.length} document{checklist.length !== 1 ? 's' : ''} required</span>
          </div>
        </div>
      </div>

      {/* Checklist Items */}
      <div className="divide-y divide-gray-100">
        {checklist.map((item, index) => {
          const status = getStatusConfig(item);
          const StatusIcon = status.icon;
          
          return (
            <div 
              key={index} 
              className="px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50/30 transition-all duration-200"
            >
              {/* Document Type */}
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${status.bg} flex items-center justify-center flex-shrink-0`}>
                  <FileText className={`w-4 h-4 ${status.iconColor}`} />
                </div>
                <span className="font-medium text-gray-800">
                  {getDocumentTypeLabel(item.type)}
                </span>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between sm:justify-end gap-3 ml-11 sm:ml-0">
                <span className={`text-sm font-medium px-3 py-1.5 rounded-full ${status.bg} ${status.color} border ${status.border}`}>
                  {status.text}
                </span>
                <StatusIcon className={`w-5 h-5 ${status.iconColor} flex-shrink-0`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Note */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50/50 px-4 sm:px-6 py-3 border-t border-gray-100">
        <p className="text-xs text-gray-600 flex items-center gap-2">
          <Shield className="w-3 h-3 text-blue-500" />
          All documents are securely stored and encrypted
        </p>
      </div>
    </div>
  );
};

export default DocumentChecklist;