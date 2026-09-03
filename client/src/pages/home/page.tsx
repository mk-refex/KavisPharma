import Navbar from '@/components/feature/Navbar';
import HeroSlider from './components/HeroSlider';
import ExtrovisBanner from './components/ExtrovisBanner';
import ServicesSection from './components/ServicesSection';
import CTAHistorySection from './components/CTAHistorySection';
import AboutSection from './components/AboutSection';
import QualityServicesSection from './components/QualityServicesSection';
import StatsCounter from './components/StatsCounter';
import WorkingAtKavisSection from './components/WorkingAtKavisSection';
import ResearchSection from './components/ResearchSection';
import CertificationsSection from './components/CertificationsSection';

export default function Home() {
  return (
    <div className="overflow-x-hidden">
      {/* First viewport: header + nav + hero = one screen */}
      <div className="h-dvh flex flex-col">
        <Navbar />
        <HeroSlider />
      </div>

      <main>
        <ExtrovisBanner />
        <ServicesSection />
        <CTAHistorySection />
        <AboutSection />
        <QualityServicesSection />
        <StatsCounter />
        <WorkingAtKavisSection />
        <ResearchSection />
        <CertificationsSection />
      </main>
    </div>
  );
}
