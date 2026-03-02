// client/src/pages/Contact.jsx
import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle, AlertCircle, User, MessageSquare } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.phone || !formData.service) {
      setError("Please fill in all required fields");
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        message: ''
      });
      setError('');
      
      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    }, 1500);
  };

  const services = [
    "RTO Services",
    "Passport Services",
    "GST & TAX Services",
    "Driving Licence",
    "Birth Certificates",
    "Insurance Services",
    "Property Documents",
    "Legal Services"
  ];

  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      description: "Call us anytime",
      value: "+91 98765 43210",
      link: "tel:+919876543210",
      color: "blue",
      bg: "bg-blue-50",
      text: "text-blue-600",
      border: "border-blue-200"
    },
    {
      icon: Mail,
      title: "Email",
      description: "Send us your queries",
      value: "info@1p1s.com",
      link: "mailto:info@1p1s.com",
      color: "purple",
      bg: "bg-purple-50",
      text: "text-purple-600",
      border: "border-purple-200"
    },
    {
      icon: MapPin,
      title: "Location",
      description: "Visit our office",
      value: "Adarsh Nagar, Gurgaon, Haryana 122001",
      link: null,
      color: "emerald",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
      border: "border-emerald-200"
    },
    {
      icon: Clock,
      title: "Working Hours",
      description: "We're available",
      value: "Mon-Fri: 9:00 AM - 6:00 PM",
      link: null,
      color: "amber",
      bg: "bg-amber-50",
      text: "text-amber-600",
      border: "border-amber-200"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
            <MessageSquare className="w-4 h-4" />
            Contact Us
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Get In Touch
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Have questions? Need assistance? Our team is here to help you with all your documentation needs.
          </p>
        </div>

        {/* Contact Info Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {contactInfo.map((info, index) => {
            const Icon = info.icon;
            return (
              <div 
                key={index} 
                className={`bg-white p-6 rounded-xl border-2 ${info.border} shadow-sm hover:shadow-md transition-all hover:-translate-y-1`}
              >
                <div className={`${info.bg} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${info.text}`} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{info.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{info.description}</p>
                {info.link ? (
                  <a 
                    href={info.link} 
                    className={`${info.text} hover:underline font-medium text-sm break-all`}
                  >
                    {info.value}
                  </a>
                ) : (
                  <p className="text-gray-700 text-sm">{info.value}</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Contact Form Section */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl border-2 border-gray-200 shadow-lg overflow-hidden">
            {/* Form Header */}
            <div className="bg-gray-800 px-6 py-4">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-white" />
                <h2 className="text-xl font-bold text-white">Send Us a Message</h2>
              </div>
              <p className="text-gray-300 text-sm mt-1">
                Fill out the form below and we'll get back to you within 24 hours
              </p>
            </div>
            
            {/* Form Body */}
            <div className="p-6 sm:p-8">
              {/* Success Message */}
              {success && (
                <div className="mb-6 bg-emerald-50 border-2 border-emerald-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-emerald-800">Message Sent Successfully!</p>
                      <p className="text-emerald-600 text-sm mt-0.5">
                        Thank you! We'll contact you within 24 hours.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="mb-6 bg-rose-50 border-2 border-rose-200 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                    <p className="font-semibold text-rose-800">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                      <User className="w-4 h-4 text-blue-500" />
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-blue-400 focus:ring-4 focus:ring-blue-100 outline-none transition-all text-gray-700"
                    />
                  </div>

                  {/* Email Field */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Mail className="w-4 h-4 text-purple-500" />
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all text-gray-700"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {/* Phone Field */}
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                      <Phone className="w-4 h-4 text-emerald-500" />
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none transition-all text-gray-700"
                    />
                  </div>

                  {/* Service Field */}
                  <div className="space-y-2">
                    <label htmlFor="service" className="block text-sm font-medium text-gray-700 flex items-center gap-1">
                      <MessageSquare className="w-4 h-4 text-amber-500" />
                      Service Required <span className="text-rose-500">*</span>
                    </label>
                    <select
                      id="service"
                      value={formData.service}
                      onChange={(e) => handleChange("service", e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none transition-all text-gray-700"
                    >
                      <option value="">Select a service</option>
                      {services.map((service, index) => (
                        <option key={index} value={service.toLowerCase().replace(/\s+/g, '-')}>
                          {service}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Message Field */}
                <div className="space-y-2">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Message (Optional)
                  </label>
                  <textarea
                    id="message"
                    placeholder="Tell us more about your requirements..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-lg focus:border-gray-400 focus:ring-4 focus:ring-gray-100 outline-none transition-all text-gray-700"
                  />
                  <p className="text-xs text-gray-500 text-right">
                    {formData.message.length}/500 characters
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-semibold transition-all disabled:opacity-50 flex items-center justify-center shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Submit Request
                    </>
                  )}
                </button>

                {/* Form Footer Note */}
                <p className="text-xs text-gray-500 text-center mt-4">
                  By submitting this form, you agree to our privacy policy and terms of service.
                  We'll never share your information with third parties.
                </p>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;