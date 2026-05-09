# /mirror Lead Magnet — Build Spec

**Status:** Spec locked from strategy conversation, May 2026. Ready to hand to Claude Code.
**Repo:** `/Users/standardmacbook/officialstandardplaybooksite`
**Reference page for visual pattern:** `src/pages/BoldMockup.tsx` (homepage) and `src/pages/BoldDirective.tsx` (single-program landing template)
**Brand reference:** `brand-guide-v2.md` (paper / ink / blue / red bold editorial system)

---

## Purpose

A self-scoring lead magnet that takes cold Meta ad traffic, walks them through The Mirror's 32-subcategory agency assessment, captures their email + score in Supabase, and routes them into a tier-and-pillar-segmented email sequence pitching the right coaching path (Boardroom default, Directive 1:1 upsell, 8-Week side door for sales-management-specific pain).

---

## Funnel Position

```
Meta ad → /mirror landing page → assessment (32 questions) →
email capture → tier results reveal → email sequence →
Boardroom (default) | Directive (upsell) | 8-Week (side door)
```

---

## Page Architecture (3 routes)

```
/mirror              → Landing page (sells the assessment)
/mirror/score        → 32-question sequential assessment
/mirror/results      → Personalized tier + pillar reveal + email confirmation
```

Add to `src/App.tsx`:
```tsx
<Route path="/mirror" element={<BoldMirror />} />
<Route path="/mirror/score" element={<BoldMirrorScore />} />
<Route path="/mirror/results" element={<BoldMirrorResults />} />
```

---

## Page 1 — `/mirror` Landing Page

**File:** `src/pages/BoldMirror.tsx`

**Sections (top to bottom):**

1. **BoldNav** (sticky, paper bar, ink border, standard reuse)
2. **Hero**
   - Eyebrow: `/ FREE AGENCY ASSESSMENT`
   - Staircase headline (3-line indented Anton): line 1 + line 2 + line 3 in brand blue (`#2080FF`)
     - Working draft: *"SCORE YOUR / AGENCY / HONESTLY."*
   - Sub-copy: *"5 pillars. 32 subcategories. One number that tells you the truth. Most agency owners score under 100."*
   - 2 CTAs: outlined ("LEARN MORE") + filled ("START SCORING →")
3. **Marquee band** (rotated tickers, alternating ink/paper, blue dot separators) — phrase: "THE MIRROR · 32 QUESTIONS · 5 PILLARS · ONE HONEST SCORE"
4. **The 5 pillars** — Bold list rows pattern (numbered 01-05, Anton title, brief description, no expansion)
5. **What you get** — 4-item display numerals grid (01-04): tier score, weakest pillar identified, full Mirror PDF, personalized 7-day breakdown
6. **Authority block** — short ink-canvas band with Justin headshot (polaroid) + 60-80 word positioning paragraph
7. **Marquee band** — phrase: "MOST AGENCIES SCORE UNDER 100 · WHERE WILL YOU LAND"
8. **Giant CTA closer** — `SCORE.` (full-bleed, clickable, opens /mirror/score)
9. **BoldFooter** (standard reuse)

**Mobile:** Sticky black bar at bottom with paper-bg "START SCORING" button (existing mobile sticky CTA pattern).

---

## Page 2 — `/mirror/score` Sequential Assessment

**File:** `src/pages/BoldMirrorScore.tsx`

**Visual aesthetic:** Paper canvas (`#F4F2EE`) for the assessment screens — better for sustained reading. Ink type, blue stars, blue progress bar.

**One question per screen.** Tap-to-rate auto-advances.

**Per-question screen layout:**

```
┌────────────────────────────────────────────┐
│  STANDARD logo (small)         × Exit      │ ← minimal sticky header
│  ━━━━━━━━━━━━━░░░░░░░░░░░░░░░              │ ← progress bar (blue fill)
│                          / QUESTION 6 OF 32 │ ← progress text
│                                            │
│                                            │
│  PILLAR 1 / CULTURE & TEAM                 │ ← pillar context (small)
│                                            │
│  SDR/TELEMARKETER                          │ ← Anton, all-caps, ~64px
│                                            │
│  Your best closer shouldn't be             │ ← Inter italic, ~24px
│  cold-calling.                             │   the declarative opener
│                                            │   (Justin's voice — sets the standard)
│                                            │
│  Rate your agency on this standard:        │ ← Inter, ~14px, small
│                                            │   STANDARDIZED PROMPT
│                                            │   (identical on every question)
│                                            │
│  ☆  ☆  ☆  ☆  ☆                              │ ← 5 blue stars (tap to rate)
│  We don't                          Dialed  │ ← anchor labels
│  have this                         in      │
│                                            │
│  if tempted to give a 4 because you're     │ ← discipline reminder
│  "almost there" — it's a 3                 │   (Inter italic, small)
│                                            │
│                                            │
│  ←  Back                                   │ ← prev question only
└────────────────────────────────────────────┘
```

