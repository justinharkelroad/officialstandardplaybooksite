// send-mirror-notification — single-file Edge Function for Lovable Cloud.
// Self-contained: all templates, diagnostics, and helpers inlined so the
// deploy can ship as a single index.ts with no external imports.

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@4.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");
const BREVO_MIRROR_LIST_ID = Deno.env.get("BREVO_MIRROR_LIST_ID");

const FROM_ADDRESS = "Standard Playbook <booking@standardplaybook.com>";
const INTERNAL_NOTIFICATION_TO = "justin@hfiagencies.com";
// Public Supabase storage URL for the Mirror workbook PDF.
// Bucket: "public" (Lovable Cloud's default). File: "THE MIRROR WORKBOOK.pdf".
const MIRROR_PDF_URL =
  "https://puidotfmyrouxezsorlt.supabase.co/storage/v1/object/public/public/THE%20MIRROR%20WORKBOOK.pdf";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/* ══════════════════════════════════════════════════════
   TYPES
   ══════════════════════════════════════════════════════ */

type MirrorTier =
  | "foundation"
  | "developing"
  | "established"
  | "advanced"
  | "elite";

type MirrorPillar =
  | "culture_team"
  | "systems_rhythm"
  | "training_scripts"
  | "marketing_lead_flow"
  | "owner_command";

interface MirrorEmailContext {
  firstName: string;
  fullName: string;
  score: number;
  tier: MirrorTier;
  tierName: string;
  weakestPillar: MirrorPillar;
  weakestPillarName: string;
  diagnosticParagraph: string;
  pdfDownloadUrl: string;
}

interface MirrorEmail {
  subject: string;
  preheader: string;
  body: string;
}

interface MirrorTierSequenceEntry {
  daysOffset: number;
  build: (ctx: MirrorEmailContext) => MirrorEmail;
}

interface MirrorSubmission {
  id?: string;
  email: string;
  full_name: string;
  phone: string;
  carrier:
    | "allstate"
    | "state_farm"
    | "farmers"
    | "american_family"
    | "independent"
    | "other";
  total_score: number;
  tier: MirrorTier;
  weakest_pillar: MirrorPillar;
  pillar_scores: Record<string, number>;
  question_scores: Record<string, number>;
  utm_source?: string | null;
  utm_medium?: string | null;
  utm_campaign?: string | null;
  utm_content?: string | null;
  device_type?: string | null;
  user_agent?: string | null;
}

const CARRIER_LABELS: Record<MirrorSubmission["carrier"], string> = {
  allstate: "Allstate",
  state_farm: "State Farm",
  farmers: "Farmers",
  american_family: "American Family",
  independent: "Independent",
  other: "Other",
};

const PILLAR_LABELS: Record<MirrorPillar, string> = {
  culture_team: "Culture & Team",
  systems_rhythm: "Systems & Rhythm",
  training_scripts: "Training & Scripts",
  marketing_lead_flow: "Marketing & Lead Flow",
  owner_command: "Owner Command",
};

const TIER_LABELS: Record<MirrorTier, string> = {
  foundation: "Foundation",
  developing: "Developing",
  established: "Established",
  advanced: "Advanced",
  elite: "Elite",
};

/* ══════════════════════════════════════════════════════
   DIAGNOSTIC MATRIX (5 tiers × 5 pillars)
   ══════════════════════════════════════════════════════ */

