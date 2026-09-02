import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHomeContent, resolveImageUrl } from '@/services/api';

const DEFAULT_IMAGE = 'https://kavispharma.com/wp-content/uploads/2024/06/banner-01.png';

export default function WorkingAtKavisSection() {
  const [visible, setVisible] = useState(false);
  const [image, setImage] = useState(DEFAULT_IMAGE);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getHomeContent()
      .then((data) => {
        if (data.sectionImages?.workingAtKavis) {
          setImage(data.sectionImages.workingAtKavis);
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
      className="relative w-full min-h-[280px] md:min-h-[340px] lg:h-[411px] lg:min-h-[411px] flex items-center overflow-hidden"
    >
      <div
        className="absolute inset-0 bg-cover bg-center lg:bg-[center_right] bg-no-repeat"
        style={{ backgroundImage: `url('${resolveImageUrl(image)}')` }}
      />
      <div
        className="absolute inset-0"
        style={{ backgroundColor: '#0D77B2', opacity: 0.77 }}
      />

      <div
        className={`relative z-10 w-full px-6 md:px-12 lg:px-16 py-14 md:py-16 text-center transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <h2 className="font-heading text-xl md:text-2xl lg:text-3xl font-medium text-white leading-relaxed max-w-4xl mx-auto mb-8">
          Working At Kavis Means Exploring And Harnessing Science For Human Good..
        </h2>
        <Link
          to="/about"
          className="inline-block px-8 py-2.5 border border-white text-white text-sm font-medium rounded-sm hover:bg-white hover:text-[#0D77B2] transition-colors whitespace-nowrap"
        >
          Know more
        </Link>
      </div>
    </section>
  );
}
