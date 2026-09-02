import { useEffect, useRef, useState } from 'react';
import { getHomeContent, resolveImageUrl } from '@/services/api';

const defaultCertifications = [
  {
    icon: 'https://kavispharma.com/wp-content/uploads/2024/06/icon1.jpg',
    label: 'Outstanding regulatory\ntrack history',
  },
  {
    icon: 'https://kavispharma.com/wp-content/uploads/2024/06/icon2.jpg',
    label: 'Fully Equipped\nGMP laboratory',
  },
  {
    icon: 'https://kavispharma.com/wp-content/uploads/2024/06/icon3.jpg',
    label: 'Certified by FDA and\nHealth Canada',
  },
];

export default function CertificationsSection() {
  const [visible, setVisible] = useState(false);
  const [certifications, setCertifications] = useState(defaultCertifications);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getHomeContent()
      .then((data) => {
        if (data.sectionImages?.certifications?.length) {
          setCertifications(data.sectionImages.certifications);
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
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full py-12 md:py-16 bg-background-50">
      <div ref={ref} className="w-full px-4 md:px-8 lg:px-16 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
          {certifications.map((cert, index) => (
            <div
              key={index}
              className={`flex flex-col items-center text-center transition-all duration-500 ${
                visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="w-[83px] h-[82px] flex items-center justify-center mb-4 overflow-hidden">
                <img
                  src={resolveImageUrl(cert.icon)}
                  alt={`Certification icon ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm md:text-base text-primary-500 font-medium whitespace-pre-line leading-relaxed">
                {cert.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
