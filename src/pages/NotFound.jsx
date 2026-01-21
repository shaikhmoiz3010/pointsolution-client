import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, HelpCircle, ArrowRight, Compass, AlertTriangle } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center px-4 py-12">
      <div className="container mx-auto max-w-3xl">
        <div className="bg-white border-2 border-gray-200 rounded-2xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-8 text-center text-white">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-10 h-10" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3">Page Not Found</h1>
              <p className="text-gray-300 text-lg">
                The page you're looking for doesn't exist or has been moved
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Error Code */}
            <div className="text-center mb-8">
              <div className="inline-block relative">
                <div className="text-9xl font-bold text-gray-800 tracking-wider opacity-10">404</div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl font-bold text-gray-900">404</div>
                </div>
              </div>
              <div className="mt-4">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm">
                  <Compass className="w-4 h-4" />
                  <span>Navigation Error</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <div className="text-center mb-6">
                <div className="inline-block mb-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                  Quick Actions
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Get Back on Track</h3>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <Link
                  to="/"
                  className="group bg-gray-50 border-2 border-gray-200 rounded-xl p-6 text-center hover:border-gray-300 hover:shadow-md transition-all duration-200"
                >
                  <div className="w-12 h-12 bg-gray-800 text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Home className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Go Home</h4>
                  <p className="text-gray-600 text-sm mb-3">Return to homepage</p>
                  <div className="text-gray-400 group-hover:text-gray-600 text-sm transition-colors">
                    Navigate home →
                  </div>
                </Link>

                <Link
                  to="/services"
                  className="group bg-gray-50 border-2 border-gray-200 rounded-xl p-6 text-center hover:border-gray-300 hover:shadow-md transition-all duration-200"
                >
                  <div className="w-12 h-12 bg-gray-800 text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Search className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Browse Services</h4>
                  <p className="text-gray-600 text-sm mb-3">Explore our services</p>
                  <div className="text-gray-400 group-hover:text-gray-600 text-sm transition-colors">
                    View services →
                  </div>
                </Link>

                <Link
                  to="/contact"
                  className="group bg-gray-50 border-2 border-gray-200 rounded-xl p-6 text-center hover:border-gray-300 hover:shadow-md transition-all duration-200"
                >
                  <div className="w-12 h-12 bg-gray-800 text-white rounded-lg flex items-center justify-center mx-auto mb-4">
                    <HelpCircle className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">Get Help</h4>
                  <p className="text-gray-600 text-sm mb-3">Contact support team</p>
                  <div className="text-gray-400 group-hover:text-gray-600 text-sm transition-colors">
                    Contact us →
                  </div>
                </Link>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link
                to="/"
                className="inline-flex items-center justify-center px-8 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-semibold transition-colors text-lg"
              >
                <Home className="w-5 h-5 mr-2" />
                Back to Homepage
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-colors text-lg"
              >
                <Search className="w-5 h-5 mr-2" />
                Browse Services
              </Link>
            </div>


          </div>  
        </div>
      </div>
    </div>
  );
};

export default NotFound;