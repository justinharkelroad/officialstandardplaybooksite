import type { MirrorTierSequenceEntry } from "./_shared.ts";

export const sequence: MirrorTierSequenceEntry[] = [
  // Email 1 — Day 0
  {
    daysOffset: 0,
    build: (ctx) => ({
      subject: `Your Mirror score: ${ctx.score} / 160`,
      preheader: "Your full PDF is here. Read this first.",
      body: `${ctx.firstName},

You scored ${ctx.score} out of 160. That puts you in Developing tier — the second tier from the bottom.

Here's what that actually means: you're not where most agencies are. You're past Foundation. You've started building. The fact that you scored 65+ tells me you have at least some systems, some accountability, some structure — and you're honest enough to take an assessment that exposes the rest.

Most owners at Developing tier are the same. They're doing better than they think, and worse than they want to be. They've earned some credibility but they haven't broken through yet.

Your weakest pillar came back as: **${ctx.weakestPillarName}**.

${ctx.diagnosticParagraph}

Your full Mirror workbook is here: [download the PDF](${ctx.pdfDownloadUrl}).

Over the next 9 days I'll send you a few notes — what's actually keeping Developing-tier agencies stuck, the move that gets them to Established, and where the room is if you want to do this work alongside other operators in the same fight.

The mirror is the mirror.

—Justin`,
    }),
  },

  // Email 2 — Day 1
  {
    daysOffset: 1,
    build: (ctx) => ({
      subject: "Why Developing is the hardest place to be",
      preheader: "You're not in crisis. You're not winning. You're stuck.",
      body: `${ctx.firstName},

Foundation-tier agencies have it easier than you in one specific way: they're in crisis. Crisis forces moves. Pain creates motion.

Developing-tier is harder. You're not in crisis — you're in slow drift. Your numbers are okay. Your team's okay. Your week-to-week feels manageable. You can keep doing what you're doing for another year, maybe three.

That's the trap.

Developing-tier agencies stay Developing for 4-6 years on average. Not because the owners aren't smart. Not because they don't work hard. They stay there because they don't have a forcing function. There's no fire. There's also no system that automatically pulls them upward.

You either install the rhythm that pulls you upward, or you stay where you are. The agencies that break through are the ones that decide they're not going to be Developing in 18 months — and then design backward from that decision.

The next note is about what that design actually looks like.

—Justin`,
    }),
  },

  // Email 3 — Day 2
  {
    daysOffset: 2,
    build: (ctx) => ({
      subject: "How Developing-tier agencies become Established",
      preheader: "Not new tactics. New rhythm.",
      body: `${ctx.firstName},

Most Developing-tier owners think the next level requires new tactics. New scripts. New marketing channel. New CRM.

It doesn't. The next level requires rhythm.

Established-tier agencies don't have radically different tactics than Developing-tier ones. They have the same playbook running on a tighter cadence:

— Daily morning huddle (you might do it 3 days a week — they do it 5)
— Weekly 1:1s with every team member (you might skip when busy — they don't)
— Monthly recap meeting reviewing real numbers (you might do it sometimes — they always do)
— Friday hour reviewing the dashboard (you might check the numbers when something feels off — they check on schedule)
— Call scoring weekly (you might score occasionally — they score every week, share results, coach off them)

That's the gap. Not new ideas. Tighter execution of ideas you already have.

Tactics are infinite and mostly overrated. Rhythm is finite and underrated. The agencies that move from Developing to Established are the ones that pick rhythm over tactics for 12 straight months.

—Justin`,
    }),
  },

  // Email 4 — Day 3
  {
    daysOffset: 3,
    build: (ctx) => ({
      subject: "The next 30 days",
      preheader: "One priority. Not five.",
      body: `${ctx.firstName},

If you wanted to move from Developing to Established and you only had 30 days, here's what I'd tell you to do:

Pick one rhythm and run it religiously for 30 days. Just one.

Not all five. Not "I'll start the huddle AND tighten the 1:1s AND build a scoreboard." That's how Developing-tier owners stay Developing — they try to install five things at once, none of them stick, and three months later nothing has changed.

One rhythm. 30 days. No exceptions.

Pick the rhythm that maps to your weakest pillar. If your weakest is Systems & Rhythm, install the daily huddle. If it's Training & Scripts, start scoring one call per producer every week. If it's Marketing & Lead Flow, build the cost-per-sale comparison chart for every lead source.

After 30 days, that rhythm becomes muscle memory. THEN you add the next one.

The agencies that move tiers stack rhythms one at a time. The ones that stay stuck try to stack five at once.

—Justin`,
    }),
  },

  // Email 5 — Day 4
  {
    daysOffset: 4,
    build: (ctx) => ({
      subject: "The mistake most Developing-tier owners make",
      preheader: "Spending money to fix a discipline problem.",
      body: `${ctx.firstName},

The most common mistake I see at Developing tier:

Owners reach a plateau, get frustrated, and try to spend their way out of it. New software. New marketing agency. New training course. New tech stack.

It almost never works. Here's why.

Developing-tier plateaus aren't tactical problems — they're discipline problems. The agency owner already has 80% of what they need to break through. They just don't run it consistently. So they go buy more stuff to run inconsistently.

A new CRM doesn't fix a team that doesn't log calls.
A new training course doesn't fix a manager who doesn't score calls.
A new lead source doesn't fix follow-up that dies after 24 hours.
A new scheduling tool doesn't fix a calendar that gets blown up every week.

Spending money is easier than installing rhythm. That's why most Developing-tier owners do it. It feels like progress. It looks like investment. It costs almost nothing in personal discipline.

The agencies that break through are the ones that say "no new tools for 90 days — we're going to install rhythm on what we already have, then decide what's actually missing."

That decision saves most owners six figures and 18 months.

—Justin`,
    }),
  },

  // Email 6 — Day 6
  {
    daysOffset: 6,
    build: (ctx) => ({
      subject: "Where Developing-tier owners actually fix this",
      preheader: "The room I built for this exact moment.",
      body: `${ctx.firstName},

The Boardroom is built for Developing-tier owners. Not exclusively — there are Foundation-tier and Established-tier owners in there too — but the modal member is exactly where you are.

Why it works for Developing tier specifically:

Developing-tier owners don't need to be told what to do. They mostly know. They need accountability that doesn't depend on their own willpower, and they need to be in a room with peers who'll call them out when they drift.

That's what the Boardroom is. One 2-hour group coaching call with me each month — second Tuesday. Core-level access to Agency Brain. Marco Polo video access to me directly. Branded gear. Call scoring infrastructure (about 20 calls scored per month).

It's $299/month. No contract. Most members stay 12+ months because the rhythm of being in the room is what carries them when their own discipline wavers.

If you want in: [join here](https://buy.stripe.com/aFa9AT4KOayO0hycG84Vy0l).

If you want to talk to me first about whether Boardroom or something more 1:1 (Directive) is the right fit: [book a 45-min Standard Fit call](https://AGENCYCOACHING.as.me/standardfit).

—Justin`,
    }),
  },

  // Email 7 — Day 9
  {
    daysOffset: 9,
    build: (ctx) => ({
      subject: "Last note",
      preheader: "One direct ask.",
      body: `${ctx.firstName},

This is the last note in this sequence.

You scored Developing. You know roughly where the gaps are. You know rhythm beats tactics. You know that buying new tools won't fix it.

The only question is whether you do the work in private or you do it in a room.

Doing it in private is fine — most owners do. The Mirror PDF is yours, the morning huddle is yours, the playbook is yours. You can install all of it without me.

Doing it in a room is faster. The Boardroom is built for that exact reason.

Three reasonable next moves:

**1. Join the Boardroom.** $299/mo. Monthly group call. The room I built for Developing-tier owners. [Join here](https://buy.stripe.com/aFa9AT4KOayO0hycG84Vy0l).

**2. Book a 45-min Standard Fit call** to talk through whether Boardroom or 1:1 Directive coaching makes more sense. [Book here](https://AGENCYCOACHING.as.me/standardfit).

**3. Do nothing.** Keep the workbook. Run one rhythm. Take the assessment again in 90 days.

The mirror is the mirror.

—Justin`,
    }),
  },
];
