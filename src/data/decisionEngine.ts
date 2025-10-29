// Source of truth for The Decision page - all offer data, rules, and intake schema

export interface OfferInclusions {
  group_call_2h_monthly?: boolean;
  one_on_one_2h_monthly?: boolean;
  video_messaging_24_7?: boolean;
  team_call_45m_monthly?: boolean;
  app_access?: string;
  hardcover_included?: boolean;
  scs_included?: {
    calls_per_rep_per_week: number;
    unlimited_reps: boolean;
  };
  deliverables?: string[];
  duration_weeks?: number;
  calls_scored_per_month?: number;
}

export interface OfferGuarantee {
  label: string;
  copy: string;
}

export interface OfferLinks {
  checkout: string | null;
  details?: string;
}

export interface PriceOption {
  label: string;
  amount: number;
}

export interface Offer {
  slug: string;
  name: string;
  type: 'membership' | 'program' | 'saas';
  price?: number;
  price_options?: PriceOption[];
  billing_cycle: string;
  status: 'open' | 'sold_out';
  inclusions: OfferInclusions;
  notes?: string[];
  guarantee?: OfferGuarantee;
  links: OfferLinks;
  display_order: number;
}

export interface DecisionRule {
  if_any_tags: string[];
  recommend: string[];
  why: string;
}

export interface DecisionConstraints {
  exclude_from_auto_select: string[];
  always_show_cards: string[];
}

export interface Bundle {
  name: string;
  when_recommended: string[];
  also_show: string[];
  note?: string;
}

export interface IntakeField {
  id: string;
  label: string;
  type: 'textarea' | 'number' | 'multiselect' | 'select' | 'toggle';
  options?: string[];
  required?: boolean;
}

export interface FormData {
  situation: string;
  team_size?: number;
  ninety_day_win: string;
  focus: string[];
  coaching_mode: string;
  urgency: string;
  app_usage: boolean;
}

// ====================================================
// OFFER_CATALOG
// ====================================================

export const OFFER_CATALOG: { version: string; currency: string; offers: Offer[] } = {
  version: "2025-10-29",
  currency: "USD",
  offers: [
    {
      slug: "boardroom",
      name: "Boardroom",
      type: "membership",
      price: 299,
      billing_cycle: "monthly",
      status: "open",
      inclusions: {
        group_call_2h_monthly: true,
        one_on_one_2h_monthly: false,
        video_messaging_24_7: false,
        team_call_45m_monthly: false,
        app_access: "Stack Access",
        hardcover_included: true
      },
      notes: ["Month-to-month. No contract."],
      links: {
        checkout: "URL_PLACEHOLDER",
        details: "https://standardplaybook.com/boardroom"
      },
      display_order: 10
    },
    {
      slug: "directive",
      name: "Directive",
      type: "membership",
      price: 1500,
      billing_cycle: "monthly",
      status: "open",
      inclusions: {
        group_call_2h_monthly: true,
        one_on_one_2h_monthly: true,
        video_messaging_24_7: true,
        team_call_45m_monthly: false,
        app_access: "Full Access",
        hardcover_included: true
      },
      notes: ["Month-to-month. No contract."],
      links: {
        checkout: "URL_PLACEHOLDER",
        details: "https://standardplaybook.com/directive"
      },
      display_order: 20
    },
    {
      slug: "partnership",
      name: "Partnership",
      type: "membership",
      price: 2000,
      billing_cycle: "monthly",
      status: "sold_out",
      inclusions: {
        group_call_2h_monthly: true,
        one_on_one_2h_monthly: true,
        video_messaging_24_7: true,
        team_call_45m_monthly: true,
        app_access: "Full Access",
        hardcover_included: true
      },
      notes: ["Sold Out"],
      links: {
        checkout: null,
        details: "https://standardplaybook.com/partnership"
      },
      display_order: 30
    },
    {
      slug: "sales-experience",
      name: "8-Week Sales Experience",
      type: "program",
      price_options: [
        { label: "Pay in full", amount: 4500 },
        { label: "Weekly", amount: 625 }
      ],
      billing_cycle: "one_time_or_weekly",
      status: "open",
      inclusions: {
        scs_included: { calls_per_rep_per_week: 4, unlimited_reps: true },
        deliverables: [
          "Hard copy of Building a Sales Experience",
          "8 Monday video trainings",
          "8 Wednesday training documents",
          "Sales team call scoring",
          "Fully deployed Sales Process",
          "Accountability Process document",
          "Consequence Process document"
        ],
        app_access: "Stack Access"
      },
      guarantee: {
        label: "The Only Guarantee That Matters",
        copy: "If you don't see value after 8 weeks, I'll give you your money back... STRAIGHT UP. Not because the system doesn't work. Because if it doesn't work for you, you weren't working. And I only want money from people who implement. Fair?"
      },
      links: {
        checkout: "URL_PLACEHOLDER",
        details: "https://standardplaybook.com/sales-experience"
      },
      display_order: 40
    },
    {
      slug: "producer-challenge",
      name: "Producer Power Up Challenge",
      type: "program",
      price: 299,
      billing_cycle: "one_time",
      status: "open",
      inclusions: {
        duration_weeks: 6,
        app_access: "Stack Access"
      },
      links: { checkout: "URL_PLACEHOLDER" },
      display_order: 50
    },
    {
      slug: "scs-30",
      name: "Standard Call Scoring — 30",
      type: "saas",
      price: 299,
      billing_cycle: "monthly",
      status: "open",
      inclusions: { calls_scored_per_month: 30 },
      links: { checkout: "URL_PLACEHOLDER", details: "https://standardplaybook.com/callscoring" },
      display_order: 60
    },
    {
      slug: "scs-50",
      name: "Standard Call Scoring — 50",
      type: "saas",
      price: 399,
      billing_cycle: "monthly",
      status: "open",
      inclusions: { calls_scored_per_month: 50 },
      links: { checkout: "URL_PLACEHOLDER", details: "https://standardplaybook.com/callscoring" },
      display_order: 70
    },
    {
      slug: "scs-100",
      name: "Standard Call Scoring — 100",
      type: "saas",
      price: 499,
      billing_cycle: "monthly",
      status: "open",
      inclusions: { calls_scored_per_month: 100 },
      links: { checkout: "URL_PLACEHOLDER", details: "https://standardplaybook.com/callscoring" },
      display_order: 80
    }
  ]
};

