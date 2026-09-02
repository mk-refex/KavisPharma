import { useEffect, useState } from 'react';
import { getCareerContent } from '@/services/api';
import { defaultCareerContent } from '@/data/careerDefaults';

export default function DiversitySection() {
  const [diversity, setDiversity] = useState(defaultCareerContent.diversity);

  useEffect(() => {
    getCareerContent()
      .then((data) => {
        if (data.diversity) setDiversity(data.diversity);
      })
      .catch(() => {});
  }, []);

  return (
    <section className="w-full py-12 md:py-16 bg-background-50">
      <div className="w-full px-4 md:px-8 lg:px-16 text-center">
        <h2 className="font-heading text-xl md:text-2xl lg:text-3xl font-semibold text-primary-500 mb-4 leading-relaxed max-w-4xl mx-auto">
          {diversity.title}
        </h2>
        <p className="text-sm md:text-base text-foreground-700 leading-relaxed max-w-4xl mx-auto">
          {diversity.description}
        </p>
      </div>
    </section>
  );
}
