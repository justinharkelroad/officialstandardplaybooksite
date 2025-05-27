
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Users, Award, TrendingUp } from 'lucide-react';

const About = () => {
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
          <h1 className="font-rajdhani font-bold text-6xl md:text-8xl uppercase tracking-wide text-white mb-6 animate-fade-up">
            About
            <br />
            <span className="text-gradient">The Standard</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            We're not just another coaching company. We're the catalyst for elite entrepreneurs 
            who refuse to settle for ordinary results.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-8">
              Our Mission
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-8">
              To elevate the standard of entrepreneurship by providing world-class coaching, 
              proven systems, and an elite community for ambitious business leaders who are 
              committed to excellence.
            </p>
            <p className="text-lg text-gray-400">
              We believe that ordinary advice produces ordinary results. That's why we've built 
              The Standard Playbook—a comprehensive system designed for extraordinary entrepreneurs 
              who demand extraordinary outcomes.
            </p>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-6">
              Our Values
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <Card className="bg-dark-card border-primary/20 card-hover text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary rounded-square flex items-center justify-center mx-auto mb-4">
                  <Target className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-white font-rajdhani text-xl uppercase tracking-wide">
                  Excellence
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  We hold ourselves and our clients to the highest standards. Mediocrity is not an option.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-dark-card border-primary/20 card-hover text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary-accent rounded-square flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-white font-rajdhani text-xl uppercase tracking-wide">
                  Community
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  We believe in the power of connection. Success is amplified when shared with the right people.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-dark-card border-primary/20 card-hover text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary rounded-square flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-white font-rajdhani text-xl uppercase tracking-wide">
                  Integrity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  We do what we say we'll do. Our word is our bond, and trust is the foundation of everything.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-dark-card border-primary/20 card-hover text-center">
              <CardHeader>
                <div className="w-16 h-16 bg-primary-accent rounded-square flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-white font-rajdhani text-xl uppercase tracking-wide">
                  Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  We're obsessed with outcomes. Every strategy, system, and conversation is designed to drive results.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-8 text-center">
              Our Story
            </h2>
            
            <div className="space-y-8 text-lg text-gray-300 leading-relaxed">
              <p>
                The Standard Playbook was born from a simple observation: most business coaching 
                focuses on tactics without addressing the foundational elements that truly drive success. 
                We saw entrepreneurs struggling not because they lacked knowledge, but because they 
                lacked the right framework, community, and accountability to execute consistently.
              </p>
              
              <p>
                Our founders spent years in the trenches—building, scaling, and selling multiple 
                businesses. They experienced firsthand the isolation, challenges, and breakthrough 
                moments that define the entrepreneurial journey. This real-world experience became 
                the foundation for a different kind of coaching company.
              </p>
              
              <p>
                We don't just teach theory; we share battle-tested strategies that have been proven 
                in the marketplace. Our approach combines high-level strategic thinking with 
                practical implementation support, all delivered within a community of peers who 
                share your ambition and commitment to excellence.
              </p>
              
              <p>
                Today, The Standard Playbook serves hundreds of entrepreneurs across multiple 
                industries and continents. Our members have collectively generated over $500 million 
                in additional revenue since implementing our systems. But more importantly, they've 
                raised their personal and professional standards in ways that extend far beyond business.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-6">
              By The Numbers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <Card className="bg-dark-card border-primary/20 text-center">
              <CardContent className="pt-8">
                <div className="text-4xl font-bold text-primary mb-2">500+</div>
                <p className="text-white font-rajdhani text-lg uppercase tracking-wide">Entrepreneurs Coached</p>
                <p className="text-gray-400 mt-2">Across 50+ industries</p>
              </CardContent>
            </Card>

            <Card className="bg-dark-card border-primary/20 text-center">
              <CardContent className="pt-8">
                <div className="text-4xl font-bold text-primary mb-2">$500M+</div>
                <p className="text-white font-rajdhani text-lg uppercase tracking-wide">Revenue Generated</p>
                <p className="text-gray-400 mt-2">By our community members</p>
              </CardContent>
            </Card>

            <Card className="bg-dark-card border-primary/20 text-center">
              <CardContent className="pt-8">
                <div className="text-4xl font-bold text-primary mb-2">95%</div>
                <p className="text-white font-rajdhani text-lg uppercase tracking-wide">Success Rate</p>
                <p className="text-gray-400 mt-2">Members achieving goals</p>
              </CardContent>
            </Card>

            <Card className="bg-dark-card border-primary/20 text-center">
              <CardContent className="pt-8">
                <div className="text-4xl font-bold text-primary mb-2">5</div>
                <p className="text-white font-rajdhani text-lg uppercase tracking-wide">Years Running</p>
                <p className="text-gray-400 mt-2">Of proven results</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-6">
              Leadership Team
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Meet the experienced entrepreneurs and coaches behind The Standard Playbook.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-dark-card border-primary/20 card-hover text-center">
              <CardContent className="pt-8">
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">JD</span>
                </div>
                <h3 className="text-white font-rajdhani text-xl uppercase tracking-wide mb-2">John Davis</h3>
                <p className="text-primary font-semibold mb-3">Founder & CEO</p>
                <p className="text-gray-300 text-sm">
                  Serial entrepreneur with 3 exits totaling $150M. Former Fortune 500 executive 
                  turned business coach and strategic advisor.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-dark-card border-primary/20 card-hover text-center">
              <CardContent className="pt-8">
                <div className="w-24 h-24 bg-primary-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">SM</span>
                </div>
                <h3 className="text-white font-rajdhani text-xl uppercase tracking-wide mb-2">Sarah Martinez</h3>
                <p className="text-primary-accent font-semibold mb-3">Head of Strategy</p>
                <p className="text-gray-300 text-sm">
                  McKinsey alum and growth strategist who's helped 200+ companies scale from 
                  startup to market leaders.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-dark-card border-primary/20 card-hover text-center">
              <CardContent className="pt-8">
                <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">MK</span>
                </div>
                <h3 className="text-white font-rajdhani text-xl uppercase tracking-wide mb-2">Michael Kim</h3>
                <p className="text-primary font-semibold mb-3">Lead Coach</p>
                <p className="text-gray-300 text-sm">
                  Executive coach and performance specialist with 15+ years helping 
                  C-suite leaders optimize their personal and professional effectiveness.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
