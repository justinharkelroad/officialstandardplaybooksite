// Structured data (JSON-LD) schemas for all pages
// Each page can have multiple schema objects

const BASE_URL = 'https://standardplaybook.com';

// --- Reusable Entities ---

const providerOrg = {
  "@type": "Organization",
  "name": "The Standard Playbook",
  "url": BASE_URL,
};

// --- Breadcrumb Helper ---

function breadcrumb(pageName: string, pageUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": BASE_URL,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": pageName,
        "item": `${BASE_URL}${pageUrl}`,
      },
    ],
  };
}

// --- Service Schema Helper ---

function serviceSchema(opts: {
  name: string;
  url: string;
  description: string;
  serviceType: string;
  audience: string;
  price?: string;
  priceCurrency?: string;
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": opts.name,
    "url": `${BASE_URL}${opts.url}`,
    "description": opts.description,
    "provider": providerOrg,
    "serviceType": opts.serviceType,
    "audience": {
      "@type": "Audience",
      "audienceType": opts.audience,
    },
    "areaServed": {
      "@type": "Country",
      "name": "United States",
    },
  };
  if (opts.price) {
    schema.offers = {
      "@type": "Offer",
      "price": opts.price,
      "priceCurrency": opts.priceCurrency || "USD",
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": opts.price,
        "priceCurrency": opts.priceCurrency || "USD",
        "unitText": "MONTH",
      },
    };
  }
  return schema;
}

// --- Course Schema Helper ---

function courseSchema(opts: {
  name: string;
  url: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": opts.name,
    "url": `${BASE_URL}${opts.url}`,
    "description": opts.description,
    "provider": providerOrg,
  };
}

// --- FAQ Schema Helper ---

function faqSchema(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": items.map((item) => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer,
      },
    })),
  };
}

// --- Per-Page Structured Data ---

