import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import VideoPlayer from '@/components/VideoPlayer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const WelcomeBoardroom = () => {
  const faqs = [
    {
      question: "When do Boardroom calls happen?",
      answer: "Boardroom calls are held every Tuesday at 2 PM EST. You'll receive calendar invitations with Zoom links automatically."
    },
    {
      question: "How do I access The Standard App?",
      answer: "You'll receive login credentials via email within 24 hours of enrollment. Download the app from your app store and use those credentials to access all features."
    },
    {
      question: "What if I need additional support?",
      answer: "You can reach out to the community or schedule additional coaching time if needed. We're here to help you succeed."
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
              WELCOME TO BOARDROOM
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300 mb-12">
              THIS IS YOUR WELCOME PAGE
            </p>
            
            {/* Welcome Video */}
            <div className="aspect-video w-full mb-12 rounded-lg overflow-hidden border border-primary/20">
              <VideoPlayer 
                videoId="YOUR_WELCOME_VIDEO_ID"
                title="Welcome to Boardroom"
                className="w-full h-full"
              />
            </div>

            {/* CTA Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
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
                videoId="YOUR_STANDARD_APP_VIDEO_ID"
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
                  <p className="font-semibold text-white mb-4">INFORMATION BOX</p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Access all your coaching materials in one place</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Track your progress and metrics in real-time</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Watch training videos and complete assignments</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Connect with your coach and team members</span>
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
                videoId="YOUR_CALL_SCORING_VIDEO_ID"
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
                  <p className="font-semibold text-white mb-4">INFORMATION BOX</p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>AI-powered analysis of your sales calls</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Detailed scoring against proven frameworks</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Personalized feedback and improvement tips</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Track improvement over time with metrics</span>
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
                videoId="YOUR_AGENCY_BRAIN_VIDEO_ID"
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
                  <p className="font-semibold text-white mb-4">INFORMATION BOX</p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Your AI-powered agency assistant</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Get instant answers to agency questions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Access proven scripts and frameworks</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Generate custom solutions for your challenges</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 8 Week Sales Management Training Section */}
      <section className="py-20 relative bg-dark-card/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-7xl mx-auto">
            {/* Video - appears first on mobile, second on desktop */}
            <div className="aspect-video w-full rounded-lg overflow-hidden border border-primary/20 order-1 lg:order-2">
              <VideoPlayer 
                videoId="YOUR_8_WEEK_VIDEO_ID"
                title="8 Week Sales Mgmt Training Demo"
                className="w-full h-full"
              />
            </div>

            {/* Info - appears second on mobile, first on desktop */}
            <Card className="bg-dark-card border-primary/20 order-2 lg:order-1">
              <CardContent className="p-8">
                <h2 className="font-rajdhani font-bold text-3xl lg:text-4xl uppercase tracking-wide text-white mb-6">
                  8 WEEK SALES MGMT TRAINING
                </h2>
                <div className="space-y-4 text-gray-300">
                  <p className="font-semibold text-white mb-4">INFORMATION BOX</p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Intensive 8-week sales management program</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Weekly coaching and accountability sessions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Proven frameworks to manage sales teams</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Transform your agency's sales performance</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Challenge Section */}
      <section className="py-20 relative bg-dark">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-7xl mx-auto">
            {/* Video Left */}
            <div className="aspect-video w-full rounded-lg overflow-hidden border border-primary/20">
              <VideoPlayer 
                videoId="YOUR_TEAM_CHALLENGE_VIDEO_ID"
                title="Team Challenge Demo"
                className="w-full h-full"
              />
            </div>

            {/* Info Right */}
            <Card className="bg-dark-card border-primary/20">
              <CardContent className="p-8">
                <h2 className="font-rajdhani font-bold text-3xl lg:text-4xl uppercase tracking-wide text-white mb-6">
                  TEAM CHALLENGE
                </h2>
                <div className="space-y-4 text-gray-300">
                  <p className="font-semibold text-white mb-4">INFORMATION BOX</p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>8-week intensive team transformation program</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Weekly coaching calls and accountability</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Proven systems to scale your agency</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-primary mr-2">•</span>
                      <span>Enroll your team members to accelerate growth</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Other Relevant Links Section */}
      <section className="py-20 relative bg-dark-card/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-rajdhani font-bold text-4xl lg:text-5xl uppercase tracking-wide text-white mb-12">
              OTHER RELEVANT LINKS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Button 
                onClick={() => window.open('YOUR_LINK_1_URL', '_blank')}
                variant="outline"
                className="text-lg py-6 border-primary/50 hover:bg-primary/10"
              >
                Resource Library
              </Button>
              <Button 
                onClick={() => window.open('YOUR_LINK_2_URL', '_blank')}
                variant="outline"
                className="text-lg py-6 border-primary/50 hover:bg-primary/10"
              >
                Community Forum
              </Button>
              <Button 
                onClick={() => window.open('YOUR_LINK_3_URL', '_blank')}
                variant="outline"
                className="text-lg py-6 border-primary/50 hover:bg-primary/10"
              >
                Training Calendar
              </Button>
              <Button 
                onClick={() => window.open('YOUR_LINK_4_URL', '_blank')}
                variant="outline"
                className="text-lg py-6 border-primary/50 hover:bg-primary/10"
              >
                Support Portal
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 relative bg-dark">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-rajdhani font-bold text-4xl lg:text-5xl uppercase tracking-wide text-white mb-12 text-center">
              FAQ SECTION
            </h2>
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-dark-card border border-primary/20 rounded-lg px-6"
                >
                  <AccordionTrigger className="text-left text-white hover:text-primary text-lg font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300 text-base leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default WelcomeBoardroom;
