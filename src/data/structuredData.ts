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
      description: "Elite mastermind for insurance agency owners. Monthly calls, peer accountability, strategy sessions, and growth frameworks from $1M+ agency operators. $299/month.",
      serviceType: "Business Coaching Mastermind",
      audience: "Insurance Agency Owners and Principal Agents",
      price: "299",
    }),
    breadcrumb("The Boardroom", "/boardroom"),
    faqSchema([
      {
        question: "Is this right for someone at my level?",
        answer: "The Boardroom is designed for agency owners at any stage who are committed to growth. If you want to surround yourself with proven operators who've built what you're trying to build, you belong here.",
      },
      {
        question: "What is included in the Boardroom membership?",
        answer: "Monthly group mastermind calls, peer accountability, strategy sessions, face-to-face networking with high-performing agency leaders, and access to proven scaling systems. $299/month with no long-term contracts.",
      },
      {
        question: "How fast will I see results?",
        answer: "Results depend on your implementation. Members who actively participate in calls and implement the systems typically see improvements within the first 1-2 months.",
      },
      {
        question: "What if I join and realize I'm the smallest one there?",
        answer: "Then you're in a room that can change your life. Being surrounded by people operating at a higher level is the fastest path to growth.",
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

  '/partnership': [
    serviceSchema({
      name: "Partnership",
      url: "/partnership",
      description: "White-glove business partnership for elite entrepreneurs generating $1M+ annually. Includes 24/7 direct phone access, revenue-sharing, joint ventures, and dedicated account management. Limited to 12 clients.",
      serviceType: "Executive Business Partnership",
      audience: "Elite Entrepreneurs generating $1M+ annually",
    }),
    breadcrumb("Partnership", "/partnership"),
    faqSchema([
      {
        question: "What are the requirements for Partnership consideration?",
        answer: "Partnership candidates typically generate $1M+ annually, have a proven track record of success, and are committed to significant growth. We look for entrepreneurs who value true partnership over traditional service relationships.",
      },
      {
        question: "How is Partnership pricing structured?",
        answer: "Partnership agreements are custom-designed based on your business, goals, and growth potential. Pricing typically includes a base fee plus performance-based components aligned with your success metrics.",
      },
      {
        question: "How many Partnership spots are available?",
        answer: "We limit Partnerships to ensure quality and attention. Currently, we accept no more than 12 Partnership clients at any time to maintain the highest level of service and collaboration.",
      },
      {
        question: "What makes this different from high-end consulting?",
        answer: "Unlike consulting, Partnership means we have aligned incentives through revenue sharing and joint investments. We're not just advisors — we're invested partners with skin in the game alongside you.",
      },
    ]),
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

  '/producer-power-up': [
    serviceSchema({
      name: "Producer Power-Up",
      url: "/producer-power-up",
      description: "6-week sales transformation challenge for insurance producers. Rolling enrollment with daily video modules, Core 4 habit tracking, weekly Discovery Stacks, 60-day app access, and daily owner reports. $299/producer.",
      serviceType: "Sales Producer Training Program",
      audience: "Insurance Producers and Agency Owners investing in producer development",
      price: "299",
    }),
    breadcrumb("Producer Power-Up", "/producer-power-up"),
    faqSchema([
      {
        question: "When does the challenge start?",
        answer: "The Producer Challenge runs on a rolling enrollment basis. Sign up any producer by Friday and they will automatically begin the following Monday. There are no fixed cohort dates — the system is always ready.",
      },
      {
        question: "How much time does this require daily?",
        answer: "Each daily module takes approximately 3-5 minutes to watch. Including the action declaration and submission, expect 10-15 minutes per day. The weekly Discovery Stack takes about 20-30 minutes on Fridays.",
      },
      {
        question: "What if my producer misses a day?",
        answer: "All content remains accessible throughout the 6-week period. While daily completion is encouraged for building the habit loop, producers can catch up if needed. You'll see exactly which modules they've completed through the daily reports.",
      },
      {
        question: "What access do I get as the owner?",
        answer: "You receive every daily action report via email, plus the full PDF of each weekly Discovery Stack. This gives you unprecedented visibility into your producer's engagement, takeaways, and action commitments.",
      },
      {
        question: "What's included in the app access?",
        answer: "Your producer gets 60 days of full access to The Standard App, including The Armory (30 training modules), Core 4 Tracker (habit gamification), and all 19 Stacking frameworks for emotional processing and reflection.",
      },
      {
        question: "What's the investment policy?",
        answer: "All enrollments are final. We provide immediate access to the full system. After completion, producers can continue with Standard programs at a 25% lifetime discount.",
      },
    ]),
  ],

  '/owner-challenge': [
    serviceSchema({
      name: "Owner Challenge",
      url: "/owner-challenge",
      description: "6-week Core 4 & Leadership Challenge for insurance agency owners. Identity-driven micro-lessons, Core 4 leadership habit system, executive templates, and weekly reinforcement. $299.",
      serviceType: "Leadership Development Challenge",
      audience: "Insurance Agency Owners",
      price: "299",
    }),
    breadcrumb("Owner Challenge", "/owner-challenge"),
    faqSchema([
      {
        question: "When does my identity transformation begin?",
        answer: "Your leadership identity transformation begins every Sunday. You'll receive your app credentials within 48 hours of enrollment to start building your new identity immediately.",
      },
      {
        question: "How much time is required for this identity shift?",
        answer: "Just 3 minutes daily for the micro-lessons, plus time to implement the identity-reinforcing strategies. Designed specifically for busy agency owners ready to transform their leadership identity.",
      },
      {
        question: "How do I track my identity development?",
        answer: "The app includes Core 4 tracking, habit stacking features, and progress monitoring specifically designed to reinforce your evolving leadership identity and measure your transformation.",
      },
      {
        question: "What's the investment policy?",
        answer: "All investments are final. We provide immediate access to identity-transforming content and are confident in the leadership transformation you'll experience through this proven framework.",
      },
    ]),
  ],

  '/callscoring': [
    serviceSchema({
      name: "Standard Call Scoring",
      url: "/callscoring",
      description: "AI-powered call evaluation tool for insurance agency sales teams. Provides instant insights, consistent feedback, and performance acceleration. $299-499/month.",
      serviceType: "AI Sales Coaching Tool",
      audience: "Insurance Agency Owners and Sales Managers",
      price: "299",
    }),
    breadcrumb("Call Scoring", "/callscoring"),
  ],

  '/app': [
    breadcrumb("App", "/app"),
  ],

  '/about': [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "Justin", // TODO: Update with full name
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
};