**Three text layers per question:**
1. Subcategory name (Anton, all-caps, large) — categorical anchor
2. Declarative opener (Inter italic, mid) — Justin's voice, sets what "good" looks like
3. Standardized scoring prompt (Inter, small) — *"Rate your agency on this standard:"* — IDENTICAL ON EVERY QUESTION, removes ambiguity about what's being scored

The opener varies per subcategory (32 unique lines, see `the-mirror-ui-openers.md`). The scoring prompt is one string used 32 times.

**Star widget:**
- 5 stars, blue (`#2080FF`) when filled, hairline ink outline (`#0A0A0B`) when empty
- Tap a star → fills 1-N → auto-advances to next question after 300ms delay (just enough to confirm visually)
- No "submit" button per question — tap-to-advance

**Anchor labels:**
- Position 1: "We don't have this"
- Position 5: "Dialed in"
- Positions 2-4: no labels (interpolated)

**Discipline reminder:** Italic, Inter, small ink text under the rating row, on every question. "*if tempted to give a 4 because you're 'almost there' — it's a 3*"

**Navigation:**
- Back arrow (top-left or above stars) — goes to previous question
- No skip button — must rate to advance
- × Exit (top-right) — confirms abandon ("Are you sure? You'll lose your progress.")

**After question 32:** Lead capture screen with 4 required fields.

```
┌────────────────────────────────────────────┐
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━           │ ← progress bar (full)
│                                            │
│  ALMOST THERE.                             │ ← Anton, all-caps
│                                            │
│  Where should we send your results?        │ ← Inter, body lead
│                                            │
│  Full name                                 │
│  ┌──────────────────────────────────────┐  │
│  │                                      │  │ ← bottom border only
│  └──────────────────────────────────────┘  │
│                                            │
│  Email                                     │
│  ┌──────────────────────────────────────┐  │
│  │                                      │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  Phone                                     │
│  ┌──────────────────────────────────────┐  │
│  │                                      │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  Carrier                                   │
│  ┌──────────────────────────────────────┐  │
│  │  Select your carrier            ⌄    │  │ ← custom dropdown
│  └──────────────────────────────────────┘  │   (NOT native browser)
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │  SEE MY SCORE  →                     │  │ ← filled ink button
│  └──────────────────────────────────────┘  │   (disabled until all 4 valid)
│                                            │
│  We'll send your full Mirror PDF and       │ ← privacy reassurance
│  7-day breakdown. Unsubscribe anytime.     │
└────────────────────────────────────────────┘
```

**Field requirements (all required):**

| Field | Validation | DB column |
|-------|-----------|-----------|
| Full name | Non-empty text | `full_name` |
| Email | Standard email format | `email` |
| Phone | 10 digits min, accept dashes/dots/spaces/parens | `phone` |
| Carrier | Must be one of 6 dropdown options | `carrier` |

**Carrier dropdown options (display label → db value):**
- Allstate → `allstate`
- State Farm → `state_farm`
- Farmers → `farmers`
- American Family → `american_family`
- Independent → `independent`
- Other → `other`

