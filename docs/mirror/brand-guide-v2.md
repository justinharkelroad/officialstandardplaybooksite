# Standard Playbook — Brand Guide (V2 / 2026 Bold Rebrand)
*Created: May 2026 — extracted from new site mockups, then locked against canonical in-code specs from `BOLD_REBRAND_HANDOFF.md` (officialstandardplaybooksite repo)*
*Status: CANONICAL for confirmed specs (color, type, motifs). A few application questions remain open — see Section 8.*
*Codebase reference: `/Users/standardmacbook/officialstandardplaybooksite`. Live local dev at `localhost:8080`.*

---

## 1. Brand Overview

**Full Name:** Standard Playbook
**Short Name / Mark:** STANDARD
**Website:** standardplaybook.com
**Tagline:** *Raise your standard.*
**Closing word (page footers):** *RAISE.* / *JOIN.* / *TRAIN.* — single imperative, period-terminated

**Aesthetic Position:**
*Bold editorial / Dom Pérignon-inspired.* Editorial newspaper headline meets modern minimalism with a luxury-print sensibility. Heavy condensed all-caps display type, disciplined whitespace, restrained two-canvas system (paper + ink). The brand reads tough, operator-built, no-fluff — the visual equivalent of how Justin actually talks. Loud where it counts, quiet where it doesn't. Internally codenamed "Bold." All page files in the repo are prefixed `Bold*.tsx`.

**What changed from V1:**
- Display typography is dramatically heavier and condensed (was Apple system stack, weight 600, sentence case — now bold condensed all-caps)
- Light canvas is warmer (cream / off-white, not cool Apple gray)
- Black replaces Apple Blue as the primary CTA color
- Blue is now an accent / highlight role, not the workhorse
- New signature motifs: diagonal tape banners, polaroid photo treatment, numbered list architecture, single-word page closers
- Apple restraint is preserved in spacing and grid; the type system is the rebellious part

---

## 2. Visual Identity

### 2.1 Color Palette

The system is built on a tight four-color rhythm: ink, paper, brand blue, alert red. The first three do 99% of the work. Red is restricted. No secondary palette. Restraint is the rule.

**Canonical (locked in code as constants across every `Bold*.tsx` file):**

| Role | Name | Hex | RGB | Usage |
|------|------|-----|-----|-------|
| **Ink** | Near-Black | `#0A0A0B` | rgb(10, 10, 11) | Type, borders, dark canvas backgrounds, primary CTA fills |
| **Paper** | Warm Off-White | `#F4F2EE` | rgb(244, 242, 238) | Light canvas backgrounds, paper text on ink, primary CTA text on ink |
| **Brand Blue** | Bold Blue | `#2080FF` | rgb(32, 128, 255) | Accent moments only — staircase headline emphasis line, marquee dot separators, hover/active states |
| **Alert Red** | Editorial Red | `#C8102E` | rgb(200, 16, 46) | RESERVED — Fit Check / Problem block use only. Not a CTA color. Not for emphasis. |

**Color Rules:**
- Three colors do 99% of the work: ink, paper, brand blue. Red is restricted to Fit Check / Problem blocks only.
- Ink (`#0A0A0B`) is the new Apple Blue: filled CTAs, dominant backgrounds, footer, all type on paper.
- Brand Blue (`#2080FF`) is reserved for accent moments — one line in a 3-line staircase headline, marquee dot separators, hover/active states, the "MOST POPULAR" tag. Never used as body color or full button fill.
- Paper (`#F4F2EE`) is warmer than V1's Apple Gray. It should feel like newsprint, not Apple product page. If it looks cool/blue-tinted, it's wrong.
- The two-canvas alternation (ink / paper) is preserved from V1 — it's still the page rhythm.
- Retired from V1: Apple Blue (`#0071E3`) as primary CTA color, Bright Blue (`#2997FF`) as outline pill color, the cool gray light canvas (`#F5F5F7`), pure black `#000000`.

> **Note for any new build:** Pull color constants from the codebase, not from this doc. The canonical source is the `ink` / `paper` / `blue` / `red` constants repeated in every `src/pages/Bold*.tsx` file. If you find a discrepancy, the code wins and this doc gets updated.

---

### 2.2 Typography

The system runs on three font roles: display, editorial (alternate display), and body. All loaded from Google Fonts via `index.html`.

