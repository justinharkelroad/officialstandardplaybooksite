import { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useFlowSession } from '@/app/hooks/useFlowSession';
import { useFlowProfile } from '@/app/hooks/useFlowProfile';
import { useFocusItems } from '@/app/hooks/useFocusItems';
import { ChatBubble, isHtmlContent } from '@/app/components/flows/ChatBubble';
import { ChatInput } from '@/app/components/flows/ChatInput';
import { FlowTypeIcon } from '@/app/components/flows/FlowTypeIcon';
import { TypingIndicator } from '@/app/components/flows/TypingIndicator';
import { FlowChallenge } from '@/app/components/flows/FlowChallenge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { X, Loader2, ChevronDown, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/app/lib/auth';
import { DeclaredFlowAction, getDeclaredFlowActionKey } from '@/app/lib/declaredFlowActions';

interface DraftDeclaredAction {
  index: number;
  originalText: string;
  refinedText: string;
  coachMessage: string;
  finalText: string | null;
}

export default function FlowSession() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { profile } = useFlowProfile();
  const { user } = useAuth();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const isNearBottomRef = useRef(true);
  const forceScrollRef = useRef(false);
  
  // Dynamic footer height for proper scroll padding
  const [footerHeight, setFooterHeight] = useState(128);

  // Get session ID from location state (when resuming a draft)
  const sessionId = (location.state as { sessionId?: string } | null)?.sessionId;
  
  const {
    template,
    session,
    questions,
    currentQuestion,
    currentQuestionIndex,
    responses,
    loading,
    saving,
    isFirstQuestion,
    isLastQuestion,
    progress,
    saveResponse,
    goToNextQuestion,
    goToPreviousQuestion,
    goToQuestion,
    interpolatePrompt,
  } = useFlowSession({ templateSlug: slug, sessionId });

  const { createItem } = useFocusItems();

  const [currentValue, setCurrentValue] = useState('');
  const [showChallenge, setShowChallenge] = useState(false);
  const [challengeText, setChallengeText] = useState('');
  const [checkingChallenge, setCheckingChallenge] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(new Set());
  const [isTyping, setIsTyping] = useState(false);
  const [showCurrentQuestion, setShowCurrentQuestion] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [addingToPlaybook, setAddingToPlaybook] = useState(false);
  const [pendingAnswer, setPendingAnswer] = useState<string | null>(null);
  const [userPhotoUrl, setUserPhotoUrl] = useState<string | null>(null);
  const [userInitials, setUserInitials] = useState('??');
  const [postFlowHistory, setPostFlowHistory] = useState<Array<{ prompt: string; answer: string }>>([]);
  const [declaredActions, setDeclaredActions] = useState<DeclaredFlowAction[]>([]);
  const [draftAction, setDraftAction] = useState<DraftDeclaredAction | null>(null);
  const [postFlowStage, setPostFlowStage] = useState<'idle' | 'review' | 'add_to_playbook' | 'ask_more' | 'capture_additional'>('idle');
  const [postFlowInput, setPostFlowInput] = useState('');
  const [refiningAction, setRefiningAction] = useState(false);
  const addingToPlaybookRef = useRef(false);
  
  // Ref for typing timeout to prevent race conditions
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Track footer height changes (for select buttons vs text input)
  useEffect(() => {
    if (!footerRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setFooterHeight(entry.contentRect.height);
      }
    });
    
    observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  // Fetch user profile photo
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id) return;
      
      const { data } = await supabase
        .from('profiles')
        .select('full_name, profile_photo_url')
        .eq('id', user.id)
        .single();
      
      if (data) {
        setUserPhotoUrl(data.profile_photo_url || null);
        const name = data.full_name || user.email || '';
        const initials = name
          ? name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
          : user.email?.[0].toUpperCase() || '??';
        setUserInitials(initials);
      }
    };
    
    fetchUserProfile();
  }, [user?.id, user?.email]);
  
  // Cleanup timeout on unmount or question change
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);
  
  // Clear timeout when question changes
  useEffect(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [currentQuestion?.id]);

  // Update browser tab title
  useEffect(() => {
    if (template?.name) {
      document.title = `${template.name} | AgencyBrain`;
    } else {
      document.title = "Flow Session | AgencyBrain";
    }
    return () => { document.title = "AgencyBrain"; };
  }, [template?.name]);

  useEffect(() => {
    if (currentQuestion && !isTyping) {
      setCurrentValue(responses[currentQuestion.id] || '');
      setShowChallenge(false);
      setChallengeText('');
      setShowCurrentQuestion(true);
    }
  }, [currentQuestion?.id, responses, isTyping]);

  // Auto-scroll to current question bubble (center it so footer doesn't cover it)
  const scrollToCurrentQuestion = useCallback(() => {
    // Find the current question bubble (last one with data attribute)
    const messages = document.querySelectorAll('[data-current-question="true"]');
    const currentQuestionEl = messages[messages.length - 1];
    
    if (currentQuestionEl) {
      currentQuestionEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      // Fallback to bottom ref
      bottomRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' });
    }
  }, []);

  // Auto-scroll after DOM commits when relevant chat UI changes
  useLayoutEffect(() => {
    const shouldScroll = forceScrollRef.current || isNearBottomRef.current;
    if (!shouldScroll) return;

    // Small delay to ensure DOM has updated with new question
    const timer = setTimeout(() => {
      scrollToCurrentQuestion();
      forceScrollRef.current = false;
    }, 100);

    return () => clearTimeout(timer);
  }, [
    currentQuestionIndex,
    isTyping,
    showChallenge,
    postFlowStage,
    showCurrentQuestion,
    answeredQuestions.size,
    postFlowHistory.length,
    scrollToCurrentQuestion,
    currentQuestion?.type, // Re-scroll when input type changes (text vs select)
  ]);

  // Handle scroll position to show/hide scroll button
  const handleScroll = () => {
    if (!chatContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;

    isNearBottomRef.current = isNearBottom;
    setShowScrollButton(!isNearBottom);
  };

  // Auto-save on page unload/refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (currentValue.trim() && currentQuestion) {
        saveResponse(currentQuestion.id, currentValue.trim());
      }
      
      if (currentValue.trim()) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [currentValue, currentQuestion, saveResponse]);

  const checkForChallenge = async (questionId: string, response: string): Promise<string | null> => {
    if (!currentQuestion?.ai_challenge) {
      return null;
    }

    // Only fires on explicit vague patterns. The blanket 15-char rule
    // was punishing valid short answers ("Patience", "My wife Corina")
    // and has been removed; see 10-regex-fix-spec.md.
    const vaguePatterns = [
      /^(good|fine|okay|ok|idk|dunno|stuff|things|whatever)\.?$/i,
      /^(i don'?t know|not sure|maybe|i guess)\.?$/i,
    ];

    const isVague = vaguePatterns.some(pattern => pattern.test(response.trim()));
    
    if (!isVague) return null;

    setCheckingChallenge(true);
    
    try {
      // Keyed by question id. Falls back to 'default' for any flagged
      // question not in the map. See 00-voice-persona.md Section 6
      // for the persona's pushback rules per question type.
      const challenges: Record<string, string> = {
        'actions': `That's a start, not a declaration. What's the one specific move in the next 24 hours?`,
        'revelation': `Stay with that for a second. Why does this one land for you, right now?`,
        'lesson': `Take it one layer deeper. What's the one lesson that's actually moving you?`,
        'why_grateful': `Take it one layer deeper. What specifically about this is hitting you?`,
        'why_pray': `Take your time with this one. What specifically is drawing you to pray, right now?`,
        'why_irritated': `Take it deeper. What specifically is getting to you?`,
        'idea_activated': `Get sharper. What exactly is the idea?`,
        'discovery_activated': `Get specific. What did you actually take from this?`,
        'what_you_see': `What did you actually see? Not what you think you should have seen. What landed?`,
        'desired_story': `That's the old story dressed up. What's the actual new story you're choosing?`,
        'feelings_now': `Take a second. What's the actual word for how you feel right now?`,
        'default': `Get more specific. The clearer you name it, the more this Flow can do for you.`,
      };

      return challenges[questionId] || challenges['default'];
    } finally {
      setCheckingChallenge(false);
    }
  };

  // Get the action text from the last question's response
  const getActionText = useCallback(() => {
    if (!questions.length) return null;
    const lastQuestion = questions[questions.length - 1];
    return responses[lastQuestion.id]?.trim() || null;
  }, [questions, responses]);

  const handleCompleteFlow = useCallback(() => {
    navigate(`/flows/complete/${session?.id}`);
  }, [navigate, session?.id]);

  const refineActionItem = async (actionText: string) => {
    const { data, error } = await supabase.functions.invoke('refine_flow_action_item', {
      body: {
        action_text: actionText,
        flow_name: template?.name,
        flow_title: session?.title,
        domain: session?.domain,
        previous_actions: declaredActions.map(action => action.finalText),
      },
    });

    if (error) {
      throw error;
    }

    return {
      coachMessage: data?.coach_message || "That has strong intent. I sharpened it so it is easier to measure and easier to win.",
      refinedText: data?.refined_action || actionText,
    };
  };

  const startPostFlowReview = async (actionText: string) => {
    const trimmedAction = actionText.trim();
    if (!trimmedAction) {
      handleCompleteFlow();
      return;
    }

    forceScrollRef.current = true;
    setRefiningAction(true);
    setShowCurrentQuestion(false);

    try {
      const { coachMessage, refinedText } = await refineActionItem(trimmedAction);
      setDraftAction({
        index: declaredActions.length + 1,
        originalText: trimmedAction,
        refinedText,
        coachMessage,
        finalText: null,
      });
      setPostFlowStage('review');
    } catch (error) {
      console.error('Failed to refine flow action item:', error);
      setDraftAction({
        index: declaredActions.length + 1,
        originalText: trimmedAction,
        refinedText: trimmedAction,
        coachMessage: "That has real intent behind it. You can keep it as-is or use the sharpened version below.",
        finalText: null,
      });
      setPostFlowStage('review');
      toast.error('Unable to refine the action item. You can still keep going.');
    } finally {
      setRefiningAction(false);
    }
  };

  const persistDeclaredAction = async (action: DeclaredFlowAction) => {
    await saveResponse(getDeclaredFlowActionKey(action.index, 'original'), action.originalText);
    await saveResponse(getDeclaredFlowActionKey(action.index, 'refined'), action.refinedText);
    await saveResponse(getDeclaredFlowActionKey(action.index, 'final'), action.finalText);
    await saveResponse(
      getDeclaredFlowActionKey(action.index, 'added_to_weekly_playbook'),
      action.addedToWeeklyPlaybook === null ? '' : String(action.addedToWeeklyPlaybook),
    );
  };

  const finalizeDraftAction = async (addedToWeeklyPlaybook: boolean, finalTextOverride?: string) => {
    const finalText = finalTextOverride ?? draftAction?.finalText;
    if (!draftAction || !finalText || addingToPlaybookRef.current) return;

    if (addedToWeeklyPlaybook && (!template || !session)) {
      handleCompleteFlow();
      return;
    }

    if (addedToWeeklyPlaybook) {
      addingToPlaybookRef.current = true;
      setAddingToPlaybook(true);
      try {
        await createItem.mutateAsync({
          title: finalText,
          description: `Action from ${template!.name} flow session`,
          priority_level: "mid",
          source_type: "flow",
          source_name: template!.name,
          source_session_id: session!.id,
          zone: "bench",
        });
        toast.success("Action added to your Weekly Playbook.");
      } catch (error) {
        console.error("Failed to add action to weekly playbook:", error);
        toast.error("Failed to add this action to your Weekly Playbook.");
        addingToPlaybookRef.current = false;
        setAddingToPlaybook(false);
        return;
      }
    }

    const finalizedAction: DeclaredFlowAction = {
      index: draftAction.index,
      originalText: draftAction.originalText,
      refinedText: draftAction.refinedText,
      finalText,
      addedToWeeklyPlaybook,
    };

    try {
      await persistDeclaredAction(finalizedAction);
      setDeclaredActions(prev => [...prev, finalizedAction]);
      setDraftAction(null);
      setPostFlowInput('');
      setPostFlowStage('ask_more');
    } catch (error) {
      console.error('Failed to persist declared flow action:', error);
      toast.error('Your action may not have saved. Please try again.');
    } finally {
      if (addedToWeeklyPlaybook) {
        addingToPlaybookRef.current = false;
        setAddingToPlaybook(false);
      }
    }
  };

  const handleUseSuggestedAction = () => {
    if (!draftAction) return;
    const finalText = draftAction.refinedText;
    setDraftAction({ ...draftAction, finalText });
    setPostFlowStage('add_to_playbook');
    void finalizeDraftAction(true, finalText);
  };

  const handleKeepOriginalAction = () => {
    if (!draftAction) return;
    const finalText = draftAction.originalText;
    setDraftAction({ ...draftAction, finalText });
    setPostFlowStage('add_to_playbook');
    void finalizeDraftAction(true, finalText);
  };

  const handleSubmitAdditionalAction = async (valueOverride?: string) => {
    const actionText = (valueOverride ?? postFlowInput).trim();
    if (!actionText || refiningAction) return;

    setPostFlowInput('');
    setPostFlowHistory(prev => [
      ...prev,
      { prompt: "What's the next action you're declaring?", answer: actionText },
    ]);
    await startPostFlowReview(actionText);
  };

  const handleSubmitAnswer = async (valueOverride?: string) => {
    const valueToSubmit = (valueOverride ?? currentValue).trim();
    
    console.log('[FlowSession] handleSubmitAnswer called:', {
      valueOverride,
      currentValue,
      valueToSubmit,
      currentQuestionId: currentQuestion?.id,
      currentQuestionType: currentQuestion?.type,
      isTyping,
      checkingChallenge,
      showChallenge
    });
    
    if (!valueToSubmit) {
      console.warn('[FlowSession] handleSubmitAnswer: No value to submit');
      return;
    }
    if (!currentQuestion) {
      console.warn('[FlowSession] handleSubmitAnswer: No current question');
      return;
    }
    if (isTyping) {
      console.warn('[FlowSession] handleSubmitAnswer: Already typing, ignoring');
      return;
    }

    console.log('[FlowSession] Saving response:', currentQuestion.id, valueToSubmit);
    
    // Save immediately and clear input
    forceScrollRef.current = true;
    setCurrentValue('');
    await saveResponse(currentQuestion.id, valueToSubmit);
    setAnsweredQuestions(prev => new Set(prev).add(currentQuestion.id));

    const challenge = await checkForChallenge(currentQuestion.id, valueToSubmit);
    
    if (challenge && !answeredQuestions.has(currentQuestion.id)) {
      setChallengeText(challenge);
      setShowChallenge(true);
    } else if (isLastQuestion) {
      const promptText = interpolatePrompt(currentQuestion.prompt).map(s => s.content).join(' ');
      setPostFlowHistory(prev => [...prev, { prompt: promptText, answer: valueToSubmit }]);
      await startPostFlowReview(valueToSubmit);
    } else {
      // Clear any pending timeout first
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Store the pending answer to display immediately
      setPendingAnswer(valueToSubmit);
      
      // Start typing animation
      setShowCurrentQuestion(false);
      setIsTyping(true);
      
      console.log('[FlowSession] Moving to next question after typing delay...');
      
      // Wait for typing indicator, then show next question
      typingTimeoutRef.current = setTimeout(() => {
        console.log('[FlowSession] Timeout fired, advancing to next question');
        setIsTyping(false);
        setPendingAnswer(null);
        setShowCurrentQuestion(true);
        goToNextQuestion();
        typingTimeoutRef.current = null;
      }, 2000);
    }
  };

  const handleRevise = () => {
    setShowChallenge(false);
    setChallengeText('');
  };

  const handleSkipChallenge = () => {
    forceScrollRef.current = true;
    setShowChallenge(false);
    setChallengeText('');
    
    if (isLastQuestion) {
      const actionText = getActionText();
      if (actionText && currentQuestion) {
        const promptText = interpolatePrompt(currentQuestion.prompt).map(s => s.content).join(' ');
        setPostFlowHistory(prev => [...prev, { prompt: promptText, answer: actionText }]);
        void startPostFlowReview(actionText);
      } else {
        handleCompleteFlow();
      }
    } else {
      // Clear any pending timeout first
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      // Store the pending answer to display immediately
      setPendingAnswer(responses[currentQuestion?.id || ''] || currentValue);
      
      // Start typing animation
      setShowCurrentQuestion(false);
      setIsTyping(true);
      
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
        setPendingAnswer(null);
        setShowCurrentQuestion(true);
        goToNextQuestion();
        typingTimeoutRef.current = null;
      }, 2000);
    }
  };

  const handleExit = async () => {
    if (currentValue.trim() && currentQuestion) {
      await saveResponse(currentQuestion.id, currentValue.trim());
    }
    navigate('/flows');
  };

  const handleClickPreviousAnswer = (idx: number) => {
    if (idx < currentQuestionIndex && !isTyping && postFlowStage === 'idle') {
      if (currentValue.trim() && currentQuestion) {
        saveResponse(currentQuestion.id, currentValue.trim());
      }
      goToQuestion(idx);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Flow template not found.</p>
            <Button className="mt-4" onClick={() => navigate('/flows')}>
              Back to Flows
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If all questions are answered (currentQuestion is undefined), navigate to completion
  if (!currentQuestion) {
    if (session?.id) {
      navigate(`/flows/complete/${session.id}`, { replace: true });
    } else {
      navigate('/flows', { replace: true });
    }
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const promptSegments = interpolatePrompt(currentQuestion.prompt);
  const flowIcon = (
    <FlowTypeIcon
      flowSlug={template.slug}
      fallback={template.icon || '🧠'}
      size="sm"
      animateOnHover
      className="text-foreground"
    />
  );
  // Build prompt text from segments
  const getPromptText = (segments: typeof promptSegments) => {
    return segments.map(s => s.content).join(' ');
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header - minimal with progress */}
      <header className="border-b border-border/10 bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <FlowTypeIcon
                flowSlug={template.slug}
                fallback={template.icon || '🧠'}
                size="sm"
                animateOnHover
                className="text-foreground"
              />
              <h1 className="font-medium text-sm text-muted-foreground">{template.name}</h1>
            </div>
            <Button variant="ghost" size="sm" onClick={handleExit} className="h-8 px-2">
              <X className="h-4 w-4" strokeWidth={1.5} />
            </Button>
          </div>
          <Progress value={progress} className="h-1" />
        </div>
      </header>

      {/* Chat Container */}
      <main 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto"
        onScroll={handleScroll}
        style={{ 
          paddingBottom: footerHeight + 32,
          scrollPaddingBottom: footerHeight + 32 
        }}
      >
        <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
          {/* Previous Q&A as chat bubbles */}
          {questions.slice(0, currentQuestionIndex).map((q, idx) => {
            const segments = interpolatePrompt(q.prompt);
            const response = responses[q.id];
            
            return (
              <div key={q.id} className="space-y-3">
                {/* Question bubble */}
                <ChatBubble 
                  variant="incoming" 
                  icon={flowIcon}
                  className="opacity-70 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => handleClickPreviousAnswer(idx)}
                >
                  {getPromptText(segments)}
                </ChatBubble>
                
                {/* Answer bubble */}
                {response && (
                  <ChatBubble
                    variant="outgoing"
                    className="opacity-70"
                    avatarUrl={userPhotoUrl}
                    avatarFallback={userInitials}
                    html={isHtmlContent(response) ? response : undefined}
                  >
                    {response}
                  </ChatBubble>
                )}
              </div>
            );
          })}

          {/* Current Question */}
          {showCurrentQuestion && !isTyping && postFlowStage === 'idle' && postFlowHistory.length === 0 && (
            <div className="space-y-3" data-current-question="true">
              <ChatBubble 
                variant="incoming" 
                icon={flowIcon}
                animate={currentQuestionIndex > 0}
              >
                {promptSegments.map((segment, idx) => (
                  <span 
                    key={idx}
                    className={segment.type === 'interpolated' ? 'font-medium' : ''}
                  >
                    {segment.content}
                  </span>
                ))}
              </ChatBubble>
            </div>
          )}

          {postFlowHistory.map((entry, idx) => (
            <div key={`pfh-${idx}`} className="space-y-3">
              <ChatBubble
                variant="incoming"
                icon={flowIcon}
                className="opacity-70"
              >
                {entry.prompt}
              </ChatBubble>
              <ChatBubble
                variant="outgoing"
                className="opacity-70"
                avatarUrl={userPhotoUrl}
                avatarFallback={userInitials}
                html={isHtmlContent(entry.answer) ? entry.answer : undefined}
              >
                {entry.answer}
              </ChatBubble>
            </div>
          ))}

          {/* Show the pending answer during typing state */}
          {isTyping && pendingAnswer && currentQuestion && (
            <div className="space-y-3">
              {/* Show current question as faded (now part of history) */}
              <ChatBubble 
                variant="incoming" 
                icon={flowIcon}
                className="opacity-70"
              >
                {promptSegments.map((segment, idx) => (
                  <span 
                    key={idx}
                    className={segment.type === 'interpolated' ? 'font-medium' : ''}
                  >
                    {segment.content}
                  </span>
                ))}
              </ChatBubble>
              
              {/* Show the user's answer immediately */}
              <ChatBubble
                variant="outgoing"
                avatarUrl={userPhotoUrl}
                avatarFallback={userInitials}
                html={isHtmlContent(pendingAnswer) ? pendingAnswer : undefined}
              >
                {pendingAnswer}
              </ChatBubble>
            </div>
          )}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex items-end gap-2">
              <span className="text-lg">{flowIcon}</span>
              <TypingIndicator />
            </div>
          )}

          {/* AI Challenge */}
          {showChallenge && (
            <div className="space-y-3 animate-chat-message-in">
              <ChatBubble variant="incoming" icon={flowIcon}>
                {challengeText}
              </ChatBubble>
              <div className="flex gap-2 pl-8">
                <Button size="sm" onClick={handleRevise} className="rounded-full">
                  Revise Answer
                </Button>
                <Button size="sm" variant="ghost" onClick={handleSkipChallenge} className="rounded-full">
                  Continue →
                </Button>
              </div>
            </div>
          )}

          {declaredActions.length > 0 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <ChatBubble variant="incoming" icon={flowIcon}>
                Here are the action items you have declared so far.
              </ChatBubble>
              <div className="space-y-2 pl-8">
                {declaredActions.map((action) => (
                  <div key={action.index} className="rounded-2xl border border-border/60 bg-card px-4 py-3">
                    <p className="text-sm text-foreground">{action.finalText}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {action.addedToWeeklyPlaybook
                        ? 'Added to Weekly Playbook'
                        : 'Not added to Weekly Playbook'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {refiningAction && (
            <div className="flex items-end gap-2">
              <span className="text-lg">{flowIcon}</span>
              <TypingIndicator />
            </div>
          )}

          {draftAction && postFlowStage === 'review' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <ChatBubble variant="incoming" icon={flowIcon} animate>
                {draftAction.coachMessage}
                <br />
                <br />
                <strong>Sharper version:</strong> {draftAction.refinedText}
              </ChatBubble>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleKeepOriginalAction}
                  className="rounded-full"
                >
                  Keep Mine
                </Button>
                <Button
                  size="sm"
                  onClick={handleUseSuggestedAction}
                  className="rounded-full"
                >
                  Use Suggestion
                </Button>
              </div>
            </div>
          )}

          {draftAction && postFlowStage === 'add_to_playbook' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <ChatBubble variant="incoming" icon={flowIcon} animate>
                Strong move. This is going to your <strong>Weekly Playbook</strong>.
              </ChatBubble>

              <div className="rounded-2xl border border-border/60 bg-card px-4 py-3 ml-8">
                <p className="text-sm text-foreground">{draftAction.finalText}</p>
              </div>

              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={() => void finalizeDraftAction(true)}
                  disabled={addingToPlaybook}
                  className="rounded-full"
                >
                  {addingToPlaybook ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Add to Playbook
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {postFlowStage === 'ask_more' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <ChatBubble variant="incoming" icon={flowIcon} animate>
                Anything else you&apos;re being called to declare before we close this out?
              </ChatBubble>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCompleteFlow}
                  className="rounded-full"
                >
                  No, I&apos;m done
                </Button>
                <Button
                  size="sm"
                  onClick={() => setPostFlowStage('capture_additional')}
                  className="rounded-full"
                >
                  Yes, add another
                </Button>
              </div>
            </div>
          )}

          {postFlowStage === 'capture_additional' && !refiningAction && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <ChatBubble variant="incoming" icon={flowIcon} animate>
                What&apos;s the next action you&apos;re declaring?
              </ChatBubble>
            </div>
          )}

          <div ref={bottomRef} className="h-px w-full" style={{ scrollMarginBottom: footerHeight + 32 }} />
        </div>
      </main>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <Button
          variant="secondary"
          size="icon"
          className="fixed bottom-24 right-4 rounded-full shadow-lg z-20"
          onClick={() => scrollToCurrentQuestion()}
        >
          <ChevronDown className="h-5 w-5" />
        </Button>
      )}

      {/* Fixed Input Area */}
      <footer ref={footerRef} className="border-t border-border/10 bg-background/95 backdrop-blur sticky bottom-0">
        <div className="max-w-2xl mx-auto px-4 py-3">
          {saving && (
            <div className="flex items-center justify-center mb-2">
              <span className="text-xs text-muted-foreground flex items-center">
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                Saving...
              </span>
            </div>
          )}
          
          {!isTyping && currentQuestion && postFlowStage === 'idle' && (
            <>
              <ChatInput
                question={currentQuestion}
                value={currentValue}
                onChange={setCurrentValue}
                onSubmit={handleSubmitAnswer}
                disabled={checkingChallenge || showChallenge}
                isLast={isLastQuestion}
              />
            </>
          )}
          {!isTyping && postFlowStage === 'capture_additional' && (
            <ChatInput
              question={{
                id: '__post_flow_action_item',
                type: 'textarea',
                prompt: "What's the next action you're declaring?",
                required: true,
                placeholder: "What you'll actually do. Specific.",
              }}
              value={postFlowInput}
              onChange={setPostFlowInput}
              onSubmit={handleSubmitAdditionalAction}
              disabled={refiningAction}
              isLast
            />
          )}
          {!isTyping && postFlowStage !== 'idle' && postFlowStage !== 'capture_additional' && !refiningAction && (
            <div className="text-center text-sm text-muted-foreground py-2">
              Choose an option above to continue.
            </div>
          )}
          {isTyping && (
            <div className="text-center text-sm text-muted-foreground py-2">
              Thinking...
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}
