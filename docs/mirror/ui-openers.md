# The Mirror — UI Opener Lines + Subcategory Questions

**Purpose:** For the /mirror tap-through assessment, each of the 32 subcategories has TWO text layers:

1. **Opener** — declarative line in Justin's voice. Sets the standard ("here's what good looks like").
2. **Question** — subcategory-specific question that converts the opener into a scoreable action ("rate yourself against that standard").

This file is the canonical reference for both layers. Used by `src/data/mirrorQuestions.ts` in the codebase.

**Default UI structure per question:**

```
PILLAR X / [PILLAR NAME]      (small eyebrow)
SUBCATEGORY NAME              (Anton, all-caps, large)

[Opener]                       (Inter italic, mid)

[Question]                     (Inter, weight 500, mid)

[1] [2] [3] [4] [5]            (5 blue stars)
We don't have this — Dialed in

if tempted to give a 4, it's a 3
```

---

## PILLAR 1 — CULTURE & TEAM

### 01. Core Values
**Opener:** *Core values aren't a poster on the wall — they're the filter for every hire, every fire, every hard call.*
**Question:** How well do your values actually drive decisions on your team?

### 02. Role Specialization
**Opener:** *When producers split time between sales and service, neither gets the attention it deserves.*
**Question:** How clearly does each person on your team know what they own?

### 03. Sales
**Opener:** *A sales producer's job is new business — 5+ quoted households a day, closing. Period.*
**Question:** How focused is your sales producer on new business?

### 04. Service
**Opener:** *Service is the engine of retention — protecting the book, handling claims fast, and surfacing cross-sell from a relationship standpoint.*
**Question:** How well is your service team protecting and growing the book?

### 05. Hybrid
**Opener:** *A hybrid role with no structure is just chaos with a title.*
**Question:** How clearly are hybrid roles structured on your team?

### 06. SDR/Telemarketer
**Opener:** *Your best closer shouldn't be cold-calling.*
**Question:** How well do you separate prospecting from closing?

### 07. Onboarding
**Opener:** *The sale isn't the finish line — it's the starting line.*
**Question:** How strong is your new client's first 30-day experience?

### 08. Management
**Opener:** *Somebody has to hold the standard when you're not in the room.*
**Question:** How well does your team perform when you're not there?

### 09. Always Be Recruiting
**Opener:** *The worst time to recruit is when you're desperate.*
**Question:** How consistently are you building your bench, week to week?

### 10. Recognition
**Opener:** *People repeat what gets recognized — but only when the criteria are clear, earned, and consistent.*
**Question:** How clearly and consistently do you recognize your team's wins?

---

## PILLAR 2 — SYSTEMS & RHYTHM

### 11. Accountability
**Opener:** *When accountability lives in the team — not just the owner — you stop being the enforcer.*
**Question:** How well does your team hold each other accountable without you?

### 12. Scoreboard
**Opener:** *You can't be engaged in a goal you can't see.*
**Question:** How visible are your team's numbers, every day?

### 13. Call Reports
**Opener:** *A call report answers the question: what did my sales team actually do all day?*
**Question:** How clearly do you know what your team did yesterday?

### 14. Morning Huddle
**Opener:** *The morning huddle sets the tone — every team member reports yesterday, declares today's goal, and trains together.*
**Question:** How consistently does your team start the day together?

### 15. Weekly 1:1s
**Opener:** *The weekly 1:1 is where you find out what's really going on.*
**Question:** How real are your weekly 1:1s — and do they happen every week?

### 16. Monthly Recap Meeting
**Opener:** *Without a monthly recap, your agency runs on disconnected weeks instead of measured momentum.*
**Question:** How consistently does your team review the month together?

---

## PILLAR 3 — TRAINING & SCRIPTS

### 17. Sales Agent Playbook
**Opener:** *Without a playbook, every producer runs their own version of the job — and you can't coach what isn't standardized.*
**Question:** How standardized is your sales process across every producer?

### 18. Training Video Vault
**Opener:** *When a new hire asks "how do I do this?" — the answer should be "watch the video."*
**Question:** How much of your training is documented and instantly available?

### 19. New Hire Training
**Opener:** *Goal: get a new sales producer to write their first sale within their first full month.*
**Question:** How fast can a new hire start producing in your agency?

### 20. Ongoing Training
**Opener:** *Training isn't a one-time event — it's a weekly discipline.*
**Question:** How consistently does your team train every week?

### 21. Scoring Calls
**Opener:** *Call scoring is how you know if your training is sticking.*
**Question:** How often are your team's calls scored and coached?

### 22. Sales & Service Scripts
**Opener:** *Scripts aren't training wheels — they're guardrails.*
**Question:** How well do your team's scripts actually get used?

---

## PILLAR 4 — MARKETING & LEAD FLOW

### 23. CRM
**Opener:** *A CRM only works if your team uses it.*
**Question:** How consistently does your team log every lead and call?

### 24. Phone System
**Opener:** *If your team is manually dialing and flying blind on call quality, you're leaving production on the table.*
**Question:** How well does your phone system support your team's speed and quality?

### 25. Agency Communication Platform
**Opener:** *Internal email chains are where information goes to die.*
**Question:** How fast and organized is communication inside your agency?

### 26. Marketing Plan
**Opener:** *A marketing plan has one job: put enough leads in front of your producers to hit their number.*
**Question:** How clearly can you tie every marketing dollar to a sale?

### 27. AI-Powered Email System
**Opener:** *Speed to response is speed to close — every new lead, automated, 5+ days, no exceptions.*
**Question:** How fast does every new lead get a response in your agency?

### 28. Lead Distribution
**Opener:** *Stop assigning leads automatically.*
**Question:** How well does your lead distribution reward fast, hungry producers?

---

## PILLAR 5 — OWNER COMMAND

### 29. New Sale Review
**Opener:** *No review, no credit — every new policy gets checked before commission counts.*
**Question:** How thoroughly is every new policy reviewed before counting?

### 30. Marketing Reporting
**Opener:** *If you can't compare lead vendors side by side on real numbers, you're guessing which marketing is working.*
**Question:** How clearly can you see which marketing source is actually working?

### 31. Commissions Reporting
**Opener:** *Commissions should reflect reality, not optimism.*
**Question:** How accurately do your commissions match your carrier statements each month?

### 32. Cancellations Reporting
**Opener:** *Every cancellation is a data point.*
**Question:** How well do you track and act on your cancellations?

---

## Voice rules for the Question layer

- **Frame as a measurable action.** "How well does..." / "How clearly..." / "How consistently..." / "How fast..."
- **Specific to the subcategory.** No generic placeholders.
- **One line.** Two lines max on mobile.
- **No restatement of the opener.** The question pivots from "here's the standard" to "where do YOU stand against it."
- **Operator-direct.** Not corporate, not surveyish. Justin's voice carries.

## Sales metric note

Sales subcategory uses "5+ quoted households a day" (Justin override of the original "4+ conversations" workbook language). This is the canonical metric for the lead magnet — do not revert.