**Display face — `Anton` (primary), with `Archivo Black`, `Oswald`, `Impact` as fallbacks**
Used for staircase headlines, section titles, page closers, marquee tickers, display numerals. All-caps, near-zero letter-spacing. Anton's condensed proportions and heavy weight do the brand's heavy lifting.

```css
font-family: "Anton", "Archivo Black", "Oswald", Impact, sans-serif;
```

**Editorial face — `Archivo Black` (primary), with `Anton`, `Impact` as fallbacks**
Used as an alternate display when slightly less condensed proportions are wanted (e.g., shorter wider headlines, certain editorial blocks). Used sparingly — Anton is the default.

```css
font-family: "Archivo Black", "Anton", Impact, sans-serif;
```

**Body face — `Inter`**
Body copy, navigation, eyebrows, buttons, fine print. Regular-to-medium weight. Inter is the universal text face — it renders consistently and is the workhorse.

```css
font-family: Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
```

**Fonts loaded in `index.html`:** Anton, Archivo Black, Bebas Neue (display options), Oswald, Rajdhani (legacy display, kept for fallback compatibility), Inter (body).

> **Note:** The legacy Oswald and Rajdhani imports remain in `index.html` for backward compatibility with not-yet-rebranded pages. They are NOT to be used on new bold work. Anton is the canonical display face.

**Type Scale:**

| Role | Treatment | Example |
|------|-----------|---------|
| Mega Display | Display face, ~140-180px, all-caps, weight 800-900, tight tracking | "RAISE YOUR STANDARD" / "TRAIN." / "RAISE." / "JOIN." |
| Hero H1 | Display face, ~80-100px, all-caps, weight 800-900 | "TRAIN YOUR WHOLE TEAM. ONE PLATFORM." |
| Section H2 | Display face, ~48-64px, all-caps, weight 800 | "ANY VIDEO. A TEAM TRAINING." |
| Sub-headline / Diagnostic Headline | Display face, ~36-44px, all-caps, weight 700-800, mid-gray when set as quieter element | "STANDARD PLAYBOOK'S OBSESSION IS BUILDING AGENCIES…" |
| Card / Item Headline | Display face, 20-24px, all-caps, weight 800 | "THE BOARDROOM" / "8 WEEK EXPERIENCE" |
| Body Lead | Body face, 17-19px, weight 400 | Hero subheads, feature body |
| Body | Body face, 15-16px, weight 400 | Paragraph copy |
| Eyebrow / Kicker | Body face, 11-12px, weight 500-600, tracked +1.5 to +2px, prefixed with `/ ` | `/ THE MISSION`, `/ PROGRAMS`, `/ CLAIM YOUR SEAT` |
| Numbered List Marker | Body face, 13-14px, weight 600, electric blue | `01`, `02`, `03` |
| Button | Body face, 12-14px, weight 600, all-caps, tracked +1px | "BOOK A CALL" / "JOIN →" |
| Tape Banner | Display face, 18-24px, all-caps, weight 800 | "STANDARD PLAYBOOK • STANDARD PLAYBOOK • …" |

**Typography Rules:**
- Display face is ALL CAPS, always. Never set the display face in mixed case.
- Body face is sentence case for paragraphs, ALL CAPS only for buttons and eyebrows.
- Periods are part of the typography. "RAISE." "TRAIN." "JOIN." The period is intentional — it's the full stop that gives the word weight. Don't drop them.
- Two-line headline pattern: line 1 in primary color, line 2 in electric blue for emphasis. Used selectively — not every headline is two-line. Example: "EVERY MONTH. **EVERY MEMBER.**" / "IT'S NOT JUST **BUSINESS.**"
- The display face must be HEAVY. If it looks light, you've picked the wrong weight. Black / Heavy / Bold-Condensed only.
- Body weight 400 (regular). Buttons and eyebrows at 600. Never use 700+ for body text.
- Letter-spacing on the display face is near zero or slightly negative — these are dense typographic blocks, not airy display faces.
- Sub-headline gray treatment (used on the homepage "OBSESSION IS BUILDING AGENCIES" headline) is reserved for moments where the display face is set very large but should recede into the design — a deliberate quiet-loud move. Use sparingly.
- Retired from V1: Apple system stack as the display layer, weight 600 sentence-case headlines, the prohibition on ALL CAPS headlines. The new brand IS all-caps headlines.

