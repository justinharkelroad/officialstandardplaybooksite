import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import VideoPlayer from '@/components/VideoPlayer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const WelcomeToCoaching = () => {
  const faqs = [
    {
      question: "How do I access The Standard App?",
      answer: "You'll receive login credentials via email within 24 hours of enrollment. Download the app from your app store and use those credentials to access all features."
    },
    {
      question: "When do the Boardroom calls happen?",
      answer: "Boardroom calls are held every Tuesday at 2 PM EST. You'll receive calendar invitations with Zoom links automatically."
    },
    {
      question: "What if I need 1-on-1 support?",
      answer: "You can book individual coaching calls anytime using the booking link provided. We recommend scheduling these at least 48 hours in advance."
    },
    {
      question: "How does Call Scoring work?",
      answer: "Upload your recorded sales calls to the platform, and our AI will analyze them against proven frameworks, providing detailed feedback and improvement suggestions."
    }
  ];

  return (
    <div className="min-h-screen bg-dark text-white">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative bg-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="font-rajdhani font-bold text-5xl lg:text-7xl uppercase tracking-wide text-white mb-4">
              WELCOME TO THE STANDARD
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 mb-12">
              THIS IS YOUR WELCOME PAGE
            </p>
            
            {/* Welcome Video */}
            <div className="aspect-video w-full mb-12 rounded-lg overflow-hidden border border-primary/20">
              <VideoPlayer 
                videoId="iHdAjyoYHuQ"
                title="Welcome to The Standard"
                className="w-full h-full"
              />
            </div>

            {/* CTA Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <Button 
                onClick={() => window.open('https://AGENCYCOACHING.as.me/2HR', '_blank')}
                className="btn-primary text-lg py-6"
              >
                BOOK 1-ON-1 CALL
              </Button>
              <Button 
                onClick={() => window.open('https://us06web.zoom.us/meeting/register/tZIvdOuurTkvGtB3DFPus_VohU6a22LFlb8t', '_blank')}
                className="btn-primary text-lg py-6"
              >
                BOOK BOARDROOM
              </Button>
              <Button 
                onClick={() => window.open('https://form.jotform.com/242944208646159', '_blank')}
                className="btn-primary text-lg py-6"
              >
                GET FREE SWAG
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* The Standard App Section */}
      <section className="py-20 relative bg-dark">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-7xl mx-auto">
            {/* Video Left */}
            <div className="aspect-video w-full rounded-lg overflow-hidden border border-primary/20">
              <VideoPlayer 
                videoId="LDc3jLIrZRw"
                title="The Standard App Demo"
                className="w-full h-full"
              />
            </div>

            {/* Info Right */}
            <Card className="bg-dark-card border-primary/20">
              <CardContent className="p-8">
                <h2 className="font-rajdhani font-bold text-3xl lg:text-4xl uppercase tracking-wide text-white mb-6">
                  THE STANDARD APP
                </h2>
                <div className="space-y-4 text-gray-300">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>You will receive password reset from support@wakeupwarrior.com</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Once logged in you will complete your profile</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Head to "Armory" tab to view Training Videos</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>You have FULL ACCESS to the app w/ your level of membership</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Direct App Access @ <a href="https://standardplaybook.com/app" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">standardplaybook.com/app</a></span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call Scoring Section */}
      <section className="py-20 relative bg-dark-card/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-7xl mx-auto">
            {/* Video - appears first on mobile, second on desktop */}
            <div className="aspect-video w-full rounded-lg overflow-hidden border border-primary/20 order-1 lg:order-2">
              <VideoPlayer 
                videoId="4sbJ4amGuE8"
                title="Call Scoring Demo"
                className="w-full h-full"
              />
            </div>

            {/* Info - appears second on mobile, first on desktop */}
            <Card className="bg-dark-card border-primary/20 order-2 lg:order-1">
              <CardContent className="p-8">
                <h2 className="font-rajdhani font-bold text-3xl lg:text-4xl uppercase tracking-wide text-white mb-6">
                  CALL SCORING
                </h2>
                <div className="space-y-4 text-gray-300">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Your modules and program are ready</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Head to <a href="https://app.standardcallscoring.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">app.standardcallscoring.com</a> and click on (forgot?) to receive a password reset link for access</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Drop a couple calls to get feedback and determine adjustments you'd like</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>You have 100 calls per month with your level of membership</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Agency Brain Section */}
      <section className="py-20 relative bg-dark">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-7xl mx-auto">
            {/* Video Left */}
            <div className="aspect-video w-full rounded-lg overflow-hidden border border-primary/20">
              <VideoPlayer 
                videoId="Xj32FPpgTBc"
                title="Agency Brain Demo"
                className="w-full h-full"
              />
            </div>

            {/* Info Right */}
            <Card className="bg-dark-card border-primary/20">
              <CardContent className="p-8">
                <h2 className="font-rajdhani font-bold text-3xl lg:text-4xl uppercase tracking-wide text-white mb-6">
                  AGENCY BRAIN
                </h2>
                <div className="space-y-4 text-gray-300">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>To set up your AgencyBrain, visit <a href="https://myagencybrain.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">myagencybrain.com</a></span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Click on "Create Account"</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Input your info and your passcode is: 3148178</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Challenge Section */}
      <section className="py-20 relative bg-dark-card/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-7xl mx-auto">
            {/* Video - appears first on mobile, second on desktop */}
            <div className="aspect-video w-full rounded-lg overflow-hidden border border-primary/20 order-1 lg:order-2">
              <VideoPlayer 
                videoId="1NzNXlsGOQs"
                title="Team Challenge Demo"
                className="w-full h-full"
              />
            </div>

            {/* Info - appears second on mobile, first on desktop */}
            <Card className="bg-dark-card border-primary/20 order-2 lg:order-1">
              <CardContent className="p-8">
                <h2 className="font-rajdhani font-bold text-3xl lg:text-4xl uppercase tracking-wide text-white mb-6">
                  TEAM CHALLENGE
                </h2>
                <div className="space-y-4 text-gray-300">
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>You receive the team challenge at a wholesale cost of $50 per team member</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>To enroll them, just visit <a href="https://StandardChallenge.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">StandardChallenge.com</a></span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Use code STANDARD50 to get $249 off each access pass</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Other Relevant Links Section */}
      <section className="py-20 relative bg-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-rajdhani font-bold text-4xl lg:text-5xl uppercase tracking-wide text-white mb-12">
              OTHER RELEVANT LINKS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Button 
                onClick={() => window.open('https://createthestandard.com/zoom', '_blank')}
                variant="outline"
                className="text-lg py-6 border-primary text-white hover:bg-primary/10"
              >
                ACCESS MY ZOOM ROOM
              </Button>
              <Button 
                onClick={() => window.open('https://www.facebook.com/justin.ncorinaharkelroad', '_blank')}
                variant="outline"
                className="text-lg py-6 border-primary text-white hover:bg-primary/10"
              >
                CONNECT ON SOCIAL
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WelcomeToCoaching;

