import { useEffect, useState } from 'react';
import { getCareerContent, resolveImageUrl } from '@/services/api';
import { defaultCareerContent } from '@/data/careerDefaults';

export default function CareerBottomImage() {
  const [imageUrl, setImageUrl] = useState(
    defaultCareerContent.bottomImage.imageUrl,
  );

  useEffect(() => {
    getCareerContent()
      .then((data) => {
        if (data.bottomImage?.imageUrl) {
          setImageUrl(data.bottomImage.imageUrl);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section
      className="relative w-full h-[300px] md:h-[400px] overflow-hidden"
      style={{
        backgroundImage: `url(${resolveImageUrl(imageUrl)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-secondary-500/40" />
    </section>
  );
}
