import { useEffect, useRef, useState } from 'react';
import { getHomeContent, resolveImageUrl } from '@/services/api';

const DEFAULT_IMAGE =
  'https://kavispharma.com/wp-content/uploads/2024/06/quality-as-a-service.jpeg';

export default function QualityServicesSection() {
  const [visible, setVisible] = useState(false);
  const [image, setImage] = useState(DEFAULT_IMAGE);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getHomeContent()
      .then((data) => {
        if (data.sectionImages?.qualityServices) {
          setImage(data.sectionImages.qualityServices);
        }
      })
      .catch(() => {});
  }, []);

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
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full py-12 md:py-16 bg-background-50">
      <div ref={ref} className="w-full px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          <div className={`flex-1 transition-all duration-700 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <div className="relative overflow-hidden">
              <img
                src={resolveImageUrl(image)}
                alt="Quality services in pharmaceutical manufacturing"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>

          <div className={`flex-1 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground-950 mb-4">
              Quality Services
            </h2>
            <p className="text-sm md:text-base text-foreground-700 leading-relaxed">
              We are committed to delivering high-quality healthcare services that profoundly impact your well-being and quality of life.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
