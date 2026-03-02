// client/src/pages/Home.jsx (updated version - shows categories instead of services)
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { 
  Car, 
  FileText, 
  Award, 
  FolderOpen, 
  CreditCard,
  Home as HomeIcon,
  User,
  Briefcase,
  FileCheck,
  Shield,
  BookOpen,
  Clipboard,
  ArrowRight
} from 'lucide-react';

// Icon mapping for categories
const categoryIcons = {
  'rto': Car,
  'gst': Briefcase,
  'legal': FileCheck,
  'passport': FileText,
  'challan': CreditCard,
  'certificate': Award,
  'document': FolderOpen,
  'property': HomeIcon,
  'identity': User,
  'police': Shield,
  'education': BookOpen,
  'income': Clipboard,
  'other': FileText
};

// Category display names and descriptions
const categoryDetails = {
  'rto': {
    name: 'RTO Services',
    description: 'Driving licence, vehicle registration, RC transfer, and all RTO related services.',
    icon: Car
  },
  'gst': {
    name: 'GST & Tax Services',
    description: 'GST registration, return filing, amendments, and tax consultation.',
    icon: Briefcase
  },
  'legal': {
    name: 'Legal Documents',
    description: 'Marriage certificate, legal heir certificate, affidavits, and power of attorney.',
    icon: FileCheck
  },
  'passport': {
    name: 'Passport Services',
    description: 'New passport application, renewal, tatkal service, and police clearance.',
    icon: FileText
  },
  'challan': {
    name: 'Traffic Challan',
    description: 'Pay traffic challans online, check pending fines, and dispute assistance.',
    icon: CreditCard
  },
  'certificate': {
    name: 'Certificates',
    description: 'Birth, death, income, caste, and other government certificates.',
    icon: Award
  },
  'document': {
    name: 'Document Services',
    description: 'Document verification, attestation, and notary services.',
    icon: FolderOpen
  },
  'property': {
    name: 'Property Services',
    description: 'Property registration, mutation, and land record services.',
    icon: HomeIcon
  },
  'identity': {
    name: 'Identity Documents',
    description: 'Aadhaar, PAN card, voter ID, and ration card services.',
    icon: User
  },
  'police': {
    name: 'Police Services',
    description: 'Police clearance certificate, character verification, and NOCs.',
    icon: Shield
  },
  'education': {
    name: 'Education Documents',
    description: 'Degree verification, marksheet attestation, and education certificates.',
    icon: BookOpen
  },
  'income': {
    name: 'Income Certificates',
    description: 'Income certificate, EWS certificate, and domicile certificates.',
    icon: Clipboard
  },
  'other': {
    name: 'Other Services',
    description: 'Insurance, visa assistance, and other documentation services.',
    icon: FileText
  }
};

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const [trackingId, setTrackingId] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero slides data
  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600",
      title: "Fast & Reliable Doorstep Services",
      subtitle: "Expert assistance for RTO, Passport, and Legal Documents in Gurgaon."
    },
    {
      image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600",
      title: "Hassle-Free Documentation",
      subtitle: "We handle all the paperwork while you focus on what matters most."
    },
    {
      image: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=1600",
      title: "Expert Guidance at Every Step",
      subtitle: "Our experienced team ensures 100% accurate and timely processing."
    }
  ];

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await getCategories();
      
      if (response && response.success) {
        setCategories(response.categories || []);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (trackingId.trim()) {
      window.location.href = `/track/${trackingId}`;
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Get icon for category
  const getCategoryIcon = (categoryId) => {
    const Icon = categoryIcons[categoryId] || FileText;
    return Icon;
  };

  // Get category details
  const getCategoryDetails = (categoryId) => {
    return categoryDetails[categoryId] || {
      name: categoryId.replace(/-/g, ' ').toUpperCase(),
      description: 'Professional documentation services with expert assistance.',
      icon: FileText
    };
  };

  // Featured categories to show first (you can customize this order)
  const featuredOrder = ['rto', 'gst', 'legal', 'passport', 'challan', 'certificate', 'property', 'identity'];

  // Sort categories with featured ones first
  const sortedCategories = [...categories].sort((a, b) => {
    const indexA = featuredOrder.indexOf(a.id);
    const indexB = featuredOrder.indexOf(b.id);
    
    if (indexA === -1 && indexB === -1) return 0;
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading categories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 font-sans text-gray-900">
      {/* Hero Section with Image Slider */}
      <section className="relative h-[600px] overflow-hidden bg-black">
        {/* Slides */}
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`hero-slide absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'active opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={slide.image}
              className="w-full h-full object-cover opacity-60"
              alt={`Slide ${index + 1}`}
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg animate-fade-in">
                {slide.title}
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-2xl animate-fade-in-up">
                {slide.subtitle}
              </p>
              <div className="flex space-x-4 animate-fade-in-up">
                <a href="/services" className="bg-orange-600 hover:bg-orange-700 px-8 py-3 rounded-lg text-lg font-bold transition transform hover:scale-105">
                  Our Services
                </a>
                <Link to="/contact" className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-bold transition transform hover:scale-105">
                  Consult Now
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-12 h-12 rounded-full flex items-center justify-center transition z-20"
        >
          <i className="fas fa-chevron-left text-2xl"></i>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white w-12 h-12 rounded-full flex items-center justify-center transition z-20"
        >
          <i className="fas fa-chevron-right text-2xl"></i>
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentSlide
                  ? 'bg-orange-600 w-8'
                  : 'bg-white/50 hover:bg-white'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Categories Section - Using same design as original service cards */}
      <section id="categories" className="py-20 container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-extrabold text-gray-900 mb-4">What We Do</h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg">We simplify government documentation across multiple categories so you can focus on what matters most.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {sortedCategories.map((category) => {
            const details = getCategoryDetails(category.id);
            const Icon = getCategoryIcon(category.id);
            
            return (
              <Link 
                key={category.id}
                to={`/services/category/${category.id}`} 
                className="service-card bg-white p-10 rounded-2xl shadow-sm hover:shadow-2xl transition border border-gray-100 block text-center"
              >
                <div className="service-icon w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                  <Icon className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800">{details.name}</h3>
                <p className="text-gray-600 mb-6">
                  {details.description}
                </p>
                <div className="flex items-center justify-center gap-2 text-blue-600 font-bold">
                  <span> Explore {details.name}</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* View All Categories Button */}
        <div className="text-center mt-12">
          <Link 
            to="/services" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all duration-300 hover:shadow-lg"
          >
            View All Services
            <i className="fas fa-arrow-right ml-2"></i>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="py-20 bg-blue-50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust us with their documentation needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register" 
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-bold transition"
              >
                Create Account
              </Link>
              <Link 
                to="/login" 
                className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-3 rounded-lg font-bold transition"
              >
                Login
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Logged-in User Section */}
      {isAuthenticated && (
        <section className="py-20 bg-blue-50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome back, {user?.fullName || 'User'}!</h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Continue tracking your applications or book new services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/dashboard" 
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-bold transition"
              >
                Go to Dashboard
              </Link>
              <Link 
                to="/services" 
                className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-3 rounded-lg font-bold transition"
              >
                Browse Services
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;