import { useEffect, useState } from 'react';
import { getAboutContent, resolveImageUrl, type TechCard } from '@/services/api';
import { defaultAboutContent } from '@/data/aboutDefaults';

function FlipCard({
  title,
  backText,
  image,
}: {
  title: string;
  backText: string;
  image: string;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative w-full h-72 md:h-80 cursor-pointer group"
      style={{ perspective: '1000px' }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div
        className="relative w-full h-full transition-transform duration-700"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        <div
          className="absolute inset-0 w-full h-full rounded-lg overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <img
            src={resolveImageUrl(image)}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary-500/70" />
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <h3 className="font-heading text-lg md:text-xl font-semibold text-white text-center">
              {title}
            </h3>
          </div>
        </div>

        <div
          className="absolute inset-0 w-full h-full rounded-lg bg-primary-600 p-5 md:p-6 flex flex-col items-center justify-center overflow-y-auto"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <h3 className="font-heading text-base md:text-lg font-semibold text-white text-center mb-3">
            {title}
          </h3>
          <div className="text-sm text-white/90 leading-relaxed text-center whitespace-pre-line">
            {backText}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TechnologiesSection() {
  const [technologies, setTechnologies] = useState(defaultAboutContent.technologies);
  const [cards, setCards] = useState<TechCard[]>(
    defaultAboutContent.technologies.cards,
  );

  useEffect(() => {
    getAboutContent()
      .then((data) => {
        if (data.technologies) {
          setTechnologies(data.technologies);
          if (data.technologies.cards?.length) {
            setCards(data.technologies.cards);
          }
        }
      })
      .catch(() => {
        // Keep default content if API is unavailable
      });
  }, []);

  return (
    <section className="w-full py-12 md:py-16 bg-background-50">
      <div className="w-full px-4 md:px-8 lg:px-16">
        <div className="text-center max-w-4xl mx-auto mb-10 md:mb-14">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground-950 mb-4">
            {technologies.title}
          </h2>
          <p className="text-sm md:text-base text-foreground-700 leading-relaxed">
            {technologies.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {cards.map((card, index) => (
            <FlipCard
              key={index}
              title={card.title}
              backText={card.backText}
              image={card.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