**Canonical font stacks (locked in code):**
```css
/* Display */
font-family: "Anton", "Archivo Black", "Oswald", Impact, sans-serif;

/* Editorial (alternate display) */
font-family: "Archivo Black", "Anton", Impact, sans-serif;

/* Body */
font-family: Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif;
```

---

### 2.3 Logo & Wordmark

**Primary Mark:** "STANDARD" set in the heavy condensed display face, rendered as a flat wordmark. The cross integration in the "T" carries forward from V1 — structural, not decorative.

**Treatment:**
- White wordmark on black backgrounds (footer, hero, dark sections)
- Black wordmark on cream backgrounds (light sections, documents)
- The blue-bordered rectangle from V1 is RETIRED. The new wordmark stands on its typography alone.

**Tape Banner Lockup (new signature):**
A diagonal tape strip running across the canvas, set with repeating "STANDARD PLAYBOOK" or section name in the display face, separated by electric blue dot or diamond markers. Used as a visual transition between sections.

Examples observed:
- Homepage: "STANDARD PLAYBOOK • STANDARD PLAYBOOK • STANDARD PLAYBOOK"
- Boardroom page: "THE BOARDROOM • THE BOARDROOM • THE BOARDROOM"
- Agency Brain training: "TEAM TRAINING • TEAM TRAINING • TEAM TRAINING" / "10 TRACKS • ALL ROLES"

**Tape Banner Rules:**
- Always diagonal, never horizontal
- Background: black, with white display-face text
- Separator: electric blue dot or diamond (small)
- Used at transition moments — between hero and body, between major page zones
- Not decorative — it's a brand signature. Use it deliberately, not constantly.

> **Confirm-with-design action:** Pull the exact tape angle, height, and marker style from the design source.

---

### 2.4 Visual Motifs

These are the design fingerprints. If a deliverable feels off-brand, it's usually because one of these is missing or used wrong.

**1. Marquee Bands (Tape Banners)** — see 2.3 above. Section dividers, brand reinforcement. Always TWO rotated tickers, alternating ink/paper backgrounds, brand-blue dot separators between text repeats. Phrase rotates by context: "8 WEEK EXPERIENCE", "PRODUCER CHALLENGE", "FORT WAYNE · INDIANA", page-specific section names.

**2. Polaroid Photo Treatment** — photos are framed in a white card with paper-style proportions (~14px padding all sides, 22px on bottom for caption space), tilted 3-11 degrees, with a soft drop-shadow. Snaps to 0° on hover.

Canonical spec:
- White card background
- Padding: ~14px sides/top, 22px bottom (caption space)
- Tilt range: 3° to 11° (vary across clustered polaroids)
- Drop-shadow: `0 30px 60px -20px rgba(0, 0, 0, 0.45)`
- Hover behavior: rotate to 0°

Used for:
- Justin headshots ("Believer" cap photo on homepage)
- Product/app screenshots (AB screens in "SEE THE WORK" section)
- Personal/lifestyle photography

The polaroid is not used for hero photography or full-bleed imagery — only for grouped, smaller, deliberate visual moments. Multiple polaroids can be clustered with varied tilts.

**3. Numbered List Architecture** — programs, features, and inclusion lists are numbered (`01`, `02`, `03`…) with the number set in the body face, weight 600, electric blue. The number is to the left of the item, separated by generous space. This is used for:
- Program lists ("PICK YOUR PATH" — 8 numbered programs)
- Feature/inclusion checklists ("EVERY MONTH. EVERY MEMBER." — 9 numbered items)
- FAQ items ("THAT REVEAL EVERYTHING.")
- Step sequences ("01 / 02 / 03" — three-step explanations)

**4. Slash-Prefix Eyebrows** — section labels are formatted as `/ SECTION NAME` in the body face, weight 600, tracked, all-caps. The slash is a brand signature.

Examples observed: `/ THE MISSION`, `/ PROGRAMS`, `/ CLAIM YOUR SEAT`, `/ THE TRUTH`, `/ THE QUESTIONS`, `/ TRACK MORE`.

**5. Giant CTA / Single-Word Page Closer** — every long-form page ends with one massive imperative word, period-terminated, set in the largest possible display treatment. The whole section is clickable — opens the relevant modal or external link. Ink on paper or paper on ink. This is the brand exit line and a primary conversion surface.

