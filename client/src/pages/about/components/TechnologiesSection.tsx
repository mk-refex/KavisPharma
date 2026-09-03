import { useEffect, useState } from 'react';
import { getAboutContent, resolveImageUrl, type TechCard } from '@/services/api';
import { defaultAboutContent } from '@/data/aboutDefaults';

function FlipCard({
  title,
  backText,
  image,
  imagePosition = 'center',
}: {
  title: string;
  backText: string;
  image: string;
  imagePosition?: 'center' | 'right';
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="group relative h-[400px] w-full cursor-pointer"
      style={{ perspective: '1000px' }}
      onMouseEnter={() => setFlipped(true)}
      onMouseLeave={() => setFlipped(false)}
    >
      <div
        className="relative h-full w-full transition-transform duration-500"
        style={{
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
        }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 h-full w-full overflow-hidden"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <img
            src={resolveImageUrl(image)}
            alt={title}
            className={`h-full w-full object-cover ${
              imagePosition === 'right' ? 'object-right' : 'object-center'
            }`}
          />
          <div
            className="absolute inset-0"
            style={{ backgroundColor: '#DBD6D670' }}
          />
          <div className="absolute inset-0 flex items-center justify-center p-5">
            <h3 className="font-heading text-center text-lg font-semibold text-black md:text-xl">
              {title}
            </h3>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 flex h-full w-full flex-col items-center justify-center overflow-hidden px-4 py-5"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            backgroundColor: '#0D77B2',
          }}
        >
          <h3 className="font-heading mb-2 text-center text-sm font-semibold text-white md:text-base">
            {title}
          </h3>
          <div className="whitespace-pre-line text-center text-xs leading-snug text-white/95 md:text-[13px] md:leading-snug">
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
    <section className="w-full bg-background-50 py-12 md:py-16">
      <div className="w-full px-4 md:px-8 lg:px-16">
        <div className="mx-auto mb-10 max-w-4xl text-center md:mb-14">
          <h2 className="font-heading mb-4 text-2xl font-semibold text-foreground-950 md:text-3xl">
            {technologies.title}
          </h2>
          <p className="text-sm leading-relaxed text-foreground-700 md:text-base">
            {technologies.description}
          </p>
        </div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {cards.map((card, index) => (
            <FlipCard
              key={index}
              title={card.title}
              backText={card.backText}
              image={card.image}
              imagePosition={index === 0 ? 'center' : 'right'}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
