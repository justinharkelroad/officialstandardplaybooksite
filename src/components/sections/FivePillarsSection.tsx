import { CheckCircle } from 'lucide-react';

const FivePillarsSection = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-8">
            What Makes The Standard Different?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            We don't sell hope. We architect ascension through five undeniable phases:
          </p>
          
          <div className="bg-dark-card border-primary/20 rounded-lg p-8 text-left">
            <div className="space-y-6">
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-primary mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-bold text-lg mb-2">ACCESS to the minds that matter</h3>
                  <p className="text-gray-300">Direct connection to frameworks, systems, and intelligence that built empires</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-primary mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-bold text-lg mb-2">ASSOCIATION with empires, not employees</h3>
                  <p className="text-gray-300">Your environment determines your ceiling. Surround yourself with operators who've already ascended</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-primary mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-bold text-lg mb-2">ACCOUNTABILITY that cuts through comfort</h3>
                  <p className="text-gray-300">Truth without consequences is just conversation. Get accountability with teeth</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-primary mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-bold text-lg mb-2">ACCELERATION through borrowed experience</h3>
                  <p className="text-gray-300">Why learn from your mistakes when you can download others' wisdom</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-primary mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-bold text-lg mb-2">ASCENSION to your final form</h3>
                  <p className="text-gray-300">Become someone whose old goals look like poverty thinking</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-primary/20 text-center">
              <p className="text-primary font-medium text-lg mb-2">
                Every program. Every level. Every transformation.
              </p>
              <p className="text-gray-300">
                Same architecture. Different altitude.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FivePillarsSection;