import type { MirrorTierSequenceEntry } from "./_shared.ts";

// Elite uses 5 emails on a 0/2/4/6/9 cadence per the spec.
export const sequence: MirrorTierSequenceEntry[] = [
  // Email 1 — Day 0
  {
    daysOffset: 0,
    build: (ctx) => ({
      subject: `Your Mirror score: ${ctx.score} / 160`,
      preheader: "You're in the top 3%.",
      body: `${ctx.firstName},

You scored ${ctx.score} out of 160. That's Elite tier. Top of the five.

I'm going to be straight with you: very few agency owners actually score this high. The ones who do almost always either built something rare from scratch or transformed something inherited until it was unrecognizable. Either way, you've earned a level of operating discipline most owners never reach.

Your weakest pillar came back as: **${ctx.weakestPillarName}**.

${ctx.diagnosticParagraph}

Your full Mirror workbook is here: [download the PDF](${ctx.pdfDownloadUrl}).

Over the next 9 days I'll send you a few notes — what the work actually looks like at Elite tier, where the next ceiling is (because there is one), and what's available if you want to keep raising the standard you're already at.

These notes will be shorter than what I send to lower tiers. You don't need the long form. You need the signal.

The mirror is the mirror.

—Justin`,
    }),
  },

  // Email 2 — Day 2
  {
    daysOffset: 2,
    build: (ctx) => ({
      subject: "At Elite, the agency isn't the work anymore",
      preheader: "It's everything around it.",
      body: `${ctx.firstName},

At Elite tier, the agency mostly runs without you needing to be in the room every day. That's the point. That's what you built.

So the work isn't really "the agency" anymore. The work becomes:

— Protecting the standard you've built (one B-player on an A-team compounds in the wrong direction)
— Marriage / family / faith / health (the things that get sacrificed on the climb up are the things you have to rebuild now)
— Vision (what's the next 10 years actually for? What are you building toward?)
— Legacy (succession, second business, exit, mentorship — depending on where you're headed)
— Depth in fewer relationships (Elite-tier owners almost always under-invest here)

These aren't side quests. At your level, they ARE the main quest. The agency is the platform that lets you actually do them.

If you're not deliberately working on at least three of those, you're at risk of the most common Elite-tier failure mode: the agency keeps running, you start coasting, and 5 years go by where you optimized maintenance instead of building anything new.

—Justin`,
    }),
  },

  // Email 3 — Day 4
  {
    daysOffset: 4,
    build: (ctx) => ({
      subject: "The Elite-tier blind spot",
      preheader: "Almost nobody calls you on it.",
      body: `${ctx.firstName},

Here's the Elite-tier blind spot most owners never see:

At your level, almost nobody calls you on anything anymore.

Your team won't push back hard — you sign their checks. Your peers won't push back hard — you outperform most of them. Your spouse might push back, but on a different vector. Your friends mostly admire you. Your coach, if you have one, might be playing not to lose you as a client.

That's the blind spot. Truth becomes scarce at Elite tier — not because you don't want it, but because almost nobody around you is positioned to deliver it without an agenda.

The owners who stay Elite are the ones who actively recruit truth. They build a small handful of relationships specifically designed to surface their blind spots. A friend, a peer, a coach, a mentor. Doesn't matter which — what matters is they have someone who'll tell them the actual mirror.

If you don't have that, your Mirror score is going to start drifting back down in 3-5 years and you won't see it until you take the test again.

—Justin`,
    }),
  },

  // Email 4 — Day 6
  {
    daysOffset: 6,
    build: (ctx) => ({
      subject: "What's available at this tier",
      preheader: "The Directive. Or just a real conversation.",
      body: `${ctx.firstName},

If you want to work with me at this tier, there's one path: The Directive.

1:1 monthly coaching with me. Application only. The fit conversation matters here more than at lower tiers because the dynamic only works if both of us decide it's right.

This is the work I described in the last note — protecting the standard, working on identity, building toward the next 10 years instead of optimizing the current ones.

If you'd rather start with a 45-min Standard Fit call before committing: [book here](https://AGENCYCOACHING.as.me/standardfit). I do them myself. No pitch on the call.

If you already know what you want: [apply for The Directive](https://standardplaybook.com/directive).

—Justin`,
    }),
  },

  // Email 5 — Day 9
  {
    daysOffset: 9,
    build: (ctx) => ({
      subject: "Last note",
      preheader: "One direct note.",
      body: `${ctx.firstName},

This is the last note in this sequence.

You scored Elite. You don't need much more from me right now.

If you ever want to work together — Directive, or just a Standard Fit call to talk through what you're building — you know where to find me.

[Book a 45-min Standard Fit call](https://AGENCYCOACHING.as.me/standardfit) | [Apply for The Directive](https://standardplaybook.com/directive)

The mirror is the mirror.

Still love you.

—Justin`,
    }),
  },
];