Confirmed word library: `RAISE.`, `TRAIN.`, `JOIN.`, `APPLY.`, `ENROLL.`, `DIRECT.`, `REACH.` Each maps to a specific page/destination:
- RAISE. → homepage closer
- TRAIN. → /training
- JOIN. → /boardroom
- APPLY. → /8-week-apply, /directive
- ENROLL. → enrollment moments
- DIRECT. → /directive
- REACH. → /contact

Use sparingly — one per page, end of page, no exceptions. Always full-bleed. Always clickable.

**6. Two-Line Headline with Blue Accent** — when a headline runs two lines, line 2 often shifts to electric blue for emphasis.

Examples: "EVERY MONTH. **EVERY MEMBER.**" / "IT'S NOT JUST **BUSINESS.**" / "ANY VIDEO. **A TEAM TRAINING.**"

Not every headline uses this pattern. Use when the second line is the punchline.

**7. Massive Pricing Slab** — pricing is treated as a hero moment. The dollar amount is set in the display face at near-mega-display size (~140-180px). Modifier ("/ MONTH" or "/ PRODUCER") is set small below. Adjacent to the slab, a black callout card with a 2-line declaration ("STOP GUESSING. START LEADING.") and a CTA.

**8. STOP X. START Y. Pattern** — visual + verbal pairing of contrasting imperatives. This shows up in headlines and section calls-to-action throughout. It's both a copy pattern (see Voice section) and a visual rhythm.

---

### 2.5 Photography Style

**Subject treatment:**
- Justin photographed in operator/working contexts: hoodies, in alleys, at desks, in studios — never in suit-and-tie corporate poses
- Black-and-white or desaturated treatment for hero photography
- Color allowed in lifestyle/in-context shots (workbook on wood, etc.)

**Composition:**
- Tight crops on faces / mid-body
- Environmental context that reinforces the operator identity
- Never glossy or "stock-photo" looking

**Treatment:**
- Polaroid framing for grouped/smaller shots (see 2.4)
- Full-bleed for hero moments only
- No gradient overlays, no color filters beyond grayscale

---

### 2.6 Section Architecture

**Page rhythm (top to bottom):**
1. Hero section — black or cream canvas, mega display headline, hero photo (often polaroid), 1-2 CTA buttons (filled black + outline)
2. Tape banner — diagonal transition
3. Mission / positioning section — large display headline (often in muted gray treatment), supporting photo or quote
4. Feature/proof section — black canvas, display headline, 3-up or numbered grid
5. Process / explanation section — cream canvas, numbered 01/02/03 layout
6. Programs / pricing section — cream canvas, numbered list with prices and CTAs
7. Closing single-word imperative — full-bleed, mega display
8. Footer — black canvas, newsletter signup, link columns

**Whitespace:**
- 200px+ vertical between major sections (preserved from V1 — Apple-style spacing discipline is a brand element, even with louder typography)
- Headlines have generous space above and below
- Don't compress sections to fit "more on screen" — let the page breathe

**Grid:**
- Container max-width ~1280px on desktop
- 3-column grid for feature sections
- Single-column or 2-column for hero sections
- Mobile: single column, full-bleed display headlines, generous vertical spacing preserved

---

### 2.7 UI Components

**Buttons:**

| Style | Background | Text | Border | Radius | When to use |
|-------|------------|------|--------|--------|-------------|
| Filled Primary | `#000000` | `#FFFFFF` | none | 0px (square) or 4px max | Primary CTAs ("BOOK A CALL", "CLAIM YOUR SEAT") |
| Outline Secondary | transparent | current text color | 1-2px solid current text color | 0px (square) or 4px max | Secondary CTAs ("LEARN MORE") |
| Text-link CTA | none | electric blue | none | n/a | Inline CTAs ("LEARN MORE →") |

- Buttons are SQUARE or near-square — not pill-shaped. The V1 Apple pill button (radius 980px) is RETIRED.
- Button text is ALL CAPS, body face, weight 600, tracked +1px. Sentence-case buttons from V1 are RETIRED.
- Arrow `→` is used after text on links and outline buttons. Filled buttons usually omit it.

**Cards:**
- **Pricing cards** (program list items): minimal — number on left, program name in display face, price on right, CTA button on far right. Hairline divider between items.
- **Feature cards / inclusion lists**: numbered, no card background, separated by hairlines or generous whitespace
- The V1 white-card / glass-card patterns are RETIRED. The new brand uses lists, not cards, for most layouts.

