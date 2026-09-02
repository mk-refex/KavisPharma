import { useEffect, useState } from 'react';
import { getCareerContent } from '@/services/api';
import { defaultCareerContent } from '@/data/careerDefaults';

export default function CareerGrowth() {
  const [growth, setGrowth] = useState(defaultCareerContent.growth);

  useEffect(() => {
    getCareerContent()
      .then((data) => {
        if (data.growth) setGrowth(data.growth);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="w-full py-12 md:py-16 bg-background-50">
      <div className="w-full px-4 md:px-8 lg:px-16">
        <div className="text-center max-w-4xl mx-auto mb-10 md:mb-14">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-primary-500 mb-4">
            {growth.title}
          </h2>
          <p className="text-sm md:text-base text-foreground-700 leading-relaxed">
            {growth.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 max-w-4xl mx-auto">
          {growth.cards.map((card, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-14 h-14 flex items-center justify-center mb-4 text-primary-500">
                <i className={`${card.icon} text-4xl`} />
              </div>
              <p className="text-sm md:text-base text-foreground-700 leading-relaxed">
                {card.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
