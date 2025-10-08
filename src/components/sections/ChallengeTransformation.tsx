import { useEffect } from 'react';

// Declare Wistia custom element for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'wistia-player': any;
    }
  }
}

const ChallengeTransformation = () => {
  useEffect(() => {
    // Load Wistia player scripts
    const script1 = document.createElement('script');
    script1.src = 'https://fast.wistia.com/player.js';
    script1.async = true;
    document.body.appendChild(script1);

    const script2 = document.createElement('script');
    script2.src = 'https://fast.wistia.com/embed/t8m2sv6yma.js';
    script2.async = true;
    script2.type = 'module';
    document.body.appendChild(script2);

    return () => {
      if (script1.parentNode) script1.parentNode.removeChild(script1);
      if (script2.parentNode) script2.parentNode.removeChild(script2);
    };
  }, []);

  const transformationPoints = [
    "Weekly Discovery Stacks that reinforce your team's identity as value-first professionals",
    "Personal accountability mindset activation that transforms how team members see themselves",
    "Activity-to-results understanding that builds confidence in their producer identity",
    "Owner Fast Track Coaching PDF to accelerate leadership identity development",
    "60 days of identity-reinforcing habit development through The Standard App",
    "Cultural transformation that elevates everyone's professional identity",
    "Continued growth through Standard Membership with 25% discount"
  ];

  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-12 text-center">
            How This Transforms Your Team's Identity
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div className="bg-dark-card border-primary/20 rounded-lg p-8">
              <ul className="space-y-4">
                {transformationPoints.map((point, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-primary mr-3 mt-1">•</span>
                    <span className="text-gray-300">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: Video */}
            <div className="relative">
              <div className="aspect-square rounded-lg overflow-hidden border border-primary/20 bg-black">
                <style dangerouslySetInnerHTML={{
                  __html: `
                    wistia-player[media-id='t8m2sv6yma']:not(:defined) { 
                      background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/t8m2sv6yma/swatch'); 
                      display: block; 
                      filter: blur(5px); 
                      padding-top:100.0%; 
                    }
                    wistia-player[media-id='t8m2sv6yma'] {
                      width: 100%;
                      height: 100%;
                    }
                  `
                }} />
                <wistia-player media-id="t8m2sv6yma" aspect="1.0"></wistia-player>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChallengeTransformation;
