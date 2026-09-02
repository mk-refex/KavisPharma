import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getHomeContent, resolveImageUrl } from '@/services/api';

const DEFAULT_IMAGE =
  'https://kavispharma.com/wp-content/uploads/2024/06/changing-the-future-one-experiment-at-a-time-1191463139-1040x1040-c-center-1024x1024.webp';

export default function AboutSection() {
  const [visible, setVisible] = useState(false);
  const [image, setImage] = useState(DEFAULT_IMAGE);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getHomeContent()
      .then((data) => {
        if (data.sectionImages?.aboutSection) {
          setImage(data.sectionImages.aboutSection);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="w-full py-12 md:py-16 bg-background-50">
      <div ref={ref} className="w-full px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          <div className={`flex-1 transition-all duration-700 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
            <h2 className="font-heading text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground-950 mb-3">
              A Premier Pharmaceutical Manufacturer
            </h2>
            <p className="text-sm text-primary-500 font-medium mb-4">
              We come with over 5 decades of experience in changing lives through science
            </p>
            <p className="text-sm md:text-base text-foreground-700 leading-relaxed mb-4">
              At Kavis Pharma, we are dedicated to producing high-quality pharmaceuticals through a dedicated supply chain to make a real impact on people's lives. Working closely with Extrovis and our strategic partners, we support the development and supply of life-changing medications across the United States, Europe and Canada. In addition to manufacturing, we are a proven CMO provider keenly focused on strategic partnerships with our contract customers. We excel in manufacturing complex pharmaceuticals, including non-sterile semi-solid, and liquid medications. With advanced engineering controls, we guarantee the safe and effective production of high-alcohol products, cytotoxic formulations, potent compounds, and hormones.
            </p>
            <p className="text-sm md:text-base text-foreground-700 leading-relaxed mb-6">
              With a dedication to enhancing access to high-quality medicines, we strive to maintain a dependable supply chain, ensuring our customers can receive timely and appropriate treatments wherever and whenever required.
            </p>
            <Link
              to="/about"
              className="inline-block px-6 py-2.5 bg-primary-500 text-background-50 text-sm font-medium rounded-md hover:bg-primary-600 transition-colors whitespace-nowrap"
            >
              Know more
            </Link>
          </div>

          <div className={`flex-1 transition-all duration-700 delay-200 ${visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
            <div className="relative overflow-hidden">
              <img
                src={resolveImageUrl(image)}
                alt="Pharmaceutical research laboratory"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