export const structuredDataByRoute: Record<string, object[]> = {
  '/': [
    // ProfessionalService, WebSite, and Person are in index.html statically
    // No additional dynamic schemas needed for homepage
  ],

  '/boardroom': [
    serviceSchema({
      name: "The Boardroom",
      url: "/boardroom",
      description: "Weekly group coaching and software-enforced accountability for insurance agency owners. Live Monday calls at 1:00 PM ET, the 30-minute Domino & Mirror accountability loop, daily Telegram access, the 8-Week Mirror Challenge, and full Agency Brain Core access ($299/mo standalone value) included for $399/month.",
      serviceType: "Business Coaching Mastermind & Agency Operating Software",
      audience: "Insurance Agency Owners, Principal Agents, and Key Leaders",
      price: "399",
    }),
    courseSchema({
      name: "The Boardroom",
      url: "/boardroom",
      description: "Weekly Monday live coaching, Domino accountability loop, and Agency Brain Core operating system for insurance agency owners",
    }),
    breadcrumb("The Boardroom", "/boardroom"),
    faqSchema([
      {
        question: "Who is The Boardroom for (and how do key leaders work)?",
        answer: "The Boardroom is built for insurance agency owners who want peer pressure, direct access to Justin and Corina, and a weekly execution rhythm. Your $399/mo membership includes unlimited Agency Brain Staff Portal logins for your producers and team, and you can also grant designated key leaders access to the Boardroom loop inside the platform.",
      },
      {
        question: "How does the 30-minute pre-call software loop work?",
        answer: "Every Sunday at 12:00 AM Eastern, your weekly Boardroom window opens inside Agency Brain. Before Monday's 1:00 PM ET call, you walk through three gated stages: Return & Report (5 min), the 5-Step Domino Builder (10 min), and the 10-Step Domino Flow (15 min) which goes directly to your coach and anchors your live breakout room.",
      },
      {
        question: "What is The Mirror and the 8-Week Mirror Challenge?",
        answer: "Members get three connected Mirror systems: the Weekly Mirror tracking your last 8 Domino loops, the 160-Point Agency Mirror across 5 Pillars and 32 subcategories, and the Boardroom-exclusive 8-Week / 32-Day Mirror Challenge delivered via a private managed Telegram room.",
      },
      {
        question: "Is the full $299/month Agency Brain Core platform really included?",
        answer: "Yes. Standalone Agency Brain Core is $299/month. Your $399/month Boardroom membership includes full Agency Brain Core access plus weekly live Monday coaching ($100/mo — $25/week): 20 AI-scored calls per month, unlimited Staff Portal seats, Scorecards, Leaderboards, LQS Roadmap, 5 Agency HQs, Standard Playbook Training, Core 4, all 7 Daily Flows, and 5 ROI Forecasters.",
      },
    ]),
  ],

  '/directive': [
    serviceSchema({
      name: "The Directive",
      url: "/directive",
      description: "Intensive 1:1 implementation coaching with direct access to Justin. Includes monthly private coaching calls, weekly check-ins, accountability protocols, 100 AI-graded calls per month, and custom AI/tech strategy buildouts.",
      serviceType: "One-on-One Business Coaching",
      audience: "Insurance Agency Owners seeking intensive growth acceleration",
    }),
    breadcrumb("The Directive", "/directive"),
  ],

  '/momentum': [
    serviceSchema({
      name: "Momentum",
      url: "/momentum",
      description: "Directive-level work, twice the conversation. Two 90-minute 1:1 coaching and implementation calls per month, the weekly Monday group coaching call, Boardroom tool access inside Agency Brain, Agency Brain Pro, and Telegram access.",
      serviceType: "One-on-One Business Coaching",
      audience: "Insurance Agency Owners",
    }),
    breadcrumb("Momentum", "/momentum"),
  ],

  '/sales-experience': [
    serviceSchema({
      name: "Sales Experience",
      url: "/sales-experience",
      description: "8-week sales management training program for insurance agencies. Includes sales dashboard analytics, training modules with feedback, sales process frameworks, accountability metrics, and consequence ladder systems.",
      serviceType: "Sales Management Training Program",
      audience: "Insurance Agency Owners and Sales Managers",
    }),
    breadcrumb("Sales Experience", "/sales-experience"),
  ],


  '/callscoring': [
    serviceSchema({
      name: "Standard Call Scoring",
      url: "/callscoring",
      description: "AI-powered call evaluation tool for insurance agency sales teams. Provides instant insights, consistent feedback, and performance acceleration. Included in every Agency Brain plan.",
      serviceType: "AI Sales Coaching Tool",
      audience: "Insurance Agency Owners and Sales Managers",
      price: "299",
    }),
    breadcrumb("Call Scoring", "/callscoring"),
  ],

  '/about': [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Justin Harkelroad",
      "jobTitle": "Founder & Head Coach",
      "worksFor": providerOrg,
      "knowsAbout": [
        "Executive Coaching",
        "Insurance Agency Growth",
        "Sales Leadership",
        "Producer Development",
        "AI in Sales",
        "Business Coaching",
      ],
    },
    breadcrumb("About", "/about"),
  ],

  '/contact': [
    breadcrumb("Contact", "/contact"),
  ],

  '/decision': [
    breadcrumb("Find Your Program", "/decision"),
  ],

  '/privacy': [
    breadcrumb("Privacy Policy", "/privacy"),
  ],

  '/terms': [
    breadcrumb("Terms of Service", "/terms"),
  ],

  '/the-challenge': [
    serviceSchema({
      name: "The 6 Week Producer Challenge",
      url: "/the-challenge",
      description: "A 42-day execution system for one insurance producer. Daily modules, daily accountability, and a weekly Discovery Stack.",
      serviceType: "Insurance Agency Intensive Program",
      audience: "Insurance Agency Owners",
      price: "299",
    }),
    courseSchema({
      name: "The 6 Week Producer Challenge",
      url: "/the-challenge",
      description: "A 42-day producer execution system with daily modules and daily accountability",
    }),
    breadcrumb("The 6 Week Producer Challenge", "/the-challenge"),
  ],

  '/blog': [
    breadcrumb("Blog", "/blog"),
  ],
};
