import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import challengeBanner from '@/assets/challenge-banner.png';

const PromoBanner = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-gradient-to-r from-blue-900 via-blue-700 to-blue-600 py-3 px-4 mt-20 md:mt-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4">
          {/* Image */}
          <div className="flex-shrink-0">
            <img 
              src={challengeBanner} 
              alt="Producer Power Up Challenge" 
              className="w-48 h-48 md:w-40 md:h-40 object-contain drop-shadow-2xl"
            />
          </div>
          
          {/* Content */}
          <div className="flex-1 text-center">
            <h2 className="text-white text-xl md:text-2xl lg:text-3xl font-bold mb-3 leading-tight">
              6 WEEKS - 30 TRAININGS<br />
              1 PRODUCER FINDING THEIR POWER
            </h2>
            <Button
              onClick={() => navigate('/thechallenge')}
              className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-6 py-3 text-base"
            >
              Learn More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoBanner;