const DIAGNOSTIC_MATRIX: Record<MirrorTier, Record<MirrorPillar, string>> = {
  foundation: {
    culture_team:
      "You don't have a team — you have helpers. Every standard in your agency rises and falls with you being in the room, which means there is no agency without you. The first move isn't a system or a script. It's defining one specific seat, hiring for it, and refusing to do that work yourself anymore.",
    systems_rhythm:
      "You're firefighting because you have no system to hold the line for you. No morning huddle, no scoreboard, no 1:1s — just you reacting to whatever blows up that day. Pick one rhythm and install it this week. The morning huddle is the cheapest, fastest way to turn chaos into a calendar.",
    training_scripts:
      "Your team is making it up every day because there's no playbook to make it up FROM. No scripts, no scoring, no video walkthroughs — every new hire is a six-month nightmare and every old hire runs their own version. Build the playbook this quarter. Even a rough version is infinitely better than nothing.",
    marketing_lead_flow:
      "Your producers might be good, but they're not getting enough at-bats. No CRM, no marketing plan tied to numbers, no idea which dollar is actually working. Install the CRM. Track every lead source by cost-per-sale. You can't fix what you can't measure, and right now the whole front of your business is invisible.",
    owner_command:
      "Your agency runs on optimism because you have no real visibility. No commission verification, no cancellation tracking, no marketing ROI report. You're making decisions on memory and gut, and the carrier statements rarely match what you think happened. Install the basic reporting cadence this month. You can't lead what you can't see.",
  },
  developing: {
    culture_team:
      "You've built systems your people can't run yet. The producer who's also doing service isn't a producer. The service person who's also taking payments isn't a service person. Specialization isn't a luxury — it's the unlock that makes everything else you've built actually work, and right now your team is the reason your numbers cap out where they do.",
    systems_rhythm:
      "You have pieces of a rhythm, but you're still the engine. The huddle happens when you're there. The 1:1 happens when you remember it. Your team waits for your energy to perform — which means the agency caps at your bandwidth. Codify the cadence so it runs whether you're in the room or not.",
    training_scripts:
      "You have training materials, but nobody references them. Scripts might exist somewhere — but no one's been scored on a call in months. Your team is performing on personality, not process. Install the scoring loop and the weekly training rhythm; that's where training actually starts to stick.",
    marketing_lead_flow:
      "You're spending on marketing without knowing what's working. Some leads convert, others don't, and you're guessing which channel is the keeper. Build the comparison chart — every vendor side by side, real numbers. The agencies that scale are the ones that stop guessing about the front of the funnel.",
    owner_command:
      "You see some of it. You don't see all of it. You probably react to cancellations instead of tracking patterns. You probably check commissions when something feels off, not on a schedule. The data exists — you're just not in the seat reviewing it. Build the review rhythm, and the rest of your agency starts running cleaner overnight.",
  },
  established: {
    culture_team:
      "Your foundation is built. What you don't have is a team that wants to stay. A-players leave when there's no recognition rhythm, no real management layer, and no clear path forward — and you're paying full training cost on people who'll be gone in 18 months. You can keep replacing them, or you can build the conditions that make A-players want to plant flags.",
    systems_rhythm:
      "The structure is built. The discipline isn't. You have huddles but no scoreboard, or 1:1s but no monthly recap — somewhere in your rhythm there's a leak you've stopped noticing. Find the missing loop and close it. The agency doesn't need a new system; it needs the existing one to actually run.",
    training_scripts:
      "The materials are built. The accountability loop isn't. You can have the best playbook in the market and it won't matter if no one's scoring calls against it. Scoring calls is the unlock — it's the difference between training your team had and training your team uses.",
    marketing_lead_flow:
      "Your marketing flow exists, but it's leaking at the back end. Leads come in, sit in an inbox, get assigned by round-robin, and die in follow-up. Speed to response is speed to close. Install the automation layer and let your producers fight for the leads they actually quote — not the ones they're handed in turn.",
    owner_command:
      "The reports exist. The discipline of reviewing them doesn't. You can have every report your CRM can generate and it won't matter if no one looks at them on a schedule. Pick a weekly hour, sit in the dashboard, make the calls the data is already telling you to make.",
  },
  advanced: {
    culture_team:
      "You've built something most agencies don't. The team that got you here isn't the team that takes you to the next level, and you're starting to feel it in the friction. Hire ahead of the gap, build a real management bench, and raise the standard before the next growth spurt exposes the cracks you're already noticing.",
    systems_rhythm:
      "Your rhythm built the agency you have. The same rhythm at this scale is loosening, and you're starting to see variance you didn't see at lower volume. Tighten the cadence back to where it was when you were hungry. At this level, rhythm isn't maintenance — it's the multiplier.",
    training_scripts:
      "Your playbook built this agency. It's also slowly getting stale while the market moves around it. Ongoing training isn't optional at this tier — it's how you keep the standard from quietly becoming yesterday's standard. Refresh the scripts, reset the scoring rubric, train weekly.",
    marketing_lead_flow:
      "You have marketing that works. The risk is over-reliance on the channels that built you. One algorithm change, one vendor shift, and your lead flow softens overnight. Diversify the sources, automate the follow-up, and stop letting your top channels dictate your growth ceiling.",
    owner_command:
      "Your reporting is solid. You're the bottleneck for it. Every decision waits for you to look at the numbers, which means the agency moves at owner speed. Train a second set of eyes — someone who reviews the data and brings you the patterns, not the spreadsheets. That's how owner command stops being owner labor.",
  },
  elite: {
    culture_team:
      "You're operating at the standard. At this level, your team is the one variable without a fixed ceiling — one B-player on an A-team compounds in the wrong direction faster than at any other tier. Recognition rhythm and the management layer are full-time work now. Protecting the standard is the standard.",
    systems_rhythm:
      "You're operating at the standard, and your rhythm is the reason. The danger at this tier isn't broken rhythm — it's assumed rhythm. The owner who built it is also the one most likely to bend it for \"good reasons.\" Protect the discipline from yourself.",
    training_scripts:
      "You're operating at the standard. The risk at this tier isn't that your training is bad — it's that it's been good for so long you've stopped evolving it. The agencies that stay at the top are the ones that keep updating their definition of \"dialed in.\" Don't outsource that work to anyone but yourself.",
    marketing_lead_flow:
      "You're operating at the standard. The marketing engine works — which means the next move isn't fixing it, it's testing what's beyond it. New channels, tighter attribution, AI-driven nurture. At this tier, the question isn't \"is the funnel full\" — it's \"is it future-proof.\"",
    owner_command:
      "You're operating at the standard. The dashboards work. The risk at this tier is missing one quiet metric — a cancellation pattern, a commission anomaly, a marketing source that's softening. Tighten the precision on the reports you already trust. The next move isn't more data; it's sharper review.",
  },
};

