import { useEffect, useState } from 'react';
import { getAboutContent } from '@/services/api';
import { defaultAboutContent } from '@/data/aboutDefaults';

export default function AboutIntro() {
  const [intro, setIntro] = useState(defaultAboutContent.intro);

  useEffect(() => {
    getAboutContent()
      .then((data) => {
        if (data.intro) {
          setIntro(data.intro);
        }
      })
      .catch(() => {
        // Keep default intro if API is unavailable
      });
  }, []);

  return (
    <section className="w-full py-12 md:py-16 bg-background-50">
      <div className="w-full px-4 md:px-8 lg:px-16">
        <div className="text-center max-w-4xl mx-auto mb-10 md:mb-14">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground-950 mb-6">
            {intro.title}
          </h2>
          <p className="text-sm md:text-base text-foreground-700 leading-relaxed">
            {intro.description}
          </p>
        </div>
      </div>
    </section>
  );
}
