import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { label: 'HOME', path: '/' },
  { label: 'ABOUT', path: '/about' },
  { label: 'CAREER', path: '/career' },
  { label: 'CONTACT US', path: '/contact' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Top contact bar — white background like reference */}
      <div className="w-full bg-background-50 border-b border-background-200">
        <div className="w-full px-4 md:px-8 py-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm">
          <span className="flex items-center gap-1.5 text-[#0f5299] min-w-0 text-center sm:text-left">
            <i className="ri-map-pin-line text-sm text-[#0f5299] shrink-0"></i>
            <span className="truncate sm:whitespace-normal">12720 Dairy Ashford Rd Sugar Land, TX 77478</span>
          </span>
          <a href="tel:+12812401000" className="flex items-center gap-1.5 text-[#0f5299] hover:opacity-80 transition-opacity whitespace-nowrap shrink-0">
            <i className="ri-phone-line text-sm text-[#0f5299]"></i>
            <span>+1(281) 240-1000</span>
          </a>
        </div>
      </div>

      {/* Main navigation — always solid blue like reference */}
      <div className="w-full bg-primary-500 z-50">
        <div className="w-full px-4 md:px-8 py-3 md:py-4 flex items-center justify-between">
          {/* Logo with text */}
          <Link to="/" className="flex flex-col items-center gap-0">
            <img
              src="https://kavispharma.com/wp-content/uploads/2024/06/logo.png"
              alt="Kavis Pharma"
              className="h-10 md:h-12 w-auto"
            />
            <span className="text-[10px] md:text-xs text-white/90 tracking-widest uppercase font-medium mt-0.5">
              KAVIS PHARMA LLC
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'text-red-500'
                      : 'text-white/90 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden w-8 h-8 flex flex-col items-center justify-center gap-1.5 cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={() => setMobileOpen(false)}></div>
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-background-50 shadow-2xl transform transition-transform duration-300 md:hidden ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <span className="font-heading text-lg font-semibold text-primary-500">Menu</span>
            <button
              onClick={() => setMobileOpen(false)}
              className="w-8 h-8 flex items-center justify-center cursor-pointer"
              aria-label="Close menu"
            >
              <i className="ri-close-line text-2xl text-foreground-800"></i>
            </button>
          </div>
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-base font-medium py-2 border-b border-background-200 transition-colors ${
                    isActive ? 'text-primary-500' : 'text-foreground-700 hover:text-primary-500'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
          <div className="mt-8 pt-6 border-t border-background-200">
            <p className="text-sm text-foreground-600 mb-4">Follow Us On :</p>
            <div className="flex flex-col gap-2 text-sm text-foreground-600">
              <a href="tel:+12812401000" className="flex items-center gap-2 hover:text-primary-500 transition-colors">
                <i className="ri-phone-line"></i>
                <span>+1(281) 240-1000</span>
              </a>
              <span className="flex items-center gap-2">
                <i className="ri-map-pin-line"></i>
                <span>12720 Dairy Ashford Rd Sugar Land, TX 77478</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}