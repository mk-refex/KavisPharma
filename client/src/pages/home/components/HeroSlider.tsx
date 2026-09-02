import { useState, useEffect, useCallback } from 'react';
import { getHomeContent, resolveImageUrl, type HeroSlide } from '@/services/api';

const defaultSlides: HeroSlide[] = [
  {
    tagline: 'Customer-driven pharma solutions',
    description: 'Innovative practices that develop, produce and deliver life-impacting pharma products',
    image: 'https://kavispharma.com/wp-content/uploads/slider/cache/2e67d0658b8ee6f84d1d6815e72285e6/banner-01.png',
  },
  {
    tagline: 'Life-saving innovations',
    description: 'We believe in empowering health and global well being through rigorous science.',
    image: 'https://kavispharma.com/wp-content/uploads/slider/cache/c8dffe325b3f16d35ae8836134db2888/new-banner-01-1.png',
  },
  {
    tagline: 'Thoughtful Solutions for Our Customers',
    description: 'We invest in high quality solutions that are constantly upgraded to build novel specialty medicines for now and tomorrow.',
    image: 'https://kavispharma.com/wp-content/uploads/slider/cache/7ed4db47a4837af73d08092d0fd59baf/new-banner-02.png',
  },
  {
    tagline: 'Your health is our responsibility',
    description: 'Trust in our commitment to deliver innovative and life-changing pharmaceutical solutions for a brighter, healthier future.',
    image: 'https://kavispharma.com/wp-content/uploads/slider/cache/7ac013d70fd1538563e03bdd9b3b644e/Untitled-design-9.png',
  },
];

export default function HeroSlider() {
  const [slides, setSlides] = useState<HeroSlide[]>(defaultSlides);
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    getHomeContent()
      .then((data) => {
        if (data.heroSlides?.length) {
          setSlides(data.heroSlides);
        }
      })
      .catch(() => {
        // Keep default slides if API is unavailable
      });
  }, []);

  const goTo = useCallback((index: number) => {
    if (isAnimating || slides.length === 0) return;
    setIsAnimating(true);
    setCurrent(index);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, slides.length]);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length);
  }, [current, goTo, slides.length]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length);
  }, [current, goTo, slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return undefined;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, slides.length]);

  if (slides.length === 0) {
    return null;
  }

  return (
    <section className="relative flex-1 min-h-0 w-full overflow-hidden border-b-2 border-primary-500">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === current ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
          }`}
        >
          <div className="absolute inset-0">
            <img
              src={resolveImageUrl(slide.image)}
              alt=""
              className="w-full h-full object-cover object-right md:object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-transparent w-full md:w-[72%]" />
          </div>

          <div className="relative z-10 h-full flex items-center">
            <div className="w-full max-w-xl lg:max-w-2xl min-w-0 pl-16 sm:pl-20 md:pl-24 lg:pl-28 pr-6 box-border">
              <h2 className="text-[#1a1a1a] text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-medium leading-snug mb-4">
                {slide.tagline}
              </h2>
              <p className="text-[#1a1a1a] text-sm sm:text-base md:text-lg leading-relaxed max-w-md">
                {slide.description}
              </p>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={prev}
        className="group absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white shadow-md flex items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-[#16b7cc]"
        aria-label="Previous slide"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="fill-[#0f5299] transition-colors duration-200 group-hover:fill-white"
        >
          <path d="M11.433 15.992L22.69 5.712c.393-.39.393-1.03 0-1.42-.393-.39-1.03-.39-1.423 0l-11.98 10.94c-.21.21-.3.49-.285.76-.015.28.075.56.284.77l11.98 10.94c.393.39 1.03.39 1.424 0 .393-.4.393-1.03 0-1.42l-11.257-10.29z" fillRule="evenodd"/>
        </svg>
      </button>
      <button
        type="button"
        onClick={next}
        className="group absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white shadow-md flex items-center justify-center cursor-pointer transition-colors duration-200 hover:bg-[#16b7cc]"
        aria-label="Next slide"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="fill-[#0f5299] transition-colors duration-200 group-hover:fill-white"
        >
          <path d="M10.722 4.293c-.394-.39-1.032-.39-1.427 0-.393.39-.393 1.03 0 1.42l11.283 10.28-11.283 10.29c-.393.39-.393 1.02 0 1.42.395.39 1.033.39 1.427 0l12.007-10.94c.21-.21.3-.49.284-.77.014-.27-.076-.55-.286-.76L10.72 4.293z" fillRule="evenodd"/>
        </svg>
      </button>
    </section>
  );
}
