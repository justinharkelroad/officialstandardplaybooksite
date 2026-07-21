import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/app/lib/supabaseClient';
import { useAuth } from '@/app/lib/auth';
import { useFlowProfile } from '@/app/hooks/useFlowProfile';
import { useFlowStats } from '@/app/hooks/useFlowStats';
import { useCore4Stats } from '@/app/hooks/useCore4Stats';
import { usePlaybookStats } from '@/app/hooks/usePlaybookStats';
import { FlowTemplate, FlowSession } from '@/app/types/flows';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, User, ChevronRight, CheckCircle2, Flame, Zap } from 'lucide-react';
import { format } from 'date-fns';
import { FlowStatsCard } from '@/app/components/flows/FlowStatsCard';
import { HelpButton } from '@/app/components/HelpButton';
import { FlowTypeIcon } from '@/app/components/flows/FlowTypeIcon';
import { FlowInfoButton } from '@/app/components/flows/FlowInfoButton';
import { AppIcon } from "@/app/components/icons/appIcons";
import { isOpenProfileInterviewReview, isProfileFlowSlug } from '@/app/lib/flowProfileInterview';

type PendingProfileReview = { id: string; created_at: string };

export default function Flows() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile, loading: profileLoading, hasProfile } = useFlowProfile();
  const flowStats = useFlowStats();
  const core4Stats = useCore4Stats();
  const playbookStats = usePlaybookStats();
  
  const [templates, setTemplates] = useState<FlowTemplate[]>([]);
  const [recentSessions, setRecentSessions] = useState<FlowSession[]>([]);
  const [pendingProfileReview, setPendingProfileReview] = useState<PendingProfileReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTemplateIconId, setActiveTemplateIconId] = useState<string | null>(null);
  const [activeRecentIconId, setActiveRecentIconId] = useState<string | null>(null);

  // Combined weekly score: Core 4 (max 28) + Flow (max 7) + Playbook (max 21) = 56
  const combinedWeeklyScore = core4Stats.weeklyPoints + flowStats.weeklyProgress + playbookStats.weeklyPoints;
  const combinedWeeklyGoal = 56;
  const combinedPercentage = combinedWeeklyGoal > 0 ? Math.round((combinedWeeklyScore / combinedWeeklyGoal) * 100) : 0;
  const combinedTotalPoints = flowStats.totalFlows + core4Stats.totalPoints;

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch active templates
      const { data: templatesData } = await supabase
        .from('flow_templates')
        .select('*')
        .eq('is_active', true)
        .order('display_order');

      setTemplates((templatesData || []).filter(template => !isProfileFlowSlug(template.slug)) as unknown as FlowTemplate[]);

      // Fetch recent completed sessions for this user so drafts do not appear in history.
      if (user?.id) {
        const { data: sessionsData } = await supabase
          .from('flow_sessions')
          .select('*, flow_template:flow_templates(*)')
          .eq('user_id', user.id)
          .eq('status', 'completed')
          .order('created_at', { ascending: false })
          .limit(100);

        const completedSessions = (sessionsData || []) as unknown as FlowSession[];
        setRecentSessions(completedSessions
          .filter(session => !isProfileFlowSlug(session.flow_template?.slug))
          .slice(0, 5));
        const review = completedSessions.find(session =>
          isProfileFlowSlug(session.flow_template?.slug)
          && isOpenProfileInterviewReview(session.status, session.agent_metadata)
        );
        setPendingProfileReview(review ? { id: review.id, created_at: review.created_at } : null);
      }
    } catch (err) {
      console.error('Error fetching flows data:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const startFlow = (template: FlowTemplate) => {
    if (!hasProfile) {
      const redirectTo = `/app/flows/start/${template.slug}`;
      if (pendingProfileReview) {
        navigate(`/app/flows/profile?session_id=${encodeURIComponent(pendingProfileReview.id)}`, {
          state: { redirectTo },
        });
      } else {
        navigate('/app/flows/start/profile-builder', { state: { redirectTo } });
      }
    } else {
      navigate(`/app/flows/start/${template.slug}`);
    }
  };

  const hasConfirmedGuidedProfile = profile?.guided_interview_version === 2
    && Boolean(profile.guided_interview_confirmed_at);
  const profileCardTitle = !hasProfile
    ? 'Build a coach that actually knows you'
    : hasConfirmedGuidedProfile
      ? 'Revisit your Flow Profile'
      : 'Deepen your Flow Profile';
  const profileCardDescription = !hasProfile
    ? 'Take a guided 20 to 40 minute conversation across Body, Being, Balance, and Business. Use text or voice.'
    : hasConfirmedGuidedProfile
      ? 'Life changes. Revisit the full conversation whenever you want sharper, more current coaching.'
      : 'Your current profile stays in place while Flow helps you build a deeper one. You review every field before anything changes.';
  const profileCardAction = !hasProfile
    ? 'Build My Flow Profile'
    : hasConfirmedGuidedProfile
      ? 'Revisit My Flow Profile'
      : 'Deepen My Flow Profile';

  if (loading || profileLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-48" />
          <div className="h-4 bg-muted rounded w-64" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 bg-muted rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-medium flex items-center gap-2">
            <Sparkles className="h-6 w-6" strokeWidth={1.5} />
            Flows
            <HelpButton videoKey="flows-overview" />
          </h1>
          <p className="text-muted-foreground/70 mt-1">
            Guided reflection for growth
          </p>
        </div>
        
        <Button
          variant="ghost"
          onClick={() => navigate('/app/flows/profile')}
          className="flex items-center gap-2"
        >
          <User className="h-4 w-4" strokeWidth={1.5} />
          {hasProfile ? 'Edit Profile Manually' : 'Build Profile Manually'}
        </Button>
      </div>

      {pendingProfileReview && (
        <Card className="mb-8 border-primary/30 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="flex items-center gap-2 font-medium text-lg">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  Your interview is ready to review
                </h3>
                <p className="text-muted-foreground/70 text-sm mt-1">
                  Edit what Flow heard before you use it. Your current profile has not changed.
                </p>
              </div>
              <Button onClick={() => navigate(`/app/flows/profile?session_id=${encodeURIComponent(pendingProfileReview.id)}`)}>
                Review What Flow Heard
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!pendingProfileReview && (
        <Card className="mb-8 border-primary/30 bg-primary/5">
          <CardContent className="p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-medium text-lg">{profileCardTitle}</h3>
                <p className="text-muted-foreground/70 text-sm mt-1">
                  {profileCardDescription}
                </p>
              </div>
              <div className="flex flex-col items-start gap-2 sm:items-end">
                <Button onClick={() => navigate(`/app/flows/start/${hasProfile ? 'profile-reprofile' : 'profile-builder'}`)}>
                  {profileCardAction}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
                <Button variant="link" className="h-auto p-0 text-sm" onClick={() => navigate('/app/flows/profile')}>
                  {hasProfile ? 'Edit it manually' : 'Build it manually'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Combined Score Cards - Same as Core4 page */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {/* THE SCORE */}
        <Card className="bg-card border-border">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground mb-3">THE SCORE</p>
            <div className="relative w-32 h-32 mx-auto mb-3">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  className="text-muted"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${combinedPercentage * 2.83} 283`}
                  className="text-primary transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">{combinedWeeklyScore}</span>
                <span className="text-xs text-muted-foreground">/ {combinedWeeklyGoal}</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Core 4: {core4Stats.weeklyPoints}/28</p>
              <p>Flow: {flowStats.weeklyProgress}/7</p>
              <p>Playbook: {playbookStats.weeklyPoints}/21</p>
            </div>
          </CardContent>
        </Card>

        {/* THE STREAKS */}
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-4 text-center">THE STREAKS</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Zap className="h-5 w-5 mx-auto mb-1 text-[#2997FF]" />
                <p className="text-xl font-bold">{flowStats.currentStreak}</p>
                <p className="text-xs text-muted-foreground">Flow</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <Flame className="h-5 w-5 mx-auto mb-1 text-[#2997FF]" />
                <p className="text-xl font-bold">{core4Stats.currentStreak}</p>
                <p className="text-xs text-muted-foreground">Core 4</p>
              </div>
            </div>
            <div className="mt-4 text-center text-xs text-muted-foreground">
              <p>Longest: Flow {flowStats.longestStreak} | Core {core4Stats.longestStreak}</p>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* Gamification Stats - Flow only */}
      <FlowStatsCard />

      {/* Flow Templates Grid */}
      <div className="mb-10">
        <h2 className="text-lg font-medium mb-4">Choose Your Flow</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {templates.map(template => (
            <Card
              key={template.id}
              className="cursor-pointer hover:border-border/30 hover:bg-accent/5 transition-all group"
              onClick={() => startFlow(template)}
              onMouseEnter={() => setActiveTemplateIconId(template.id)}
              onMouseLeave={() => setActiveTemplateIconId(null)}
              onFocus={() => setActiveTemplateIconId(template.id)}
              onBlur={() => setActiveTemplateIconId(null)}
            >
              <CardContent className="p-6">
                <FlowTypeIcon
                  flowSlug={template.slug}
                  /* line-icon default; never fall back to the template's emoji */
                  size="lg"
                  active={activeTemplateIconId === template.id}
                  className="mb-3 text-foreground"
                />
                <div className="flex items-center gap-1.5">
                  <h3 className="font-medium text-lg group-hover:text-primary transition-colors">
                    {template.name}
                  </h3>
                  <FlowInfoButton slug={template.slug} />
                </div>
                {template.description && (
                  <p className="text-sm text-muted-foreground/70 mt-2 line-clamp-2">
                    {template.description}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
          
        </div>
      </div>

      {/* Recent Stacks / Library */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="flex items-center gap-2 text-lg font-medium"><AppIcon name="library" className="h-5 w-5" /> Your Flow Library</h2>
          {recentSessions.length > 0 && (
            <Button
              variant="ghost"
              onClick={() => navigate('/app/flows/library')}
              className="text-muted-foreground"
            >
              View All
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>

        {recentSessions.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Sparkles className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" strokeWidth={1} />
              <h3 className="font-medium mb-2">No flows yet</h3>
              <p className="text-sm text-muted-foreground/70">
                Start your first Flow to begin building your library.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {recentSessions.map(session => (
              <Card
                key={session.id}
                className="cursor-pointer hover:bg-accent/5 transition-colors"
                onClick={() => navigate(`/app/flows/view/${session.id}`)}
                onMouseEnter={() => setActiveRecentIconId(session.id)}
                onMouseLeave={() => setActiveRecentIconId(null)}
                onFocus={() => setActiveRecentIconId(session.id)}
                onBlur={() => setActiveRecentIconId(null)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <FlowTypeIcon
                      flowSlug={session.flow_template?.slug}
                      
                      size="md"
                      active={activeRecentIconId === session.id}
                      className="text-foreground"
                    />
                    <div>
                      <h4 className="font-medium">
                        {session.title || 'Untitled Flow'}
                      </h4>
                      <p className="text-sm text-muted-foreground/70">
                        {session.flow_template?.name} • {format(new Date(session.created_at), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-[#2997FF]" />
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
