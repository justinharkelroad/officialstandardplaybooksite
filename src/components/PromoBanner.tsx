import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import challengeBanner from '@/assets/challenge-banner.png';

const PromoBanner = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 py-8 px-4 mt-20 md:mt-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Image */}
          <div className="flex-shrink-0">
            <img 
              src={challengeBanner} 
              alt="Producer Power Up Challenge" 
              className="w-48 h-48 md:w-56 md:h-56 object-contain drop-shadow-2xl"
            />
          </div>
          
          {/* Content */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-white text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
              6 Weeks - 30 Trainings - 1 Producer Finding Their Power
            </h2>
            <Button
              onClick={() => navigate('/thechallenge')}
              className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-8 py-6 text-lg"
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
