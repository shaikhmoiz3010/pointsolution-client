// client/src/pages/About.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Target, Users, Award, Clock, Shield, FileCheck, Clock as TimeIcon, TrendingUp } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Users, value: "5000+", label: "Satisfied Clients" },
    { icon: Award, value: "20+", label: "Services Offered" },
    { icon: Clock, value: "5+", label: "Years Experience" },
    { icon: Target, value: "99%", label: "Success Rate" }
  ];

  const features = [
    {
      icon: Shield,
      title: "Expert Guidance",
      description: "Our team of experienced professionals guides you through every step of the documentation process."
    },
    {
      icon: FileCheck,
      title: "Transparent Process",
      description: "We maintain complete transparency with clear pricing and no hidden charges."
    },
    {
      icon: TimeIcon,
      title: "Time-Saving",
      description: "We handle all the paperwork, saving you valuable time and multiple trips to government offices."
    },
    {
      icon: TrendingUp,
      title: "Legal Compliance",
      description: "All our services follow 100% legitimate and legal procedures as per government regulations."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* About Section - Exact Figma Design */}
      <section id="about" className="pt-32 pb-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm">
              About Us
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose 1Point 1Solution?
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We are your trusted partner for all government documentation needs in India.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            {/* Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1758876020343-c8c2add9d527?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwYXBlcndvcmslMjBkb2N1bWVudHMlMjBkZXNrfGVufDF8fHx8MTc2ODgxMjQzMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Documentation services"
                  className="w-full h-[450px] object-cover"
                />
              </div>
            </div>

            {/* Content */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Your Trusted Documentation Partner
              </h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                At 1Point 1Solution, we understand that dealing with government paperwork can be overwhelming, time-consuming, and confusing. That's why we exist – to make your life easier.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                With years of experience in handling various government documentation processes, our team of experts is well-versed in the latest regulations and procedures. We connect you with specialists who ensure your paperwork is completed accurately and efficiently.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Whether you need RTO services, passport assistance, certificate registration, or any other documentation service, we provide personalized support tailored to your specific needs.
              </p>

              {/* Features Grid */}
              <div className="grid sm:grid-cols-2 gap-4">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div key={index} className="bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                          <Icon className="w-5 h-5 text-gray-700" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">{feature.title}</h4>
                          <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="bg-white p-6 text-center border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                    <Icon className="w-6 h-6 text-gray-700" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission & Vision - Updated to match design */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm">
              Our Commitment
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Mission & Vision
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                To simplify access to government services through technology, transparency, and exceptional customer service. We believe that obtaining government services should be easy, transparent, and accessible to everyone.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-600">Make government services accessible to all</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-600">Provide transparent and efficient service</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-600">Ensure customer satisfaction at every step</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                To become India's most trusted and comprehensive platform for all government and legal services. We envision a future where citizens can access all government services through a single, user-friendly platform.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-600">Be the #1 trusted platform in India</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-600">Digitize all government services</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  </div>
                  <span className="text-gray-600">Reduce bureaucratic hurdles for citizens</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm">
              Our Process
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How We Work
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple, transparent process from start to finish
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: '01', title: 'Service Selection', description: 'Choose from 20+ government services' },
              { number: '02', title: 'Document Upload', description: 'Upload required documents securely' },
              { number: '03', title: 'Expert Processing', description: 'Our experts handle all paperwork' },
              { number: '04', title: 'Service Delivery', description: 'Get your completed documents' },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center mx-auto">
                    <span className="text-2xl font-bold text-gray-800">{step.number}</span>
                  </div>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-1/2 left-1/2 w-full h-0.5 bg-gray-300 transform translate-y-1/2"></div>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-800 to-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join 5000+ satisfied clients who have trusted us with their documentation needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/services"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-gray-800 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 text-lg"
            >
              Browse Services
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-all duration-300 text-lg"
            >
              Contact Us
            </Link>
          </div>
          <p className="mt-6 text-sm text-gray-400">
            Get your first consultation absolutely free
          </p>
        </div>
      </section>
    </div>
  );
};

export default About;