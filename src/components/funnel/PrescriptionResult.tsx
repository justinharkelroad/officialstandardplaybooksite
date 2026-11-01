import { Link } from 'react-router-dom';
import { MIRROR_CREDIT_TERMS, OFFERS, RESULTS_DISCLAIMER, type OfferKey } from '@/config/offers';
import { TALK_TO_MARY_RESULTS } from '@/config/quiz';
import { bookHref, OfferActions } from './OfferActions';

interface PrescriptionResultProps {
  a: OfferKey;
  b: OfferKey;
  why: string;
  /** Overrides the "Book 15 minutes with Mary" rule (booking form shows its own link). */
  maryLink?: React.ReactNode;
}

const OfferCard = ({ offerKey, primary }: { offerKey: OfferKey; primary: boolean }) => {
  const offer = OFFERS[offerKey];
  return (
    <article className={`fn-card${primary ? ' fn-card--primary' : ''}`}>
      <span className="fn-card__tag">{primary ? 'A · Prescription' : 'B · Alternative'}</span>
      <h2 className="fn-display fn-h3">{offer.name}</h2>
      {offer.price && <p className="fn-card__price">{offer.price}<small>{offer.cadence}</small></p>}
      <p className="fn-card__fit">{offer.summary}</p>
      {offer.includes.length > 0 && (
        <ul className="fn-list">
          {offer.includes.map((item) => <li key={item}>{item}</li>)}
        </ul>
      )}
      {offerKey === 'mirror' && <p className="fn-credit" style={{ margin: 0 }}>{MIRROR_CREDIT_TERMS}</p>}
      <div className="fn-card__actions">
        <OfferActions offerKey={offerKey} variant={primary ? 'blue' : 'ink'} />
      </div>
    </article>
  );
};

/** "Your prescription: X", why, the A and B offers, and the Mary link where it applies. */
const PrescriptionResult = ({ a, b, why, maryLink }: PrescriptionResultProps) => (
  <div>
    <p className="fn-kicker">/ Your prescription</p>
    <h1 className="fn-display fn-h2">
      Your prescription: <span className="fn-accent">{OFFERS[a].name}.</span>
    </h1>
    <p className="fn-result-why">{why}</p>
    <div className="fn-result-actions">
      <OfferCard offerKey={a} primary />
      <OfferCard offerKey={b} primary={false} />
    </div>
    {maryLink ?? (TALK_TO_MARY_RESULTS.includes(a) && (
      <p className="fn-mary">
        Want to talk it through? <Link className="fn-link" to={bookHref(a)}>Book 15 minutes with Mary.</Link>
      </p>
    ))}
    <p className="fn-disclaimer">{RESULTS_DISCLAIMER}</p>
  </div>
);

export default PrescriptionResult;
