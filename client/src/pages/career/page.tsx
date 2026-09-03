import Navbar from '@/components/feature/Navbar';
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
        <CareerHero />
        <CareerGrowth />
        <CareerContactCTA />
        <JobBoard />
        <DiversitySection />
        <CareerBottomImage />
      </main>
    </div>
  );
}
