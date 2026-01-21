// client/src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ServiceCard from '../components/ServiceCard';
import { getAllServices } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { CheckCircle, ArrowRight, FileText, UserCheck, Settings, CheckCircle as CheckCircleIcon } from 'lucide-react';

const Home = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await getAllServices();
      if (response.success) {
        const allServices = Object.values(response.services).flat();
        const featuredServices = allServices.slice(0, 6);
        setServices(featuredServices);
      }
    } catch (error) {
      console.error('Failed to fetch services:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToContact = () => {
    const element = document.getElementById("contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToServices = () => {
    const element = document.getElementById("services");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Process Steps from Figma
  const processSteps = [
    {
      icon: FileText,
      step: "Step 1",
      title: "Share Your Requirements",
      description: "Contact us with your documentation needs. Our team will understand your requirements and guide you on the documents needed."
    },
    {
      icon: UserCheck,
      step: "Step 2",
      title: "Document Submission",
      description: "Submit the required documents to us. We verify all documents and ensure everything is in order before proceeding."
    },
    {
      icon: Settings,
      step: "Step 3",
      title: "Processing & Follow-up",
      description: "Our experts handle all the paperwork and follow up with relevant government departments on your behalf."
    },
    {
      icon: CheckCircleIcon,
      step: "Step 4",
      title: "Completion & Delivery",
      description: "Once completed, we deliver your documents securely. You stay updated throughout the entire process."
    }
  ];

  return (
    <div className="bg-gray-50">
      {/* Updated Hero Section with Figma Design */}
      <section id="home" className="pt-24 pb-16 bg-gradient-to-br from-gray-50 to-white md:pt-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-block mb-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm">
                🇮🇳 Trusted Indian Documentation Services
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                1 Point,<br />
                <span className="text-gray-700">1 Solution</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8">
                Expert assistance for all your government documentation needs. From RTO services to passport applications, we make paperwork simple.
              </p>

              {/* Key Points */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Fast & Hassle-free Documentation</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Expert Consultation Available</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">100% Legitimate & Transparent Process</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link 
                  to="/services"
                  className="inline-flex items-center justify-center px-8 py-3 bg-gray-800 hover:bg-gray-900 text-white text-lg rounded-lg font-semibold transition-colors"
                >
                  Get Started Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </div>
            </div>

            {/* Right Image Section */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1659355894117-0ae6f8f28d0b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbmRpYW4lMjBnb3Zlcm5tZW50JTIwb2ZmaWNlJTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc2ODgxMjQzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Professional documentation services"
                  className="w-full h-[400px] md:h-[500px] object-cover"
                />
              </div>
              {/* Floating Stats */}
              <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-3">
                <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg text-center">
                  <div className="text-2xl font-bold text-gray-800">5000+</div>
                  <div className="text-xs text-gray-600">Happy Clients</div>
                </div>
                <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg text-center">
                  <div className="text-2xl font-bold text-gray-800">20+</div>
                  <div className="text-xs text-gray-600">Services</div>
                </div>
                <div className="bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg text-center">
                  <div className="text-2xl font-bold text-gray-800">24/7</div>
                  <div className="text-xs text-gray-600">Customer Support</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section from Figma */}
      <section id="process" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm">
              Our Process
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How We Work
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our streamlined 4-step process makes documentation simple and hassle-free.
            </p>
          </div>

          {/* Process Steps */}
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 transform -translate-y-1/2 z-0"></div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {processSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={index} className="p-6 bg-white border-2 border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-xl transition-all duration-300 relative">
                    {/* Step Number Badge */}
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-gray-700 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                      {index + 1}
                    </div>
                    
                    <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Icon className="w-8 h-8 text-gray-700" />
                      </div>
                      <div className="text-sm text-gray-700 font-semibold mb-2">{step.step}</div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-gray-50 border-2 border-gray-200 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-2">💼 Professional Expertise</h4>
              <p className="text-sm text-gray-600">
                Our team has extensive experience in handling government documentation across various departments.
              </p>
            </div>
            <div className="p-6 bg-gray-50 border-2 border-gray-200 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-2">🔒 Secure & Confidential</h4>
              <p className="text-sm text-gray-600">
                Your documents and personal information are handled with utmost care and confidentiality.
              </p>
            </div>
            <div className="p-6 bg-gray-50 border-2 border-gray-200 rounded-lg">
              <h4 className="font-bold text-gray-900 mb-2">⚡ Quick Turnaround</h4>
              <p className="text-sm text-gray-600">
                We ensure fast processing while maintaining accuracy and compliance with all regulations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section id="services" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Popular Services</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from our wide range of government and legal services
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading services...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <ServiceCard key={index} service={service} />
              ))}
            </div>
          )}

<div className="text-center mt-12">
  <Link 
    to="/services" 
    className="inline-flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-semibold transition-all duration-300 hover:shadow-lg"
  >
    View All Services
    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
    </svg>
  </Link>
</div>
        </div>
      </section>

      {/* CTA Section - UPDATED: Only show if user is NOT logged in */}
      {!isAuthenticated && (
  <section id="contact" className="py-20 bg-gradient-to-br from-gray-50 to-white">
    <div className="container mx-auto px-4 text-center">
      <h2 className="text-4xl font-bold text-gray-900 mb-6">
        Ready to Get Started?
      </h2>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Join thousands of satisfied customers who trust us with their government and legal services.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          to="/register" 
          className="inline-flex items-center justify-center px-8 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-semibold transition-colors text-lg"
        >
          Create Account
          <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </Link>
        <Link 
          to="/login" 
          className="inline-flex items-center justify-center px-8 py-3 border-2 border-gray-700 text-gray-700 hover:bg-gray-50 rounded-lg font-semibold transition-colors text-lg"
        >
          Already have an account? Login
        </Link>
      </div>
      <p className="mt-6 text-sm text-gray-500">
        Create your account in 30 seconds and start booking services immediately
      </p>
    </div>
  </section>
)}

      {/* NEW: Show this section for logged-in users instead */}
      {isAuthenticated && (
  <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gray-800 text-white rounded-full flex items-center justify-center text-xl">
            {user?.fullName?.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-1">
              Welcome back, {user?.fullName || 'valued customer'}!
            </h2>
            <p className="text-gray-600">Ready to continue your documentation journey</p>
          </div>
        </div>
        
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Access your dashboard to track ongoing services or explore more documentation solutions.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center justify-center px-8 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-semibold transition-colors text-lg"
          >
            Go to Dashboard
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
          <Link 
            to="/services" 
            className="inline-flex items-center justify-center px-8 py-3 border-2 border-gray-700 text-gray-700 hover:bg-gray-50 rounded-lg font-semibold transition-colors text-lg"
          >
            Browse Services
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help with existing services? <Link to="/contact" className="text-gray-700 hover:text-gray-900 font-medium underline">Contact support</Link>
          </p>
        </div>
      </div>
    </div>
  </section>
)}
    </div>
  );
};

export default Home;