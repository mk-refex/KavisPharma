import { useEffect, useRef, useState } from 'react';
import { getHomeContent, type HomeStat } from '@/services/api';

const defaultStats: HomeStat[] = [
  { value: 50, suffix: '+', label: 'Years of experience' },
  { value: 100, suffix: '+', label: 'Dedicated Programs' },
  { value: 3, suffix: '', label: 'International Markets' },
  { value: 25, suffix: '+', label: 'Leadership Experience' },
  { value: 100, suffix: '%', label: 'Dedicated supply chain' },
];

function AnimatedCounter({ target, suffix, label }: { target: number; suffix: string; label: string }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [started, target]);

  return (
    <div ref={ref} className="text-center">
      <div className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-primary-500 mb-2">
        {count}{suffix}
      </div>
      <div className="text-xs md:text-sm text-foreground-600">
        {label}
      </div>
    </div>
  );
}

export default function StatsCounter() {
  const [stats, setStats] = useState<HomeStat[]>(defaultStats);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getHomeContent()
      .then((data) => {
        if (data.stats?.length) {
          setStats(data.stats);
        }
      })
      .catch(() => {
        // Keep default stats if API is unavailable
      });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="w-full py-12 md:py-16 bg-background-50">
      <div className={`w-full px-4 md:px-8 lg:px-16 max-w-6xl mx-auto transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <AnimatedCounter key={index} target={stat.value} suffix={stat.suffix} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
