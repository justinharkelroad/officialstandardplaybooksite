
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* 404 Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }} />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="font-rajdhani font-bold text-8xl md:text-9xl uppercase tracking-wide text-white mb-6 animate-fade-up">
            404
          </h1>
          
          <h2 className="font-rajdhani font-bold text-4xl md:text-6xl uppercase tracking-wide text-white mb-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Page Not
            <br />
            <span className="text-gradient">Found</span>
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            The page you're looking for doesn't exist. It might have been moved, 
            deleted, or you entered the wrong URL.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <Link to="/">
              <Button className="btn-primary text-lg px-8 py-4">
                <Home className="w-5 h-5 mr-2" />
                Go Home
              </Button>
            </Link>
            <Button 
              onClick={() => window.history.back()}
              className="btn-ghost text-lg px-8 py-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default NotFound;
