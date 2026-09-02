import { useState, useEffect, useCallback, useRef } from 'react';
import { getHomeContent, resolveImageUrl } from '@/services/api';

const defaultResearchImages = [
  'https://kavispharma.com/wp-content/uploads/2024/06/slider1.png',
  'https://kavispharma.com/wp-content/uploads/2024/06/slider2.png',
  'https://kavispharma.com/wp-content/uploads/2024/06/slider3.png',
];

export default function ResearchSection() {
  const [researchImages, setResearchImages] = useState(defaultResearchImages);
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getHomeContent()
      .then((data) => {
        if (data.sectionImages?.research?.length) {
          setResearchImages(data.sectionImages.research);
        }
      })
      .catch(() => {});
  }, []);

  const goTo = useCallback((index: number) => {
    if (isAnimating || researchImages.length === 0) return;
    setIsAnimating(true);
    setCurrent(index);
    setTimeout(() => setIsAnimating(false), 400);
  }, [isAnimating, researchImages.length]);

  const next = useCallback(() => {
    goTo((current + 1) % researchImages.length);
  }, [current, goTo, researchImages.length]);

  const prev = useCallback(() => {
    goTo((current - 1 + researchImages.length) % researchImages.length);
  }, [current, goTo, researchImages.length]);

  useEffect(() => {
    if (researchImages.length <= 1) return undefined;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next, researchImages.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="w-full py-12 md:py-16 bg-background-50">
      <div className="w-full px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          <div className={`flex-1 w-full transition-all duration-700 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="relative w-full overflow-hidden">
              <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${current * 100}%)` }}>
                {researchImages.map((img, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <img
                      src={resolveImageUrl(img)}
                      alt={`Research facility ${index + 1}`}
                      className="w-full h-auto object-cover max-h-[400px]"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-foreground-400 hover:text-foreground-800 transition-colors cursor-pointer z-10"
                aria-label="Previous slide"
              >
                <i className="ri-arrow-left-s-line text-2xl"></i>
              </button>
              <button
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center text-foreground-400 hover:text-foreground-800 transition-colors cursor-pointer z-10"
                aria-label="Next slide"
              >
                <i className="ri-arrow-right-s-line text-2xl"></i>
              </button>
            </div>
          </div>

          <div className={`flex-1 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground-950 mb-4">
              Backed By Advanced Scientific Research
            </h2>
            <p className="text-sm md:text-base text-foreground-700 leading-relaxed">
              Kavis Pharma is driven by our mission to advance science and enhance patient well-being. Our products are built on cutting-edge research and strong evidence, reflecting our strong commitment to scientific progress and improving healthcare outcomes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