**Dividers:**
- Cream sections: `#D6D2C8` hairline (1px), used between numbered list items
- Black sections: `#1A1A1A` hairline or pure whitespace
- Tape banners function as section-level dividers

**Forms:**
- Black canvas
- Single line input with bottom border only (no full box)
- Submit button: filled primary (black on cream) or outline (white on black)
- Newsletter signup is the canonical form pattern — appears in footer

---

## 3. Brand Voice

The voice direction from V1 holds — operator, not guru; warm authority; faith-integrated; anti-hype; truth as operating system. The signature phrases ("inside of," "the mirror is the mirror," "still love you," "declare it," "person first, producer second," "raise your standard," "let's go") all carry forward unchanged.

**What's intensified in V2:**

The visual louder-where-it-counts pattern shows up in copy as well. The new brand leans harder into:

- **Imperative pairs:** "STOP X. START Y." structure used heavily.
  Observed: "STOP CONSUMING. START BUILDING." / "STOP GUESSING. START LEADING."
- **Two-word declarative payoffs:** Short, punchy, period-terminated.
  Observed: "PROCESS BUILDS PROFITS." / "SOFTWARE IS LEVERAGE." / "RAISE YOUR STANDARD."
- **Single-word imperatives:** Page closers and section punctuation.
  Observed: "RAISE." / "TRAIN." / "JOIN."
- **Truth-naming headlines:** Plain statements that name reality without softening.
  Observed: "THEY CAN'T FAKE THEIR WAY THROUGH." / "IT'S NOT JUST BUSINESS." / "BUILT FOR HOW AGENCIES TRAIN."

**Headline construction patterns (V2):**

1. **Two-line setup-payoff:** Line 1 sets up, line 2 (often blue) lands the punch.
   - "ANY VIDEO. **A TEAM TRAINING.**"
   - "EVERY MONTH. **EVERY MEMBER.**"
   - "IT'S NOT JUST **BUSINESS.**"

2. **Imperative pair:** Two short sentences in opposition.
   - "STOP CONSUMING. START BUILDING."
   - "STOP GUESSING. START LEADING."
   - "SAME LIBRARY. MORE TOOLS THE HIGHER YOU GO."

3. **Truth statement:** Declarative, plain.
   - "TEN TRACKS. ONE LIBRARY."
   - "REAL WORDS. MONDAY MORNING."
   - "NEW LESSONS ON THE REGULAR."

4. **Single-word closer:** Page exit.
   - "RAISE."
   - "TRAIN."
   - "JOIN."

**What's retained from V1 voice:**
- Apple-style copy discipline: short declarative + precise subhead
- Faith-integrated, never performative
- Vulnerable strength — losses + wins
- Warm authority — direct + "still love you"
- Anti-hype — no "10x," no manufactured urgency
- All signature phrases

**What evolves in V2:**
- Headlines run heavier — the visual demands it. A short, punchy, all-caps headline lands differently in the new typography than a sentence-case headline would.
- The **STOP X. START Y.** pattern is now a brand signature. Use it where it earns its place — not in every headline, but for high-conviction moments (CTAs, section closers, feature descriptions).
- The single-word page closer is a brand signature. Every long-form marketing page should end with one.

---

## 4. Messaging Framework

### Hero Headline (Live Site V2)
> *"RAISE YOUR STANDARD"*

### Supporting Headlines (Observed)
- *"Coaching, systems, and software for insurance agency owners who refuse to settle for average."* (hero subhead)
- *"STANDARD PLAYBOOK'S OBSESSION IS BUILDING AGENCIES THAT REFUSE TO SETTLE FOR AVERAGE."* (mission)
- *"PROCESS BUILDS PROFITS."* (proof point)
- *"SOFTWARE IS LEVERAGE."* (Agency Brain intro)
- *"THE OPERATING SYSTEM FOR YOUR AGENCY."* (AB sub-headline)
- *"PICK YOUR PATH."* (programs section)
- *"TRAIN YOUR WHOLE TEAM. ONE PLATFORM."* (Agency Brain training hero)
- *"TEN TRACKS. ONE LIBRARY."* (training feature)
- *"REAL WORDS. MONDAY MORNING."* (training utility)
- *"BUILT FOR HOW AGENCIES TRAIN."* (training fit)
- *"THE BOARDROOM."* (Boardroom hero)
- *"EVERY MONTH. EVERY MEMBER."* (Boardroom inclusions)
- *"IT'S NOT JUST BUSINESS."* (Boardroom positioning)
- *"STOP GUESSING. START LEADING."* (Boardroom CTA card)

