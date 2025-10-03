
import { Card, CardContent } from '@/components/ui/card';
import { useScrollReveal } from '@/hooks/useScrollReveal';

const TestimonialsSection = () => {
  const { ref, isVisible } = useScrollReveal();
  
  return (
    <section 
      ref={ref as React.RefObject<HTMLElement>}
      id="testimonials" 
      className={`py-20 relative transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-oswald font-bold text-4xl md:text-6xl uppercase tracking-tight text-white mb-6">
            Success Stories
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-dark-card border-primary/20 card-hover">
            <CardContent className="pt-6">
              <div className="mb-4">
                <div className="flex text-primary mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-gray-300 italic">
                  "Working with Justin Harkelroad has truly transformed my insurance agency, both professionally and personally. His quick responses over text and always spot-on advice have been invaluable, helping me navigate challenges with confidence and clarity. Justin's mentorship has been a game-changer, and I'm incredibly grateful for his guidance and impact on my journey"
                </blockquote>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-semibold">JC</span>
                </div>
                <div>
                  <p className="text-white font-semibold">Jackie Crane</p>
                  <p className="text-gray-400 text-sm">Allstate Insurance</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-dark-card border-primary/20 card-hover">
            <CardContent className="pt-6">
              <div className="mb-4">
                <div className="flex text-primary mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-gray-300 italic">
                  "Justin has been instrumental in helping me achieve balance in both my personal life and business. His guidance has not only fostered my personal growth but has also elevated my business and team to levels I'm incredibly proud of. I'm appreciative of Justin's time and dedication to my continued growth, making the journey exciting as I strive to win at this thing called life!"
                </blockquote>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary-accent rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-semibold">HE</span>
                </div>
                <div>
                  <p className="text-white font-semibold">Heather Ebersole</p>
                  <p className="text-gray-400 text-sm">Allstate Insurance</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-dark-card border-primary/20 card-hover">
            <CardContent className="pt-6">
              <div className="mb-4">
                <div className="flex text-primary mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <blockquote className="text-gray-300 italic">
                  "While searching for standout consultants, Justin Harkelroad's name consistently surfaced—and for good reason. Justin has far exceeded expectations, guiding my team and me through every challenge our business has faced. Grounded in God-fearing principles, his coaching has transformed not only how I manage my business but also how I engage with my family. He continually pushes me to grow into a better man. His sharp attention to detail and strong business acumen are just the icing on the cake of the invaluable lessons he's imparted."
                </blockquote>
              </div>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-semibold">NS</span>
                </div>
                <div>
                  <p className="text-white font-semibold">Nick Siciliano</p>
                  <p className="text-gray-400 text-sm">Allstate Insurance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
