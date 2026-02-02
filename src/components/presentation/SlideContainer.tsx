import { useState, useEffect, useCallback, ReactNode } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface SlideContainerProps {
  children: ReactNode[];
}

const SlideContainer = ({ children }: SlideContainerProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const totalSlides = children.length;

  const goToSlide = useCallback((index: number) => {
    if (isAnimating) return;
    if (index < 0 || index >= totalSlides) return;
    
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, totalSlides]);

  const nextSlide = useCallback(() => {
    goToSlide(currentSlide + 1);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide(currentSlide - 1);
  }, [currentSlide, goToSlide]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, toggleFullscreen]);

  return (
    <div className="fixed inset-0 bg-dark overflow-hidden">
      {/* Slide Content */}
      <div className="relative w-full h-full">
        {children.map((child, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-500 ease-out ${
              index === currentSlide
                ? 'opacity-100 scale-100 translate-x-0'
                : index < currentSlide
                ? 'opacity-0 scale-95 -translate-x-full'
                : 'opacity-0 scale-95 translate-x-full'
            }`}
          >
            {child}
          </div>
        ))}
      </div>

      {/* Click Zones for Navigation */}
      <div 
        className="absolute left-0 top-0 w-1/4 h-full cursor-pointer z-10"
        onClick={prevSlide}
      />
      <div 
        className="absolute right-0 top-0 w-1/4 h-full cursor-pointer z-10"
        onClick={nextSlide}
      />

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className={`absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all z-20 ${
          currentSlide === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-100'
        }`}
        disabled={currentSlide === 0}
      >
        <ChevronLeft className="w-8 h-8 text-white" />
      </button>
      <button
        onClick={nextSlide}
        className={`absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all z-20 ${
          currentSlide === totalSlides - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-100'
        }`}
        disabled={currentSlide === totalSlides - 1}
      >
        <ChevronRight className="w-8 h-8 text-white" />
      </button>

      {/* Fullscreen Button */}
      <button
        onClick={toggleFullscreen}
        className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all z-20"
      >
        <Maximize2 className="w-6 h-6 text-white" />
      </button>

      {/* Progress Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {children.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-primary w-6'
                : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Slide Counter */}
      <div className="absolute bottom-6 right-6 text-white/50 font-mono text-sm z-20">
        {currentSlide + 1} / {totalSlides}
      </div>
    </div>
  );
};

export default SlideContainer;
