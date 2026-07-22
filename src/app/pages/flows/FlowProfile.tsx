import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFlowProfile } from '@/app/hooks/useFlowProfile';
import { useFlowCoachMemory } from '@/app/hooks/useFlowCoachMemory';
import { supabase } from '@/app/lib/supabaseClient';
import { useAuth } from '@/app/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { ArrowLeft, Brain, Loader2, Save, Sparkles, Trash2 } from 'lucide-react';
import { useToast } from '@/app/hooks/use-toast';
import { isProfileFlowSlug, safeFlowStartRedirect } from '@/app/lib/flowProfileInterview';
import {
  ACCOUNTABILITY_CODES,
  ACCOUNTABILITY_STYLES,
  CORE_VALUES,
  EMPTY_FORM_DATA,
  FEEDBACK_CODES,
  FEEDBACK_PREFERENCES,
  LIFE_ROLES,
  type ProfileFormData,
  toProfileFormData,
  validProfileArray,
} from '@/app/lib/flowProfileReview';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export default function FlowProfile() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading, saveProfile, refetch, hasProfile } = useFlowProfile();
  const coachMemory = useFlowCoachMemory();

  const routeState = location.state as { redirectTo?: unknown; sessionId?: unknown } | null;
  const params = new URLSearchParams(location.search);
  const redirectTo = safeFlowStartRedirect(routeState?.redirectTo ?? params.get('return_to'));
  const reviewSessionId = typeof routeState?.sessionId === 'string'
    ? routeState.sessionId
    : params.get('session_id');
  const isReviewMode = Boolean(reviewSessionId);

  const [formData, setFormData] = useState<ProfileFormData>(EMPTY_FORM_DATA);
  const [saving, setSaving] = useState(false);
  const [loadingReviewDraft, setLoadingReviewDraft] = useState(isReviewMode);
  const [reviewDraftFallback, setReviewDraftFallback] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  useEffect(() => {
    if (profile && !isReviewMode) {
      setFormData(toProfileFormData(profile));
    }
  }, [isReviewMode, profile]);

  useEffect(() => {
    if (!reviewSessionId || loading || authLoading) return;
    if (!user?.id) {
      setReviewError('Sign in to review this profile interview.');
      setLoadingReviewDraft(false);
      return;
    }

    let cancelled = false;
    let timeoutId: number | null = null;
    const wait = (milliseconds: number) => new Promise<void>(resolve => {
      timeoutId = window.setTimeout(resolve, milliseconds);
    });

    const loadDraft = async () => {
      let latestResponses: Record<string, unknown> = {};
      let preserveExisting = Boolean(profile);

      const failReview = (message: string) => {
        if (cancelled) return;
        setReviewError(message);
        setLoadingReviewDraft(false);
      };

      for (let attempt = 0; attempt < 45 && !cancelled; attempt += 1) {
        const { data, error } = await supabase
          .from('flow_sessions')
          .select('status,responses_json,agent_metadata,flow_template:flow_templates(slug)')
          .eq('id', reviewSessionId)
          .eq('user_id', user.id)
          .maybeSingle();

        if (cancelled) return;
        if (error || !data) {
          failReview('This profile review is unavailable or does not belong to your account.');
          return;
        }

        const joinedTemplate = Array.isArray(data.flow_template) ? data.flow_template[0] : data.flow_template;
        if (!isProfileFlowSlug(joinedTemplate?.slug)) {
          failReview('This session is not a Flow Profile interview.');
          return;
        }
        if (data.status !== 'completed') {
          failReview('Finish the profile interview before opening its review.');
          return;
        }

        preserveExisting = joinedTemplate.slug === 'profile-reprofile' || Boolean(profile);
        latestResponses = isRecord(data.responses_json) ? data.responses_json : {};
        const metadata = isRecord(data.agent_metadata) ? data.agent_metadata : {};
        if (isRecord(metadata.profile_draft)) {
          setFormData(toProfileFormData(metadata.profile_draft, latestResponses, profile, preserveExisting));
          setLoadingReviewDraft(false);
          return;
        }

        await wait(1000);
      }

      if (!cancelled) {
        setFormData(toProfileFormData({}, latestResponses, profile, preserveExisting));
        setReviewDraftFallback(true);
        setLoadingReviewDraft(false);
      }
    };

    void loadDraft();
    return () => {
      cancelled = true;
      if (timeoutId !== null) window.clearTimeout(timeoutId);
    };
  }, [authLoading, loading, profile, reviewSessionId, user?.id]);

  const toggleArrayItem = (field: 'life_roles' | 'core_values', item: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(item)
        ? prev[field].filter(i => i !== item)
        : [...prev[field], item],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.preferred_name.trim()) {
      toast({
        title: 'Name required',
        description: 'Please enter what we should call you.',
        variant: 'destructive',
      });
      return;
    }

    const profileToSave = {
      ...formData,
      life_roles: validProfileArray(formData.life_roles, LIFE_ROLES),
      core_values: validProfileArray(formData.core_values, CORE_VALUES),
      accountability_style: ACCOUNTABILITY_CODES.has(formData.accountability_style)
        ? formData.accountability_style
        : null,
      feedback_preference: FEEDBACK_CODES.has(formData.feedback_preference)
        ? formData.feedback_preference
        : null,
    };

    setSaving(true);
    const result = isReviewMode && reviewSessionId
      ? await (supabase.rpc as unknown as (
          name: string,
          args: Record<string, unknown>,
        ) => Promise<{ data: unknown; error: { message: string } | null }>)(
          'confirm_my_flow_profile_interview',
          { p_session_id: reviewSessionId, p_profile: profileToSave },
        )
      : await saveProfile(profileToSave);
    setSaving(false);

    const error = result.error;

    if (error) {
      toast({
        title: 'Error saving profile',
        description: error,
        variant: 'destructive',
      });
    } else {
      await refetch();
      toast({
        title: 'Profile saved',
        description: isReviewMode
          ? 'Your guided conversation is now your Flow profile.'
          : 'Your Flow profile has been updated.',
      });
      
      if (redirectTo) {
        navigate(redirectTo);
      } else {
        navigate('/app/flows');
      }
    }
  };

  const handleMemoryPause = async (paused: boolean) => {
    const saved = await coachMemory.setPaused(paused);
    toast({
      title: saved ? (paused ? 'Coach memory paused' : 'Coach memory resumed') : 'Unable to update coach memory',
      description: saved
        ? (paused ? 'Flowing will stop adding new memories. Existing memories remain available.' : 'Flowing can add insights from future completed flows again.')
        : 'Please try again.',
      variant: saved ? undefined : 'destructive',
    });
  };

  const handleDeleteMemory = async () => {
    if (!window.confirm('Delete all Flowing coach memory, Flowing reflections, and Weekly Reflections built from it? This cannot be undone.')) return;
    const deleted = await coachMemory.deleteAll();
    toast({
      title: deleted ? 'Coach memory deleted' : 'Unable to delete coach memory',
      description: deleted ? 'Flowing coach memory and its saved reflections have been removed.' : 'Please try again.',
      variant: deleted ? undefined : 'destructive',
    });
  };

  if (loading || authLoading || loadingReviewDraft) {
    return (
      <div className="container max-w-2xl py-8">
        <div className="flex min-h-[320px] flex-col items-center justify-center gap-3 text-center">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
          <h1 className="text-xl font-semibold">
            {isReviewMode ? 'Building your profile draft...' : 'Loading your profile...'}
          </h1>
          {isReviewMode && (
            <p className="max-w-md text-sm text-muted-foreground">
              Flow is turning the conversation into a clean profile for you to review.
            </p>
          )}
        </div>
      </div>
    );
  }

  if (reviewError) {
    return (
      <div className="container max-w-2xl py-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile review unavailable</CardTitle>
            <CardDescription>{reviewError}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/app/flows')}>Back to Flows</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl py-8">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/app/flows')}
          className="mb-4 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Flows
        </Button>
        
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Sparkles className="h-8 w-8 text-primary" />
          {isReviewMode
            ? 'Review What Flow Heard'
            : hasProfile
              ? 'Edit Your Profile'
              : 'Build Your Flow Profile'}
        </h1>
        <p className="text-muted-foreground mt-2">
          {isReviewMode
            ? 'Nothing has been saved yet. Change anything below, then confirm the profile when it feels true.'
            : 'Help us personalize your experience with AI-powered insights.'}
        </p>
        {reviewDraftFallback && (
          <p className="mt-3 rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-800 dark:text-amber-200">
            The polished draft took too long, so Flow recovered the original interview answers. Review each field before saving.
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        {/* About You */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">About You</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Preferred Name */}
            <div>
              <Label htmlFor="preferred_name">What should we call you? *</Label>
              <Input
                id="preferred_name"
                value={formData.preferred_name}
                onChange={e => setFormData(prev => ({ ...prev, preferred_name: e.target.value }))}
                placeholder="Your first name or nickname"
                className="mt-2"
              />
            </div>

            {/* Life Roles */}
            <div>
              <Label>What roles do you play in life?</Label>
              <p className="text-sm text-muted-foreground/70 mb-2">Select all that apply</p>
              <div className="flex flex-wrap gap-2">
                {LIFE_ROLES.map(role => (
                  <Button
                    key={role}
                    type="button"
                    variant={formData.life_roles.includes(role) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleArrayItem('life_roles', role)}
                  >
                    {role}
                  </Button>
                ))}
              </div>
              <Textarea
                value={formData.life_roles_context}
                onChange={e => setFormData(prev => ({ ...prev, life_roles_context: e.target.value }))}
                placeholder="Which role carries the most weight right now? Which one is getting the least of you? Include any role not listed above."
                className="mt-3 min-h-[88px]"
              />
            </div>

            {/* Core Values */}
            <div>
              <Label>What are your core values?</Label>
              <p className="text-sm text-muted-foreground/70 mb-2">Select your top values</p>
              <div className="flex flex-wrap gap-2">
                {CORE_VALUES.map(value => (
                  <Button
                    key={value}
                    type="button"
                    variant={formData.core_values.includes(value) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleArrayItem('core_values', value)}
                  >
                    {value}
                  </Button>
                ))}
              </div>
              <Textarea
                value={formData.core_values_context}
                onChange={e => setFormData(prev => ({ ...prev, core_values_context: e.target.value }))}
                placeholder="When these values collide in real life, which one tends to win? Include any value not listed above."
                className="mt-3 min-h-[88px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Current Focus - Enhanced questions */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Current Focus</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Goals - Reworded for specificity */}
            <div>
              <Label htmlFor="current_goals">What's ONE thing that, if you accomplished it in the next 90 days, would change everything?</Label>
              <p className="text-sm text-muted-foreground/70 mb-2">Be specific - vague goals get vague results</p>
              <Textarea
                id="current_goals"
                value={formData.current_goals}
                onChange={e => setFormData(prev => ({ ...prev, current_goals: e.target.value }))}
                placeholder="Example: Close 3 new commercial accounts worth $50k+ each so I can hire my first producer..."
                className="mt-2 min-h-[100px]"
              />
            </div>

            {/* Challenges - Reworded to get at patterns */}
            <div>
              <Label htmlFor="current_challenges">What pattern keeps showing up that you haven't been able to break?</Label>
              <p className="text-sm text-muted-foreground/70 mb-2">Think recurring, not one-time obstacles</p>
              <Textarea
                id="current_challenges"
                value={formData.current_challenges}
                onChange={e => setFormData(prev => ({ ...prev, current_challenges: e.target.value }))}
                placeholder="Example: I keep saying yes to things that aren't priorities, then resent the time they take..."
                className="mt-2 min-h-[100px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Self-Awareness Section - NEW */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Self-Awareness</CardTitle>
            <CardDescription>Helps the AI understand how you operate</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Peak State */}
            <div>
              <Label htmlFor="peak_state">When you're at your best, what does that look like?</Label>
              <p className="text-sm text-muted-foreground/70 mb-2">What conditions, routines, or mindsets create your peak performance?</p>
              <Textarea
                id="peak_state"
                value={formData.peak_state}
                onChange={e => setFormData(prev => ({ ...prev, peak_state: e.target.value }))}
                placeholder="Example: When I've had my morning routine, blocked deep work time, and have clarity on my top 3 priorities..."
                className="mt-2 min-h-[80px]"
              />
            </div>

            {/* Growth Edge */}
            <div>
              <Label htmlFor="growth_edge">What growth area have you been avoiding or resistant to?</Label>
              <p className="text-sm text-muted-foreground/70 mb-2">The thing you know you should work on but keep putting off</p>
              <Textarea
                id="growth_edge"
                value={formData.growth_edge}
                onChange={e => setFormData(prev => ({ ...prev, growth_edge: e.target.value }))}
                placeholder="Example: Delegating more and letting go of control, even when I think I can do it better..."
                className="mt-2 min-h-[80px]"
              />
            </div>

            {/* Overwhelm Response */}
            <div>
              <Label htmlFor="overwhelm_response">How do you typically respond when you feel overwhelmed or stuck?</Label>
              <p className="text-sm text-muted-foreground/70 mb-2">Your default coping pattern - no judgment</p>
              <Textarea
                id="overwhelm_response"
                value={formData.overwhelm_response}
                onChange={e => setFormData(prev => ({ ...prev, overwhelm_response: e.target.value }))}
                placeholder="Example: I work harder and longer hours, which leads to burnout. Or I procrastinate and distract myself..."
                className="mt-2 min-h-[80px]"
              />
            </div>
          </CardContent>
        </Card>

        {/* Coaching Preferences - NEW */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Coaching Preferences</CardTitle>
            <CardDescription>How should the AI coach you?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Accountability Style */}
            <div>
              <Label htmlFor="accountability_style">What style of accountability works best for you?</Label>
              <Select
                value={formData.accountability_style}
                onValueChange={(value) => setFormData(prev => ({ ...prev, accountability_style: value }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select your preferred style..." />
                </SelectTrigger>
                <SelectContent>
                  {ACCOUNTABILITY_STYLES.map(style => (
                    <SelectItem key={style.value} value={style.value}>
                      {style.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Feedback Preference */}
            <div>
              <Label htmlFor="feedback_preference">When receiving feedback, you prefer...</Label>
              <Select
                value={formData.feedback_preference}
                onValueChange={(value) => setFormData(prev => ({ ...prev, feedback_preference: value }))}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select your preference..." />
                </SelectTrigger>
                <SelectContent>
                  {FEEDBACK_PREFERENCES.map(pref => (
                    <SelectItem key={pref.value} value={pref.value}>
                      {pref.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Additional Context */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Additional Context</CardTitle>
            <CardDescription>Optional - helps personalize spiritual/faith-based flows</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Spiritual Beliefs */}
            <div>
              <Label htmlFor="spiritual_beliefs">Spiritual beliefs or faith tradition</Label>
              <Textarea
                id="spiritual_beliefs"
                value={formData.spiritual_beliefs}
                onChange={e => setFormData(prev => ({ ...prev, spiritual_beliefs: e.target.value }))}
                placeholder="Your faith background or spiritual practices (optional)..."
                className="mt-2"
              />
            </div>

            {/* Background Notes */}
            <div>
              <Label htmlFor="background_notes">Anything else we should know?</Label>
              <Textarea
                id="background_notes"
                value={formData.background_notes}
                onChange={e => setFormData(prev => ({ ...prev, background_notes: e.target.value }))}
                placeholder="Any other context that would help us personalize your experience..."
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6 overflow-hidden border-primary/20">
          <CardHeader className="bg-primary/[0.04]">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <div className="mt-0.5 rounded-xl bg-primary/10 p-2 text-primary">
                  <Brain className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg">Coach memory</CardTitle>
                  <CardDescription className="mt-1">
                    Flowing remembers useful moments from your completed flows so its reflections can build on your own words.
                  </CardDescription>
                </div>
              </div>
              <Switch
                checked={!coachMemory.paused}
                disabled={coachMemory.loading || coachMemory.updating}
                onCheckedChange={(enabled) => void handleMemoryPause(!enabled)}
                aria-label="Enable coach memory"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div className="flex items-center justify-between gap-4 rounded-xl border border-border/60 bg-muted/30 px-4 py-3">
              <div>
                <p className="text-sm font-medium">{coachMemory.paused ? 'Memory is paused' : 'Memory is on'}</p>
                <p className="text-xs text-muted-foreground">
                  {coachMemory.paused ? 'No new insights will be saved.' : 'New completed flows can add durable insights.'}
                </p>
              </div>
              <span className="shrink-0 text-sm font-medium text-muted-foreground">
                {coachMemory.insightCount} {coachMemory.insightCount === 1 ? 'memory' : 'memories'}
              </span>
            </div>

            {coachMemory.loading ? (
              <div className="flex items-center justify-center py-6 text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading memory…
              </div>
            ) : coachMemory.error ? (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-4 text-center">
                <p className="text-sm font-medium text-destructive">{coachMemory.error}</p>
                <Button type="button" variant="link" size="sm" onClick={() => void coachMemory.refetch()}>
                  Try again
                </Button>
              </div>
            ) : coachMemory.insights.length > 0 ? (
              <div className="max-h-80 space-y-2 overflow-y-auto pr-1">
                {coachMemory.insights.map((insight) => (
                  <div key={insight.id} className="rounded-xl border border-border/60 px-4 py-3">
                    <div className="mb-1.5 flex items-center justify-between gap-3">
                      <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-primary">
                        {insight.kind}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {insight.session_title || (insight.flow_slug ? `${insight.flow_slug} flow` : 'Past flow')}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/90">{insight.content}</p>
                  </div>
                ))}
                {coachMemory.insightCount > coachMemory.insights.length && (
                  <p className="py-2 text-center text-xs text-muted-foreground">
                    Showing the {coachMemory.insights.length} most recent memories.
                  </p>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-border px-4 py-6 text-center">
                <p className="text-sm font-medium">No coach memories yet</p>
                <p className="mt-1 text-xs text-muted-foreground">They will appear here after completed flows are distilled.</p>
              </div>
            )}

            <div className="flex items-center justify-between gap-4 border-t border-border/60 pt-4">
              <p className="text-xs leading-relaxed text-muted-foreground">
                Deleting memory also removes past Flowing reflections and Weekly Reflections built from it.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="shrink-0 text-destructive hover:text-destructive"
                disabled={coachMemory.updating}
                onClick={() => void handleDeleteMemory()}
              >
                {coachMemory.updating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                Delete all
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate('/app/flows')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              'Saving...'
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" strokeWidth={1.5} />
                {isReviewMode ? 'Confirm Flow Profile' : 'Save Profile'}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
