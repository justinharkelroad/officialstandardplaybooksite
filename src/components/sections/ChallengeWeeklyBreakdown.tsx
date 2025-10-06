import { Card, CardContent } from '@/components/ui/card';

const ChallengeWeeklyBreakdown = () => {
  const weeks = [
    {
      week: 1,
      title: "Foundation",
      days: [
        { day: "Monday", text: "Start your proof game." },
        { day: "Tuesday", text: "Find the gift in what happened." },
        { day: "Wednesday", text: "Fuel the rocket before launch." },
        { day: "Thursday", text: "Win small, win fast." },
        { day: "Friday", text: "Discover what this week taught you." }
      ]
    },
    {
      week: 2,
      title: "Consistency & Systems",
      days: [
        { day: "Monday", text: "Decide what's non-negotiable." },
        { day: "Tuesday", text: "Build your follow-up rhythm." },
        { day: "Wednesday", text: "Ask the question no one expects." },
        { day: "Thursday", text: "Lock the next call in stone." },
        { day: "Friday", text: "Reflect. Adjust. Evolve." }
      ]
    },
    {
      week: 3,
      title: "Communication & Clarity",
      days: [
        { day: "Monday", text: "Fix what's slipping through the cracks." },
        { day: "Tuesday", text: "Speed beats perfection." },
        { day: "Wednesday", text: "Show up in a new way." },
        { day: "Thursday", text: "Clean your buckets. Clear your mind." },
        { day: "Friday", text: "Simplify your system." }
      ]
    },
    {
      week: 4,
      title: "Relationships & Retention",
      days: [
        { day: "Monday", text: "Earn the right to be referred." },
        { day: "Tuesday", text: "Deliver the first experience they'll remember." },
        { day: "Wednesday", text: "Connect with zero agenda." },
        { day: "Thursday", text: "Zero the clutter." },
        { day: "Friday", text: "Close the loop and capture clarity." }
      ]
    },
    {
      week: 5,
      title: "Mastery of Sales",
      days: [
        { day: "Monday", text: "Start conversations that feed you." },
        { day: "Tuesday", text: "Turn price into purpose." },
        { day: "Wednesday", text: "Ask for the truth—yes or no." },
        { day: "Thursday", text: "Assume the win." },
        { day: "Friday", text: "Lose with grace. Win later." }
      ]
    },
    {
      week: 6,
      title: "Identity & Next Level",
      days: [
        { day: "Monday", text: "Be grateful—for you." },
        { day: "Tuesday", text: "Raise your personal bar." },
        { day: "Wednesday", text: "Keep what works. Cut what doesn't." },
        { day: "Thursday", text: "Set the next target." },
        { day: "Friday", text: "Own who you've become." }
      ]
    }
  ];

  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white mb-4">
            Your 6-Week Journey
          </h2>
          <p className="text-gray-300 text-lg">
            Each week builds on the last, transforming your daily actions into lasting results.
          </p>
        </div>

        <div className="max-w-6xl mx-auto space-y-12">
          {weeks.map((week) => (
            <div key={week.week} className="space-y-6">
              <h3 className="font-rajdhani font-bold text-2xl md:text-3xl uppercase tracking-wide text-primary text-center">
                Week {week.week} – {week.title}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {week.days.map((day, index) => (
                  <Card 
                    key={index} 
                    className="bg-dark-card border-primary/20 card-hover shadow-lg hover:shadow-primary/20 transition-all duration-300"
                  >
                    <CardContent className="p-6 text-center space-y-3">
                      <div className="font-rajdhani font-bold text-lg text-primary uppercase">
                        {day.day}
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {day.text}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChallengeWeeklyBreakdown;
