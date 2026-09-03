import Navbar from '@/components/feature/Navbar';
import AboutHeroSlider from './components/AboutHeroSlider';
import PrideBanner from './components/PrideBanner';
import AboutIntro from './components/AboutIntro';
import AboutCards from './components/AboutCards';
import HowWeDoIt from './components/HowWeDoIt';
import TechnologiesSection from './components/TechnologiesSection';
import TeamSection from './components/TeamSection';
import AboutCTA from './components/AboutCTA';

export default function About() {
  return (
    <div className="overflow-x-hidden">
      <div className="h-dvh flex flex-col">
        <Navbar />
        <AboutHeroSlider />
      </div>

      <main>
        <PrideBanner />
        <AboutIntro />
        <AboutCards />
        <HowWeDoIt />
        <TechnologiesSection />
        <TeamSection />
        <AboutCTA />
      </main>
    </div>
  );
}
