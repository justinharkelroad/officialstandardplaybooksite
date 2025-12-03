import { Card, CardContent } from '@/components/ui/card';

const ChallengeWeeklyBreakdown = () => {
  const weeks = [
    {
      week: 1,
      title: "Foundation & Proof",
      description: "Producers learn how the challenge works, anchor to the Core 4 system, and build momentum through gratitude, micro wins, and honest reflection. The goal is structure, honesty, and visible daily proof of progress."
    },
    {
      week: 2,
      title: "Consistency & Cadence",
      description: "Focus shifts to discipline—locking in personal standards, follow-up structure, and appointment integrity. Producers move from reactive selling to predictable systems that create trust and follow-through."
    },
    {
      week: 3,
      title: "Process & Precision",
      description: "Follow-up becomes a science with cadence, speed, and smarter communication. Producers clean their buckets, tighten CRMs, and learn that clarity and documentation eliminate chaos."
    },
    {
      week: 4,
      title: "Retention & Relationships",
      description: "Referrals, onboarding, and relationship-building take center stage. The week converts short-term sales habits into long-term client trust and structural prospecting systems."
    },
    {
      week: 5,
      title: "Mastery & Momentum",
      description: "Producers level up to advanced sales strategy—building COI pipelines, reframing price, closing confidently, and handling rejection with grace. It's about professional tone, confidence, and leverage."
    },
    {
      week: 6,
      title: "Reflection & Expansion",
      description: "The final week turns results into identity. Producers celebrate growth, set new measurable standards, map 90-day targets, and finish with deep reflection on who they've become."
    }
  ];

  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="font-oswald font-bold text-4xl md:text-5xl uppercase tracking-tight text-white mb-4">
            Your 6-Week Journey
          </h2>
          <p className="text-gray-300 text-lg">
            Each week builds on the last, transforming your daily actions into lasting results.
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {weeks.map((week, index) => (
            <Card 
              key={week.week} 
              className="bg-gradient-to-br from-dark-card to-dark-card/80 border-primary/30 shadow-xl hover:shadow-primary/30 transition-all duration-300 overflow-hidden group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8 md:p-10">
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  {/* Week Number Badge */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <span className="text-3xl font-bold text-white">
                        {week.week}
                      </span>
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 space-y-4">
                    <h3 className="font-oswald font-bold text-2xl md:text-3xl uppercase tracking-tight text-primary">
                      Week {week.week} – {week.title}
                    </h3>
                    <p className="text-gray-300 text-lg leading-relaxed">
                      {week.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChallengeWeeklyBreakdown;
