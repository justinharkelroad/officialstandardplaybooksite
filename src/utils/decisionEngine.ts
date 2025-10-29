import {
  OFFER_CATALOG,
  DECISION_RULES,
  INTAKE_SCHEMA,
  FormData,
  Offer,
} from '@/data/decisionEngine';

export interface Recommendation {
  slug: string;
  why: string;
}

export interface DecisionResult {
  recommendations: Recommendation[];
  cards: Offer[];
  scs_section: {
    show: boolean;
    tiers: Array<{
      slug: string;
      calls_per_month: number;
      price: number;
    }>;
  };
  tags: string[];
}

/**
 * Parse user form inputs into tags using INTAKE_SCHEMA.tag_map
 */
function parseInputsToTags(formData: FormData): string[] {
  const tags: string[] = [];

  // Map focus selections
  if (formData.focus && formData.focus.length > 0) {
    formData.focus.forEach((focusItem) => {
      const tag = INTAKE_SCHEMA.tag_map[focusItem];
      if (tag) tags.push(tag);
    });
  }

  // Map coaching mode
  if (formData.coaching_mode) {
    const tag = INTAKE_SCHEMA.tag_map[formData.coaching_mode];
    if (tag) tags.push(tag);
  }

  // Map urgency
  if (formData.urgency) {
    const tag = INTAKE_SCHEMA.tag_map[formData.urgency];
    if (tag) tags.push(tag);
  }

  // Map app usage
  if (formData.app_usage) {
    const tag = INTAKE_SCHEMA.tag_map['Willing to use the app weekly:true'];
    if (tag) tags.push(tag);
  }

  return [...new Set(tags)]; // Deduplicate
}

/**
 * Apply DECISION_RULES to tags and generate recommendations
 */
function applyRules(tags: string[]): Recommendation[] {
  const recommendations: Recommendation[] = [];
  const seenSlugs = new Set<string>();

  for (const rule of DECISION_RULES.rules) {
    const matches = rule.if_any_tags.some((tag) => tags.includes(tag));
    if (matches) {
      for (const slug of rule.recommend) {
        // Respect constraints: never auto-select Partnership
        if (DECISION_RULES.constraints.exclude_from_auto_select.includes(slug)) {
          continue;
        }
        if (!seenSlugs.has(slug)) {
          recommendations.push({ slug, why: rule.why });
          seenSlugs.add(slug);
        }
      }
    }
  }

  // Limit to 3 recommendations
  return recommendations.slice(0, 3);
}

/**
 * Apply bundle logic: if certain offers are recommended, also show related offers
 */
function applyBundles(recommendations: Recommendation[]): Recommendation[] {
  const bundled = [...recommendations];
  const seenSlugs = new Set(recommendations.map((r) => r.slug));

  for (const bundle of DECISION_RULES.bundles) {
    const shouldApply = bundle.when_recommended.some((slug) => seenSlugs.has(slug));
    if (shouldApply) {
      for (const slug of bundle.also_show) {
        if (!seenSlugs.has(slug)) {
          bundled.push({
            slug,
            why: bundle.note || "Additional recommendation based on your selections.",
          });
          seenSlugs.add(slug);
        }
      }
    }
  }

  return bundled;
}

/**
 * Build offer cards from slugs
 */
function buildCards(recommendations: Recommendation[]): Offer[] {
  const cards: Offer[] = [];
  const slugs = recommendations.map((r) => r.slug);

  for (const slug of slugs) {
    const offer = OFFER_CATALOG.offers.find((o) => o.slug === slug);
    if (offer) {
      cards.push(offer);
    }
  }

  // Always add Partnership card (sold out, no auto-select)
  const partnership = OFFER_CATALOG.offers.find((o) => o.slug === 'partnership');
  if (partnership && !slugs.includes('partnership')) {
    cards.push(partnership);
  }

  return cards;
}

/**
 * Determine if SCS section should be shown
 */
function shouldShowSCS(recommendations: Recommendation[], tags: string[]): boolean {
  const scsSlugs = ['scs-30', 'scs-50', 'scs-100'];
  const hasScoreRecommendation = recommendations.some((r) => scsSlugs.includes(r.slug));
  const hasTimeManagementTag = tags.includes('time_management_for_call_reviews');
  return hasScoreRecommendation || hasTimeManagementTag;
}

/**
 * Main decision engine: parse inputs, apply rules, return recommendations
 */
export function runDecisionEngine(formData: FormData): DecisionResult {
  // 1. Parse inputs to tags
  const tags = parseInputsToTags(formData);

  // 2. Apply rules to get recommendations
  let recommendations = applyRules(tags);

  // 3. Apply bundle logic
  recommendations = applyBundles(recommendations);

  // 4. Build cards from recommendations
  const cards = buildCards(recommendations);

  // 5. Determine if SCS section should be shown
  const showSCS = shouldShowSCS(recommendations, tags);

  // 6. Build SCS tiers
  const scsTiers = [
    { slug: 'scs-30', calls_per_month: 30, price: 299 },
    { slug: 'scs-50', calls_per_month: 50, price: 399 },
    { slug: 'scs-100', calls_per_month: 100, price: 499 },
  ];

  return {
    recommendations,
    cards,
    scs_section: {
      show: showSCS,
      tiers: scsTiers,
    },
    tags,
  };
}
