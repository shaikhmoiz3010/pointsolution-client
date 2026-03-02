import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { 
  Upload, 
  X, 
  FileText, 
  Image, 
  File, 
  CheckCircle, 
  AlertCircle,
  Loader,
  Eye,
  Trash2
} from 'lucide-react';
import { uploadDocument } from '../utils/documentApi';

const DocumentUploader = ({ 
  bookingId, 
  documentType, 
  onUploadComplete, 
  onUploadError,
  maxSize = 10 * 1024 * 1024, // 10MB default
  acceptedFileTypes = {
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'application/pdf': ['.pdf'],
    'application/msword': ['.doc'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
  }
}) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [error, setError] = useState('');

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      if (error.code === 'file-too-large') {
        setError(`File too large. Max size: ${maxSize / (1024 * 1024)}MB`);
      } else if (error.code === 'file-invalid-type') {
        setError('Invalid file type. Please upload PDF, images, or documents.');
      } else {
        setError(error.message);
      }
      if (onUploadError) onUploadError(error);
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setError('');

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('bookingId', bookingId);
      formData.append('documentType', documentType);

      const response = await uploadDocument(formData);

      clearInterval(interval);
      setProgress(100);

      if (response.success) {
        setUploadedFile(response.document);
        if (onUploadComplete) {
          onUploadComplete(response.document);
        }
      } else {
        setError(response.message || 'Upload failed');
        if (onUploadError) onUploadError(new Error(response.message));
      }
    } catch (err) {
      clearInterval(interval);
      setError(err.message || 'Upload failed');
      if (onUploadError) onUploadError(err);
    } finally {
      setUploading(false);
      setTimeout(() => setProgress(0), 1000);
    }
  }, [bookingId, documentType, onUploadComplete, onUploadError, maxSize]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedFileTypes,
    maxSize,
    multiple: false
  });

  const getFileIcon = (mimeType) => {
    if (mimeType?.startsWith('image/')) return <Image className="w-5 h-5" />;
    if (mimeType === 'application/pdf') return <FileText className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
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

  if (uploadedFile) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              {getFileIcon(uploadedFile.mimeType)}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-medium text-gray-900 truncate">
                  {uploadedFile.documentName}
                </p>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                  <span>{formatFileSize(uploadedFile.fileSize)}</span>
                  <span>•</span>
                  <span className="capitalize">{uploadedFile.mimeType.split('/')[1]}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={uploadedFile.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="View Document"
                >
                  <Eye className="w-4 h-4" />
                </a>
              </div>
            </div>
            <div className="mt-2">
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                <CheckCircle className="w-3 h-3" />
                Uploaded Successfully
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-sm font-medium text-gray-700">
        {getDocumentTypeLabel(documentType)}
      </div>

      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
          transition-colors duration-200
          ${isDragActive 
            ? 'border-blue-400 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }
          ${error ? 'border-red-300 bg-red-50' : ''}
        `}
      >
        <input {...getInputProps()} />
        
        <div className="space-y-2">
          {uploading ? (
            <>
              <Loader className="w-8 h-8 mx-auto text-blue-600 animate-spin" />
              <p className="text-sm text-gray-600">
                Uploading... {progress}%
              </p>
              {progress > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </>
          ) : (
            <>
              <Upload className="w-8 h-8 mx-auto text-gray-400" />
              <p className="text-sm text-gray-600">
                {isDragActive
                  ? 'Drop the file here'
                  : 'Drag & drop a file here, or click to select'
                }
              </p>
              <p className="text-xs text-gray-500">
                Supported formats: PDF, Images (JPG, PNG), Word Documents
                <br />
                Max size: {maxSize / (1024 * 1024)}MB
              </p>
            </>
          )}
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-lg">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default DocumentUploader;