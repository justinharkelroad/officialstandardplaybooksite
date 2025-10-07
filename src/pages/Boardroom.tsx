
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import BoardroomHero from '@/components/sections/BoardroomHero';
import BoardroomFeatures from '@/components/sections/BoardroomFeatures';
import BoardroomBusiness from '@/components/sections/BoardroomBusiness';
import BoardroomWhy from '@/components/sections/BoardroomWhy';
import BoardroomPricing from '@/components/sections/BoardroomPricing';
import BoardroomFAQ from '@/components/sections/BoardroomFAQ';
import BoardroomIncludes from '@/components/sections/BoardroomIncludes';

const Boardroom = () => {
  const handleJoinNow = () => {
    window.open('https://link.fastpaydirect.com/payment-link/68371b280a5741f8835218c8', '_blank');
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <BoardroomHero />
      <BoardroomIncludes />
      <BoardroomBusiness />
      <BoardroomWhy />
      <BoardroomPricing />
      
      {/* Final CTA Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-8">
              Two Types of Agency Owners
            </h2>
            <div className="space-y-6 text-xl text-gray-300 mb-12">
              <p><strong>Type 1:</strong> Reads this and thinks "someday"</p>
              <p><strong>Type 2:</strong> Reads this and thinks "why not today?"</p>
              
              <p className="text-white font-bold">One builds businesses.<br />One builds empires.</p>
              
              <p className="text-primary font-medium">Capacity is limited.</p>
              
              <p>Not because we can't find people.<br />Because we won't accept tourists.</p>
              
              <p className="text-white font-bold">This is your interview.<br />This page? Your first test.</p>
              
              <p className="text-primary font-medium">If you've read this far without applying, you've already failed.</p>
            </div>
            
            <Button onClick={handleJoinNow} className="btn-primary text-xl px-12 py-6 mb-8">
              JOIN THE BOARDROOM →
            </Button>
            
            <p className="text-gray-300 italic">Comfort is not allowed.</p>
            
            <p className="text-sm text-gray-400 mt-6">
              <strong>Final Warning:</strong> Every month you wait, someone else takes your market share, your best people, and your future. They're not smarter. They just stopped making decisions alone.
            </p>
          </div>
        </div>
      </section>
      
      <BoardroomFAQ />

      {/* Sticky CTA for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-dark-card border-t border-primary/20 p-4 md:hidden z-40">
        <Button onClick={handleJoinNow} className="btn-primary w-full">
          BURN THE BOATS →
        </Button>
      </div>

      <Footer />
    </div>
  );
};

export default Boardroom;
