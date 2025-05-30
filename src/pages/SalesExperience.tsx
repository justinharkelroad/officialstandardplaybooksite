import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import VideoPlayer from '@/components/VideoPlayer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Target, Calendar, Users, CheckCircle, ArrowRight, Shield, TrendingUp, Video, FileText, User, CreditCard, DollarSign, Phone } from 'lucide-react';

const SalesExperience = () => {
  const scrollToPayment = () => {
    const paymentSection = document.getElementById('payment');
    if (paymentSection) {
      paymentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const weeklyFramework = [
    {
      week: 1,
      title: "STANDARD CALL SCORING SET UP",
      items: [
        { icon: TrendingUp, text: "EACH SALES TEAM MEMBER GETS 4 CALLS GRADED & SCORED" },
        { icon: User, text: "AGENT/MANAGER ZOOM SESSION ON FUNDAMENTALS OF COACHING TEAM" },
        { icon: Video, text: "SALES COACHING VIDEO: \"WELCOME TO STANDARD CALL SCORING EXPERIENCE\"" },
        { icon: FileText, text: "HOW TO GET THE BEST POSSIBLE SCORE DOCUMENT" }
      ]
    },
    {
      week: 2,
      title: "RAPPORT BUILDING AND ROLE PLAY",
      items: [
        { icon: TrendingUp, text: "EACH SALES TEAM MEMBER GETS 4 CALLS GRADED & SCORED" },
        { icon: User, text: "AGENT/MANAGER ZOOM SESSION ON EVALUATING OPENING + CHECK IN" },
        { icon: Video, text: "SALES COACHING VIDEO: \"WINNING THE FIRST 30 SECONDS\"" },
        { icon: FileText, text: "FOCUSING ON THE INTROS DOCUMENT" }
      ]
    },
    {
      week: 3,
      title: "OPEN ENDED QUESTIONING",
      items: [
        { icon: TrendingUp, text: "EACH SALES TEAM MEMBER GETS 4 CALLS GRADED & SCORED" },
        { icon: User, text: "AGENT/MANAGER ZOOM SESSION ON IDENTIFYING DEEPER NEEDS + CHECK IN" },
        { icon: Video, text: "SALES COACHING VIDEO: \"DIG DEEPER FOR EMPATHY & ACTIVE LISTENING\"" },
        { icon: FileText, text: "HOW TO COURSE CORRECT MID WEEK DOCUMENT" }
      ]
    },
    {
      week: 4,
      title: "OBJECTION HANDLING",
      items: [
        { icon: TrendingUp, text: "EACH SALES TEAM MEMBER GETS 4 CALLS GRADED & SCORED" },
        { icon: User, text: "AGENT/MANAGER ZOOM SESSION ON HELPING THE TEAM DEAL W/ INDECISION" },
        { icon: Video, text: "SALES COACHING VIDEO: \"CONNECTING THE DOTS TO PRESENT THE RIGHT ONES\"" },
        { icon: FileText, text: "COMMON OBJECTIONS & HANDLING DOCUMENT" }
      ]
    },
    {
      week: 5,
      title: "CLOSING TECHNIQUES CHEAT SHEET",
      items: [
        { icon: TrendingUp, text: "EACH SALES TEAM MEMBER GETS 4 CALLS GRADED & SCORED" },
        { icon: User, text: "AGENT/MANAGER ZOOM SESSION ON ART OF CLOSING + CHECK IN" },
        { icon: Video, text: "SALES COACHING VIDEO: \"SEAL THE DEAL - CONFIDENT CLOSING\"" },
        { icon: FileText, text: "ASKING FOR THE CLOSE AND ASKING AGAIN DOCUMENT" }
      ]
    },
    {
      week: 6,
      title: "REFINING THE SALES PROCESS",
      items: [
        { icon: TrendingUp, text: "EACH SALES TEAM MEMBER GETS 4 CALLS GRADED & SCORED" },
        { icon: User, text: "AGENT/MANAGER ZOOM SESSION ON DIALING IN WHAT WILL BE REQUIRED" },
        { icon: Video, text: "SALES COACHING VIDEO: \"ELEVATE YOUR VALUE BEYOND THE BASICS\"" },
        { icon: FileText, text: "COMPARATIVE PERFORMANCE REPORT FROM WEEK 1-6" }
      ]
    },
    {
      week: 7,
      title: "BUILDING MOMENTUM",
      items: [
        { icon: TrendingUp, text: "EACH SALES TEAM MEMBER GETS 4 CALLS GRADED & SCORED" },
        { icon: User, text: "AGENT/MANAGER ZOOM SESSION ON MAINTAINING COACHING MOMENTUM + CHECK IN" },
        { icon: Video, text: "SALES COACHING VIDEO: \"BUILDING YOUR PIPELINE THROUGH REFERRALS\"" },
        { icon: FileText, text: "HOW TO GET THE MOST OUT OF EVERY INTERACTION DOCUMENT" }
      ]
    },
    {
      week: 8,
      title: "FINAL WEEK WRAP UP",
      items: [
        { icon: TrendingUp, text: "EACH SALES TEAM MEMBER GETS 4 CALLS GRADED & SCORED" },
        { icon: User, text: "AGENT/MANAGER ZOOM SESSION BUILD THE FUTURE ROAD MAP FOR AGENCY" },
        { icon: Video, text: "SALES COACHING VIDEO: \"CONSISTENCY WINS EVERY TIME. WHAT'S NEXT?\"" },
        { icon: FileText, text: "CONSISTENT COACHING CALENDAR DOCUMENT" }
      ]
    }
  ];

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
          <div className="w-16 h-16 bg-primary-accent rounded-square flex items-center justify-center mx-auto mb-8 animate-fade-up">
            <Target className="w-8 h-8 text-white" />
          </div>
          
          <h1 className="font-rajdhani font-bold text-6xl md:text-8xl uppercase tracking-wide text-white mb-6 animate-fade-up">
            8 Week Sales
            <br />
            <span className="text-gradient">Experience</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Build a Sales Process, Accountability Frame and Consequence Ladder with precision. Work one-on-one with Justin to transform your agency's sales approach.
          </p>

          {/* Video Frame with Background Glow */}
          <div className="relative max-w-4xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="video-glow absolute -inset-4"></div>
            <div className="relative aspect-video bg-dark-card rounded-lg overflow-hidden">
              <VideoPlayer 
                videoId="kJWh8cVHoFs"
                title="8-Week Sales Experience Overview"
                className="w-full h-full rounded-lg"
              />
            </div>
          </div>

          <div className="animate-fade-up" style={{ animationDelay: '0.6s' }}>
            <Button 
              onClick={scrollToPayment}
              className="btn-primary text-lg px-8 py-4"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Here's What You Get Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-8">
              Here's What You Get
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              Everything you need to build a world-class sales operation in just 8 weeks.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-dark-card border-primary/20">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <span className="text-gray-300">HARD COPY BOOK MAILED FOR YOU/YOUR MANAGER</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <span className="text-gray-300">4 GRADED CALLS PER SALES TEAM MEMBER PER WEEK</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <span className="text-gray-300">WEEKLY MONDAY SALES QUICK HIT TRAINING VIDEO EMAILED TO TEAM</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <span className="text-gray-300">WEEKLY WEDNESDAY TRAINING DOCUMENT EMAILED TO TEAM</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <span className="text-gray-300">30 MINUTE ZOOMS WEEKLY (8X) w/ AGENT or MANAGER</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <span className="text-gray-300">1 ON 1 VIDEO COACHING ANYTIME VIA MARCO POLO APP FOR YOU OR MANAGER</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <span className="text-gray-300">FULLY BUILT OUT SALES PROCESS DOCUMENTED BY END OF EXPERIENCE</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <span className="text-gray-300">FULLY BUILT OUT ACCOUNTABILITY PROCESS DEPLOYED BY END OF EXPERIENCE</span>
                  </div>
                  <div className="flex items-start space-x-3 md:col-span-2 md:justify-center">
                    <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                    <span className="text-gray-300">FULLY BUILT OUT CONSEQUENCE LADDER DEPLOYED BY END OF EXPERIENCE</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FREE Call CTA Section */}
      <section className="py-12 relative">
        <div className="container mx-auto px-4 text-center">
          <a href="https://AGENCYCOACHING.as.me/8week" target="_blank" rel="noopener noreferrer">
            <Button className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-4 transition-all duration-300 transform hover:scale-105">
              <Phone className="w-5 h-5 mr-2" />
              Book a FREE 15m Call
            </Button>
          </a>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-8">
              The Sales Process Problem
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              Most agencies struggle with inconsistent sales processes, lack of accountability, and unclear consequences for underperformance. 
              This leads to missed opportunities, frustrated teams, and unpredictable revenue.
            </p>
            <p className="text-lg text-gray-400">
              Without a systematic approach to sales, even talented teams can't reach their full potential. 
              You need structure, accountability, and proven frameworks to build a high-performing sales organization.
            </p>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-8">
              The 8-Week Transformation
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              Work directly with Justin over 8 intensive weeks to build a complete sales system. 
              Create processes, establish accountability measures, and implement consequence ladders that drive consistent results.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-dark-card border-primary/20 card-hover text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary rounded-square flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-white font-rajdhani text-xl uppercase tracking-wide">
                  Sales Process Design
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Custom-built sales process for your agency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-gray-300 space-y-2 text-left">
                  <li>• Lead qualification frameworks</li>
                  <li>• Closing techniques and scripts</li>
                  <li>• Follow-up sequences</li>
                  <li>• Pipeline management systems</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-dark-card border-primary/20 card-hover text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary-accent rounded-square flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-white font-rajdhani text-xl uppercase tracking-wide">
                  Accountability Framework
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Systems to ensure consistent performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-gray-300 space-y-2 text-left">
                  <li>• Daily activity tracking</li>
                  <li>• Performance metrics and KPIs</li>
                  <li>• Regular check-in protocols</li>
                  <li>• Team motivation strategies</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-dark-card border-primary/20 card-hover text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary rounded-square flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-white font-rajdhani text-xl uppercase tracking-wide">
                  Consequence Ladder
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Clear consequences for performance standards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-gray-300 space-y-2 text-left">
                  <li>• Performance improvement plans</li>
                  <li>• Progressive disciplinary actions</li>
                  <li>• Reward systems for top performers</li>
                  <li>• Clear termination protocols</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Money Back Guarantee Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative mb-12">
              {/* Guarantee Badge */}
              <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full border-8 border-yellow-300 shadow-2xl mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-black">100%</div>
                  <div className="text-xs font-semibold text-black uppercase">Money Back</div>
                  <div className="text-xs font-semibold text-black uppercase">Guarantee</div>
                </div>
              </div>
            </div>
            
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-8">
              If You Don't See The Value After [8] Weeks, I'll Give You Your Money Back... Straight Up
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed">
              All I ask is you <span className="text-primary font-semibold underline">COMMIT TO THE WORK</span>
            </p>
          </div>
        </div>
      </section>

      {/* Payment Section */}
      <section id="payment" className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-8">
              Choose Your Payment Option
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Select the payment plan that works best for your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Weekly Pay Option */}
            <Card className="bg-dark-card border-primary/20 card-hover">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary rounded-square flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-white font-rajdhani text-2xl uppercase tracking-wide mb-4">
                  Weekly Pay Option
                </CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">$625</span>
                  <span className="text-gray-400">/week</span>
                </div>
                <CardDescription className="text-gray-400">
                  Pay weekly for 8 weeks
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    Flexible weekly payments
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    Full 8-week experience
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    Complete transformation program
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    Total Investment: $5,000
                  </li>
                </ul>
                <a href="https://link.fastpaydirect.com/payment-link/67b9e53c156a771b286e2ca6" target="_blank" rel="noopener noreferrer">
                  <Button className="btn-primary w-full">
                    Start Weekly Payments
                  </Button>
                </a>
              </CardContent>
            </Card>

            {/* Pay In Full Option */}
            <Card className="bg-dark-card border-primary relative card-hover animate-pulse-neon">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-white px-4 py-1 rounded-pill text-sm font-semibold uppercase tracking-wide">
                  Save $500
                </span>
              </div>
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-primary-accent rounded-square flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-white font-rajdhani text-2xl uppercase tracking-wide mb-4">
                  Pay In Full Option
                </CardTitle>
                <div className="mb-4">
                  <div className="text-lg text-gray-400 line-through">$5,000</div>
                  <span className="text-4xl font-bold text-white">$4,500</span>
                  <span className="text-gray-400"> one-time</span>
                </div>
                <CardDescription className="text-gray-400">
                  Save $500 with upfront payment
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <ul className="space-y-3 mb-8 text-left">
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    $500 discount savings
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    Full 8-week experience
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    Complete transformation program
                  </li>
                  <li className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-primary mr-3" />
                    No recurring payments
                  </li>
                </ul>
                <a href="https://link.fastpaydirect.com/payment-link/67b9e4c1020837472ed0b709" target="_blank" rel="noopener noreferrer">
                  <Button className="btn-primary w-full bg-primary-accent hover:bg-primary-light">
                    Pay In Full & Save
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 8-Week Experience Framework Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-8">
              The 8 Week Experience Framework
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              A structured, week-by-week roadmap that transforms your sales team through progressive skill building and continuous improvement.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {weeklyFramework.map((week, index) => (
                <Card key={week.week} className="bg-dark-card border-primary/20 card-hover">
                  <CardHeader>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-primary rounded-square flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{week.week}</span>
                      </div>
                      <div>
                        <CardTitle className="text-white font-rajdhani text-lg uppercase tracking-wide">
                          Week {week.week}
                        </CardTitle>
                        <CardDescription className="text-primary text-sm font-semibold">
                          {week.title}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {week.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start space-x-3">
                          <item.icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300 text-sm leading-relaxed">{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-6">
              Sales Experience FAQ
            </h2>
          </div>

          <div className="max-w-4xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-dark-card border border-primary/20 rounded-lg px-6">
                <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                  What's included in the 8-week program?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  You get 8 weeks of direct one-on-one coaching with Justin, custom sales process development, accountability framework creation, consequence ladder implementation, and ongoing support throughout the transformation.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-dark-card border border-primary/20 rounded-lg px-6">
                <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                  Who participates in the sessions?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Either you as the agency owner or your sales manager can participate in the one-on-one sessions with Justin. We recommend whoever will be directly implementing and overseeing the sales process on a daily basis.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-dark-card border border-primary/20 rounded-lg px-6">
                <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                  How quickly will we see results?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  Most agencies start seeing improvements in sales activity and accountability within the first 2-3 weeks. Full transformation and consistent results typically manifest by week 6-8 and continue growing from there.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-dark-card border border-primary/20 rounded-lg px-6">
                <AccordionTrigger className="text-white font-rajdhani text-lg uppercase tracking-wide">
                  What if our current sales process is already established?
                </AccordionTrigger>
                <AccordionContent className="text-gray-300">
                  We'll audit your existing process and identify gaps or inefficiencies. The program focuses on optimization and enhancement, building on what works while fixing what doesn't to create a more effective system.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Sticky CTA for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 bg-dark-card border-t border-primary/20 p-4 md:hidden z-40">
        <Button 
          onClick={scrollToPayment}
          className="btn-primary w-full"
        >
          Start 8-Week Sales Experience
        </Button>
      </div>

      <Footer />
    </div>
  );
};

export default SalesExperience;
