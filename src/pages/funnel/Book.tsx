import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import StandardFitModal from '@/components/StandardFitModal';
import QuizFlow from '@/components/funnel/QuizFlow';
import PrescriptionResult from '@/components/funnel/PrescriptionResult';
import { FunnelFooter, FunnelHeader } from '@/components/funnel/FunnelChrome';
import { JUSTIN_CALENDARS, maryCalendarUrl } from '@/config/booking';
import { isOfferKey, OFFERS, type OfferKey } from '@/config/offers';
import type { QuizAnswers } from '@/config/quiz';
import { explainPrescription, prescribe } from '@/lib/funnel/prescribe';
import { captureMirrorAttribution } from '@/lib/mirrorAttribution';
import { submitFunnelLead, type FunnelContact } from '@/lib/funnel/track';
import './Funnel.css';

type View =
  | { kind: 'form' }
  | { kind: 'apply'; offer: OfferKey; contact: FunnelContact }
  | { kind: 'mary'; offer: OfferKey }
  | { kind: 'buy'; offer: OfferKey; alternative: OfferKey; answers: QuizAnswers };

const bookedHref = (offer: OfferKey) => `/booked?offer=${offer}`;

/** Mary's 15-minute calendar, embedded, with a manual continue for bookers. */
const MaryCalendar = ({ offer }: { offer: OfferKey }) => {
  const navigate = useNavigate();
  const url = maryCalendarUrl();

  // Acuity can post a booked message when the calendar has the custom
  // confirmation snippet installed (same one BookingModal listens for).
  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      const origin = event.origin || '';
      const fromAcuity = origin.includes('acuityscheduling.com') || origin.includes('as.me');
      const data = event.data as { type?: string } | null;
      if (fromAcuity && data && typeof data === 'object' && data.type === 'acuity-appointment-booked') {
        navigate(bookedHref(offer));
      }
    };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, [navigate, offer]);

  return (
    <div>
      <p className="fn-kicker">/ 15 minutes with Mary</p>
      <h1 className="fn-display fn-h2">Pick a time that works.</h1>
      <p className="fn-result-why">
        Mary will walk through {OFFERS[offer].name} with you and answer anything that's still open.
      </p>
      <div className="fn-calendar">
        <iframe title="Book 15 minutes with Mary" src={url} allow="payment" />
      </div>
      <div className="fn-final-actions">
        <Link className="fn-btn fn-btn--blue" to={bookedHref(offer)}>Booked? Continue</Link>
        <a className="fn-btn fn-btn--ghost" href={url} target="_blank" rel="noopener noreferrer">Open the calendar in a new tab</a>
      </div>
    </div>
  );
};

/**
 * /book: the booking form. Quiz questions 1-5 plus contact details, then
 * routed by offer: Standard 90 / Ascension / Momentum go to the application
 * and Justin's calendar, 8-Week and Team Standard go to Mary's calendar, and
 * buy-now offers skip the call and show checkout.
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
    });
    if (route === 'apply') {
      setView({ kind: 'apply', offer, contact });
      setApplyOpen(true);
    } else if (route === 'mary') setView({ kind: 'mary', offer });
    else if (route === 'waitlist') navigate(OFFERS[offer].page);
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

        {view.kind === 'mary' && (
          <div className="fn-stepper"><MaryCalendar offer={view.offer} /></div>
        )}

        {view.kind === 'buy' && (
          <div className="fn-stepper">
            <PrescriptionResult
              a={view.offer}
              b={view.alternative}
              why={explainPrescription(view.offer, view.answers)}
              maryLink={
                <p className="fn-small" style={{ marginTop: 20 }}>
                  You can start right now, no call needed.{' '}
                  <button
                    type="button"
                    className="fn-back fn-link"
                    style={{ padding: 0, fontSize: 'inherit' }}
                    onClick={() => setView({ kind: 'mary', offer: view.offer })}
                  >
                    I still want to talk to someone
                  </button>
                </p>
              }
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
