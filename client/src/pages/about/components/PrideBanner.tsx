import { useEffect, useState } from 'react';
import { getAboutContent, resolveImageUrl } from '@/services/api';
import { defaultAboutContent } from '@/data/aboutDefaults';

export default function PrideBanner() {
  const [banner, setBanner] = useState(defaultAboutContent.prideBanner);

  useEffect(() => {
    getAboutContent()
      .then((data) => {
        if (data.prideBanner) {
          setBanner(data.prideBanner);
        }
      })
      .catch(() => {
        // Keep default banner if API is unavailable
      });
  }, []);

  return (
    <section className="relative w-full py-14 md:py-20 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${resolveImageUrl(banner.backgroundImage)})` }}
      />
      <div className="absolute inset-0 bg-primary-500/85" />
      <div className="relative z-10 w-full px-4 md:px-8 lg:px-16 text-center">
        <h2 className="font-heading text-lg md:text-2xl lg:text-3xl font-medium text-background-50 leading-relaxed max-w-4xl mx-auto">
          {banner.text}
        </h2>
      </div>
    </section>
  );
}
