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
  FileText as DefaultIcon
} from 'lucide-react';

// Icon mapping for different service categories
const getServiceIcon = (service) => {
  const name = service.name?.toLowerCase() || '';
  const category = service.category?.toLowerCase() || '';

  if (name.includes('vehicle') || name.includes('rto') || name.includes('driving') || name.includes('license')) {
    return Car;
  }
  if (name.includes('passport')) {
    return FileText;
  }
  if (name.includes('certificate') || name.includes('birth') || name.includes('marriage') || name.includes('death')) {
    return Award;
  }
  if (name.includes('document') || name.includes('verification') || name.includes('attestation')) {
    return FolderOpen;
  }
  if (name.includes('pan') || name.includes('aadhaar')) {
    return CreditCard;
  }
  if (name.includes('property') || name.includes('land') || name.includes('mutatio')) {
    return Home;
  }
  if (name.includes('identity') || name.includes('voter') || name.includes('ration') || name.includes('id')) {
    return User;
  }
  if (name.includes('business') || name.includes('gst') || name.includes('company') || name.includes('registration')) {
    return Briefcase;
  }
  if (name.includes('legal') || name.includes('affidavit') || name.includes('power of attorney') || name.includes('agreement')) {
    return FileCheck;
  }
  if (name.includes('police') || name.includes('clearance') || name.includes('verification')) {
    return Shield;
  }
  if (name.includes('education') || name.includes('degree') || name.includes('marksheet') || name.includes('educational')) {
    return BookOpen;
  }
  if (name.includes('income') || name.includes('caste') || name.includes('ews') || name.includes('obc')) {
    return Clipboard;
  }

  // Fallback based on category
  if (category.includes('rto')) return Car;
  if (category.includes('passport')) return FileText;
  if (category.includes('certificate')) return Award;
  if (category.includes('document')) return FolderOpen;
  if (category.includes('pan')) return CreditCard;
  if (category.includes('property')) return Home;
  if (category.includes('identity')) return User;
  if (category.includes('business')) return Briefcase;
  if (category.includes('legal')) return FileCheck;
  if (category.includes('police')) return Shield;
  if (category.includes('education')) return BookOpen;
  if (category.includes('income')) return Clipboard;

  return DefaultIcon;
};

// Get service features/items for the bullet points
const getServiceItems = (service) => {
  // If service has features array, use them
  if (service.features && Array.isArray(service.features) && service.features.length > 0) {
    return service.features.slice(0, 4);
  }

  // Default features based on category
  const defaultItems = [
    "Expert Assistance",
    "Document Verification",
    "Fast Processing",
    "Government Approved"
  ];

  return defaultItems;
};

const ServiceCard = ({ service }) => {
  const Icon = getServiceIcon(service);
  const serviceItems = getServiceItems(service);

  return (
    <div className="bg-white p-6 border-2 border-gray-200 rounded-lg hover:shadow-xl hover:border-gray-300 transition-all duration-300 group">
      <div className="flex items-start gap-4">
        {/* Icon Container */}
        <div className="flex-shrink-0">
          <div className="bg-gray-100 p-3 rounded-lg group-hover:bg-gray-700 transition-colors duration-300">
            <Icon className="w-6 h-6 text-gray-700 group-hover:text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {/* Category Badge */}
          {service.category && (
            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded mb-2">
              {service.category.replace(/-/g, ' ').toUpperCase()}
            </span>
          )}

          {/* Service Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-800">
            {service.name}
          </h3>

          {/* Service Description */}
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {service.description || 'Professional documentation service with expert assistance.'}
          </p>

          {/* Service Features (Bullet Points) */}
          <ul className="space-y-1.5 mb-4">
            {serviceItems.map((item, index) => (
              <li key={index} className="text-sm text-gray-500 flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full flex-shrink-0"></div>
                <span className="line-clamp-1">{item}</span>
              </li>
            ))}
          </ul>

          {/* Price and CTA */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              {/* Price */}
              <div>
                {service.fee || service.price ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-gray-900">
                      ₹{service.fee || service.price}
                    </span>
                    <span className="text-sm text-gray-500">starting</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">Price on inquiry</span>
                )}
                
                {/* Processing Time */}
                {service.processingTime && (
                  <div className="flex items-center gap-1 mt-1">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs text-gray-500">{service.processingTime}</span>
                  </div>
                )}
              </div>

              {/* CTA Button */}
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