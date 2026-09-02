import Navbar from '@/components/feature/Navbar';
import Footer from '@/components/feature/Footer';
import CareerHero from './components/CareerHero';
import CareerGrowth from './components/CareerGrowth';
import CareerContactCTA from './components/CareerContactCTA';
import JobBoard from './components/JobBoard';
import DiversitySection from './components/DiversitySection';
import CareerBottomImage from './components/CareerBottomImage';

export default function Career() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <CareerHero />

        {/* Grow Your Career */}
        <CareerGrowth />

        {/* Contact CTA */}
        <CareerContactCTA />

        {/* Job Board */}
        <JobBoard />

        {/* Diversity Section */}
        <DiversitySection />

        {/* Bottom Image */}
        <CareerBottomImage />
      </main>
      <Footer />
    </div>
  );
}