### Headline Formula (V2)
Pick one of four patterns: two-line setup-payoff, imperative pair, truth statement, or single-word closer. Period at the end, always. ALL CAPS, always. The display face does the heavy lifting — copy stays short.

### Primary CTAs (V2 button text)
1. "BOOK A CALL" — top of funnel
2. "LEARN MORE" — secondary, outline
3. "CLAIM YOUR SEAT" — Boardroom enrollment
4. "JOIN →" — direct enrollment
5. "APPLY" — Directive / Partnership / 8-Week
6. "START →" — 6-Week Producer Challenge entry
7. "CHOOSE [TIER]" — Agency Brain tier selection (Choose Core / Plus / Pro)
8. "SUBSCRIBE" — newsletter

All CTAs in V2 are ALL CAPS, body face, weight 600, tracked. The V1 sentence-case button rule is RETIRED.

---

## 5. Programs & Products (Updated Structure from Site)

The "PICK YOUR PATH" section on the new homepage shows the canonical product order:

| # | Program | Tier | Price | CTA |
|---|---------|------|-------|-----|
| 01 | The Boardroom | Membership | $299/mo | JOIN → |
| 02 | 8 Week Experience | Managed Training | Apply | LEARN MORE |
| 03 | 6 Week Producer Challenge | Team Sprint | $295/producer | START → |
| 04 | The Directive | 1:1 Coaching | Application Only | APPLY → |
| 05 | Partnership | 1:1 Coaching | (Sold Out) | — |
| 06 | Agency Brain Core | Software Foundation | $299/mo | CHOOSE CORE |
| 07 | Agency Brain Plus | Full Software Access | $449/mo | CHOOSE PLUS |
| 08 | Agency Brain Pro | Top Tier | $599/mo | CHOOSE PRO |

> **Confirm-with-Justin action:** This pricing is observed from the screenshot. Confirm the current canonical pricing — the safety rule is "never change pricing without approval," so verify before this guide goes operational.

---

## 6. Application Examples

### 6.1 Landing page hero (cream canvas)
- Eyebrow: `/ THE MISSION` (slash prefix, body face, tracked, all-caps)
- Headline: "RAISE YOUR STANDARD" (display face, all-caps, weight 900, ~120px)
- Sub-headline: "Coaching, systems, and software for insurance agency owners who refuse to settle for average." (body face, 17px, weight 400)
- CTAs: "LEARN MORE" (outline) + "BOOK A CALL" (filled black)
- Hero image: polaroid-framed photo of Justin (Believer cap), tilted 3-5°

### 6.2 Section transition
- Diagonal tape banner: black background, white display face text repeating "STANDARD PLAYBOOK" with electric blue dots between repeats

### 6.3 Numbered program list (cream canvas)
- Eyebrow: `/ PROGRAMS`
- Headline: "PICK YOUR PATH." (display face, all-caps, weight 800)
- Sub-headline: short body line
- List: 8 numbered items, hairline dividers, name in display face, price right-aligned, CTA button right-aligned
- "MOST POPULAR" tag in electric blue, set on the highest-converting tier

### 6.4 Page closer
- Full-bleed black section
- Single word, mega display face, white: "RAISE." (or relevant imperative)
- Below: footer (newsletter signup + link columns)

---

## 7. Migration & Sequencing

**Files / surfaces that need to be re-skinned to V2 once the new site is live:**
- The Mirror workbook covers (currently V1 dark theme — would need cream/black update if rebrand carries through to the workbook)
- The Mirror one-pagers (light + dark)
- All Boardroom / Directive / 8-Week / Formula sales pages
- Agency Brain marketing pages (the live AB product UI is a separate system and may not need to match the marketing brand exactly)
- Slide decks
- Email templates (Brevo)
- Social content templates
- Lead magnet PDFs

**Cross-system tension to resolve:**
- Agency Brain (the product) is built in a different visual system than the new SP marketing brand. Decision needed: does AB product UI adopt V2, stay on its current system, or develop its own consistent-but-distinct visual language under the SP umbrella?
- Brand-guide.md (V1) says it was rewritten in April 2026 to match the live site. V2 will need to replace it once the rebrand goes live. Until then, V1 stays canonical for any work touching the current site.

