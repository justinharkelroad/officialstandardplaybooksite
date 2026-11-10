import { useState } from 'react';

// Public, new-customer offers only. Existing customers upgrade inside Agency Brain.
// Billing truth: agencybrain/_shared/boardroomCheckout.ts; feature truth:
// agencybrain/src/components/subscription/CoreProUpgradeModal.tsx.
const plans = [
  {
    name: 'Boardroom', software: 'Agency Brain Core', price: 399,
    url: 'https://buy.stripe.com/cNi6oH2CGeP4aWcbC44Vy0z',
    detail: 'The complete agency operating system, with weekly owner accountability.',
    features: ['20 AI call scores per month', 'Unlimited Staff Portal logins', 'Scorecards, leaderboards and agency workflows', 'Core 4 and guided Daily Flows'],
    breakdown: 'Core included in your $399 Boardroom membership.',
  },
  {
    name: 'Boardroom Plus', software: 'Agency Brain Plus', price: 549,
    url: 'https://buy.stripe.com/28E00j2CGgXcc0gcG84Vy0K',
    detail: 'Everything in Core, with AI builders to develop your team and agency.',
    features: ['50 AI call scores per month', 'Video Architect and Training AI Builder', 'AI Training Studio: 240 minutes per month', 'Mirror, Growth Center, Comp Plan, Theta and Life Targets AI tools'],
    breakdown: '$399 Boardroom + $150 Plus software layer.',
  },
  {
    name: 'Boardroom Pro', software: 'Agency Brain Pro', price: 699,
    url: 'https://buy.stripe.com/bJe8wP3GKfT89S835y4Vy0L',
    detail: 'Everything in Plus, with more AI capacity and the full HR Suite.',
    features: ['100 AI call scores per month', '600 Studio roleplay minutes per month', 'HR Suite', 'Priority support'],
    breakdown: '$399 Boardroom + $300 Pro software layer.',
  },
] as const;

export type CheckoutAudience = 'checking' | 'signed-out' | 'signed-in' | 'error';

export default function BoardroomPlanChoices({ audience }: { audience: CheckoutAudience }) {
  const [confirmedNewCustomer, setConfirmedNewCustomer] = useState(false);
  const canPurchase = audience === 'signed-out' && confirmedNewCustomer;

  return (
    <section id="pricing" className="br-plans" aria-labelledby="br-plans-title">
      <div className="br-plans-inner">
        <p className="br-plans-eyebrow">Your seat. Your software.</p>
        <h2 id="br-plans-title">SAME BOARDROOM.<br />CHOOSE YOUR BRAIN.</h2>
        <p className="br-plans-intro">Weekly live coaching. The same accountability. Choose the Agency Brain software level you want from day one.</p>
        <div className="br-plans-shared">
          <h3>Every plan includes The Boardroom</h3>
          <p>Monday live coaching at 1:00 PM ET · Return &amp; Report, Domino Builder and Domino Flow · Private Telegram room and direct access to Justin · 8-Week Mirror Challenge</p>
        </div>

        <div className="br-plans-access" aria-live="polite">
          {audience === 'checking' && <p>Checking account access…</p>}
          {audience === 'error' && <p>We couldn’t check your account. Refresh this page before starting a new membership.</p>}
          {audience === 'signed-in' ? (
            <p>You’re signed in. Manage your existing membership and software in Agency Brain to avoid a second subscription.</p>
          ) : (
            <>
              <p>Already have Boardroom or Agency Brain? <a href="https://myagencybrain.com">Open Agency Brain to upgrade your existing subscription.</a></p>
              {audience === 'signed-out' && (
                <label className="br-plans-confirm">
                  <input type="checkbox" checked={confirmedNewCustomer} onChange={(event) => setConfirmedNewCustomer(event.target.checked)} />
                  <span>I’m a new customer. I don’t already have a Boardroom or Agency Brain subscription.</span>
                </label>
              )}
            </>
          )}
          {audience === 'signed-in' && <a href="https://myagencybrain.com">Open Agency Brain →</a>}
        </div>

        <div className="br-plans-grid">
          {plans.map((plan) => (
            <article key={plan.name} className="br-plan" aria-label={plan.name}>
              <p className="br-plan-software">
                {plan.software}{plan.name === 'Boardroom' && <> <span className="br-plan-value">($299/mo value)</span></>} included
              </p>
              <h3>{plan.name}</h3>
              <p className="br-plan-price"><strong>${plan.price}</strong><span>/month</span></p>
              <p className="br-plan-breakdown">{plan.breakdown}</p>
              <p className="br-plan-detail">{plan.detail}</p>
              <ul>{plan.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
              {canPurchase ? (
                <a className="br-plan-cta" href={plan.url} target="_blank" rel="noopener noreferrer">Join {plan.name} <span aria-hidden="true">↗</span></a>
              ) : (
                <button className="br-plan-cta" disabled>Join {plan.name}</button>
              )}
            </article>
          ))}
        </div>
        <p className="br-plans-footnote">Monthly billing. New memberships only. Existing customers: upgrade in Agency Brain, where Stripe shows proration before you confirm.</p>
        <p className="br-plans-footnote">Live Monday attendance is coach-verified and streak-tracked. Call recordings and anonymized recaps are archived privately inside Agency Brain for active members. No income or sales results are promised or implied; outcomes depend on your market and your execution.</p>
      </div>
    </section>
  );
}
