import type { MirrorTierSequenceEntry } from "./_shared.ts";

export const sequence: MirrorTierSequenceEntry[] = [
  // Email 1 — Day 0
  {
    daysOffset: 0,
    build: (ctx) => ({
      subject: `Your Mirror score: ${ctx.score} / 160`,
      preheader: "Your full PDF is here. Read this first.",
      body: `${ctx.firstName},

You scored ${ctx.score} out of 160. That's Established tier — the middle of the five.

Here's what that means: you've actually built something. Most agencies don't get to Established. You've got systems, you've got people, you've got rhythm running on most of the pillars. That's earned.

But you also took this honestly enough to find the gap. And the gap at Established tier is usually surgical — one or two specific weaknesses while the rest of the agency is functional. Those gaps are easier to close than Foundation gaps. They're also harder to see because everything else around them looks fine.

Your weakest pillar came back as: **${ctx.weakestPillarName}**.

${ctx.diagnosticParagraph}

Your full Mirror workbook is here: [download the PDF](${ctx.pdfDownloadUrl}).

Over the next 9 days I'll send you a few notes — what keeps Established-tier owners stuck at Established, the specific pattern that moves them to Advanced, and where the right help lives if you want to compress the timeline.

The mirror is the mirror.

—Justin`,
    }),
  },

  // Email 2 — Day 1
  {
    daysOffset: 1,
    build: (ctx) => ({
      subject: "The \"almost there\" trap",
      preheader: "Established is the most comfortable place to plateau.",
      body: `${ctx.firstName},

Established is the most comfortable place to plateau. That's why so many agencies stay there for a decade.

You're past the firefighting of Foundation. You're past the chronic friction of Developing. The agency more or less runs. The numbers are decent. The team mostly knows what to do.

That comfort is the trap. The pain that forced earlier owners to grow has subsided. You can survive Established forever without growing. And most owners do.

The gap between Established and Advanced isn't bigger than the gap between Developing and Established. It's just less visible. Foundation-tier owners can SEE their gaps everywhere. Established-tier owners have to LOOK for theirs.

That's what the Mirror just did for you. It pointed at one specific gap that's quietly capping your growth. The question is whether you close it — or whether you let "almost there" become "still here" 18 months from now.

—Justin`,
    }),
  },

  // Email 3 — Day 2
  {
    daysOffset: 2,
    build: (ctx) => ({
      subject: "How Established becomes Advanced",
      preheader: "Surgical fixes, not overhauls.",
      body: `${ctx.firstName},

Established → Advanced doesn't look like Foundation → Developing.

Foundation-to-Developing is structural. Whole new systems get installed. Whole new roles get hired. The agency reshapes.

Established-to-Advanced is surgical. The structure already exists. What changes is precision.

Five surgical moves I see most often:

— Tightening one weak rhythm that became inconsistent (huddle quality, scoring discipline, 1:1 follow-through)
— Building the management bench so the owner stops being the only enforcer
— Diversifying lead sources beyond the 1-2 that built the agency
— Killing one product/carrier/process that's a quiet drag on the team
— Installing a real recognition rhythm that makes A-players want to stay

Most Established-tier owners can do 3-4 of these in 12-18 months and shift into Advanced. The ones that don't usually skip the surgical work because it's less satisfying than building something new. Closing a gap doesn't feel like progress the way creating something does. But it is progress — usually more impactful than another launch.

—Justin`,
    }),
  },

  // Email 4 — Day 3
  {
    daysOffset: 3,
    build: (ctx) => ({
      subject: "What I'd do in your seat",
      preheader: "Not five things. Two.",
      body: `${ctx.firstName},

If I were sitting in your seat at Established tier, I'd do two specific things in the next 30 days:

**1. Pick the surgical move that maps to your weakest pillar.** Your Mirror score told you exactly where the gap is. The fix at Established tier is usually one specific change — not a transformation. Don't try to overhaul. Tighten the one thing.

**2. Get a second set of eyes on the agency.** Not a coach in the abstract — a specific operator who's run an agency past Advanced and can pressure-test where you're spending time. Established-tier owners almost always have one or two blind spots that are obvious from the outside and invisible from inside the room.

The reason Established-tier owners stay Established is usually #2. They know how to fix the visible problems. They can't see the invisible ones. The right second set of eyes costs less than the time you'll waste figuring it out alone.

—Justin`,
    }),
  },

  // Email 5 — Day 4
  {
    daysOffset: 4,
    build: (ctx) => ({
      subject: "When coaching is the wrong answer",
      preheader: "Save the money. Until it's the right answer.",
      body: `${ctx.firstName},

Most coaching is sold to people who don't need it.

I'll tell you when coaching is the WRONG answer for an Established-tier agency owner:

— You haven't tried installing the rhythm yet (install it first — if it works, you didn't need a coach)
— You're hoping a coach will fix a discipline problem (they won't — discipline is yours)
— You're chasing a quick win to feel better (coaching is a 6-12 month commitment minimum)
— You don't actually want to change (no coach can help with this)

Coaching is the RIGHT answer for an Established-tier owner when:

— You've identified the specific gap and you've tried to close it on your own and you can't move the needle
— You want pressure and accountability that doesn't come from your own willpower
— You're in the room with someone who's actually run an agency past your tier (not a consultant, not a guru)
— You're committing for at least 12 months because that's how long real change takes

If you're in the second list, the next email is about which room makes the most sense based on your specific gap. If you're in the first list, save your money and run the rhythm.

—Justin`,
    }),
  },

  // Email 6 — Day 6 (variant by weakest pillar)
  {
    daysOffset: 6,
    build: (ctx) => {
      const is8WeekBranch =
        ctx.weakestPillar === "systems_rhythm" || ctx.weakestPillar === "training_scripts";

      if (is8WeekBranch) {
        return {
          subject: "The 8 weeks that fix sales management",
          preheader: "Built for Established-tier owners ready to close the gap.",
          body: `${ctx.firstName},

Your weakest pillar is ${ctx.weakestPillarName}. That's a sales management problem more than a general agency problem.

The 8 Week Sales Management Experience is built specifically for that gap. It's a managed training program — 8 weeks, structured, accountability built in. Different from ongoing coaching. Surgical.

It runs in cohorts. We work directly with you and your team. By week 8 the rhythm is installed and the scoring infrastructure is running. Most participants score 15-25 points higher on their next Mirror.

It's apply-and-fit. Not everyone is right for the program, and not everyone who applies gets accepted.

[Apply for 8-Week](https://standardplaybook.com/8-week-apply)

If you'd rather talk first about whether 8-Week or Boardroom or 1:1 Directive coaching is the right move: [book a 45-min Standard Fit call](https://AGENCYCOACHING.as.me/standardfit).

—Justin`,
        };
      }

      return {
        subject: "The room for this work",
        preheader: "Built for Established-tier owners ready to close the gap.",
        body: `${ctx.firstName},

Your weakest pillar is ${ctx.weakestPillarName}. That's broader than what 8-Week solves — it's an ongoing operational gap that needs sustained work, not an 8-week sprint.

The Boardroom is built for that. Monthly 2-hour group coaching call with me — second Tuesday. Core-level access to Agency Brain. Marco Polo video access to me directly. Call scoring infrastructure. The room for Established-tier owners who need accountability + community + access without the price point of 1:1.

$299/mo. No contract.

[Join the Boardroom](https://buy.stripe.com/aFa9AT4KOayO0hycG84Vy0l)

If you want to talk first about whether Boardroom or something more 1:1 (Directive) is the right move: [book a 45-min Standard Fit call](https://AGENCYCOACHING.as.me/standardfit).

—Justin`,
      };
    },
  },

  // Email 7 — Day 9
  {
    daysOffset: 9,
    build: (ctx) => ({
      subject: "Last note",
      preheader: "Two paths.",
      body: `${ctx.firstName},

This is the last note in this sequence.

You scored Established. You know your weakest pillar. You know the surgical fix is one specific move, not a full overhaul.

You have three reasonable next moves:

**1. Apply for 8-Week or join the Boardroom** (whichever fits your gap — see Day 6's note).

**2. Book a 45-min Standard Fit call** to talk through whether Boardroom, 8-Week, or 1:1 Directive coaching is the right move for where you are. [Book here](https://AGENCYCOACHING.as.me/standardfit).

**3. Do nothing.** Keep the workbook. Run the surgical fix. Take the assessment again in 90 days.

The mirror is the mirror.

—Justin`,
    }),
  },
];
