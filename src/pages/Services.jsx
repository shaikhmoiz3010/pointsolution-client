// client/src/pages/Services.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ArrowRight, X, ChevronRight, FileText, Star, Shield, Clock } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import { getAllServices, getCategories } from '../utils/api';

const Services = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filteredServices, setFilteredServices] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterServices();
  }, [selectedCategory, searchQuery, services]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [servicesResponse, categoriesResponse] = await Promise.all([
        getAllServices(),
        getCategories()
      ]);

      if (servicesResponse?.success) {
        const allServices = servicesResponse.allServices || 
          Object.values(servicesResponse.services || {}).flat();
        setServices(allServices);
        setFilteredServices(allServices);
      } else {
        setError(servicesResponse?.message || 'Failed to load services');
      }

      if (categoriesResponse?.success) {
        setCategories(categoriesResponse.categories || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      setError(error.message || 'Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = [...services];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(query) ||
        service.description?.toLowerCase().includes(query)
      );
    }

    setFilteredServices(filtered);
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setShowMobileFilters(false);
  };

  // Stats for the header
  const stats = [

  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-gray-800 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-2xl border-2 border-rose-200 shadow-lg overflow-hidden">
              <div className="bg-rose-50 px-6 py-4 border-b border-rose-200">
                <h2 className="text-lg font-semibold text-rose-800">Error Loading Services</h2>
              </div>
              <div className="p-6 text-center">
                <p className="text-gray-600 mb-6">{error}</p>
                <button 
                  onClick={fetchData}
                  className="px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-semibold transition-all shadow-lg"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4 bg-orange-500 text-black px-4 py-2 rounded-full text-sm font-medium">
            <Star className="w-4 h-4" />
            Our Services
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-4">
            Comprehensive Documentation Solutions
          </h1>
          <p className="text-lg text-black max-w-3xl mx-auto">
            We provide end-to-end assistance for all government-related paperwork, 
            making your documentation journey smooth and hassle-free.
          </p>
        </div>



        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="sm:hidden flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl border-2 border-gray-200 font-medium"
            >
              <Filter className="w-4 h-4" />
              {selectedCategory === 'all' ? 'All Categories' : 'Filtered'}
              <span className="bg-gray-800 text-white text-xs px-2 py-1 rounded-full ml-1">
                {categories.filter(c => c.id === selectedCategory).length ? 1 : 0}
              </span>
            </button>

            {/* Desktop Categories */}
            <div className="hidden sm:block">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all min-w-[200px]"
              >
                <option value="all">All Services ({services.length})</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters Button (when filters active) */}
            {(selectedCategory !== 'all' || searchQuery) && (
              <button
                onClick={clearFilters}
                className="hidden sm:flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium border-2 border-gray-200"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </button>
            )}
          </div>

          {/* Mobile Categories (expandable) */}
          {showMobileFilters && (
            <div className="sm:hidden mt-4 pt-4 border-t border-gray-200">
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setSelectedCategory('all');
                    setShowMobileFilters(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 font-medium transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-gray-800 text-white border-gray-800'
                      : 'bg-white text-gray-700 border-gray-200'
                  }`}
                >
                  All Services ({services.length})
                </button>
                
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setShowMobileFilters(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 font-medium transition-all ${
                      selectedCategory === category.id
                        ? 'bg-gray-800 text-white border-gray-800'
                        : 'bg-white text-gray-700 border-gray-200'
                    }`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}

                {(selectedCategory !== 'all' || searchQuery) && (
                  <button
                    onClick={clearFilters}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium border-2 border-gray-200 mt-3"
                  >
                    <X className="w-4 h-4" />
                    Clear All Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredServices.length}</span> services
            {selectedCategory !== 'all' && (
              <> in <span className="font-semibold text-gray-900">
                {categories.find(c => c.id === selectedCategory)?.name}
              </span></>
            )}
          </p>

        </div>

        {/* Services Grid */}
        {filteredServices.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredServices.map((service) => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-lg p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 text-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No services found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchQuery 
                ? `No results found for "${searchQuery}"`
                : 'No services available in this category at the moment.'}
            </p>
            <button
              onClick={clearFilters}
              className="inline-flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-semibold transition-all shadow-lg"
            >
              <X className="w-5 h-5 mr-2" />
              Clear Filters
            </button>
          </div>
        )}




      </div>
    </div>
  );
};

export default Services;