---

## 8. Open Questions

The handoff doc resolved most V2 questions. These remain open and matter for upcoming work:

**Application questions:**
1. **Lead magnet pages (/mirror)** — does this slot into the bold system as another `Bold*.tsx` page, or get treated as a simplified/standalone surface? My recommendation: full bold treatment (BoldNav + hero + bold list rows for the 32 questions + giant CTA closer).
2. **Newsletter / email capture infrastructure** — currently NOT implemented anywhere on the site (per handoff doc). The Mirror would be the first true email-capture surface beyond the strategy-call form. Need to wire to Supabase table or external list (Mailchimp / GHL / Beehiiv).
3. **Document brand** — does the heavy display typography carry into PDFs, workbooks, slide decks? Or is there a quieter document treatment?
4. **The Mirror workbook (existing PDF)** — re-skin to bold V2 (paper background, ink type, Anton headlines), or treat as a separate sub-brand product?
5. **Email templates (Brevo)** — how does V2 typography render in email where Google Fonts can't be guaranteed? Web-safe fallbacks.
6. **Social content templates** — bold treatment on 1080×1080 IG square or 9:16 Reel cover. Not yet templated.
7. **Agency Brain product UI** — separate visual system from the marketing brand. Decision needed: adopt V2, stay distinct, or develop sibling system.

**Resolved by `BOLD_REBRAND_HANDOFF.md`:**
- ~~Display face~~ → Anton (with Archivo Black, Oswald, Impact fallbacks)
- ~~Body face~~ → Inter
- ~~Exact hex values~~ → ink `#0A0A0B`, paper `#F4F2EE`, blue `#2080FF`, red `#C8102E`
- ~~Polaroid frame dimensions~~ → ~14px padding, 22px bottom, 3-11° tilt, drop-shadow `0 30px 60px -20px rgba(0,0,0,0.45)`, snaps to 0° on hover
- ~~Pricing accuracy~~ → AB Core $299, Plus $449, Pro $599 confirmed; Boardroom $299/mo confirmed
- ~~Logo treatment~~ → SP word logo, paper bar with ink border, Facebook + LinkedIn icons in footer
- ~~Patterns / motifs~~ → 10 recurring sections codified (BoldNav, Hero, Marquee bands, Bold list rows, Polaroid screenshots, Black band sections, Display numerals grid, Giant CTA section, Bold footer, Mobile sticky CTA)

---

## 9. Codebase Reference

The canonical source of truth for V2 specs is the live codebase, NOT this doc. If you find a discrepancy, the code wins.

**Repo:** `/Users/standardmacbook/officialstandardplaybooksite`
**Local dev:** `npm run dev` → `localhost:8080`
**Reference page for new builds:** `src/pages/BoldMockup.tsx` (homepage — the template for any new bold page)
**Routes file:** `src/App.tsx`
**Color/font constants:** repeated in every `Bold*.tsx` file (look for `const ink`, `const paper`, `const blue`, `const display`, `const body`)
**Modal shell:** `src/components/ui/dialog.tsx` (patched with bold close button)
**Already-bold modals:** `StandardFitModal`, `BookingOnboardingForm`, `DirectiveApplicationModal`

**Sister repo (cross-references):** `/Users/standardmacbook/agencybrain`
- AB pricing source of truth: `src/components/marketing/AgencyBrainPricing.tsx`
- Stripe price IDs: `supabase/functions/_shared/agencyBrainPlans.ts`
- Membership entitlements: `src/utils/membershipEntitlements.ts`

**Bold pages currently shipped (11 routes):**
`/`, `/bold`, `/sales-experience`, `/8-week`, `/8-week-apply`, `/directive`, `/boardroom`, `/about`, `/the-challenge`, `/training`, `/contact`

**Pages NOT yet rebranded (pending bold conversion):**
`/owner-challenge`, `/producer-power-up`, `/PPUC`, `/callscoring`, `/formulaai`, `/decision`, `/partnership`, `/ai-walk-through`, `/fit`, `/websites`, `/blog`, `/blog/:slug`, `/links`, `/privacy`, `/terms`, `/thank-you`, `/challenge-thank-you`, `/welcometocoaching`, `/welcomeboardroom`, `/appinfo`, `/app`, `/presentation`
