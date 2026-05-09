import type { MirrorTierSequenceEntry } from "./_shared.ts";

export const sequence: MirrorTierSequenceEntry[] = [
  // Email 1 — Day 0
  {
    daysOffset: 0,
    build: (ctx) => ({
      subject: `Your Mirror score: ${ctx.score} / 160`,
      preheader: "Your full PDF is attached. Read this first.",
      body: `${ctx.firstName},

You scored ${ctx.score} out of 160. That puts you in Foundation tier — the bottom of the five.

Before you spiral or close this email — that's not a verdict. That's a starting line.

Foundation isn't where I think you should stay. It's where most agency owners actually are when they take this honestly. The owners who told themselves they were Established and skipped the score? They're still where they were two years ago.

Your weakest pillar came back as: **${ctx.weakestPillarName}**.

${ctx.diagnosticParagraph}

Your full Mirror workbook is here: [download the PDF](${ctx.pdfDownloadUrl}). Print it. Score it again on paper this week if you want — the digital version is fast, the printed version is slower and that's the point. Slow scoring is honest scoring.

Over the next 9 days I'll send you a few notes — what your score is actually costing you, what Foundation-tier agencies do to climb out, and the one move I'd start with if I were sitting in your seat.

The mirror is the mirror.

Still love you.

—Justin

P.S. If you already know you want to talk through this, hit reply and tell me what you saw. I read every one.`,
    }),
  },

  // Email 2 — Day 1
  {
    daysOffset: 1,
    build: (ctx) => ({
      subject: "What your score is actually costing you",
      preheader: "Foundation tier is working twice as hard for half the result.",
      body: `${ctx.firstName},

Yesterday you scored Foundation. Let me tell you what that's actually costing.

It's not a number — it's a tax. You're paying it every month and you don't see it on the P&L:

— You're working 60+ hours because there's no system to absorb the work for you
— Whoever's on the team is doing five jobs at once, and you're doing the ones nobody else will
— You can't take a vacation without revenue softening
— You can't grow your team because there's no time to hire, train, or build a path forward
— You're chasing the same lead sources because you can't measure new ones

Most Foundation-tier agencies pay this tax for years. Some pay it for a decade.

The ones that climb out usually do it after a single hard moment — a producer quits, a carrier audit hits, a health scare — and they realize they don't actually have a business. They have a job they can't quit.

Your Mirror score is the cheaper version of that moment. You got to see it without paying the cost first.

The next note is about what the climb out actually looks like.

—Justin`,
    }),
  },

  // Email 3 — Day 2
  {
    daysOffset: 2,
    build: (ctx) => ({
      subject: "How Foundation-tier agencies climb out",
      preheader: "Five moves. Four of them free.",
      body: `${ctx.firstName},

Foundation-tier owners who climb out usually do it the same way.

It's not magic. It's not a single decision. It's five specific moves, often in this order:

**1. Define three roles.** Sales, service, and management — even if one person wears two hats for now. Document who owns what.

**2. Hire one person for one of those roles.** Not all three. One. Stop doing that work yourself the day they start.

**3. Install the morning huddle.** Daily. 12 minutes. Same time. The cheapest piece of infrastructure in any agency.

**4. Build a one-page sales playbook.** Even rough. Then score every producer against it weekly.

**5. Run a Friday hour with your dashboard.** Just you and the numbers. Make the calls the data is already telling you to make.

Four of those moves cost zero dollars. The fifth (the hire) is the only real investment — and the right hire pays for themselves inside 90 days.

I've watched owners run this exact play and move from Foundation to Established inside 18 months. Not because they got smarter. Because they stopped trying to do it all alone.

The mirror is the mirror.

—Justin`,
    }),
  },

  // Email 4 — Day 3
  {
    daysOffset: 3,
    build: (ctx) => ({
      subject: "The first move (do this Monday)",
      preheader: "One thing. Cheap. Specific.",
      body: `${ctx.firstName},

Foundation-tier agency owners always ask the same question: where do I start?

Here's the answer: install the morning huddle. This Monday. 12 minutes.

You think it's too small. It's not. Here's why:

The morning huddle is the cheapest, fastest piece of infrastructure you can install. It does five things at once:

1. Tells you who's actually in their seat (not who said they would be)
2. Gives you yesterday's numbers from every producer's mouth
3. Forces every team member to declare today's goal out loud
4. Creates 5 minutes of training daily — even if it's one tip
5. Sets the rhythm for the rest of your day

It costs you nothing. You don't need a system, software, or a coach to start it. You just need to walk in Monday at 8:30am and run it.

Most owners skip this because it feels too simple to matter. The owners who run it religiously become the owners with agencies that don't need them in the room.

Try it for two weeks. If your team isn't tighter by week three, hit reply and tell me. I've never had it not work.

—Justin`,
    }),
  },

  // Email 5 — Day 4
  {
    daysOffset: 4,
    build: (ctx) => ({
      subject: "\"I should figure this out myself\"",
      preheader: "The most expensive sentence in the agency owner's vocabulary.",
      body: `${ctx.firstName},

The most expensive sentence in the agency owner's vocabulary is *"I should be able to figure this out myself."*

I said it for years.

I built agencies, sold them, and figured out the same thing every operator eventually figures out: the time you spend figuring it out is the time the agency doesn't have.

Founders confuse independence with intelligence. They confuse "I built this myself" with "I should solve this myself." They aren't the same. Independence is a virtue at the start. After a certain score — and Foundation is past that line — independence becomes the bottleneck.

The agency owners who stay at Foundation tier the longest are usually the smartest people in the room. They believe they can think their way out. They can't. Not because they're not smart — because they're inside the room, and the room is the problem.

Person first, producer second. The same applies to owners. You first, business second.

The mirror is the mirror.

If you want a 45-minute Standard Fit call about what the next 90 days could look like, [book it here](https://AGENCYCOACHING.as.me/standardfit). I do them myself. No assistant, no funnel, no upsell on the call. Just a conversation.

—Justin`,
    }),
  },

  // Email 6 — Day 6
  {
    daysOffset: 6,
    build: (ctx) => ({
      subject: "There's a room for this",
      preheader: "Built for Foundation-tier owners who don't want to climb alone.",
      body: `${ctx.firstName},

A few years ago I built a room called The Boardroom.

It exists for one reason: Foundation-tier agency owners shouldn't have to climb out alone, and the Foundation-tier owners I knew were all making the same mistakes in private.

It's $299/month. One 2-hour group coaching call with me each month — second Tuesday of every month. You get Core-level access to Agency Brain, the call-scoring system (about 20 calls scored per month), Marco Polo video access to me directly, and the gear that puts you on the team. Most members started where you are.

It's not a magic pill. It's a room. The room makes the climb easier because you're not the only one doing it.

If you want in: [join here](https://buy.stripe.com/aFa9AT4KOayO0hycG84Vy0l).

If you want to talk first to make sure it's the right move: [book a 45-min Standard Fit call](https://AGENCYCOACHING.as.me/standardfit).

If neither feels right today, that's also fine. Keep the workbook. Keep running the morning huddle. The first move is the move regardless of where you do the rest of the work.

—Justin`,
    }),
  },

  // Email 7 — Day 9
  {
    daysOffset: 9,
    build: (ctx) => ({
      subject: "Last note from me",
      preheader: "One direct ask, then I'll stop.",
      body: `${ctx.firstName},

This is the last note in this sequence. After this I'll stop emailing unless you reach out.

Here's the direct ask:

You took The Mirror because something inside you knew the score was going to be lower than you wanted. It was. That's good. That's what mirrors do.

You have three reasonable next moves:

**1. Book a 45-min Standard Fit call with me.** No pitch, no upsell on the call. We talk about what you actually saw and what the next 90 days could look like. [Book here](https://AGENCYCOACHING.as.me/standardfit).

**2. Join The Boardroom.** $299/mo. Monthly group coaching call (2nd Tuesday). The room I built for this exact moment. [Join here](https://buy.stripe.com/aFa9AT4KOayO0hycG84Vy0l).

**3. Do nothing.** Keep the PDF, run the morning huddle, take the assessment again in 90 days and see where you've moved on your own.

All three are real. The only one I'd argue against is a fourth option — pretending you didn't see what you saw.

The mirror is the mirror.

—Justin`,
    }),
  },
];
