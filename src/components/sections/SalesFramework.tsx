
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Video, FileText, User } from 'lucide-react';

const SalesFramework = () => {
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
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-oswald font-bold text-4xl md:text-5xl uppercase tracking-tight text-white mb-8">
            The 8 Week Management Training Framework
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            A structured, week-by-week roadmap that transforms your sales management through progressive skill building and continuous improvement.
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
  );
};

export default SalesFramework;
