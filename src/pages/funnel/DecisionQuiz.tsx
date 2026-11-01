import { useEffect, useState } from 'react';
import SEOHead from '@/components/SEOHead';
import QuizFlow from '@/components/funnel/QuizFlow';
import PrescriptionResult from '@/components/funnel/PrescriptionResult';
import { FunnelFooter, FunnelHeader } from '@/components/funnel/FunnelChrome';
import type { QuizAnswers } from '@/config/quiz';
import { explainPrescription, prescribe, type Prescription } from '@/lib/funnel/prescribe';
import { leadSummary } from '@/lib/funnel/leadSummary';
import { saveAnswers } from '@/lib/funnel/funnelState';
import { captureMirrorAttribution } from '@/lib/mirrorAttribution';
import { submitFunnelLead } from '@/lib/funnel/track';
import './Funnel.css';

/** /decision: the 2-minute prescription quiz. */
const DecisionQuiz = () => {
  const [result, setResult] = useState<{ rx: Prescription; answers: QuizAnswers } | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    captureMirrorAttribution();
  }, []);

  const complete = (answers: QuizAnswers, contact: Parameters<typeof submitFunnelLead>[0]['contact']) => {
    const rx = prescribe(answers);
    submitFunnelLead({
      kind: 'quiz',
      contact,
      answers: { ...answers },
      prescription: rx.a,
      alternative: rx.b,
      rule: rx.rule,
      summary: leadSummary(answers, rx),
    });
    setResult({ rx, answers });
    window.scrollTo({ top: 0 });
  };

  const restart = () => {
    saveAnswers({});
    setResult(null);
    setAttempt((n) => n + 1);
  };

  return (
    <main className="funnel-page">
      <SEOHead
        config={{
          title: 'Find Your Prescription: 2-Minute Quiz | The Standard Playbook',
          description: 'Five questions about your agency. Get the Standard Playbook program that fits, with the reason why.',
          canonical: 'https://standardplaybook.com/decision',
        }}
      />
      <FunnelHeader />
      <div className={result ? 'fn-shell' : 'fn-shell fn-shell--narrow'}>
        {result ? (
          <div className="fn-stepper">
            <PrescriptionResult
              a={result.rx.a}
              b={result.rx.b}
              why={explainPrescription(result.rx.a, result.answers)}
            />
            <div className="fn-step-nav">
              <button type="button" className="fn-back" onClick={restart}>↺ Retake the quiz</button>
            </div>
          </div>
        ) : (
          <QuizFlow
            key={attempt}
            contactTitle="Where should we send your prescription?"
            contactNote="Your result shows on the next screen."
            submitLabel="See my prescription"
            onComplete={complete}
          />
        )}
      </div>
      <FunnelFooter />
    </main>
  );
};

export default DecisionQuiz;
