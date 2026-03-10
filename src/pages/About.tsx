
import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ContentMeta from '@/components/ContentMeta';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Users, Award, TrendingUp, Building2 } from 'lucide-react';

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

      {/* Founder Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-6">
                Meet the Founder
              </h2>
            </div>

            <div className="bg-dark-card border border-primary/20 rounded-lg p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="w-32 h-32 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  {/* TODO: Replace with actual headshot */}
                  <span className="text-white font-bold text-4xl">J</span>
                </div>
                <div>
                  {/* TODO: Update with Justin's full name when provided */}
                  <h3 className="text-white font-rajdhani text-2xl uppercase tracking-wide mb-1">Justin</h3>
                  <p className="text-primary font-semibold mb-4">Founder & Head Coach</p>
                  <div className="space-y-4 text-gray-300 leading-relaxed">
                    <p>
                      Justin founded The Standard Playbook with a clear mission: to give insurance agency
                      owners and producers the coaching, systems, and accountability they need to build
                      high-performing agencies — not just survive, but lead.
                    </p>
                    <p>
                      With deep experience in the insurance industry, Justin works directly with
                      agency owners through 1:1 coaching (The Directive), group masterminds
                      (The Boardroom), and technology-powered training platforms. His hands-on
                      approach combines strategic business coaching with AI and technology
                      implementation — including custom AI agent buildouts and call scoring systems.
                    </p>
                    <p>
                      Based in Fort Wayne, Indiana, Justin and the Standard Playbook team serve
                      insurance agencies nationwide, helping owners and their teams build systematic
                      approaches to sales, leadership, and growth.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
              The Standard Playbook — a comprehensive system designed for extraordinary entrepreneurs
              who demand extraordinary outcomes. Our coaching integrates the latest in AI and technology
              to give agencies a measurable competitive advantage.
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
                Justin spent years in the trenches — building, coaching, and scaling insurance agencies.
                He experienced firsthand the isolation, challenges, and breakthrough moments that define
                the entrepreneurial journey. This real-world experience became the foundation for a
                different kind of coaching company — one built specifically for the insurance industry.
              </p>

              <p>
                We don't just teach theory; we share battle-tested strategies that have been proven
                in the marketplace. Our approach combines high-level strategic thinking with
                practical implementation support — including AI-powered tools like{' '}
                <Link to="/callscoring" className="text-primary hover:text-primary/80 underline">
                  call scoring
                </Link>{' '}
                and custom agent buildouts — all delivered within a community of peers who
                share your ambition and commitment to excellence.
              </p>

              <p>
                Today, The Standard Playbook serves hundreds of entrepreneurs across multiple
                industries. Our members have collectively generated over $500 million
                in additional revenue since implementing our systems. The{' '}
                <a
                  href="https://www.independentagent.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 underline"
                >
                  independent insurance agency
                </a>{' '}
                model is built for growth — and we help owners realize that potential.
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

      {/* Brand Clarification Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-dark-card border border-primary/20 rounded-lg p-8 md:p-12">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-primary/20 rounded-square flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="font-rajdhani font-bold text-2xl md:text-3xl uppercase tracking-wide text-white mb-2">
                    Our Brands
                  </h2>
                  <p className="text-gray-400">Standard Playbook INC &amp; Agency Brain</p>
                </div>
              </div>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  The Standard Playbook operates under <strong className="text-white">Standard Playbook INC</strong>,
                  which also does business as <strong className="text-white">Agency Brain</strong>. Both brands are
                  part of the same company and serve the same mission.
                </p>
                <p>
                  <strong className="text-white">The Standard Playbook</strong> is our coaching and training brand —
                  encompassing all our coaching programs (Boardroom, Directive, Partnership),
                  challenges (Producer Power-Up, Owner Challenge), and the Sales Experience training.
                </p>
                <p>
                  <strong className="text-white">Agency Brain</strong> is our technology platform brand —
                  powering the training app, AI call scoring, and digital tools that support our coaching programs.
                </p>
                <p className="text-gray-400 text-sm">
                  Both brands are fully owned and operated by Standard Playbook INC, based in Fort Wayne, Indiana.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ContentMeta lastUpdated="March 2026" />

      <Footer />
    </div>
  );
};

export default About;
