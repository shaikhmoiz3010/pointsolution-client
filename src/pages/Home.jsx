// client/src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight } from 'lucide-react';

// High-quality Unsplash images for each category
const categoryImages = {
  'licenses':
    'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=600&q=80',
  'registration-certificate':
    'https://images.unsplash.com/photo-1568667256531-9a5a9700b4d1?auto=format&fit=crop&w=600&q=80',
  'gst':
    'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
  'legal':
    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
  'passport':
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=600&q=80',
  'challan':
    'https://daily.jstor.org/wp-content/uploads/2016/02/iStock_000060131960_Medium.jpg',
  'insurance':
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80',
  'pan-card':
    'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=600&q=80',
  'certificate':
    'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=600&q=80',
  'document':
    'https://images.unsplash.com/photo-1568667256531-9a5a9700b4d1?auto=format&fit=crop&w=600&q=80',
  'property':
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80',
  'identity':
    'https://images.unsplash.com/photo-1607863680198-23d4b2565df0?auto=format&fit=crop&w=600&q=80',
  'other':
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80'
};

// Category display names and descriptions
const categoryDetails = {
  'licenses': {
    name: 'Driving Licences',
    description: 'Learner, permanent, renewal, duplicate, address change, and international permit.'
  },
  'registration-certificate': {
    name: 'Registration Certificate',
    description: 'New vehicle registration, ownership transfer, duplicate RC, and RC renewal.'
  },
  'gst': {
    name: 'GST & Tax Services',
    description: 'GST registration, return filing, ITR filing, calculation, invoices, and legal aid.'
  },
  'legal': {
    name: 'Legal Documents',
    description: 'Marriage certificate, legal heir certificate, affidavits, and power of attorney.'
  },
  'passport': {
    name: 'Passport Services',
    description: 'New passport, renewal, tatkal service, and police clearance certificate.'
  },
  'challan': {
    name: 'Traffic Challan',
    description: 'Pay traffic challans online, check pending fines, and dispute assistance.'
  },
  'insurance': {
    name: 'Insurance Services',
    description: 'Vehicle, health, and life insurance plans plus claim assistance.'
  },
  'pan-card': {
    name: 'PAN Card Services',
    description: 'New PAN application, corrections, duplicate PAN, and PAN-Aadhaar linking.'
  },
  'certificate': {
    name: 'Certificates',
    description: 'Birth, death, income, caste, and other government certificates.'
  },
  'document': {
    name: 'Document Services',
    description: 'Document verification, attestation, and notary services.'
  },
  'property': {
    name: 'Property Services',
    description: 'Property registration, mutation, and land record services.'
  },
  'identity': {
    name: 'Identity Documents',
    description: 'Aadhaar, voter ID, and ration card services.'
  },
  'other': {
    name: 'Other Services',
    description: 'Additional documentation and assistance services.'
  }
};

const getCategoryDetails = (categoryId) => {
  return (
    categoryDetails[categoryId] || {
      name: categoryId
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      description: 'Professional documentation services with expert assistance.'
    }
  );
};

const getCategoryImage = (categoryId) => {
  return (
    categoryImages[categoryId] ||
    'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80'
  );
};

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      image:
        'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1600',
      title: 'Fast & Reliable Doorstep Services',
      subtitle: 'Expert assistance for RTO, Passport, and Legal Documents in Gurgaon.'
    },
    {
      image:
        'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1600',
      title: 'Hassle-Free Documentation',
      subtitle: 'We handle all the paperwork while you focus on what matters most.'
    },
    {
      image:
        'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=1600',
      title: 'Expert Guidance at Every Step',
      subtitle: 'Our experienced team ensures 100% accurate and timely processing.'
    }
  ];

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

  const goToSlide = (index) => setCurrentSlide(index);
  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () =>
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );

  // Featured categories order
  const featuredOrder = [
    'licenses',               // A
    'registration-certificate', // B
    'passport',               // C
    'legal',                  // D
    'gst',                    // E
    'challan',                // F
    'insurance',              // G
    'pan-card'                // H
  ];

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
      {/* ── Hero Slider ── */}
      <section className="relative h-[600px] overflow-hidden bg-black">
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
                <a
                  href="/services"
                  className="bg-orange-600 hover:bg-orange-700 px-8 py-3 rounded-lg text-lg font-bold transition transform hover:scale-105"
                >
                  Our Services
                </a>
                <Link
                  to="/contact"
                  className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-3 rounded-lg text-lg font-bold transition transform hover:scale-105"
                >
                  Consult Now
                </Link>
              </div>
            </div>
          </div>
        ))}

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

      {/* ── Categories Section ── */}
      <section id="categories" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          {/* Section Header */}
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 text-sm font-semibold rounded-full mb-4 uppercase tracking-wide">
              Our Services
            </span>
            <h2 className="text-4xl font-extrabold text-gray-900 mb-4">
              What We Do
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
              We simplify government documentation across multiple categories so
              you can focus on what matters most.
            </p>
          </div>

          {/* Image Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sortedCategories.map((category) => {
              const details = getCategoryDetails(category.id);
              const image = getCategoryImage(category.id);

              return (
                <Link
                  key={category.id}
                  to={`/services/category/${category.id}`}
                  className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 block"
                  style={{ minHeight: '220px' }}
                >
                  {/* Background Image */}
                  <img
                    src={image}
                    alt={details.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={(e) => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80';
                    }}
                  />

                  {/* Dark overlay — stronger at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 group-hover:from-black/90 group-hover:via-black/50 transition-all duration-300" />

                  {/* Content */}
                  <div className="relative h-full flex flex-col justify-end p-5" style={{ minHeight: '220px' }}>


                    <h3 className="text-white font-bold text-lg leading-tight mb-1">
                      {details.name}
                    </h3>
                    <p className="text-gray-300 text-xs line-clamp-2 mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {details.description}
                    </p>

                    {/* Explore button */}
                    <div className="flex items-center gap-1 text-orange-400 font-semibold text-sm">
                      <span>Explore</span>
                      <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-300 hover:shadow-lg"
            >
              View All Services
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      {!isAuthenticated && (
        <section className="py-20 bg-blue-50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust us with their
              documentation needs.
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

      {isAuthenticated && (
        <section className="py-20 bg-blue-50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome back, {user?.fullName || 'User'}!
            </h2>
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