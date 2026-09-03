import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAboutContent, resolveImageUrl } from '@/services/api';
import { defaultAboutContent } from '@/data/aboutDefaults';

const DEFAULT_CTA_IMAGE =
  'https://kavispharma.com/wp-content/uploads/2024/06/bg.jpeg';

export default function AboutCTA() {
  const [cta, setCta] = useState(defaultAboutContent.cta);

  useEffect(() => {
    getAboutContent()
      .then((data) => {
        if (data.cta) {
          setCta({
            ...defaultAboutContent.cta,
            ...data.cta,
            image: data.cta.image || defaultAboutContent.cta.image || DEFAULT_CTA_IMAGE,
          });
        }
      })
      .catch(() => {
        // Keep default CTA if API is unavailable
      });
  }, []);

  const backgroundImage = resolveImageUrl(cta.image || DEFAULT_CTA_IMAGE);

  return (
    <section className="relative w-full min-h-[250px] md:min-h-[316px] flex items-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-top bg-no-repeat"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      />
      <div className="absolute inset-0 bg-white/65" />

      <div className="relative z-10 w-full px-4 md:px-8 lg:px-16 py-12 md:py-14 text-center">
        <h2 className="font-heading text-[22px] md:text-[25px] font-medium leading-relaxed text-[#0D77B2] max-w-4xl mx-auto mb-6">
          {cta.title}
        </h2>
        <Link
          to={cta.buttonLink}
          className="inline-block px-7 py-2.5 text-sm font-semibold text-white bg-[#0D77B2] hover:bg-[#0b689c] transition-colors rounded-sm whitespace-nowrap"
        >
          {cta.buttonText}
        </Link>
      </div>
    </section>
  );
}
