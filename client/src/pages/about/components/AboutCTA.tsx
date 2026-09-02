import { useEffect, useState } from 'react';
import { getAboutContent } from '@/services/api';
import { defaultAboutContent } from '@/data/aboutDefaults';

export default function AboutCTA() {
  const [cta, setCta] = useState(defaultAboutContent.cta);

  useEffect(() => {
    getAboutContent()
      .then((data) => {
        if (data.cta) {
          setCta(data.cta);
        }
      })
      .catch(() => {
        // Keep default CTA if API is unavailable
      });
  }, []);

  return (
    <section className="relative w-full py-12 md:py-16 bg-primary-500 overflow-hidden">
      <div className="absolute inset-0 bg-primary-500/90" />
      <div className="relative z-10 w-full px-4 md:px-8 lg:px-16 text-center">
        <h2 className="font-heading text-lg md:text-2xl lg:text-3xl font-medium text-background-50 leading-relaxed max-w-4xl mx-auto mb-6">
          {cta.title}
        </h2>
        <a
          href={cta.buttonLink}
          className="inline-block px-6 py-3 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 transition-colors rounded-sm whitespace-nowrap"
        >
          {cta.buttonText}
        </a>
      </div>
    </section>
  );
}
