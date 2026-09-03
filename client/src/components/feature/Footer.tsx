import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const quickLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/career', label: 'Career' },
  { to: '/contact', label: 'Contact Us' },
];

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
    <footer className="relative w-full bg-[#0A6CA2] text-white">
      <div className="w-full px-4 md:px-10 lg:px-16 py-12 md:py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {/* About Us */}
          <div>
            <h3 className="font-heading text-lg md:text-xl font-semibold mb-4 text-white">
              About Us
            </h3>
            <p className="text-sm text-white leading-relaxed">
              At Kavis Pharma, we are dedicated to producing high-quality
              pharmaceuticals through a dedicated supply chain to make a real
              impact on people&apos;s lives. Working closely with Extrovis and
              our strategic partners, we support the development and supply of
              life-changing medications across the United States, Europe and
              Canada.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading text-lg md:text-xl font-semibold mb-4 text-white">
              Quick Links
            </h3>
            <ul className="flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="inline-flex items-center gap-2.5 text-sm text-white hover:opacity-80 transition-opacity"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/90">
                      <i className="ri-arrow-right-s-line text-xs leading-none" />
                    </span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Reach Us */}
          <div>
            <h3 className="font-heading text-lg md:text-xl font-semibold mb-4 text-white">
              Reach Us
            </h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-2.5 text-sm text-white">
                <i className="ri-map-pin-fill text-base mt-0.5 shrink-0" />
                <span>12720 Dairy Ashford Rd Sugar Land, TX 77478</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-white">
                <i className="ri-phone-fill text-base shrink-0" />
                <a
                  href="tel:+12812401000"
                  className="hover:opacity-80 transition-opacity"
                >
                  +1(281) 240-1000
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="w-full bg-[#085a88] px-4 md:px-10 lg:px-16 py-4">
        <div className="text-center text-xs md:text-sm text-white">
          Copyright Kavis Pharma. All Right Reserved
        </div>
      </div>

      {/* Scroll to top — square, matches live site */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-5 right-5 z-50 flex h-10 w-10 items-center justify-center bg-[#064a70] text-white shadow-md hover:bg-[#053d5c] transition-all duration-300 cursor-pointer ${
          showScrollTop
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        aria-label="Scroll to top"
      >
        <i className="ri-arrow-up-s-line text-xl leading-none" />
      </button>
    </footer>
  );
}
