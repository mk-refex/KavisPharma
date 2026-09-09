import { useEffect, useState } from 'react';
import { getCareerContent, resolveImageUrl } from '@/services/api';
import { defaultCareerContent } from '@/data/careerDefaults';

const CAREER_HERO_IMAGE =
  'https://kavispharma.com/wp-content/uploads/2024/06/bg.jpeg';

export default function CareerHero() {
  const [hero, setHero] = useState({
    ...defaultCareerContent.hero,
    backgroundImage: CAREER_HERO_IMAGE,
  });

  useEffect(() => {
    getCareerContent()
      .then((data) => {
        if (data.hero) {
          setHero({
            ...defaultCareerContent.hero,
            ...data.hero,
            backgroundImage: data.hero.backgroundImage || CAREER_HERO_IMAGE,
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section
      className="relative w-full min-h-[280px] md:min-h-[360px] lg:min-h-[420px] flex items-center overflow-hidden"
      style={{
        backgroundImage: `url(${resolveImageUrl(hero.backgroundImage)})`,
        backgroundPosition: 'top left',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: '#000000',
          opacity: 0.73,
          transition: 'background 0.3s, border-radius 0.3s, opacity 0.3s',
        }}
      />
      <div className="relative z-10 w-full px-4 md:px-8 lg:px-16 py-16 md:py-20 text-center">
        <h1 className="font-heading text-2xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight max-w-4xl mx-auto">
          {hero.title}
        </h1>
        <p className="text-sm md:text-base text-white leading-relaxed max-w-2xl mx-auto mb-6">
          {hero.description}
        </p>
        <a
          href={hero.buttonLink}
          className="inline-block px-6 py-2.5 text-sm font-medium text-white border border-white hover:bg-white/10 transition-colors whitespace-nowrap"
        >
          {hero.buttonText}
        </a>
      </div>
    </section>
  );
}
