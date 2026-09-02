import { useEffect, useRef, useState } from 'react';
import { getHomeContent, resolveImageUrl } from '@/services/api';

const DEFAULT_IMAGE = 'https://kavispharma.com/wp-content/uploads/2024/06/bg.jpeg';

export default function ExtrovisBanner() {
  const [visible, setVisible] = useState(false);
  const [image, setImage] = useState(DEFAULT_IMAGE);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getHomeContent()
      .then((data) => {
        if (data.sectionImages?.extrovisBanner) {
          setImage(data.sectionImages.extrovisBanner);
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
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      className="relative w-full min-h-[200px] md:min-h-[280px] lg:min-h-[350px] flex items-center overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-top bg-no-repeat"
        style={{ backgroundImage: `url('${resolveImageUrl(image)}')` }}
      />
      <div
        className="absolute inset-0"
        style={{ backgroundColor: '#0D77B2', opacity: 0.77 }}
      />

      <div
        className={`relative z-10 w-full px-6 md:px-12 py-16 md:py-24 text-center transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <h2 className="font-heading text-lg md:text-2xl lg:text-3xl font-medium text-white leading-relaxed max-w-5xl mx-auto">
          <a
            href="https://extrovis.com/kavis-pharma.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            Kavis Is Proud To Be A Part of The Extrovis Family,
            <br />
            a global integrated pharmaceutical company.
          </a>
        </h2>
      </div>
    </section>
  );
}
