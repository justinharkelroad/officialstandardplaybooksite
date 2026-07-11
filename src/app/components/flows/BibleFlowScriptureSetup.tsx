import { useMemo, useState } from 'react';
import { ArrowLeft, BookOpen, CheckCircle2, Loader2, Search, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { BibleScriptureContext } from '@/app/lib/flowAgentApi';
import {
  buildUserProvidedBibleScripture,
  recommendBibleScriptures,
  resolveBibleScripture,
} from '@/app/lib/bibleScriptureApi';

const BIBLE_FLOW_DEFAULT_BIBLE_ID = '6f11a7de016f942e-01';
const BIBLE_FLOW_DEFAULT_TRANSLATION_LABEL = 'The Message (MSG)';
const BIBLE_FLOW_CONTEXT_MIN_LENGTH = 12;

interface BibleFlowScriptureSetupProps {
  staffSessionToken?: string | null;
  onSelect: (scripture: BibleScriptureContext) => void;
  onBack: () => void;
}

interface BibleScriptureReaderProps {
  scripture: BibleScriptureContext;
  className?: string;
  compact?: boolean;
}

export function BibleScriptureReader({
  scripture,
  className,
  compact = false,
}: BibleScriptureReaderProps) {
  const displayTitle = scripture.reference || 'Selected Scripture';
  const sourceLabel = scripture.source === 'api_bible' ? 'API.Bible verified' : 'User provided';
  const content = scripture.content?.trim();

  return (
    <aside className={cn('overflow-hidden rounded-lg border border-border/70 bg-card', className)}>
      <div className="border-b border-border/70 px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-foreground">{displayTitle}</p>
            {scripture.translation_name && (
              <p className="mt-1 text-xs text-muted-foreground">{scripture.translation_name}</p>
            )}
          </div>
          <Badge variant="secondary" className="shrink-0 text-[10px]">
            {sourceLabel}
          </Badge>
        </div>
      </div>

      <ScrollArea className={cn(compact ? 'max-h-56' : 'max-h-[46dvh]')}>
        <div className="space-y-4 px-4 py-4">
          {content ? (
            <p className="whitespace-pre-wrap text-sm leading-7 text-foreground">{content}</p>
          ) : (
            <p className="text-sm leading-6 text-muted-foreground">
              Scripture text is not stored on this draft. Look up the reference again if you need the full passage.
            </p>
          )}
          {scripture.copyright && (
            <p className="border-t border-border/60 pt-3 text-[11px] leading-5 text-muted-foreground">
              {scripture.copyright}
            </p>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}

export function BibleFlowScriptureSetup({
  staffSessionToken,
  onSelect,
  onBack,
}: BibleFlowScriptureSetupProps) {
  const [mode, setMode] = useState<'recommend' | 'lookup' | 'paste'>('recommend');
  const [reference, setReference] = useState('');
  const [userContext, setUserContext] = useState('');
  const [pastedScripture, setPastedScripture] = useState('');
  const [resolvedScripture, setResolvedScripture] = useState<BibleScriptureContext | null>(null);
  const [recommendations, setRecommendations] = useState<BibleScriptureContext[]>([]);
  const [recommendationMessage, setRecommendationMessage] = useState<string | null>(null);
  const [safetyMessage, setSafetyMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const canSubmit = useMemo(() => {
    if (mode === 'recommend') return userContext.trim().length >= BIBLE_FLOW_CONTEXT_MIN_LENGTH;
    return mode === 'lookup' ? reference.trim().length >= 3 : pastedScripture.trim().length >= BIBLE_FLOW_CONTEXT_MIN_LENGTH;
  }, [mode, pastedScripture, reference, userContext]);

  const recommendationCount = recommendations.length;
  const selectedScriptureKey = resolvedScripture ? getScriptureKey(resolvedScripture) : null;

  const resetSelectionState = () => {
    setResolvedScripture(null);
    setRecommendations([]);
    setRecommendationMessage(null);
    setSafetyMessage(null);
    setErrorMessage(null);
  };

  const selectMode = (nextMode: 'recommend' | 'lookup' | 'paste') => {
    if (loading) return;
    setMode(nextMode);
    resetSelectionState();
  };

  const handleLookup = async () => {
    if (!reference.trim() || loading) return;

    setLoading(true);
    setErrorMessage(null);
    setResolvedScripture(null);
    setRecommendationMessage(null);

    try {
      const scripture = await resolveBibleScripture({
        mode: 'lookup_reference',
        reference: reference.trim(),
        preferredBibleId: BIBLE_FLOW_DEFAULT_BIBLE_ID,
        staffSessionToken,
      });
      setResolvedScripture(scripture);
      setRecommendations([]);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to verify that Scripture reference.');
    } finally {
      setLoading(false);
    }
  };

  const handleUsePasted = () => {
    const content = pastedScripture.trim();
    if (!content) return;
    setResolvedScripture(buildUserProvidedBibleScripture(content));
    setRecommendations([]);
    setRecommendationMessage(null);
    setErrorMessage(null);
  };

  const handleRecommend = async ({ excludeCurrent = false }: { excludeCurrent?: boolean } = {}) => {
    if (!userContext.trim() || loading) return;
    const currentReferences = excludeCurrent
      ? recommendations
          .map((scripture) => scripture.reference)
          .filter((reference): reference is string => Boolean(reference))
      : undefined;

    setLoading(true);
    setErrorMessage(null);
    setSafetyMessage(null);
    setRecommendationMessage(null);
    setResolvedScripture(null);
    setRecommendations([]);

    try {
      const result = await recommendBibleScriptures({
        userContext: userContext.trim(),
        preferredBibleId: BIBLE_FLOW_DEFAULT_BIBLE_ID,
        maxResults: 3,
        excludeReferences: currentReferences,
        staffSessionToken,
      });
      setSafetyMessage(result.safetyMessage ?? null);
      setRecommendationMessage(result.responseMessage ?? null);
      setRecommendations(result.recommendations);
      if (!result.safetyMessage && result.recommendations.length === 0) {
        setErrorMessage('I could not find verified recommendations. Try a specific reference instead.');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Unable to find Scripture recommendations right now.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrimary = () => {
    if (mode === 'recommend') {
      void handleRecommend({ excludeCurrent: recommendations.length > 0 });
      return;
    }
    if (mode === 'lookup') {
      void handleLookup();
      return;
    }
    handleUsePasted();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-4xl items-center px-4 py-6 sm:py-8">
        <div className="w-full rounded-lg border border-border/70 bg-card shadow-sm">
          <div className="border-b border-border/70 px-5 py-5 sm:px-7 sm:py-6">
            <Button variant="ghost" size="sm" onClick={onBack} className="-ml-2 mb-5 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <div className="mt-1 rounded-md bg-primary/10 p-2 text-primary">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">Bible Flow</p>
                  <Badge variant="secondary">{BIBLE_FLOW_DEFAULT_TRANSLATION_LABEL}</Badge>
                </div>
                <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">Start with Scripture</h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Choose a passage before the Flow begins, then keep it in view while you reflect.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[230px_minmax(0,1fr)]">
            <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-1">
              <Button
                type="button"
                variant={mode === 'recommend' ? 'default' : 'outline'}
                className="h-auto justify-start gap-2 px-3 py-3 text-left"
                onClick={() => selectMode('recommend')}
                disabled={loading}
                aria-pressed={mode === 'recommend'}
              >
                <Sparkles className="h-4 w-4" />
                <span className="min-w-0">
                  <span className="block">Find</span>
                  <span className="block truncate text-xs font-normal opacity-75">Match how you feel</span>
                </span>
              </Button>
              <Button
                type="button"
                variant={mode === 'lookup' ? 'default' : 'outline'}
                className="h-auto justify-start gap-2 px-3 py-3 text-left"
                onClick={() => selectMode('lookup')}
                disabled={loading}
                aria-pressed={mode === 'lookup'}
              >
                <Search className="h-4 w-4" />
                <span className="min-w-0">
                  <span className="block">Reference</span>
                  <span className="block truncate text-xs font-normal opacity-75">Verify a verse</span>
                </span>
              </Button>
              <Button
                type="button"
                variant={mode === 'paste' ? 'default' : 'outline'}
                className="h-auto justify-start gap-2 px-3 py-3 text-left"
                onClick={() => selectMode('paste')}
                disabled={loading}
                aria-pressed={mode === 'paste'}
              >
                <BookOpen className="h-4 w-4" />
                <span className="min-w-0">
                  <span className="block">Paste</span>
                  <span className="block truncate text-xs font-normal opacity-75">Bring your own</span>
                </span>
              </Button>
            </div>

            <div className="min-w-0 space-y-5">
              {mode === 'recommend' ? (
                <div className="space-y-2">
                  <div className="flex items-end justify-between gap-3">
                    <Label htmlFor="bible-context">What are you carrying today?</Label>
                    <span className="text-xs text-muted-foreground">
                      {userContext.trim().length}/{BIBLE_FLOW_CONTEXT_MIN_LENGTH}
                    </span>
                  </div>
                  <Textarea
                    id="bible-context"
                    value={userContext}
                    onChange={(event) => setUserContext(event.target.value)}
                    placeholder="Name what you are feeling, wrestling with, asking God for, or wanting to focus on."
                    className="min-h-36 resize-none"
                  />
                </div>
              ) : mode === 'lookup' ? (
                <div className="space-y-2">
                  <Label htmlFor="bible-reference">Reference</Label>
                  <Input
                    id="bible-reference"
                    value={reference}
                    onChange={(event) => setReference(event.target.value)}
                    placeholder="Matthew 6:25-34"
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && canSubmit) {
                        event.preventDefault();
                        void handleLookup();
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="bible-paste">Scripture text</Label>
                  <Textarea
                    id="bible-paste"
                    value={pastedScripture}
                    onChange={(event) => setPastedScripture(event.target.value)}
                    placeholder="Paste the passage you want to flow through."
                    className="min-h-44 resize-none"
                  />
                </div>
              )}

              {errorMessage && (
                <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {errorMessage}
                </div>
              )}

              {safetyMessage && (
                <div className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm leading-6 text-amber-700 dark:text-amber-300">
                  {safetyMessage}
                </div>
              )}

              {recommendationMessage && recommendations.length > 0 && (
                <div className="rounded-lg border border-border/70 bg-muted/30 px-4 py-3 text-sm leading-6 text-foreground shadow-sm">
                  {recommendationMessage}
                </div>
              )}

              {loading && mode === 'recommend' && (
                <div className="space-y-3" aria-live="polite">
                  <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Finding verified passages
                  </div>
                  <div className="grid gap-3">
                    {[0, 1, 2].map((item) => (
                      <div key={item} className="rounded-lg border border-border/70 bg-background p-4">
                        <div className="h-4 w-32 rounded bg-muted" />
                        <div className="mt-4 space-y-2">
                          <div className="h-3 rounded bg-muted" />
                          <div className="h-3 w-5/6 rounded bg-muted" />
                          <div className="h-3 w-2/3 rounded bg-muted" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {recommendations.length > 0 && (
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                      <CheckCircle2 className="h-4 w-4" />
                      {recommendationCount} verified {recommendationCount === 1 ? 'passage' : 'passages'}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => void handleRecommend({ excludeCurrent: true })}
                      disabled={!canSubmit || loading}
                      className="h-8 px-2 text-xs"
                    >
                      Show different
                    </Button>
                  </div>
                  <div className="grid gap-3">
                    {recommendations.map((scripture) => {
                      const scriptureKey = getScriptureKey(scripture);
                      const selected = selectedScriptureKey === scriptureKey;
                      return (
                        <button
                          key={scriptureKey}
                          type="button"
                          onClick={() => setResolvedScripture(scripture)}
                          className={cn(
                            'rounded-lg border p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                            selected
                              ? 'border-primary bg-primary/10 shadow-sm'
                              : 'border-border/70 bg-background hover:bg-muted/40',
                          )}
                          aria-pressed={selected}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="font-semibold text-foreground">{scripture.reference}</p>
                                {scripture.translation_name && (
                                  <Badge variant="secondary" className="text-[10px]">
                                    {scripture.translation_name}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            {selected && (
                              <Badge className="shrink-0 text-[10px]">
                                Selected
                              </Badge>
                            )}
                          </div>
                          <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                            {scripture.content}
                          </p>
                          {scripture.reason && (
                            <p className="mt-3 text-sm leading-6 text-foreground">{scripture.reason}</p>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {resolvedScripture && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
                    <CheckCircle2 className="h-4 w-4" />
                    Scripture ready
                  </div>
                  <BibleScriptureReader scripture={resolvedScripture} compact />
                </div>
              )}

              <div className="sticky bottom-0 -mx-5 flex flex-col gap-3 border-t border-border/70 bg-card/95 px-5 py-4 backdrop-blur sm:static sm:mx-0 sm:flex-row sm:justify-end sm:border-t-0 sm:bg-transparent sm:px-0 sm:py-0 sm:backdrop-blur-none">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrimary}
                  disabled={!canSubmit || loading}
                  className="gap-2 sm:min-w-36"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {mode === 'recommend'
                    ? recommendations.length > 0
                      ? 'Show different'
                      : 'Find Scripture'
                    : mode === 'lookup'
                      ? 'Verify Reference'
                      : 'Preview Passage'}
                </Button>
                <Button
                  type="button"
                  onClick={() => resolvedScripture && onSelect(resolvedScripture)}
                  disabled={!resolvedScripture}
                  className="sm:min-w-48"
                >
                  {resolvedScripture ? 'Flow with selected passage' : 'Select a passage'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getScriptureKey(scripture: BibleScriptureContext): string {
  return [
    scripture.source,
    scripture.bible_id,
    scripture.passage_id,
    scripture.reference,
    scripture.content?.slice(0, 24),
  ].filter(Boolean).join(':');
}
