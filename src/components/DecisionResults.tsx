import { DecisionResult } from '@/utils/decisionEngine';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Crown } from 'lucide-react';
import { useState } from 'react';

interface DecisionResultsProps {
  result: DecisionResult;
  onStartOver: () => void;
}

const DecisionResults = ({ result, onStartOver }: DecisionResultsProps) => {
  const [selectedScsTier, setSelectedScsTier] = useState<string>('scs-50');

  // Stub analytics handler for future implementation
  const handleCheckoutClick = (slug: string) => {
    // TODO: Fire "decision_submitted" event with tags, recommendations, and chosen_card
    console.log('Analytics stub: decision_submitted', {
      tags: result.tags,
      recommendations: result.recommendations,
      chosen_card: slug,
    });
  };

  const renderFeatureBullets = (offer: any) => {
    const bullets: string[] = [];

    if (offer.inclusions.group_call_2h_monthly) bullets.push('2-hour monthly group call');
    if (offer.inclusions.one_on_one_2h_monthly) bullets.push('2-hour monthly 1:1 call');
    if (offer.inclusions.video_messaging_24_7) bullets.push('24/7 video messaging');
    if (offer.inclusions.team_call_45m_monthly) bullets.push('45-min monthly team call');
    if (offer.inclusions.app_access) bullets.push(offer.inclusions.app_access);
    if (offer.inclusions.deliverables) bullets.push(...offer.inclusions.deliverables);
    if (offer.inclusions.duration_weeks) bullets.push(`${offer.inclusions.duration_weeks}-week program`);
    if (offer.inclusions.calls_scored_per_month) bullets.push(`${offer.inclusions.calls_scored_per_month} calls scored per month`);

    return bullets;
  };

  const renderPriceLabel = (offer: any) => {
    if (offer.price_options) {
      return (
        <div className="space-y-1">
          {offer.price_options.map((option: any) => (
            <div key={option.label}>
              <span className="text-3xl font-bold text-white">${option.amount}</span>
              <span className="text-gray-400 ml-2">/ {option.label}</span>
            </div>
          ))}
        </div>
      );
    }
    return (
      <div>
        <span className="text-3xl font-bold text-white">${offer.price}</span>
        <span className="text-gray-400 ml-2">/ {offer.billing_cycle}</span>
      </div>
    );
  };

  return (
    <div className="space-y-16 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="font-rajdhani font-bold text-4xl md:text-5xl uppercase tracking-wide text-white">
          YOUR PERSONALIZED PATH
        </h2>
        <p className="text-gray-300 text-lg">Based on your inputs, here's what fits:</p>
      </div>

      {/* Primary Recommendations */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {result.cards.map((offer) => {
          const recommendation = result.recommendations.find((r) => r.slug === offer.slug);
          const isSoldOut = offer.status === 'sold_out';
          const bullets = renderFeatureBullets(offer);

          return (
            <div
              key={offer.slug}
              className="bg-dark-card border border-primary/20 rounded-lg p-8 space-y-6 hover:border-primary/40 transition-all"
            >
              {/* Name */}
              <h3 className="font-rajdhani font-bold text-2xl uppercase text-white">
                {offer.name}
              </h3>

              {/* Price */}
              <div>{renderPriceLabel(offer)}</div>

              {/* Why This Fits */}
              {recommendation && (
                <div className="bg-primary/10 border border-primary/30 rounded-md p-4">
                  <p className="text-sm text-primary font-semibold uppercase mb-2">Why this fits</p>
                  <p className="text-gray-300 text-sm">{recommendation.why}</p>
                </div>
              )}

              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                {offer.inclusions.hardcover_included && (
                  <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                    Hardcover Included
                  </Badge>
                )}
                {offer.inclusions.app_access && (
                  <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30">
                    {offer.inclusions.app_access}
                  </Badge>
                )}
                {isSoldOut && (
                  <Badge variant="destructive" className="bg-red-500/20 text-red-400 border-red-500/30">
                    Sold Out
                  </Badge>
                )}
              </div>

              {/* Feature Bullets */}
              <ul className="space-y-3">
                {bullets.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-300">
                    {offer.type === 'membership' ? (
                      <Crown className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    ) : (
                      <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    )}
                    <span className="text-sm">{bullet}</span>
                  </li>
                ))}
              </ul>

              {/* Notes */}
              {offer.notes && (
                <div className="text-xs text-gray-500 space-y-1">
                  {offer.notes.map((note, idx) => (
                    <p key={idx}>{note}</p>
                  ))}
                </div>
              )}

              {/* Guarantee (Sales Experience) */}
              {offer.guarantee && (
                <div className="border-t border-primary/20 pt-6 space-y-3">
                  <p className="text-primary font-semibold uppercase text-sm">
                    {offer.guarantee.label}
                  </p>
                  <p className="text-gray-300 text-sm whitespace-pre-wrap">
                    {offer.guarantee.copy}
                  </p>
                </div>
              )}

              {/* Action Button */}
              <div>
                {isSoldOut ? (
                  <Button
                    disabled
                    className="w-full bg-red-500/20 text-red-400 border border-red-500/30 pointer-events-none"
                  >
                    SOLD OUT
                  </Button>
                ) : (
                  <Button
                    className="btn-primary w-full"
                    onClick={() => handleCheckoutClick(offer.slug)}
                  >
                    {offer.links.details ? 'LEARN MORE' : 'GET STARTED'}
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* SCS Section (Conditional) */}
      {result.scs_section.show && (
        <div className="bg-dark-card border border-primary/20 rounded-lg p-8 space-y-6">
          <h3 className="font-rajdhani font-bold text-3xl uppercase text-white text-center">
            ALSO CONSIDER: STANDARD CALL SCORING
          </h3>
          <p className="text-gray-300 text-center">
            Replace long call reviews with fast, AI-powered scoring.
          </p>

          {/* Tier Selector */}
          <div className="grid md:grid-cols-3 gap-4">
            {result.scs_section.tiers.map((tier) => {
              const isSelected = selectedScsTier === tier.slug;
              return (
                <button
                  key={tier.slug}
                  onClick={() => setSelectedScsTier(tier.slug)}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/10'
                      : 'border-primary/20 bg-dark-card hover:border-primary/40'
                  }`}
                >
                  <div className="text-center space-y-2">
                    <p className="text-2xl font-bold text-white">{tier.calls_per_month} calls</p>
                    <p className="text-xl text-primary">${tier.price}/mo</p>
                  </div>
                </button>
              );
            })}
          </div>

          <p className="text-xs text-gray-500 text-center">Month-to-month. No contract.</p>

          <div className="flex justify-center">
            <Button
              className="btn-primary"
              onClick={() => handleCheckoutClick(selectedScsTier)}
            >
              GET STARTED
            </Button>
          </div>
        </div>
      )}

      {/* Start Over */}
      <div className="flex justify-center pt-8">
        <Button variant="outline" onClick={onStartOver}>
          Start Over
        </Button>
      </div>
    </div>
  );
};

export default DecisionResults;
