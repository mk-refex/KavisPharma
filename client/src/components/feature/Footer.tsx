import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-secondary-500 text-background-50 relative">
      {/* Main footer */}
      <div className="w-full px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* About Us */}
          <div>
            <h3 className="font-heading text-lg md:text-xl font-semibold mb-4 text-background-50">
              About Us
            </h3>
            <p className="text-sm text-background-200 leading-relaxed">
              At Kavis Pharma, we are dedicated to producing high-quality pharmaceuticals through a dedicated supply chain to make a real impact on people's lives. Working closely with Extrovis and our strategic partners, we support the development and supply of life-changing medications across the United States, Europe and Canada.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-lg md:text-xl font-semibold mb-4 text-background-50">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-2.5">
              <li>
                <Link to="/" className="text-sm text-background-200 hover:text-background-50 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-sm text-background-200 hover:text-background-50 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/career" className="text-sm text-background-200 hover:text-background-50 transition-colors">
                  Career
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-background-200 hover:text-background-50 transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Reach Us */}
          <div>
            <h3 className="font-heading text-lg md:text-xl font-semibold mb-4 text-background-50">
              Reach Us
            </h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2.5 text-sm text-background-200">
                <div className="w-5 h-5 flex items-center justify-center mt-0.5">
                  <i className="ri-map-pin-line text-sm"></i>
                </div>
                <span>12720 Dairy Ashford Rd Sugar Land, TX 77478</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-background-200">
                <div className="w-5 h-5 flex items-center justify-center">
                  <i className="ri-phone-line text-sm"></i>
                </div>
                <span>+1(281) 240-1000</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="w-full border-t border-background-700/40 px-4 md:px-8 py-4">
        <div className="text-center text-xs text-background-300">
          <span>Copyright Kavis Pharma. All Right Reserved</span>
        </div>
      </div>

      {/* Scroll to top button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-50 w-10 h-10 flex items-center justify-center bg-primary-500 text-background-50 rounded-full shadow-lg hover:bg-primary-600 transition-all duration-300 cursor-pointer ${
          showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <i className="ri-arrow-up-line text-lg"></i>
      </button>
    </footer>
  );
}