import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import promoLogo from '@/assets/promo-logo.png';

const PromoBanner = () => {
  const navigate = useNavigate();

  const handleCallScoringClick = () => {
    navigate('/callscoring', { state: { scrollToPricing: true } });
  };

  const handleCoachingClick = () => {
    window.open('https://agencycoaching.as.me/standardfit', '_blank');
  };

  return (
    <div className="w-full bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 py-6 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Top tier - Logo */}
        <div className="flex justify-center mb-6">
          <img src={promoLogo} alt="Formula Logo" className="w-24 h-24 object-contain" />
        </div>

        {/* Bottom tier - Two columns with buttons */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left column - Call Scoring */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 flex flex-col items-center text-center">
            <p className="text-white text-sm mb-4 leading-relaxed">
              Special Formula Offer for Limited Time. Get Any Level of Call Scoring for 50% Off The First Month. No Commitment
            </p>
            <div className="relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                AI Call Scoring
              </div>
              <Button
                onClick={handleCallScoringClick}
                className="bg-white text-orange-600 hover:bg-gray-100 font-bold px-8 py-6 text-lg mt-2"
              >
                GET 50% OFF FIRST MONTH
              </Button>
            </div>
          </div>

          {/* Right column - Coaching */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 flex flex-col items-center text-center">
            <p className="text-white text-sm mb-4 leading-relaxed">
              Book a Discovery Call & Sign Up For One on One Coaching to Receive One Free Team Call.
            </p>
            <div className="relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-400 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                1 v 1 Coaching
              </div>
              <Button
                onClick={handleCoachingClick}
                className="bg-white text-orange-600 hover:bg-gray-100 font-bold px-8 py-6 text-lg mt-2"
              >
                Get Free Team Coaching Call*
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