function getDiagnosticParagraph(tier: MirrorTier, weakestPillar: MirrorPillar): string {
  return DIAGNOSTIC_MATRIX[tier]?.[weakestPillar] ?? "";
}

/* ══════════════════════════════════════════════════════
   TIER SEQUENCES
   ══════════════════════════════════════════════════════ */

const FOUNDATION_SEQUENCE: MirrorTierSequenceEntry[] = [
  { daysOffset: 0, build: (ctx) => ({
    subject: `Your Mirror score: ${ctx.score} / 160`,
    preheader: "Your full Mirror workbook is inside. Read this first.",
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
  }) },
  { daysOffset: 1, build: (ctx) => ({
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
  }) },
  { daysOffset: 2, build: (ctx) => ({
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
  }) },
  { daysOffset: 3, build: (ctx) => ({
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
  }) },
  { daysOffset: 4, build: (ctx) => ({
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

If you want a 45-minute Standard Fit call about what the next 90 days could look like, [book it here](https://AGENCYCOACHING.as.me/MIRROR). I do them myself. No assistant, no funnel, no upsell on the call. Just a conversation.

—Justin`,
  }) },
  { daysOffset: 6, build: (ctx) => ({
    subject: "There's a room for this",
    preheader: "Built for Foundation-tier owners who don't want to climb alone.",
    body: `${ctx.firstName},

A few years ago I built a room called The Boardroom.

It exists for one reason: Foundation-tier agency owners shouldn't have to climb out alone, and the Foundation-tier owners I knew were all making the same mistakes in private.

It's $299/month. One 2-hour group coaching call with me each month — second Tuesday of every month. You get Core-level access to Agency Brain, the call-scoring system (about 20 calls scored per month), Marco Polo video access to me directly, and the gear that puts you on the team. Most members started where you are.

It's not a magic pill. It's a room. The room makes the climb easier because you're not the only one doing it.

If you want in: [join here](https://buy.stripe.com/aFa9AT4KOayO0hycG84Vy0l).

If you want to talk first to make sure it's the right move: [book a 45-min Standard Fit call](https://AGENCYCOACHING.as.me/MIRROR).

If neither feels right today, that's also fine. Keep the workbook. Keep running the morning huddle. The first move is the move regardless of where you do the rest of the work.

—Justin`,
  }) },
  { daysOffset: 9, build: (ctx) => ({
    subject: "Last note from me",
    preheader: "One direct ask, then I'll stop.",
    body: `${ctx.firstName},

This is the last note in this sequence. After this I'll stop emailing unless you reach out.

Here's the direct ask:

You took The Mirror because something inside you knew the score was going to be lower than you wanted. It was. That's good. That's what mirrors do.

You have three reasonable next moves:

**1. Book a 45-min Standard Fit call with me.** No pitch, no upsell on the call. We talk about what you actually saw and what the next 90 days could look like. [Book here](https://AGENCYCOACHING.as.me/MIRROR).

**2. Join The Boardroom.** $299/mo. Monthly group coaching call (2nd Tuesday). The room I built for this exact moment. [Join here](https://buy.stripe.com/aFa9AT4KOayO0hycG84Vy0l).

**3. Do nothing.** Keep the PDF, run the morning huddle, take the assessment again in 90 days and see where you've moved on your own.

All three are real. The only one I'd argue against is a fourth option — pretending you didn't see what you saw.

The mirror is the mirror.

—Justin`,
  }) },
];

const DEVELOPING_SEQUENCE: MirrorTierSequenceEntry[] = [
  { daysOffset: 0, build: (ctx) => ({
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
  }) },
  { daysOffset: 1, build: (ctx) => ({
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
  }) },
  { daysOffset: 2, build: (ctx) => ({
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
  }) },
  { daysOffset: 3, build: (ctx) => ({
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
  }) },
  { daysOffset: 4, build: (ctx) => ({
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
  }) },
  { daysOffset: 6, build: (ctx) => ({
    subject: "Where Developing-tier owners actually fix this",
    preheader: "The room I built for this exact moment.",
    body: `${ctx.firstName},

The Boardroom is built for Developing-tier owners. Not exclusively — there are Foundation-tier and Established-tier owners in there too — but the modal member is exactly where you are.

Why it works for Developing tier specifically:

Developing-tier owners don't need to be told what to do. They mostly know. They need accountability that doesn't depend on their own willpower, and they need to be in a room with peers who'll call them out when they drift.

That's what the Boardroom is. One 2-hour group coaching call with me each month — second Tuesday. Core-level access to Agency Brain. Marco Polo video access to me directly. Branded gear. Call scoring infrastructure (about 20 calls scored per month).

It's $299/month. No contract. Most members stay 12+ months because the rhythm of being in the room is what carries them when their own discipline wavers.

If you want in: [join here](https://buy.stripe.com/aFa9AT4KOayO0hycG84Vy0l).

If you want to talk to me first about whether Boardroom or something more 1:1 (Directive) is the right fit: [book a 45-min Standard Fit call](https://AGENCYCOACHING.as.me/MIRROR).

—Justin`,
  }) },
  { daysOffset: 9, build: (ctx) => ({
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

**2. Book a 45-min Standard Fit call** to talk through whether Boardroom or 1:1 Directive coaching makes more sense. [Book here](https://AGENCYCOACHING.as.me/MIRROR).

**3. Do nothing.** Keep the workbook. Run one rhythm. Take the assessment again in 90 days.

The mirror is the mirror.

—Justin`,
  }) },
];

const ESTABLISHED_SEQUENCE: MirrorTierSequenceEntry[] = [
  { daysOffset: 0, build: (ctx) => ({
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
  }) },
  { daysOffset: 1, build: (ctx) => ({
    subject: "The \"almost there\" trap",
    preheader: "Established is the most comfortable place to plateau.",
    body: `${ctx.firstName},

Established is the most comfortable place to plateau. That's why so many agencies stay there for a decade.

You're past the firefighting of Foundation. You're past the chronic friction of Developing. The agency more or less runs. The numbers are decent. The team mostly knows what to do.

That comfort is the trap. The pain that forced earlier owners to grow has subsided. You can survive Established forever without growing. And most owners do.

The gap between Established and Advanced isn't bigger than the gap between Developing and Established. It's just less visible. Foundation-tier owners can SEE their gaps everywhere. Established-tier owners have to LOOK for theirs.

That's what the Mirror just did for you. It pointed at one specific gap that's quietly capping your growth. The question is whether you close it — or whether you let "almost there" become "still here" 18 months from now.

—Justin`,
  }) },
  { daysOffset: 2, build: (ctx) => ({
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
  }) },
  { daysOffset: 3, build: (ctx) => ({
    subject: "What I'd do in your seat",
    preheader: "Not five things. Two.",
    body: `${ctx.firstName},

If I were sitting in your seat at Established tier, I'd do two specific things in the next 30 days:

**1. Pick the surgical move that maps to your weakest pillar.** Your Mirror score told you exactly where the gap is. The fix at Established tier is usually one specific change — not a transformation. Don't try to overhaul. Tighten the one thing.

**2. Get a second set of eyes on the agency.** Not a coach in the abstract — a specific operator who's run an agency past Advanced and can pressure-test where you're spending time. Established-tier owners almost always have one or two blind spots that are obvious from the outside and invisible from inside the room.

The reason Established-tier owners stay Established is usually #2. They know how to fix the visible problems. They can't see the invisible ones. The right second set of eyes costs less than the time you'll waste figuring it out alone.

—Justin`,
  }) },
  { daysOffset: 4, build: (ctx) => ({
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
  }) },
  { daysOffset: 6, build: (ctx) => {
    const is8WeekBranch = ctx.weakestPillar === "systems_rhythm" || ctx.weakestPillar === "training_scripts";
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

If you'd rather talk first about whether 8-Week or Boardroom or 1:1 Directive coaching is the right move: [book a 45-min Standard Fit call](https://AGENCYCOACHING.as.me/MIRROR).

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

If you want to talk first about whether Boardroom or something more 1:1 (Directive) is the right move: [book a 45-min Standard Fit call](https://AGENCYCOACHING.as.me/MIRROR).

—Justin`,
    };
  } },
  { daysOffset: 9, build: (ctx) => ({
    subject: "Last note",
    preheader: "Two paths.",
    body: `${ctx.firstName},

This is the last note in this sequence.

You scored Established. You know your weakest pillar. You know the surgical fix is one specific move, not a full overhaul.

You have three reasonable next moves:

**1. Apply for 8-Week or join the Boardroom** (whichever fits your gap — see Day 6's note).

**2. Book a 45-min Standard Fit call** to talk through whether Boardroom, 8-Week, or 1:1 Directive coaching is the right move for where you are. [Book here](https://AGENCYCOACHING.as.me/MIRROR).

**3. Do nothing.** Keep the workbook. Run the surgical fix. Take the assessment again in 90 days.

The mirror is the mirror.

—Justin`,
  }) },
];

const ADVANCED_SEQUENCE: MirrorTierSequenceEntry[] = [
  { daysOffset: 0, build: (ctx) => ({
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
  }) },
  { daysOffset: 1, build: (ctx) => ({
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
  }) },
  { daysOffset: 2, build: (ctx) => ({
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
  }) },
  { daysOffset: 3, build: (ctx) => ({
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
  }) },
  { daysOffset: 4, build: (ctx) => ({
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
  }) },
  { daysOffset: 6, build: (ctx) => ({
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
  }) },
  { daysOffset: 9, build: (ctx) => ({
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
  }) },
];

// Elite uses 5 emails on a 0/2/4/6/9 cadence.
const ELITE_SEQUENCE: MirrorTierSequenceEntry[] = [
  { daysOffset: 0, build: (ctx) => ({
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
  }) },
  { daysOffset: 2, build: (ctx) => ({
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
  }) },
  { daysOffset: 4, build: (ctx) => ({
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
  }) },
  { daysOffset: 6, build: (ctx) => ({
    subject: "What's available at this tier",
    preheader: "The Directive. Or just a real conversation.",
    body: `${ctx.firstName},

If you want to work with me at this tier, there's one path: The Directive.

1:1 monthly coaching with me. Application only. The fit conversation matters here more than at lower tiers because the dynamic only works if both of us decide it's right.

This is the work I described in the last note — protecting the standard, working on identity, building toward the next 10 years instead of optimizing the current ones.

If you'd rather start with a 45-min Standard Fit call before committing: [book here](https://AGENCYCOACHING.as.me/MIRROR). I do them myself. No pitch on the call.

If you already know what you want: [apply for The Directive](https://standardplaybook.com/directive).

—Justin`,
  }) },
  { daysOffset: 9, build: (ctx) => ({
    subject: "Last note",
    preheader: "One direct note.",
    body: `${ctx.firstName},

This is the last note in this sequence.

You scored Elite. You don't need much more from me right now.

If you ever want to work together — Directive, or just a Standard Fit call to talk through what you're building — you know where to find me.

[Book a 45-min Standard Fit call](https://AGENCYCOACHING.as.me/MIRROR) | [Apply for The Directive](https://standardplaybook.com/directive)

The mirror is the mirror.

Still love you.

—Justin`,
  }) },
];

const SEQUENCES: Record<MirrorTier, MirrorTierSequenceEntry[]> = {
  foundation: FOUNDATION_SEQUENCE,
  developing: DEVELOPING_SEQUENCE,
  established: ESTABLISHED_SEQUENCE,
  advanced: ADVANCED_SEQUENCE,
  elite: ELITE_SEQUENCE,
};

function sequenceForTier(tier: MirrorTier): MirrorTierSequenceEntry[] {
  return SEQUENCES[tier] ?? [];
}

/* ══════════════════════════════════════════════════════
   HELPERS
   ══════════════════════════════════════════════════════ */

function splitName(full: string): { first: string; last: string } {
  const trimmed = (full ?? "").trim();
  if (!trimmed) return { first: "", last: "" };
  const idx = trimmed.indexOf(" ");
  if (idx === -1) return { first: trimmed, last: "" };
  return { first: trimmed.slice(0, idx), last: trimmed.slice(idx + 1).trim() };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderInline(s: string): string {
  let t = escapeHtml(s);
  t = t.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" style="color:#2080FF;text-decoration:underline;">$1</a>',
  );
  t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/(^|[\s(])\*([^*]+)\*(?=[\s).,;!?]|$)/g, "$1<em>$2</em>");
  return t;
}

function renderBodyToHtml(body: string): string {
  const paragraphs = body.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean);
  return paragraphs
    .map((p) => {
      const inner = p.split("\n").map((line) => renderInline(line.trim())).join("<br>");
      return `<p style="margin:0 0 18px;line-height:1.6;font-size:16px;color:#0A0A0B;">${inner}</p>`;
    })
    .join("\n");
}

function wrapEmail(preheader: string, bodyHtml: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#F4F2EE;">
    <span style="display:none!important;visibility:hidden;opacity:0;color:transparent;height:0;width:0;font-size:1px;line-height:1px;mso-hide:all;">${escapeHtml(preheader)}</span>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#F4F2EE;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;background:#FFFFFF;">
            <tr>
              <td style="padding:32px 28px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#0A0A0B;">
                ${bodyHtml}
                <p style="margin:24px 0 0;font-size:11px;line-height:1.5;color:#0A0A0B;opacity:0.55;">
                  Standard Playbook · Fort Wayne, IN<br/>
                  You're receiving this because you took The Mirror at standardplaybook.com/mirror.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function buildContext(s: MirrorSubmission): MirrorEmailContext {
  const { first } = splitName(s.full_name);
  return {
    firstName: first || s.full_name || "there",
    fullName: s.full_name,
    score: s.total_score,
    tier: s.tier,
    tierName: TIER_LABELS[s.tier] ?? s.tier,
    weakestPillar: s.weakest_pillar,
    weakestPillarName: PILLAR_LABELS[s.weakest_pillar] ?? s.weakest_pillar,
    diagnosticParagraph: getDiagnosticParagraph(s.tier, s.weakest_pillar),
    pdfDownloadUrl: MIRROR_PDF_URL,
  };
}

/* ══════════════════════════════════════════════════════
   DRIP
   ══════════════════════════════════════════════════════ */

interface ScheduledSendResult {
  daysOffset: number;
  subject: string;
  scheduledAt: string | null;
  ok: boolean;
  id?: string;
  error?: string;
}

async function sendDrip(s: MirrorSubmission): Promise<ScheduledSendResult[]> {
  const ctx = buildContext(s);
  const sequence = sequenceForTier(s.tier);
  if (sequence.length === 0) {
    console.warn(`No drip sequence configured for tier=${s.tier}`);
    return [];
  }

  const now = Date.now();
  const DAY_MS = 24 * 60 * 60 * 1000;

  const sends = sequence.map(async (entry): Promise<ScheduledSendResult> => {
    let email: MirrorEmail;
    try {
      email = entry.build(ctx);
    } catch (err: any) {
      console.error(`Template build failed for tier=${s.tier} day=${entry.daysOffset}:`, err);
      return {
        daysOffset: entry.daysOffset,
        subject: "(template failed)",
        scheduledAt: null,
        ok: false,
        error: `template build failed: ${err?.message ?? String(err)}`,
      };
    }

    const html = wrapEmail(email.preheader, renderBodyToHtml(email.body));
    const scheduledAt = entry.daysOffset > 0
      ? new Date(now + entry.daysOffset * DAY_MS).toISOString()
      : null;

    const payload: Record<string, unknown> = {
      from: FROM_ADDRESS,
      to: [s.email],
      subject: email.subject,
      html,
      headers: {
        "X-Mirror-Tier": s.tier,
        "X-Mirror-Pillar": s.weakest_pillar,
        "X-Mirror-Score": String(s.total_score),
        "X-Mirror-Day": String(entry.daysOffset),
        "X-Mirror-Submission-Id": s.id ?? "",
      },
      tags: [
        { name: "mirror_tier", value: s.tier },
        { name: "mirror_pillar", value: s.weakest_pillar },
        { name: "mirror_day", value: `day_${entry.daysOffset}` },
        { name: "source", value: "mirror_drip" },
      ],
    };
    if (scheduledAt) payload.scheduled_at = scheduledAt;

    try {
      // deno-lint-ignore no-explicit-any
      const res: any = await (resend.emails.send as any)(payload);
      const id = res?.data?.id ?? res?.id;
      if (res?.error) {
        const errStr = typeof res.error === "string" ? res.error : JSON.stringify(res.error);
        console.error(`Resend rejected drip day=${entry.daysOffset}:`, errStr);
        return { daysOffset: entry.daysOffset, subject: email.subject, scheduledAt, ok: false, error: errStr };
      }
      console.log(`Drip queued day=${entry.daysOffset} scheduled_at=${scheduledAt ?? "now"} id=${id}`);
      return { daysOffset: entry.daysOffset, subject: email.subject, scheduledAt, ok: true, id };
    } catch (err: any) {
      const msg = err?.message ?? String(err);
      console.error(`Drip throw day=${entry.daysOffset}:`, msg, err);
      return { daysOffset: entry.daysOffset, subject: email.subject, scheduledAt, ok: false, error: msg };
    }
  });

  return await Promise.all(sends);
}

/* ══════════════════════════════════════════════════════
   BREVO (optional)
   ══════════════════════════════════════════════════════ */

async function pushToBrevo(s: MirrorSubmission) {
  if (!BREVO_API_KEY) {
    console.log("BREVO_API_KEY not set — skipping Brevo push");
    return;
  }
  const { first, last } = splitName(s.full_name);
  const hasPhone = Boolean(s.phone && s.phone.trim());

  const tags = [
    `tier:${s.tier}`,
    `pillar:${s.weakest_pillar}`,
    `carrier:${s.carrier}`,
    `has_phone:${hasPhone}`,
    "source:mirror",
    s.utm_source ? `utm_source:${s.utm_source}` : null,
    s.utm_campaign ? `utm_campaign:${s.utm_campaign}` : null,
  ].filter(Boolean) as string[];

  try {
    const body: Record<string, unknown> = {
      email: s.email,
      attributes: {
        FIRSTNAME: first,
        LASTNAME: last,
        FULLNAME: s.full_name,
        SMS: s.phone ?? "",
        PHONE: s.phone ?? "",
        CARRIER: s.carrier,
        MIRROR_SCORE: s.total_score,
        MIRROR_TIER: s.tier,
        MIRROR_WEAKEST: s.weakest_pillar,
        MIRROR_TAGS: tags.join(","),
        UTM_SOURCE: s.utm_source ?? "",
        UTM_MEDIUM: s.utm_medium ?? "",
        UTM_CAMPAIGN: s.utm_campaign ?? "",
        UTM_CONTENT: s.utm_content ?? "",
      },
      updateEnabled: true,
    };
    if (BREVO_MIRROR_LIST_ID) {
      body.listIds = [Number(BREVO_MIRROR_LIST_ID)];
    }

    const res = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        "api-key": BREVO_API_KEY,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const text = await res.text();
      console.error("Brevo upsert failed", res.status, text);
    }
  } catch (err) {
    console.error("Brevo push error", err);
  }
}

/* ══════════════════════════════════════════════════════
   HTTP HANDLER
   ══════════════════════════════════════════════════════ */

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const s: MirrorSubmission = await req.json();

    if (
      !s.email ||
      typeof s.total_score !== "number" ||
      !s.tier ||
      !s.weakest_pillar ||
      !s.full_name ||
      !s.phone ||
      !s.carrier
    ) {
      throw new Error("Missing required fields");
    }

    const tierLabel = TIER_LABELS[s.tier] ?? s.tier;
    const pillarLabel = PILLAR_LABELS[s.weakest_pillar] ?? s.weakest_pillar;
    const pillarRows = Object.entries(s.pillar_scores)
      .map(([k, v]) =>
        `<li><strong>${PILLAR_LABELS[k as MirrorPillar] ?? k}:</strong> ${v}</li>`
      )
      .join("");

    const utmBlock = (s.utm_source || s.utm_campaign || s.utm_medium || s.utm_content)
      ? `
        <h2 style="color: #333; margin-top: 0;">Attribution</h2>
        <p><strong>Source:</strong> ${s.utm_source ?? "—"}</p>
        <p><strong>Medium:</strong> ${s.utm_medium ?? "—"}</p>
        <p><strong>Campaign:</strong> ${s.utm_campaign ?? "—"}</p>
        <p><strong>Content:</strong> ${s.utm_content ?? "—"}</p>
      `
      : "";

    /* 1) Internal notification */
    const internal = await resend.emails.send({
      from: FROM_ADDRESS,
      to: [INTERNAL_NOTIFICATION_TO],
      subject: `New Mirror Submission: ${s.full_name} — ${tierLabel} (${s.total_score}/160)`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1a1a2e; border-bottom: 2px solid #2080FF; padding-bottom: 10px;">New Mirror Submission</h1>

          <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Score</h2>
            <p style="font-size: 28px; margin: 4px 0;"><strong>${s.total_score}</strong> / 160</p>
            <p><strong>Tier:</strong> ${tierLabel}</p>
            <p><strong>Weakest pillar:</strong> ${pillarLabel}</p>
          </div>

          <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Contact</h2>
            <p><strong>Name:</strong> ${s.full_name}</p>
            <p><strong>Email:</strong> <a href="mailto:${s.email}">${s.email}</a></p>
            <p><strong>Phone:</strong> <a href="tel:${s.phone}">${s.phone}</a></p>
            <p><strong>Carrier:</strong> ${CARRIER_LABELS[s.carrier] ?? s.carrier}</p>
            <p><strong>Device:</strong> ${s.device_type ?? "—"}</p>
          </div>

          <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h2 style="color: #333; margin-top: 0;">Pillar Breakdown</h2>
            <ul>${pillarRows}</ul>
          </div>

          <div style="background: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
            ${utmBlock}
          </div>

          <p style="color: #666; font-size: 12px; margin-top: 30px;">
            Submission ID: ${s.id ?? "—"}<br/>
            UA: ${s.user_agent ?? "—"}
          </p>
        </div>
      `,
    });

    /* 2) User-facing drip — wrapped so it can't break the response */
    let dripResults: ScheduledSendResult[] = [];
    try {
      dripResults = await sendDrip(s);
    } catch (dripErr: any) {
      console.error("sendDrip threw outside per-send catch:", dripErr);
    }

    /* 3) Optional Brevo upsert. */
    await pushToBrevo(s);

    const dripSummary = {
      total: dripResults.length,
      ok: dripResults.filter((r) => r.ok).length,
      failed: dripResults.filter((r) => !r.ok).length,
      results: dripResults,
    };
    console.log("Mirror notification sent. Drip:", JSON.stringify(dripSummary));

    return new Response(
      JSON.stringify({ ok: true, internal, drip: dripSummary }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  } catch (error: any) {
    console.error("Error sending mirror notification:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } },
    );
  }
};

serve(handler);
