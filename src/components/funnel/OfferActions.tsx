import { Link } from 'react-router-dom';
import { checkoutUrl } from '@/config/checkout';
import { OFFERS, type CheckoutOption, type Offer, type OfferKey } from '@/config/offers';
import { checkoutClientReference, getKnownEmail, trackFunnel } from '@/lib/funnel/track';
import { amountFrom } from '@/lib/funnel/purchase';

export const bookHref = (offer: OfferKey) => `/book?offer=${offer}`;

/**
 * href and click handler for a checkout link, or null while the link is a
 * placeholder. The click fires InitiateCheckout and attaches the event id.
 */
export function checkoutLinkProps(offer: Offer, option: CheckoutOption) {
  const href = checkoutUrl(option.key, { email: getKnownEmail() });
  if (!href) return null;
  const onClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const eventId = trackFunnel('initiate_checkout', {
      offer: option.key,
      amount: amountFrom(option.billing),
      contentName: offer.name,
    });
    const withReference = checkoutUrl(option.key, {
      email: getKnownEmail(),
      clientReference: checkoutClientReference(eventId),
    });
    if (withReference) e.currentTarget.href = withReference;
  };
  return { href, onClick };
}

interface CheckoutButtonProps {
  offer: Offer;
  option: CheckoutOption;
  variant?: 'ink' | 'blue' | 'ghost';
  /** Label override (the offer option's label by default). */
  label?: string;
}

/**
 * A checkout button with its price line above it. Fires InitiateCheckout and
 * hands Stripe the buyer's email and the event id on the way out. If a link
 * is ever left empty, the button falls back to the offer's own page.
 */
export const CheckoutButton = ({ offer, option, variant = 'ink', label }: CheckoutButtonProps) => {
  const link = checkoutLinkProps(offer, option);
  const className = `fn-btn fn-btn--block${variant === 'blue' ? ' fn-btn--blue' : variant === 'ghost' ? ' fn-btn--ghost' : ''}`;

  if (!link) {
    return (
      <div className="fn-checkout">
        <p className="fn-checkout__billing">{option.billing}</p>
        <a className={className} href={offer.page}>
          {label ?? option.label}
        </a>
      </div>
    );
  }

  return (
    <div className="fn-checkout">
      <p className="fn-checkout__billing">{option.billing}</p>
      <a className={className} href={link.href} onClick={link.onClick}>
        {label ?? option.label}
      </a>
    </div>
  );
};

/** Agency Brain checks out on its own site; track the click the same way. */
const ExternalButton = ({ offer, variant = 'ink' }: { offer: Offer; variant?: 'ink' | 'blue' | 'ghost' }) => {
  if (!offer.external) return null;
  const { external } = offer;
  const className = `fn-btn fn-btn--block${variant === 'blue' ? ' fn-btn--blue' : variant === 'ghost' ? ' fn-btn--ghost' : ''}`;
  return (
    <div className="fn-checkout">
      <p className="fn-checkout__billing">{external.billing}</p>
      <a
        className={className}
        href={external.href}
        onClick={() => trackFunnel('initiate_checkout', { offer: offer.key, amount: amountFrom(external.billing), contentName: offer.name })}
      >
        {external.label}
      </a>
    </div>
  );
};

interface OfferActionsProps {
  offerKey: OfferKey;
  variant?: 'ink' | 'blue' | 'ghost';
  /** Show only the first checkout option (cards with limited room). */
  primaryOnly?: boolean;
}

/** The right buttons for an offer: checkout, external plans, apply, or waitlist. */
export const OfferActions = ({ offerKey, variant = 'ink', primaryOnly = false }: OfferActionsProps) => {
  const offer = OFFERS[offerKey];
  const ghostClass = 'fn-btn fn-btn--block fn-btn--ghost';
  const mainClass = `fn-btn fn-btn--block${variant === 'blue' ? ' fn-btn--blue' : variant === 'ghost' ? ' fn-btn--ghost' : ''}`;

  if (offer.route === 'waitlist') {
    return (
      <div className="fn-checkout">
        <p className="fn-checkout__billing">Waitlist only</p>
        <Link className={ghostClass} to={offer.page}>Join the waitlist</Link>
      </div>
    );
  }

  if (offer.route === 'apply') {
    return (
      <div className="fn-checkout">
        <p className="fn-checkout__billing">{offer.price ? `${offer.price} ${offer.cadence}` : offer.cadence}</p>
        <Link className={mainClass} to={bookHref(offer.key)}>Apply</Link>
      </div>
    );
  }

  if (offer.external) return <ExternalButton offer={offer} variant={variant} />;

  const options = primaryOnly ? offer.checkouts.slice(0, 1) : offer.checkouts;
  return (
    <>
      {options.map((option, i) => (
        <CheckoutButton key={option.key} offer={offer} option={option} variant={i === 0 ? variant : 'ghost'} />
      ))}
    </>
  );
};
