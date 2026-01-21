import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';
import { getServicesByCategory } from '../utils/api';
import { ArrowLeft, CheckCircle, FileText, Shield, Clock, Users } from 'lucide-react';
// Import icons
import {
  Car,
  Award,
  FolderOpen,
  CreditCard,
  HomeIcon,
  User,
  Briefcase,
  FileCheck,
  BookOpen,
  Clipboard
} from 'lucide-react';

const ServiceCategory = () => {
  const { category } = useParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategoryServices();
  }, [category]);

  const fetchCategoryServices = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await getServicesByCategory(category);

      if (response.success) {
        setServices(response.services || []);
      } else {
        setError(response.message || 'No services found in this category');
      }
    } catch (error) {
      console.error('Failed to fetch category:', error);
      setError(error.response?.data?.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  // Format category name for display
  const formatCategoryName = (cat) => {
    if (!cat) return '';
    return cat
      .replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const categoryName = formatCategoryName(category);

  // Get icon based on category
  const getCategoryIcon = () => {
    const cat = category?.toLowerCase() || '';

    if (cat.includes('rto')) return Car;
    if (cat.includes('passport')) return FileText;
    if (cat.includes('certificate')) return Award;
    if (cat.includes('document')) return FolderOpen;
    if (cat.includes('pan')) return CreditCard;
    if (cat.includes('property')) return HomeIcon;
    if (cat.includes('identity')) return User;
    if (cat.includes('business')) return Briefcase;
    if (cat.includes('legal')) return FileCheck;
    if (cat.includes('police')) return Shield;
    if (cat.includes('education')) return BookOpen;
    if (cat.includes('income')) return Clipboard;

    return FileText;
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading {categoryName} services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-8 max-w-lg mx-auto text-center">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Services</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              to="/services"
              className="inline-flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-semibold transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to All Services
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const CategoryIcon = getCategoryIcon();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white pt-32 pb-20">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-8">
          <nav className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900 transition-colors">Home</Link>
            <ArrowLeft className="w-4 h-4 mx-2 rotate-180" />
            <Link to="/services" className="hover:text-gray-900 transition-colors">Services</Link>
            <ArrowLeft className="w-4 h-4 mx-2 rotate-180" />
            <span className="text-gray-900 font-medium">{categoryName}</span>
          </nav>
        </div>

        {/* Category Header */}
        <div className="mb-12">
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                <CategoryIcon className="w-8 h-8 text-gray-700" />
              </div>
              <div>
                <div className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm mb-2">
                  Category
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  {categoryName} Services
                </h1>
              </div>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Browse our comprehensive {categoryName.toLowerCase()} documentation solutions
            </p>
          </div>
        </div>

        {/* Category Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">{services.length}</div>
            <div className="text-sm text-gray-600">Available Services</div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">24/7</div>
            <div className="text-sm text-gray-600">Support Available</div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">99%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-gray-900 mb-1">5+</div>
            <div className="text-sm text-gray-600">Years Experience</div>
          </div>
        </div>

        {/* Services Grid */}
        {services.length === 0 ? (
          <div className="bg-white border-2 border-gray-200 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No services found
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              There are no services available in this category at the moment. Check back soon or explore other categories.
            </p>
            <Link
              to="/services"
              className="inline-flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-semibold transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Browse All Services
            </Link>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {services.map((service, index) => (
                <ServiceCard key={index} service={service} />
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                to="/services"
                className="inline-flex items-center px-6 py-3 border-2 border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                View All Categories
              </Link>
            </div>
          </>
        )}

        {/* Category Information Section */}
        <div className="mt-16">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Category Details */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6">
                  About {categoryName} Services
                </h3>
                <div className="text-gray-600 space-y-4">
                  <p>
                    Our {categoryName.toLowerCase()} services are designed to simplify complex government procedures and documentation requirements.
                    We provide end-to-end assistance, ensuring accuracy and compliance at every step.
                  </p>
                  <p>
                    With years of experience and a team of dedicated professionals, we make the entire process seamless,
                    transparent, and hassle-free for our clients.
                  </p>
                </div>

                {/* Key Benefits */}
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Benefits</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-green-600 mt-0.5" />
                      <span className="text-gray-600">100% legitimate & government-approved procedures</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-green-600 mt-0.5" />
                      <span className="text-gray-600">Fast processing with regular updates</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-green-600 mt-0.5" />
                      <span className="text-gray-600">Expert guidance throughout the process</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                      <span className="text-gray-600">Transparent pricing with no hidden charges</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Common Requirements */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Common Requirements</h4>
                <div className="bg-gray-50 rounded-lg p-6">
                  <ul className="space-y-3">
                    {[
                      'Aadhaar Card (original & copy)',
                      'PAN Card (original & copy)',
                      'Address Proof (utility bill/rent agreement)',
                      'Passport-sized photographs',
                      'Age Proof (birth certificate/10th marksheet)',
                      'Previous related documents (if any)',
                      'Other category-specific documents'
                    ].map((req, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{req}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="text-sm text-gray-500">
                      *Required documents may vary based on specific service requirements.
                      Our team will guide you through exact documentation needs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">
              Need Help with {categoryName} Documentation?
            </h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Our experts are here to guide you through the entire process. Contact us for personalized assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="#contact"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Contact Support
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Explore Other Categories
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCategory;