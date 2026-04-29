// client/src/pages/Services.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, ArrowRight, Filter } from 'lucide-react';
import ServiceCard from '../components/ServiceCard';
import { getAllServices, getCategories } from '../utils/api';

// ── Same image map as Home.jsx ──────────────────────────────────────────────
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

const fallbackImage =
  'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80';

const getCategoryImage = (id) => categoryImages[id] || fallbackImage;

// ── Category name helper ────────────────────────────────────────────────────
const categoryNameMap = {
  'licenses': 'Driving Licences',
  'registration-certificate': 'Registration Certificate',
  'gst': 'GST & Tax Services',
  'legal': 'Legal Documents',
  'passport': 'Passport Services',
  'challan': 'Traffic Challan',
  'insurance': 'Insurance Services',
  'pan-card': 'PAN Card Services',
  'certificate': 'Certificates',
  'document': 'Document Services',
  'property': 'Property Services',
  'identity': 'Identity Documents',
  'other': 'Other Services'
};

const getCategoryName = (id) =>
  categoryNameMap[id] ||
  id.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase());

// ── Featured order ──────────────────────────────────────────────────────────
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

// ── Component ───────────────────────────────────────────────────────────────
const Services = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filteredServices, setFilteredServices] = useState([]);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // View mode: 'categories' shows image cards, 'services' shows individual service cards
  const [viewMode, setViewMode] = useState('categories');

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterServices();
  }, [selectedCategory, searchQuery, services]);

  // When a category is selected switch to services view
  useEffect(() => {
    if (selectedCategory !== 'all') {
      setViewMode('services');
    }
  }, [selectedCategory]);

  // When search is active switch to services view
  useEffect(() => {
    if (searchQuery.trim()) {
      setViewMode('services');
    } else if (selectedCategory === 'all') {
      setViewMode('categories');
    }
  }, [searchQuery]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');

      const [servicesResponse, categoriesResponse] = await Promise.all([
        getAllServices(),
        getCategories()
      ]);

      if (servicesResponse?.success) {
        const allServices =
          servicesResponse.allServices ||
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
      filtered = filtered.filter(
        (service) => service.category === selectedCategory
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (service) =>
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
    setViewMode('categories');
  };

  const handleCategoryCardClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setViewMode('services');
  };

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
          <div className="max-w-md mx-auto bg-white rounded-2xl border-2 border-rose-200 shadow-lg overflow-hidden">
            <div className="bg-rose-50 px-6 py-4 border-b border-rose-200">
              <h2 className="text-lg font-semibold text-rose-800">
                Error Loading Services
              </h2>
            </div>
            <div className="p-6 text-center">
              <p className="text-gray-600 mb-6">{error}</p>
              <button
                onClick={fetchData}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-semibold shadow-lg"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Page Header ── */}
        <div className="text-center mb-10">
          <span className="inline-block px-4 py-1.5 bg-orange-100 text-orange-600 text-sm font-semibold rounded-full mb-4 uppercase tracking-wide">
            Our Services
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-blue-900 mb-4">
            Comprehensive Documentation Solutions
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We provide end-to-end assistance for all government-related
            paperwork, making your documentation journey smooth and hassle-free.
          </p>
        </div>

        {/* ── Search & Filter Bar ── */}
        <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
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
              {selectedCategory === 'all'
                ? 'All Categories'
                : getCategoryName(selectedCategory)}
            </button>

            {/* Desktop Category Select */}
            <div className="hidden sm:block">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all min-w-[220px]"
              >
                <option value="all">All Services ({services.length})</option>
                {sortedCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {getCategoryName(category.id)} ({category.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            {(selectedCategory !== 'all' || searchQuery) && (
              <button
                onClick={clearFilters}
                className="hidden sm:flex items-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium border-2 border-gray-200"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>

          {/* Mobile category list */}
          {showMobileFilters && (
            <div className="sm:hidden mt-4 pt-4 border-t border-gray-200 space-y-2">
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setShowMobileFilters(false);
                  setViewMode('categories');
                }}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 font-medium transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-gray-800 text-white border-gray-800'
                    : 'bg-white text-gray-700 border-gray-200'
                }`}
              >
                All Services ({services.length})
              </button>
              {sortedCategories.map((category) => (
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
                  {getCategoryName(category.id)} ({category.count})
                </button>
              ))}
              {(selectedCategory !== 'all' || searchQuery) && (
                <button
                  onClick={clearFilters}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium border-2 border-gray-200 mt-2"
                >
                  <X className="w-4 h-4" />
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* ── CATEGORY IMAGE CARDS VIEW ── */}
        {viewMode === 'categories' && (
          <>
            <div className="mb-6">
              <p className="text-gray-600 text-sm">
                Showing{' '}
                <span className="font-semibold text-gray-900">
                  {sortedCategories.length}
                </span>{' '}
                categories — click a category to browse its services
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
              {sortedCategories.map((category) => {
                const name = getCategoryName(category.id);
                const image = getCategoryImage(category.id);

                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryCardClick(category.id)}
                    className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 text-left w-full"
                    style={{ minHeight: '220px' }}
                  >
                    {/* Background Image */}
                    <img
                      src={image}
                      alt={name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={(e) => {
                        e.target.src = fallbackImage;
                      }}
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10 group-hover:from-black/90 group-hover:via-black/50 transition-all duration-300" />

                    {/* Content */}
                    <div
                      className="relative flex flex-col justify-end p-5"
                      style={{ minHeight: '220px' }}
                    >
                      {/* Service count badge */}
                      {category.count > 0 && (
                        <span className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                          {category.count}{' '}
                          {category.count === 1 ? 'Service' : 'Services'}
                        </span>
                      )}

                      <h3 className="text-white font-bold text-lg leading-tight mb-1">
                        {name}
                      </h3>

                      {/* Explore CTA */}
                      <div className="flex items-center gap-1 text-orange-400 font-semibold text-sm mt-1">
                        <span>Explore</span>
                        <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* ── INDIVIDUAL SERVICES VIEW ── */}
        {viewMode === 'services' && (
          <>
            {/* Breadcrumb / back link when a category is selected */}
            {selectedCategory !== 'all' && (
              <div className="flex items-center gap-3 mb-6">
                <button
                  onClick={clearFilters}
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  ← All Categories
                </button>
                <span className="text-gray-400">/</span>
                <span className="text-gray-700 font-semibold text-sm">
                  {getCategoryName(selectedCategory)}
                </span>
              </div>
            )}

            {/* Category image banner when filtering by category */}
            {selectedCategory !== 'all' && (
              <div
                className="relative rounded-2xl overflow-hidden mb-8 shadow-lg"
                style={{ height: '180px' }}
              >
                <img
                  src={getCategoryImage(selectedCategory)}
                  alt={getCategoryName(selectedCategory)}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = fallbackImage;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30 flex items-center px-8">
                  <div>
                    <h2 className="text-white text-3xl font-bold mb-1">
                      {getCategoryName(selectedCategory)}
                    </h2>
                    <p className="text-gray-300 text-sm">
                      {filteredServices.length} service
                      {filteredServices.length !== 1 ? 's' : ''} available
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Results count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                Showing{' '}
                <span className="font-semibold text-gray-900">
                  {filteredServices.length}
                </span>{' '}
                service{filteredServices.length !== 1 ? 's' : ''}
                {selectedCategory !== 'all' && (
                  <>
                    {' '}
                    in{' '}
                    <span className="font-semibold text-gray-900">
                      {getCategoryName(selectedCategory)}
                    </span>
                  </>
                )}
                {searchQuery && (
                  <>
                    {' '}
                    for{' '}
                    <span className="font-semibold text-gray-900">
                      "{searchQuery}"
                    </span>
                  </>
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
                    ? `No results for "${searchQuery}"`
                    : 'No services available in this category at the moment.'}
                </p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-6 py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-xl font-semibold shadow-lg"
                >
                  <X className="w-5 h-5 mr-2" />
                  Clear Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Services;