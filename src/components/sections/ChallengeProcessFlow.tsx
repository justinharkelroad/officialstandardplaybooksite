import React, { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";
import step1 from '@/assets/step-1.png';
import step2 from '@/assets/step-2.png';
import step3 from '@/assets/step-3.png';
import step4 from '@/assets/step-4.png';
import step5 from '@/assets/step-5.png';

const steps = [
  {
    number: 1,
    name: "TRAIN",
    image: step1,
    description: "Start your transformation with daily micro-lessons that build momentum and create lasting change in your leadership approach."
  },
  {
    number: 2,
    name: "DECLARE",
    image: step2,
    description: "Declare your intentions and create accountability systems that ensure you follow through on your commitment to growth."
  },
  {
    number: 3,
    name: "TRACK",
    image: step3,
    description: "Track your Core 4 daily metrics for visible progress and measurable improvements in your leadership effectiveness."
  },
  {
    number: 4,
    name: "EXTRACT",
    image: step4,
    description: "Extract insights through weekly reflection sessions that turn experience into wisdom and accelerate your development."
  },
  {
    number: 5,
    name: "CELEBRATE",
    image: step5,
    description: "Celebrate wins and compound your success by recognizing progress and building on each achievement."
  }
];

export default function ChallengeProcessFlow() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="font-oswald font-bold text-4xl md:text-5xl uppercase tracking-tight text-white mb-12 text-center animate-fade-up">
          INTENTIONALLY MADE EXTREMELY SIMPLE TO FOLLOW
        </h2>
        
        <div className="max-w-4xl mx-auto">
          <Carousel 
            opts={{ align: "center", loop: false }}
            setApi={setApi}
            className="w-full"
          >
            <CarouselContent>
              {steps.map((step, index) => (
                <CarouselItem key={step.number} className="md:basis-4/5 lg:basis-3/4">
                  <div className="bg-dark-card border border-primary/20 rounded-lg p-8 mx-4 animate-fade-up">
                    <div className="text-center">
                      <img 
                        src={step.image} 
                        alt={`Step ${step.number} - ${step.name}`} 
                        className="w-full max-w-md mx-auto mb-6 rounded-lg"
                      />
                      <p className="text-gray-300 text-lg leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 md:-left-12" />
            <CarouselNext className="right-2 md:-right-12" />
          </Carousel>
          
          <div className="flex justify-center mt-8 space-x-2">
            {steps.map((_, index) => (
              <button 
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  current === index ? 'bg-primary' : 'bg-gray-600'
                }`}
                onClick={() => api?.scrollTo(index)}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}