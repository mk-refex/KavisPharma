import { useEffect, useState } from 'react';
import { getCareerContent } from '@/services/api';
import { defaultCareerContent } from '@/data/careerDefaults';

export default function CareerContactCTA() {
  const [cta, setCta] = useState(defaultCareerContent.contactCta);

  useEffect(() => {
    getCareerContent()
      .then((data) => {
        if (data.contactCta) setCta(data.contactCta);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="w-full py-12 md:py-16 bg-primary-500">
      <div className="w-full px-4 md:px-8 lg:px-16 text-center">
        <h2 className="font-heading text-xl md:text-2xl lg:text-3xl font-semibold text-background-50 mb-3 leading-relaxed max-w-4xl mx-auto">
          {cta.title}
        </h2>
        <p className="text-sm md:text-base text-background-200 mb-6">
          {cta.subtitle}
        </p>
        <a
          href={cta.buttonLink}
          className="inline-block px-6 py-3 text-sm font-medium text-white border border-white/60 hover:bg-white/10 transition-colors whitespace-nowrap"
        >
          {cta.buttonText}
        </a>
      </div>
    </section>
  );
}
