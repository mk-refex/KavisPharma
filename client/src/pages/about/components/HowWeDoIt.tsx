import { useEffect, useState } from 'react';
import { getAboutContent, resolveImageUrl } from '@/services/api';
import { defaultAboutContent } from '@/data/aboutDefaults';

export default function HowWeDoIt() {
  const [section, setSection] = useState(defaultAboutContent.howWeDoIt);

  useEffect(() => {
    getAboutContent()
      .then((data) => {
        if (data.howWeDoIt) {
          setSection(data.howWeDoIt);
        }
      })
      .catch(() => {
        // Keep default content if API is unavailable
      });
  }, []);

  return (
    <section className="w-full py-12 md:py-16 bg-primary-500">
      <div className="w-full px-4 md:px-8 lg:px-16">
        <div className="text-center max-w-4xl mx-auto mb-10 md:mb-14">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-background-50 mb-4">
            {section.title}
          </h2>
          <p className="text-sm md:text-base text-background-200 leading-relaxed">
            {section.description}
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="w-48 h-48 md:w-56 md:h-56 overflow-hidden rounded-full">
                <img
                  src={resolveImageUrl(section.qualityAssurance.image)}
                  alt={section.qualityAssurance.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="w-full md:w-2/3 text-center md:text-left">
              <h3 className="font-heading text-xl md:text-2xl font-semibold text-background-50 mb-4">
                {section.qualityAssurance.title}
              </h3>
              <p className="text-sm md:text-base text-background-200 leading-relaxed">
                {section.qualityAssurance.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
