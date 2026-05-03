// client/src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-20 pb-10">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-gray-800 pb-12">
        <div className="col-span-1 md:col-span-1">
          <h4 className="text-2xl font-bold mb-4">1 Point1 Solution</h4>
          <p className="text-gray-400">Simplifying documentation for residents of Gurgaon since 2026.</p>
        </div>
        <div>
          <h5 className="font-bold mb-4 uppercase text-orange-500">Quick Links</h5>
          <ul className="space-y-2 text-gray-400">
            <li> <Link to="/services/category/driving-licence" className="text-gray-400 hover:text-white transition-colors">
              Driving Licence
            </Link></li>
            <li>                <Link to="/services/category/passport" className="text-gray-400 hover:text-white transition-colors">
              Passport Services
            </Link></li>
            <li><Link to="/services/category/registration-certificate" className="text-gray-400 hover:text-white transition-colors">
              Vehicle Registration
            </Link></li>
            <li>                <Link to="/services/category/gst-registration" className="text-gray-400 hover:text-white transition-colors">
              GST Registration
            </Link></li>
          </ul>
        </div>
        <div>
          <h5 className="font-bold mb-4 uppercase text-orange-500">Contact Person</h5>
          <p className="font-bold text-lg">Amit Soni</p>
          <p className="text-gray-400">Mob: +91 9988607609</p>
          <p className="text-gray-400">Email: info@1p1s.com</p>
        </div>
        <div>
          <h5 className="font-bold mb-4 uppercase text-orange-500">Location</h5>
          <p className="text-gray-400">316/1 Lajpat Nagar, Gurgaon,<br />Haryana, 122001</p>
        </div>
      </div>
      <div className="text-center pt-8 text-gray-500 text-sm">
        © {currentYear} 1 Point1 Solution (1P1S). All Rights Reserved.
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/919988607609?text=Hi%201P1S,%20I%20am%20looking%20for%20help%20with%20a%20service."
        className="fixed bottom-8 right-8 bg-green-500 text-white w-16 h-16 rounded-full shadow-2xl hover:bg-green-600 transition flex items-center justify-center text-3xl z-50 animate-bounce"
        target="_blank"
        rel="noopener noreferrer"
      >
        <i className="fab fa-whatsapp"></i>
      </a>
    </footer>
  );
};

export default Footer;