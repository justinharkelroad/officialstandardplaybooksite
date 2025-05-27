
import { useEffect, useState } from 'react';

const Particles = () => {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number }>>([]);

  useEffect(() => {
    const particleArray = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 30
    }));
    setParticles(particleArray);
  }, []);

  return (
    <div className="particles">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.left}%`,
            animationDelay: `-${particle.delay}s`
          }}
        />
      ))}
    </div>
  );
};

export default Particles;