// ====================================================
// DECISION_RULES
// ====================================================

export const DECISION_RULES: {
  version: string;
  rules: DecisionRule[];
  constraints: DecisionConstraints;
  bundles: Bundle[];
} = {
  version: "2025-10-29",
  rules: [
    {
      if_any_tags: ["deploy_sales_process", "manager_training"],
      recommend: ["sales-experience"],
      why: "You want a fully deployed sales process and manager enablement."
    },
    {
      if_any_tags: ["time_management_for_call_reviews", "call_quality", "coaching_efficiency"],
      recommend: ["scs-30", "scs-50", "scs-100"],
      why: "You want to replace long call reviews with fast scoring."
    },
    {
      if_any_tags: ["wants_one_on_one"],
      recommend: ["directive"],
      why: "You want monthly 1:1 plus 24/7 video messaging."
    },
    {
      if_any_tags: ["prefers_group_only"],
      recommend: ["boardroom"],
      why: "You prefer group cadence without 1:1."
    },
    {
      if_any_tags: ["producer_skill_sprint"],
      recommend: ["producer-challenge"],
      why: "You want a 6-week producer-focused sprint."
    }
  ],
  constraints: {
    exclude_from_auto_select: ["partnership"],
    always_show_cards: ["partnership"]
  },
  bundles: [
    {
      name: "Sales Experience + SCS",
      when_recommended: ["sales-experience"],
      also_show: ["scs-50"],
      note: "Pair SCS for weekly call grading while deploying process."
    },
    {
      name: "Directive + Producer Challenge",
      when_recommended: ["directive"],
      also_show: ["producer-challenge"]
    }
  ]
};

// ====================================================
// INTAKE_SCHEMA
// ====================================================

export const INTAKE_SCHEMA: {
  fields: IntakeField[];
  tag_map: Record<string, string>;
} = {
  fields: [
    { id: "situation", label: "Your situation", type: "textarea", required: true },
    { id: "team_size", label: "Team size", type: "number" },
    { id: "ninety_day_win", label: "A win in the next 90 days looks like…", type: "textarea", required: true },
    {
      id: "focus",
      label: "Primary focus",
      type: "multiselect",
      options: [
        "Deploy sales process",
        "Manager training",
        "Producer skill sprint",
        "Time management for call reviews",
        "Accountability systems",
        "Community and cadence"
      ],
      required: true
    },
    {
      id: "coaching_mode",
      label: "Coaching mode",
      type: "select",
      options: ["Group only", "1:1 + group"],
      required: true
    },
    {
      id: "urgency",
      label: "Start timeframe",
      type: "select",
      options: ["ASAP (<30 days)", "Soon (30–60 days)", "Later (>60 days)"],
      required: true
    },
    { id: "app_usage", label: "Willing to use the app weekly", type: "toggle" }
  ],
  tag_map: {
    "Deploy sales process": "deploy_sales_process",
    "Manager training": "manager_training",
    "Producer skill sprint": "producer_skill_sprint",
    "Time management for call reviews": "time_management_for_call_reviews",
    "Group only": "prefers_group_only",
    "1:1 + group": "wants_one_on_one",
    "ASAP (<30 days)": "urgency_high",
    "Willing to use the app weekly:true": "wants_app_usage"
  }
};
