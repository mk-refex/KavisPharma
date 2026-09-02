import { useEffect, useState } from 'react';
import { getAboutContent, resolveImageUrl, type AboutCard } from '@/services/api';
import { defaultAboutContent } from '@/data/aboutDefaults';

export default function AboutCards() {
  const [cards, setCards] = useState<AboutCard[]>(defaultAboutContent.cards);

  useEffect(() => {
    getAboutContent()
      .then((data) => {
        if (data.cards?.length) {
          setCards(data.cards);
        }
      })
      .catch(() => {
        // Keep default cards if API is unavailable
      });
  }, []);

  return (
    <section className="w-full py-12 md:py-16 bg-background-50">
      <div className="w-full px-4 md:px-8 lg:px-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 max-w-6xl mx-auto">
          {cards.map((card, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-36 h-36 md:w-44 md:h-44 mb-6 overflow-hidden rounded-full">
                <img
                  src={resolveImageUrl(card.image)}
                  alt={card.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="font-heading text-base md:text-lg font-semibold text-primary-500 mb-3">
                {card.title}
              </h3>
              <p className="text-sm text-foreground-700 leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
