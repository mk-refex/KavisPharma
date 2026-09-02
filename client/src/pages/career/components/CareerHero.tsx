import { useEffect, useState } from 'react';
import { getCareerContent, resolveImageUrl } from '@/services/api';
import { defaultCareerContent } from '@/data/careerDefaults';

export default function CareerHero() {
  const [hero, setHero] = useState(defaultCareerContent.hero);

  useEffect(() => {
    getCareerContent()
      .then((data) => {
        if (data.hero) setHero(data.hero);
      })
      .catch(() => {});
  }, []);

  return (
    <section
      className="relative w-full py-20 md:py-28 overflow-hidden"
      style={{
        backgroundImage: `url(${resolveImageUrl(hero.backgroundImage)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-secondary-500/80" />
      <div className="relative z-10 w-full px-4 md:px-8 lg:px-16 text-center">
        <h1 className="font-heading text-2xl md:text-4xl lg:text-5xl font-bold text-background-50 mb-4 leading-tight max-w-4xl mx-auto">
          {hero.title}
        </h1>
        <p className="text-sm md:text-base text-background-200 leading-relaxed max-w-2xl mx-auto mb-6">
          {hero.description}
        </p>
        <a
          href={hero.buttonLink}
          className="inline-block px-6 py-3 text-sm font-medium text-white border border-white/60 hover:bg-white/10 transition-colors whitespace-nowrap"
        >
          {hero.buttonText}
        </a>
      </div>
    </section>
  );
}