**Carrier dropdown UX:** Custom-styled (not the native browser `<select>` — that won't match the bold brand). Bottom border only, ink chevron icon on right, opens to a styled list panel. Default placeholder: "Select your carrier".

**Mobile:** Inputs use 16px+ font to prevent iOS zoom-on-focus.

**On submit:**
1. Calculate `total_score`, `tier`, `weakest_pillar` client-side
2. Write row to Supabase `mirror_submissions` table
3. Fire `send-mirror-notification` Supabase Edge Function (queues Brevo email sequence)
4. Fire Meta Pixel `Lead` event
5. Navigate to `/mirror/results` with submission ID

---

## Page 3 — `/mirror/results` Tier Reveal

**File:** `src/pages/BoldMirrorResults.tsx`

**Visual aesthetic:** Ink canvas (`#0A0A0B`). The "moment." High contrast. Paper text. Blue accents.

**Layout:**

```
┌────────────────────────────────────────────┐
│  BoldNav (paper bar, ink border)           │
├────────────────────────────────────────────┤
│  / YOUR MIRROR                             │ ← eyebrow
│                                            │
│                                            │
│         78                                 │ ← Anton, 200px+, paper
│         / 160                              │ ← Inter, 24px, paper at 60%
│                                            │
│         DEVELOPING                          │ ← Anton, 32px, BLUE
│                                            │
│                                            │
│  PILLAR BREAKDOWN                          │ ← Inter eyebrow
│                                            │
│  Culture & Team    ████████░░  18/30       │ ← 5 horizontal bars
│  Systems & Rhythm  ████░░░░░░  10/30       │   weakest highlighted blue
│  Training & ...    ███░░░░░░░  7/30   ←    │
│  Marketing & ...   ██████░░░░  16/30       │
│  Owner Command     ████████░░  20/40       │
│                                            │
│                                            │
│  YOUR WEAKEST PILLAR:                      │ ← diagnostic block
│  TRAINING & SCRIPTS                        │   (ink card with                    │
│                                            │    blue accent line)
│  [2-3 sentence interpretation pulled       │
│   from tier × pillar matrix]               │
│                                            │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │  BOOK A 15-MIN CONVERSATION  →       │  │ ← outline button (soft CTA)
│  └──────────────────────────────────────┘  │
│                                            │
│                                            │
│  Your full Mirror PDF and 7-day            │ ← email confirmation
│  personalized breakdown have been sent     │
│  to [user@email.com]                       │
│                                            │
│  Marquee band                              │
│                                            │
│  Giant CTA: ENROLL.                        │ ← page closer (opens
│                                            │   Boardroom enrollment
│                                            │   for default tier path)
│                                            │
│  BoldFooter                                │
└────────────────────────────────────────────┘
```

The results page CTA shifts based on tier × weakest pillar combo (see Routing Logic below).

---

## Data Architecture

### Supabase table: `mirror_submissions`

```sql
create table mirror_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),

  -- User-input fields (all required)
  full_name text not null,
  email text not null,
  phone text not null,
  carrier text not null check (carrier in ('allstate', 'state_farm', 'farmers', 'american_family', 'independent', 'other')),

  -- Calculated fields
  total_score int not null,
  tier text not null check (tier in ('foundation', 'developing', 'established', 'advanced', 'elite')),
  weakest_pillar text not null check (weakest_pillar in ('culture_team', 'systems_rhythm', 'training_scripts', 'marketing_lead_flow', 'owner_command')),
  pillar_scores jsonb not null,        -- {culture_team: 18, systems_rhythm: 10, ...}
  question_scores jsonb not null,      -- {q1: 4, q2: 3, ...} all 32

  -- Attribution / metadata
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  device_type text,
  user_agent text
);

create index mirror_submissions_email_idx on mirror_submissions(email);
create index mirror_submissions_tier_idx on mirror_submissions(tier);
create index mirror_submissions_carrier_idx on mirror_submissions(carrier);
create index mirror_submissions_created_idx on mirror_submissions(created_at desc);
```

### Tier brackets (calibrated against Justin's 70-95 modal client zone)

```
Foundation: 32-64
Developing: 65-94
Established: 95-119
Advanced: 120-144
Elite: 145-160
```

### Pillar score totals (for max calculation)

```
Pillar 1 — Culture & Team:        10 subcategories × 5 = 50 max
Pillar 2 — Systems & Rhythm:       6 subcategories × 5 = 30 max
Pillar 3 — Training & Scripts:     6 subcategories × 5 = 30 max
Pillar 4 — Marketing & Lead Flow:  6 subcategories × 5 = 30 max
Pillar 5 — Owner Command:          4 subcategories × 5 = 20 max
                                  ─────────────────────
                                  32 subcategories     160 max
```

### 32-subcategory mapping

See `the-mirror-ui-openers.md` for the full list with opener lines per subcategory. Use that as the question content source.

---

## Routing Logic (tier × weakest pillar → CTA)

The results page CTA + the email sequence branch route based on tier × weakest pillar:

| Tier | Weakest Pillar | Default CTA | Email Sequence |
|------|----------------|-------------|----------------|
| Foundation (32-64) | Any | "BOOK A 45-MIN CALL" | Foundation sequence → Boardroom + 8-Week emphasis |
| Developing (65-94) | Pillars 2 or 3 | "BOOK A 45-MIN CALL" | Developing sequence → Boardroom default + 8-Week sidebar |
| Developing (65-94) | Other pillars | "JOIN THE BOARDROOM" | Developing sequence → Boardroom direct |
| Established (95-119) | Pillars 2 or 3 | "APPLY FOR 8-WEEK" | Established sequence → 8-Week primary |
| Established (95-119) | Other pillars | "JOIN THE BOARDROOM" | Established sequence → Boardroom direct |
| Advanced (120-144) | Any | "APPLY FOR THE DIRECTIVE" | Advanced sequence → Directive 1:1 |
| Elite (145-160) | Any | "EXPLORE PARTNERSHIP" (or Directive if Partnership sold out) | Elite sequence → soft validation + Directive invitation |

---

## Backend: Supabase Edge Function

**Function:** `send-mirror-notification`
**Pattern:** Mirror existing `send-booking-notification` and `send-directive-notification` (already in codebase).

**Responsibilities:**
1. Send Justin an internal notification email (new submission with full_name, email, phone, carrier, tier, score, weakest pillar)
2. Push to Brevo with appropriate tags:
   - `tier:[name]` (e.g., `tier:developing`)
   - `weakest_pillar:[name]` (e.g., `weakest_pillar:training_scripts`)
   - `carrier:[name]` (e.g., `carrier:allstate`)
   - `source:mirror`
   - `has_phone:true`
   - Plus UTM tags from submission
3. Split `full_name` for Brevo on the first space:
   - Everything before first space → Brevo `first_name` field
   - Everything after first space → Brevo `last_name` field
   - If no space (single-word name), use entire string as first_name, leave last_name empty
4. Trigger the appropriate Brevo automation sequence based on tier × weakest_pillar

---

## Tracking & Attribution

**UTM capture:** Read on landing page mount, store in component state, persist through quiz, write to submission row.

**Meta Pixel events:**
- `PageView` on `/mirror` (standard)
- `InitiateCheckout` on quiz start (custom — first question rendered)
- `Lead` on email submission (matches existing Booking form pattern)

**Conversion tracking goal in Meta Ads Manager:** `Lead` event on `/mirror/score` submission.

---

## Components to Reuse from Codebase

- `BoldNav` — sticky paper nav
- `BoldFooter` — 4-col footer
- Marquee band component (extract from any `Bold*.tsx` if not already shared)
- Polaroid screenshot pattern (for Justin headshot on landing page)
- Mobile sticky CTA (existing pattern)
- Modal shell (`src/components/ui/dialog.tsx`) if any modals are needed

## Components to Build New

- `MirrorStarRating` — 5-star tap-to-rate, blue fill, ink outline, anchor labels, auto-advance
- `MirrorProgressBar` — sticky thin progress bar (blue fill on paper)
- `MirrorPillarBars` — 5 horizontal score bars for results page (highlight weakest)
- `MirrorTierCard` — diagnostic interpretation card on results page

---

## Open Items Before Build

These are still owed before Claude Code can build cleanly:

1. **Newsletter capture infrastructure decision** — Supabase confirmed as the destination? Or external (GHL, Mailchimp, Beehiiv)?
2. **Diagnostic matrix copy** — 25 cells (5 tiers × 5 pillars) of interpretive paragraph for the results page weakest-pillar callout.
3. **Email sequence content** — 7-email Brevo sequence per tier path (Foundation, Developing, Established, Advanced, Elite). Approximately 35 emails total to write.
4. **Landing page copy refinement** — hero headline final ("SCORE YOUR / AGENCY / HONESTLY." is a working draft), positioning paragraph, what-you-get items.
5. **Ad creative** — hooks, scripts, visual direction for 30-second Meta hero + hook cuts.
6. **Justin approval** — review of all 32 opener lines in `the-mirror-ui-openers.md`, especially the 2 fresh writes (Accountability #11, Monthly Recap Meeting #16).

---

## Locked Decisions

| Decision | Lock |
|----------|------|
| Aesthetic | Bold marketing brand (paper / ink / blue / red) |
| Visual reskin from AB | Paper canvas, Anton headlines, Inter body, blue stars |
| Question format | Declarative only (sharpened opener lines, not interrogative AB-style) |
| Flow | One-question-per-screen sequential, tap-to-rate auto-advance |
| Star color | Blue `#2080FF` filled, hairline ink outline empty |
| Anchor labels | "We don't have this" → "Dialed in" |
| Discipline reminder | Visible on every question — "if tempted to give a 4, it's a 3" |
| Score system | 5-star × 32 subcategories = 160 max |
| Tier brackets | 32-64 / 65-94 / 95-119 / 120-144 / 145-160 |
| Email capture timing | After question 32, before results reveal |
| Reflection layer | REMOVED from lead magnet (paid coaching value only) |
| Backend | Supabase `mirror_submissions` + `send-mirror-notification` Edge Function |
| Attribution | UTM capture + Meta Pixel `Lead` event on submission |
| Default routing | Tier × weakest pillar → Boardroom default, Directive upsell, 8-Week side door |
| Sales metric | "5+ quoted households a day" (Justin override of original "4+ conversations") |
