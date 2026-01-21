// client/src/pages/Services.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, FileText } from 'lucide-react';
import { getAllServices, getCategories } from '../utils/api';

// Icon mapping for different service categories
const iconMapping = {
  'rto': Car,
  'passport': FileText,
  'certificate': Award,
  'document': FolderOpen,
  'pan': CreditCard,
  'property': Home,
  'identity': User,
  'business': Briefcase,
  'legal': FileCheck,
  'police': Shield,
  'education': BookOpen,
  'income': Clipboard,
  'default': FileText
};

// Import icons from lucide-react
import {
  Car, 
  FileText as FileTextIcon, 
  Award, 
  FolderOpen, 
  CreditCard,
  Home,
  User,
  Briefcase,
  FileCheck,
  Shield,
  BookOpen,
  Clipboard
} from 'lucide-react';

const Services = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [filteredServices, setFilteredServices] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterServices();
  }, [selectedCategory, searchQuery, services]);

  const fetchData = async () => {
    try {
      const [servicesResponse, categoriesResponse] = await Promise.all([
        getAllServices(),
        getCategories()
      ]);

      if (servicesResponse.success) {
        // Flatten the services object into an array
        const allServices = Object.values(servicesResponse.services).flat();
        setServices(allServices);
        setFilteredServices(allServices);
      }

      if (categoriesResponse.success) {
        setCategories(categoriesResponse.categories);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = [...services];

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => 
        service.category && service.category.toLowerCase().includes(selectedCategory.toLowerCase())
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (service.description && service.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setFilteredServices(filtered);
  };

  const getIconForService = (service) => {
    const category = service.category ? service.category.toLowerCase() : 'default';
    
    // Check for specific keywords in service name
    const serviceName = service.name.toLowerCase();
    
    if (serviceName.includes('vehicle') || serviceName.includes('rt0') || serviceName.includes('driving') || serviceName.includes('license')) {
      return Car;
    }
    if (serviceName.includes('passport')) {
      return FileTextIcon;
    }
    if (serviceName.includes('certificate') || serviceName.includes('birth') || serviceName.includes('marriage')) {
      return Award;
    }
    if (serviceName.includes('document') || serviceName.includes('verification')) {
      return FolderOpen;
    }
    if (serviceName.includes('pan') || serviceName.includes('aadhaar')) {
      return CreditCard;
    }
    if (serviceName.includes('property') || serviceName.includes('land')) {
      return Home;
    }
    if (serviceName.includes('identity') || serviceName.includes('voter') || serviceName.includes('ration')) {
      return User;
    }
    if (serviceName.includes('business') || serviceName.includes('gst') || serviceName.includes('company')) {
      return Briefcase;
    }
    if (serviceName.includes('legal') || serviceName.includes('affidavit') || serviceName.includes('power of attorney')) {
      return FileCheck;
    }
    if (serviceName.includes('police') || serviceName.includes('clearance')) {
      return Shield;
    }
    if (serviceName.includes('education') || serviceName.includes('degree') || serviceName.includes('marksheet')) {
      return BookOpen;
    }
    if (serviceName.includes('income') || serviceName.includes('caste') || serviceName.includes('certificate')) {
      return Clipboard;
    }
    
    // Fallback to category mapping
    const iconKey = Object.keys(iconMapping).find(key => category.includes(key));
    return iconMapping[iconKey] || FileText;
  };

  const getCategoryName = (categoryId) => {
    if (!categoryId) return 'General';
    const category = categories.find(cat => cat._id === categoryId);
    return category ? category._id.replace(/-/g, ' ').toUpperCase() : categoryId;
  };

  const getServiceItems = (service) => {
    // You can customize this based on your service data
    const defaultItems = [
      "Expert Assistance",
      "Document Verification",
      "Fast Processing",
      "Government Approved"
    ];

    // If service has features array, use them
    if (service.features && Array.isArray(service.features) && service.features.length > 0) {
      return service.features.slice(0, 4); // Show first 4 features
    }

    return defaultItems;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm">
            Our Services
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Comprehensive Documentation Solutions
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We provide end-to-end assistance for all government-related paperwork, making your documentation journey smooth and hassle-free.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-gray-300 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Categories Filter */}
        {categories.length > 0 && (
          <div className="mb-12">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-5 py-2.5 rounded-full border-2 font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-gray-800 text-white border-gray-800'
                    : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                All Services ({services.length})
              </button>
              
              {categories.map((category) => (
                <button
                  key={category._id}
                  onClick={() => setSelectedCategory(category._id)}
                  className={`px-5 py-2.5 rounded-full border-2 font-medium transition-all ${
                    selectedCategory === category._id
                      ? 'bg-gray-800 text-white border-gray-800'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {getCategoryName(category._id)} ({category.count || 0})
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading services...</p>
          </div>
        ) : (
          <>
            {/* Services Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.length > 0 ? (
                filteredServices.map((service, index) => {
                  const Icon = getIconForService(service);
                  const serviceItems = getServiceItems(service);
                  
                  return (
                    <div key={service._id || index} className="bg-white p-6 border-2 border-gray-200 rounded-lg hover:shadow-xl hover:border-gray-300 transition-all duration-300 group">
                      <div className="flex items-start gap-4">
                        <div className="bg-gray-100 p-3 rounded-lg group-hover:bg-gray-700 transition-colors duration-300">
                          <Icon className="w-6 h-6 text-gray-700 group-hover:text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                          <p className="text-gray-600 text-sm mb-4">
                            {service.description || 'Professional documentation service'}
                          </p>
                          
                          {/* Show category */}
                          {service.category && (
                            <div className="mb-3">
                              <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded">
                                {getCategoryName(service.category)}
                              </span>
                            </div>
                          )}

                          {/* Service features */}
                          <ul className="space-y-1">
                            {serviceItems.map((item, idx) => (
                              <li key={idx} className="text-sm text-gray-500 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                                {item}
                              </li>
                            ))}
                          </ul>

                          {/* Price and CTA */}
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex justify-between items-center">
                              <div>
                                {service.price ? (
                                  <>
                                    <span className="text-lg font-bold text-gray-900">
                                      ₹{service.price}
                                    </span>
                                    <span className="text-sm text-gray-500 ml-1">starting</span>
                                  </>
                                ) : (
                                  <span className="text-sm text-gray-500">Price on inquiry</span>
                                )}
                              </div>
                              <Link
                                to={`/service/${service._id || service.name.toLowerCase().replace(/\s+/g, '-')}`}
                                className="text-gray-700 hover:text-gray-900 font-medium text-sm underline"
                              >
                                Learn More →
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-gray-600 mb-2">
                    No services found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Try adjusting your search or filter to find what you're looking for.
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory('all');
                      setSearchQuery('');
                    }}
                    className="text-gray-700 hover:text-gray-900 font-medium underline"
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Coming Soon Section */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 rounded-full px-4 py-2 mb-4">
            <span className="text-yellow-700">🚀</span>
            <span className="text-yellow-700 text-sm font-medium">More Services Coming Soon!</span>
          </div>
          <p className="text-gray-600 mb-4">
            Don't see what you're looking for? We handle many more documentation services!
          </p>
          <Link
            to="/contact"
            className="text-gray-700 hover:text-gray-900 font-semibold underline"
          >
            Contact us for custom requirements
          </Link>
        </div>

        {/* Service Count */}
        {filteredServices.length > 0 && (
          <div className="mt-8 text-center text-gray-500 text-sm">
            Showing {filteredServices.length} of {services.length} services
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;