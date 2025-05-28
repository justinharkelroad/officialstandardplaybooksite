
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import VideoModal from '@/components/VideoModal';
import VideoPlayer from '@/components/VideoPlayer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Users, Calendar, FileText, MessageCircle, ArrowRight, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Boardroom = () => {
  const navigate = useNavigate();

  const handleJoinNow = () => {
    window.open('https://link.fastpaydirect.com/payment-link/68371b280a5741f8835218c8', '_blank');
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="w-16 h-16 bg-primary rounded-square flex items-center justify-center mx-auto mb-8 animate-fade-up">
            <Users className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="font-rajdhani font-bold text-6xl md:text-8xl uppercase tracking-wide text-white mb-6 animate-fade-up">
            The Standard
            <br />
            <span className="text-gradient">Boardroom</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Join an elite community of high-performing agency owners. Get strategic guidance, accountability, 
            and the network you need to scale to the next level.
          </p>

          {/* Video Frame with Background Glow */}
          <div className="relative max-w-4xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="video-glow absolute -inset-4"></div>
            <div className="relative aspect-video bg-dark-card rounded-lg overflow-hidden">
              <VideoPlayer 
                videoId="36Ns-DrlHEA"
                title="Boardroom Demo Video"
                className="w-full h-full rounded-lg"
              />
            </div>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: '0.6s' }}>
            <Button onClick={handleJoinNow} className="btn-primary text-lg px-8 py-4">
              Join The Boardroom
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-8">
              The Isolation Challenge
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              Running an agency can be lonely. You're surrounded by people who don't understand the challenges, 
              pressure, and decisions you face daily. Making critical business decisions in isolation often 
              leads to costly mistakes and missed opportunities.
            </p>
            <p className="text-lg text-gray-400">
              You need a peer group that gets it. People who've been where you are and where you want to go. 
              Without this support system, growth becomes much harder and takes much longer.
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-8">
              Your Strategic Network
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              The Standard Boardroom connects you with ambitious agency owners at your level. Get strategic advice, 
              accountability, and the peer support that accelerates growth while avoiding common pitfalls.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-dark-card border-primary/20 card-hover text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary rounded-square flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-white font-rajdhani text-xl uppercase tracking-wide">
                  Monthly 2 Hour Call
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Strategic sessions with fellow agency owners and expert facilitators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-gray-300 space-y-2 text-left">
                  <li>• Hot seat coaching sessions</li>
                  <li>• Group problem-solving</li>
                  <li>• Strategic planning workshops</li>
                  <li>• Guest expert presentations</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-dark-card border-primary/20 card-hover text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary-accent rounded-square flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-white font-rajdhani text-xl uppercase tracking-wide">
                  Private Chat App
                </CardTitle>
                <CardDescription className="text-gray-400">
                  24/7 access to an exclusive network of high-performers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-gray-300 space-y-2 text-left">
                  <li>• Real-time discussion forums</li>
                  <li>• Direct member connections</li>
                  <li>• Resource sharing library</li>
                  <li>• Accountability partnerships</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-dark-card border-primary/20 card-hover text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary rounded-square flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-white font-rajdhani text-xl uppercase tracking-wide">
                  Strategy Resources
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Proven frameworks and tools for business optimization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-gray-300 space-y-2 text-left">
                  <li>• Strategic planning templates</li>
                  <li>• 24/7 Justin Video Chat</li>
                  <li>• Growth playbooks</li>
                  <li>• AI Process Trainings</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why We Exist Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-8">
              Why We Exist
            </h2>
            <div className="text-xl text-gray-300 leading-relaxed space-y-6">
              <p>
                Most entrepreneurs drift. Targets live in their heads, not on paper, so results feel random. We fix that. Inside The Boardroom you'll:
              </p>
              <div className="text-left max-w-2xl mx-auto space-y-4">
                <p>• Pin down exact 90-day outcomes for every area of life.</p>
                <p>• Map the daily actions that guarantee progress.</p>
                <p>• Track wins, losses, and lessons in real time.</p>
                <p>• Sit shoulder-to-shoulder with owners who play at your pace.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-dark-card border-primary text-center card-hover">
              <CardHeader className="pb-4">
                <CardTitle className="text-white font-rajdhani text-3xl uppercase tracking-wide mb-4">
                  Boardroom Membership
                </CardTitle>
                <div className="mb-4">
                  <span className="text-6xl font-bold text-white">$299</span>
                  <span className="text-gray-400 text-xl">/month</span>
                </div>
                <CardDescription className="text-gray-400 text-lg">
                  Everything you need to connect, learn, and grow with like-minded agency owners
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="text-left">
                    <h4 className="text-white font-rajdhani text-lg uppercase tracking-wide mb-3">Community Access</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Monthly 2 Hour Group Calls</li>
                      <li>• Private member community</li>
                      <li>• Monthly strategy sessions</li>
                      <li>• Peer accountability system</li>
                    </ul>
                  </div>
                  <div className="text-left">
                    <h4 className="text-white font-rajdhani text-lg uppercase tracking-wide mb-3">Resources & Tools</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Strategic planning frameworks</li>
                      <li>• Growth optimization tools</li>
                      <li>• Industry insight reports</li>
                      <li>• Resource sharing library</li>
                    </ul>
                  </div>
                </div>
                <Button onClick={handleJoinNow} className="btn-primary text-lg px-8 py-4">
                  Join The Boardroom Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-6">
              Boardroom FAQ
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-dark-card border border-primary/20 rounded-lg px-6">
                <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                  What type of agency owners are in The Boardroom?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Our agency owners have one single thing in common: To expand their lives through the process of "Having It All". Any and all are fully accepted with open arms.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-dark-card border border-primary/20 rounded-lg px-6">
                <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                  How often are the group coaching calls?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  We host monthly coaching calls on the second Tuesday of every month from 3pm-5pm EST. Each call is 2 hours and strategically planned out to allow breakout sessions and authentic conversations to happen. Every Boardroom call is recorded and posted inside of the Armory on the app.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-dark-card border border-primary/20 rounded-lg px-6">
                <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                  Can I get individual attention in a group setting?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Absolutely. Our hot seat format ensures every member gets individual coaching time during group calls. You can also request specific topics and get personalized feedback from both coaches and fellow members.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-dark-card border border-primary/20 rounded-lg px-6">
                <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                  What if I want more intensive coaching?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Boardroom members get priority access to upgrade to The Directive or Partnership programs, which include individual coaching and more intensive support. We can discuss upgrade options at any time.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Sticky CTA for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-dark-card border-t border-primary/20 p-4 md:hidden z-40">
        <Button onClick={handleJoinNow} className="btn-primary w-full">
          Join The Boardroom
        </Button>
      </div>

      <Footer />
    </div>
  );
};

export default Boardroom;
