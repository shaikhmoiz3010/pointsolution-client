// client/src/components/ServiceCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Car, 
  FileText, 
  Award, 
  FolderOpen, 
  CreditCard,
  Home,
  User,
  Briefcase,
  FileCheck,
  Shield,
  BookOpen,
  Clipboard,
  ClipboardList,
  FileText as DefaultIcon
} from 'lucide-react';

const getServiceIcon = (service) => {
  const name = service.name?.toLowerCase() || '';
  const category = service.category?.toLowerCase() || '';

  // Category-level checks first (most reliable)
  if (category === 'licenses') return Car;
  if (category === 'registration-certificate') return ClipboardList;
  if (category === 'gst') return Briefcase;
  if (category === 'challan') return CreditCard;
  if (category === 'passport') return FileText;
  if (category === 'legal') return FileCheck;
  if (category === 'insurance') return Shield;
  if (category === 'pan-card') return CreditCard;

  // Name-level fallback checks
  if (name.includes('vehicle') || name.includes('driving') || name.includes('licence') || name.includes('license')) {
    return Car;
  }
  if (name.includes('registration') || name.includes('rc') || name.includes('hypothecation')) {
    return ClipboardList;
  }
  if (name.includes('passport')) return FileText;
  if (name.includes('certificate') || name.includes('birth') || name.includes('marriage') || name.includes('death')) {
    return Award;
  }
  if (name.includes('document') || name.includes('verification') || name.includes('attestation')) {
    return FolderOpen;
  }
  if (name.includes('pan') || name.includes('aadhaar') || name.includes('challan')) {
    return CreditCard;
  }
  if (name.includes('insurance') || name.includes('health') || name.includes('life insurance')) {
    return Shield;
  }
  if (name.includes('property') || name.includes('land') || name.includes('rental')) {
    return Home;
  }
  if (name.includes('identity') || name.includes('voter') || name.includes('ration')) {
    return User;
  }
  if (name.includes('business') || name.includes('gst') || name.includes('company')) {
    return Briefcase;
  }
  if (name.includes('legal') || name.includes('affidavit') || name.includes('power of attorney')) {
    return FileCheck;
  }
  if (name.includes('police') || name.includes('clearance')) {
    return Shield;
  }
  if (name.includes('education') || name.includes('degree') || name.includes('marksheet')) {
    return BookOpen;
  }
  if (name.includes('income') || name.includes('caste') || name.includes('ews')) {
    return Clipboard;
  }

  return DefaultIcon;
};

const getServiceItems = (service) => {
  if (service.features && Array.isArray(service.features) && service.features.length > 0) {
    return service.features.slice(0, 4);
  }
  return [];
};

const ServiceCard = ({ service }) => {
  const Icon = getServiceIcon(service);
  const serviceItems = getServiceItems(service);

  return (
    <div className="bg-white p-6 border-2 border-gray-200 rounded-lg hover:shadow-xl hover:border-gray-300 transition-all duration-300 group">
      <div className="flex items-start gap-4">
        {/* Icon Container */}
        {/* <div className="flex-shrink-0">
          <div className="bg-gray-100 p-3 rounded-lg group-hover:bg-orange-500 transition-colors duration-300">
            <Icon className="w-6 h-6 text-gray-700 group-hover:text-white" />
          </div>
        </div> */}
        {/* Content */}
        <div className="flex-1">
          {/* Category Badge */}
          {service.category && (
            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded mb-2">
              {service.category.replace(/-/g, ' ').toUpperCase()}
            </span>

          )}

          {/* Service Title */}
          <h3 className="text-xl font-bold text-blue-500 mb-2 group-hover:text-blue-800">
            {service.name}
          </h3>

          {/* Service Description */}
          <p className="text-black text-sm mb-4 line-clamp-2">
            {service.description || 'Professional documentation service with expert assistance.'}
          </p>

          {/* Service Features */}
          <ul className="space-y-1.5 mb-4">
            {serviceItems.map((item, index) => (
              <li key={index} className="text-sm text-gray-500 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0"></div>
                <span className="line-clamp-1">{item}</span>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <Link
                to={`/service/${service._id || service.name.toLowerCase().replace(/\s+/g, '-')}`}
                className="inline-flex items-center text-gray-700 hover:text-gray-900 font-medium text-sm underline group/link"
              >
                Learn More
                <svg 
                  className="w-4 h-4 ml-1 transform group-hover/link:translate-x-1 transition-transform" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;