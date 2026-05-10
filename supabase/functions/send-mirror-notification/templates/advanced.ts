import type { MirrorTierSequenceEntry } from "./_shared.ts";

export const sequence: MirrorTierSequenceEntry[] = [
  // Email 1 — Day 0
  {
    daysOffset: 0,
    build: (ctx) => ({
      subject: `Your Mirror score: ${ctx.score} / 160`,
      preheader: "You've built something rare.",
      body: `${ctx.firstName},

You scored ${ctx.score} out of 160. That's Advanced tier — the second highest of the five.

That's rare air. Most agency owners never get here. Most never even take the test honestly enough to know they're not here. You did, and you are.

So before anything else: you've built something that 90% of agency owners don't build. Your structure is real. Your team mostly works. Your rhythm exists. Your numbers reflect actual operating discipline.

Your weakest pillar came back as: **${ctx.weakestPillarName}**.

${ctx.diagnosticParagraph}

Your full Mirror workbook is here: [download the PDF](${ctx.pdfDownloadUrl}).

Over the next 9 days I'll send you a few notes — what the Advanced-tier ceiling actually is, what separates Advanced owners from Elite ones, and where the right room is if you want to do the next-level work.

The work at this tier is different than the work at lower tiers. We'll get into that.

The mirror is the mirror.

—Justin`,
    }),
  },

  // Email 2 — Day 1
  {
    daysOffset: 1,
    build: (ctx) => ({
      subject: "At Advanced, the ceiling is you",
      preheader: "Not the agency. You.",
      body: `${ctx.firstName},

At Foundation tier, the ceiling is operations.
At Developing tier, the ceiling is rhythm.
At Established tier, the ceiling is precision.

At Advanced tier, the ceiling is the owner.

That's not a criticism. It's just where the math takes you. You've already built the operations, installed the rhythm, tightened the precision. Most of the structural work is done. The remaining gap is rarely about installing more systems.

It's about who you have to become to operate at the next level.

That sounds soft and it isn't. Owner-level growth at Advanced tier looks like:

— Hiring people more talented than you in their lane (and then actually getting out of their way)
— Letting the team make decisions you'd make differently
— Spending less time IN the agency and more time ON it
— Working on personal growth — health, marriage, faith, mind — because at this level your bandwidth is the multiplier
— Learning to lead from vision instead of from tactical knowledge

Person first, producer second. The same applies to owners. At Advanced tier, owner growth IS agency growth.

—Justin`,
    }),
  },

  // Email 3 — Day 2
  {
    daysOffset: 2,
    build: (ctx) => ({
      subject: "Advanced → Elite is not what you think",
      preheader: "It's not more systems. It's less involvement.",
      body: `${ctx.firstName},

Most Advanced-tier owners assume the path to Elite is more systems, tighter execution, sharper edges.

It's not. The path to Elite is the opposite.

Elite-tier owners have learned to do less. Their personal involvement in the day-to-day decreases as their leverage increases. Their team operates without them in the room — not because the team is heroic, but because the owner spent years building the rhythm, the management bench, and the standard until the team didn't need the owner present.

The Advanced-tier owner who tries to control more on the way to Elite stays Advanced.
The Advanced-tier owner who lets go more on the way to Elite breaks through.

Letting go is the hardest thing a high-performing operator ever does. It feels like decline. It feels like dropping the ball. It is neither — it's the only path. And almost no one figures it out alone.

—Justin`,
    }),
  },

  // Email 4 — Day 3
  {
    daysOffset: 3,
    build: (ctx) => ({
      subject: "The work nobody talks about",
      preheader: "Tactics aren't the bottleneck anymore.",
      body: `${ctx.firstName},

At Advanced tier, the conversations that matter aren't tactical anymore.

They're about identity. Marriage. Health. Faith. Vision. Time allocation. The conversations most coaching avoids because they don't fit on a sales call.

Here's what I see in Advanced-tier owners I've worked with:

— The owner who's at $5M revenue but his marriage is in trouble (revenue is not the win — marriage is)
— The owner who's built an A-team but can't take a real vacation because he doesn't trust them yet (the team isn't the problem — trust is)
— The owner who's healthy on paper but hasn't had a physical in 4 years (what gets ignored compounds)
— The owner who has a clear faith but it doesn't show up in how he leads (alignment is the work)
— The owner who has the bandwidth to think long-term but uses it to optimize short-term (vision atrophies if it's not used)

These aren't soft problems. At Advanced tier, they're the real work. Tactics are mostly solved. Identity is mostly not.

If you don't have someone who'll have those conversations with you honestly, you're going to outgrow most coaching long before you outgrow yourself.

—Justin`,
    }),
  },

  // Email 5 — Day 4
  {
    daysOffset: 4,
    build: (ctx) => ({
      subject: "Why 1:1 (and not group) at this tier",
      preheader: "Group coaching has a ceiling.",
      body: `${ctx.firstName},

Group coaching is great until it isn't.

The Boardroom is built for a reason — it works. Most owners get tremendous leverage out of group coaching. But group coaching has a ceiling, and Advanced-tier owners usually hit it.

Here's why:

In a group, the conversation moves at the pace of the room. The room has owners at different tiers. The questions you'd ask aren't always the questions the room needs answered. The depth you'd go to isn't always the depth the room can hold.

That's not a knock on group coaching — it's the math of it.

At Advanced tier, the work is too specific to your operation, too sensitive to your context, and too identity-level to fit in a group setting. You need a 1:1 dynamic with someone who has bandwidth for your full picture — not just your tactics, but your team dynamics, your personal life, your vision, your blockers.

That's what The Directive is. 1:1 coaching with me. Application only. Not because I'm gatekeeping — because the dynamic only works if it's right for both of us.

If you're at Advanced tier and ready for that depth, the next note is about how it actually works.

—Justin`,
    }),
  },

  // Email 6 — Day 6
  {
    daysOffset: 6,
    build: (ctx) => ({
      subject: "The Directive",
      preheader: "1:1 work for owners past Advanced.",
      body: `${ctx.firstName},

The Directive is 1:1 coaching with me, monthly.

It's structured around the owner, not the agency. We work on:

— Whatever your weakest pillar is at the operational level (your Mirror score told us)
— Whatever's happening with your team that you can't talk about in a group room
— Whatever's happening at home, in your body, in your faith — because at this tier those are the multipliers
— Whatever vision work you've been deferring because you don't have time

It's apply-only. We do a Standard Fit call first. Both of us decide if it's the right fit. If it isn't, I'll tell you that and recommend a different path. If it is, we go.

[Apply for The Directive](https://standardplaybook.com/directive)

If you'd rather start with a 45-min Standard Fit call to talk through whether Directive or Boardroom makes more sense: [book here](https://AGENCYCOACHING.as.me/MIRROR).

—Justin`,
    }),
  },

  // Email 7 — Day 9
  {
    daysOffset: 9,
    build: (ctx) => ({
      subject: "Last note",
      preheader: "Where you go from here.",
      body: `${ctx.firstName},

This is the last note in this sequence.

You scored Advanced. That's earned. The work that got you here was real.

The work that takes you further is different — more identity than tactics, more 1:1 than group, more "letting go" than "tightening up."

You have three reasonable next moves:

**1. Apply for The Directive.** 1:1 monthly coaching with me. Application only. [Apply here](https://standardplaybook.com/directive).

**2. Book a 45-min Standard Fit call.** If you want to talk through whether Directive or another path is the right fit. [Book here](https://AGENCYCOACHING.as.me/MIRROR).

**3. Do the work alone.** Keep the workbook. Run your rhythm. Take the assessment again in 90 days.

The mirror is the mirror.

—Justin`,
    }),
  },
];
