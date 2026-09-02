import { useEffect, useRef, useState } from 'react';

const services = [
  {
    icon: 'ri-server-line',
    title: 'SAP enterprise\nresource planning',
  },
  {
    icon: 'ri-settings-4-line',
    title: 'Tech Transfer / Validation /\nCalibration',
  },
  {
    icon: 'ri-shield-check-line',
    title: 'Serialization\nCompliance',
  },
];

export default function ServicesSection() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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
      <div className={`w-full px-4 md:px-8 text-center mb-8 md:mb-12 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <h2 className="font-heading text-xl md:text-2xl lg:text-3xl font-semibold text-foreground-950 leading-relaxed max-w-4xl mx-auto">
          We Prioritize Investing In Cutting-Edge Development And Regulatory Solutions To Deliver Exceptional-Quality Pharmaceuticals.
        </h2>
      </div>

      <div
        ref={ref}
        className="w-full px-4 md:px-8 grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto"
      >
        {services.map((service, index) => (
          <div
            key={index}
            className={`flex flex-col items-center text-center transition-all duration-500 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ transitionDelay: `${index * 150}ms` }}
          >
            <div className="w-14 h-14 flex items-center justify-center mb-4 text-primary-500">
              <i className={`${service.icon} text-4xl`}></i>
            </div>
            <p className="text-sm md:text-base text-foreground-800 whitespace-pre-line leading-relaxed">
              {service.title}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}