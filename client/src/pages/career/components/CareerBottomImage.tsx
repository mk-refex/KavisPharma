import { useEffect, useState } from 'react';
import { getCareerContent, resolveImageUrl } from '@/services/api';

const CAREER_BOTTOM_IMAGE =
  'https://kavispharma.com/wp-content/uploads/2024/06/career-bg.jpeg';

export default function CareerBottomImage() {
  const [imageUrl, setImageUrl] = useState(CAREER_BOTTOM_IMAGE);

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
      className="relative w-full h-[301px] overflow-hidden"
      style={{
        backgroundImage: `url(${resolveImageUrl(imageUrl)})`,
        backgroundPosition: 'center left',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    />
  );
}
