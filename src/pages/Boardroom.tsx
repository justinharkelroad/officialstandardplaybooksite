
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import BoardroomHero from '@/components/sections/BoardroomHero';
import BoardroomProblem from '@/components/sections/BoardroomProblem';
import BoardroomFeatures from '@/components/sections/BoardroomFeatures';
import BoardroomBusiness from '@/components/sections/BoardroomBusiness';
import BoardroomWhy from '@/components/sections/BoardroomWhy';
import BoardroomPricing from '@/components/sections/BoardroomPricing';
import BoardroomFAQ from '@/components/sections/BoardroomFAQ';

const Boardroom = () => {
  const handleJoinNow = () => {
    window.open('https://link.fastpaydirect.com/payment-link/68371b280a5741f8835218c8', '_blank');
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <BoardroomHero />
      <BoardroomProblem />
      <BoardroomFeatures />
      <BoardroomBusiness />
      <BoardroomWhy />
      <BoardroomPricing />
      <BoardroomFAQ />

      {/* Sticky CTA for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-dark-card border-t border-primary/20 p-4 md:hidden z-40">
        <Button onClick={handleJoinNow} className="btn-primary w-full">
          Join The Boardroom
        </Button>
      </div>

      <Footer />
    </div>
  );
};

export default Boardroom;
