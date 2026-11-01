import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import StandardFitModal from '@/components/StandardFitModal';
import QuizFlow from '@/components/funnel/QuizFlow';
import PrescriptionResult from '@/components/funnel/PrescriptionResult';
import { FunnelFooter, FunnelHeader } from '@/components/funnel/FunnelChrome';
import { JUSTIN_CALENDARS } from '@/config/booking';
import { isOfferKey, OFFERS, type OfferKey } from '@/config/offers';
import type { QuizAnswers } from '@/config/quiz';
import { explainPrescription, prescribe } from '@/lib/funnel/prescribe';
import { leadSummary } from '@/lib/funnel/leadSummary';
import { captureMirrorAttribution } from '@/lib/mirrorAttribution';
import { submitFunnelLead, type FunnelContact } from '@/lib/funnel/track';
import './Funnel.css';

type View =
| { kind: 'form' }
  | { kind: 'apply'; offer: OfferKey; contact: FunnelContact }
  | { kind: 'buy'; offer: OfferKey; alternative: OfferKey; answers: QuizAnswers };

/**
 * /book: the booking form. Quiz questions 1-5 plus contact details, then
 * routed by offer: Standard 90 / Ascension / Momentum go to the application
 * and Justin's calendar; everything else skips the call and shows checkout.
 * There are no sales calls with Mary (Justin, 2026-11-01).
 *
 * The offer comes from ?offer= (the button that sent them here) or, if
 * missing, from the quiz rules.
 */
const Book = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const requested = params.get('offer');
  const requestedOffer = isOfferKey(requested) ? requested : null;
  const [view, setView] = useState<View>({ kind: 'form' });
  const [applyOpen, setApplyOpen] = useState(false);

  useEffect(() => {
    captureMirrorAttribution();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [view.kind]);

  // Directive isn't open: send waitlist bookings to its page.
  useEffect(() => {
    if (requestedOffer && OFFERS[requestedOffer].route === 'waitlist') navigate(OFFERS[requestedOffer].page, { replace: true });
  }, [navigate, requestedOffer]);

  const complete = (answers: QuizAnswers, contact: FunnelContact) => {
    const rx = prescribe(answers);
    const offer = requestedOffer ?? rx.a;
    const route = OFFERS[offer].route;
    submitFunnelLead({
      kind: 'booking',
      contact,
      answers: { ...answers },
      prescription: rx.a,
      alternative: rx.b,
      offer,
      route,
      rule: rx.rule,
      summary: leadSummary(answers, rx, offer),
    });
    if (route === 'apply') {
      setView({ kind: 'apply', offer, contact });
      setApplyOpen(true);
    } else if (route === 'waitlist') navigate(OFFERS[offer].page);
    else setView({ kind: 'buy', offer, alternative: offer === rx.a ? rx.b : rx.a, answers });
  };

  const offerName = requestedOffer ? OFFERS[requestedOffer].name : null;

  return (
    <main className="funnel-page">
      <SEOHead
        config={{
          title: 'Book a Call | The Standard Playbook',
          description: 'Answer five questions and we will route you to the right call, or straight to checkout if you do not need one.',
          canonical: 'https://standardplaybook.com/book',
          noindex: true,
        }}
      />
      <FunnelHeader />
      <div className={view.kind === 'form' ? 'fn-shell fn-shell--narrow' : 'fn-shell'}>
        {view.kind === 'form' && (
          <>
            {offerName && <p className="fn-kicker" style={{ marginTop: 28, marginBottom: 0 }}>/ Booking about {offerName}</p>}
            <QuizFlow
              contactTitle="Where do we reach you?"
              contactNote="We use this to confirm your call. No spam."
              submitLabel="Continue"
              onComplete={complete}
            />
          </>
        )}

        {view.kind === 'buy' && (
          <div className="fn-stepper">
            <PrescriptionResult
              a={view.offer}
              b={view.alternative}
              why={explainPrescription(view.offer, view.answers)}
            />
          </div>
        )}

        {view.kind === 'apply' && (
          <div className="fn-stepper">
            <p className="fn-kicker">/ Application</p>
            <h1 className="fn-display fn-h2">Apply for {OFFERS[view.offer].name}.</h1>
            <p className="fn-result-why">
              {OFFERS[view.offer].name} is by application. A few questions about your agency, then you pick a time on Justin's calendar.
            </p>
            <button type="button" className="fn-btn fn-btn--blue" onClick={() => setApplyOpen(true)}>
              Continue the application
            </button>
            <StandardFitModal
              open={applyOpen}
              onOpenChange={setApplyOpen}
              source={OFFERS[view.offer].applySource}
              bookingBaseUrl={JUSTIN_CALENDARS[view.offer as keyof typeof JUSTIN_CALENDARS]}
              callLengthLabel="45-min"
              programName={OFFERS[view.offer].name}
              prefill={{ full_name: view.contact.name, email: view.contact.email, cell_phone: view.contact.phone }}
            />
          </div>
        )}
      </div>
      <FunnelFooter />
    </main>
  );
};

export default Book;
