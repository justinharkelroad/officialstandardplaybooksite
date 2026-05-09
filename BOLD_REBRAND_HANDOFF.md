# Bold Rebrand — Handoff Doc

**Last updated:** 2026-05-09
**Repo:** `/Users/standardmacbook/officialstandardplaybooksite`
**Sister repo (referenced for content/Stripe/training structure):** `/Users/standardmacbook/agencybrain`

This doc is the bridge between the existing rebrand work and a fresh context window. Read it first.

---

## TL;DR

The marketing site has been progressively re-skinned from an Apple-style cinematic aesthetic → a **bold editorial / Dom Pérignon-inspired** aesthetic across **9 pages**. The original Apple-style files are preserved at `/legacy-*` routes for revert/comparison. The bold pages share a small visual system (paper background, ink type, brand-blue accents, display typography in Anton, Inter for body, hairline rules, marquee tickers, polaroid photo treatments).

---

## What got rebranded

### Live bold routes

| URL | Source file | Status |
|---|---|---|
| `/` | `src/pages/BoldMockup.tsx` | Bold |
| `/bold` | `src/pages/BoldMockup.tsx` | Alias of `/` |
| `/sales-experience` | `src/pages/BoldSalesExperience.tsx` | Bold |
| `/8-week` | `src/pages/BoldSalesExperience.tsx` (autoOpenBooking) | Bold |
| `/8-week-apply` | `src/pages/BoldEightWeekApply.tsx` | Bold |
| `/directive` | `src/pages/BoldDirective.tsx` | Bold |
| `/boardroom` | `src/pages/BoldBoardroom.tsx` | Bold |
| `/about` | `src/pages/BoldAbout.tsx` | Bold |
| `/the-challenge` | `src/pages/BoldProducerChallenge.tsx` | Bold |
| `/training` | `src/pages/BoldTraining.tsx` | Bold (mirrors AgencyBrain training structure with interactive demos) |
| `/contact` | `src/pages/BoldContact.tsx` | Bold |

### Legacy fallback routes

Every redesigned page is preserved under a `/legacy-*` path. Use these to compare against the original Apple-style design or revert in `App.tsx`:

- `/apple` → original homepage
- `/apple-sales-experience` → original 8-week page
- `/legacy-directive`
- `/legacy-boardroom`
- `/legacy-about`
- `/legacy-the-challenge`
- `/legacy-training`
- `/legacy-contact`
- `/legacy-8-week-apply`
- `/legacy` → original `NewLanding.tsx`

### Pages NOT yet rebranded

These still render in the old Apple/Rajdhani style and should be redesigned next if the bold rollout continues:

- `/owner-challenge` — `OwnerChallenge.tsx`
- `/producer-power-up` — `ProducerPowerUp.tsx` (sister page to `/the-challenge`, shares Producer* sections)
- `/PPUC` — `ProducerChallengeLanding.tsx`
- `/callscoring` — `CallScoring.tsx`
- `/formulaai` — `FormulaAI.tsx`
- `/decision` — `Decision.tsx`
- `/partnership` — `Partnership.tsx`
- `/ai-walk-through` — `AIWalkthrough.tsx`
- `/fit` — `StandardFit.tsx`
- `/websites` — `Websites.tsx`
- `/blog`, `/blog/:slug` — Blog index + post pages
- `/links` — `Links.tsx`
- `/privacy`, `/terms`, `/thank-you`, `/challenge-thank-you`, `/welcometocoaching`, `/welcomeboardroom`
- `/appinfo`, `/app` — App access pages
- `/presentation` — `Presentation.tsx`

---

## Bold visual system (the in-code values)

These are constants repeated in every `Bold*.tsx` file. Find/replace them globally if the canonical brand guide specifies different values (see `V2_BRAND_GUIDE_QUESTIONNAIRE.md`).

```ts
const display = '"Anton", "Archivo Black", "Oswald", Impact, sans-serif';
const editorial = '"Archivo Black", "Anton", Impact, sans-serif';
const body = 'Inter, -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif';

const ink = '#0A0A0B';     // near-black for type/borders
const paper = '#F4F2EE';   // warm off-white background
const blue = '#2080FF';    // brand blue, used for accents only
const red = '#C8102E';     // alert red (on Fit Check / Problem blocks only)
```

**Fonts loaded** in `index.html` via Google Fonts:
- Anton, Archivo Black, Bebas Neue (display options)
- Oswald, Rajdhani (legacy display)
- Inter (body)

### Recurring sections / patterns

Every bold page is composed of some subset of these:

1. **`BoldNav`** — sticky paper bar, ink border, SP word logo left, uppercase nav links centered, hamburger on mobile.
2. **Hero** — eyebrow ("/ Section name"), staircase headline (3-line indented display type with one line in brand blue), sub-copy + 2 CTAs (outlined + filled).
3. **Marquee bands** — two rotated tickers, alternating ink/paper backgrounds, brand-blue dot separators. Phrase rotates between contextual phrases ("8 WEEK EXPERIENCE", "PRODUCER CHALLENGE", "FORT WAYNE · INDIANA").
4. **Bold list rows** — replaces card grids: numerals (`01-XX`) · big display title · description · `+` toggle (for expandable rows). Hairline borders, hover bg shift.
5. **Polaroid screenshots** — white card, ~14px padding, 22px bottom for caption, tilted 3-11°, drop-shadow `0 30px 60px -20px rgba(0,0,0,0.45)`, snaps to 0° on hover.
6. **Black band sections** — full-width ink background with paper text, used for thematic punctuation (Promise, Mission, Numbers, Outcome, Plans).
7. **Display numerals grid** — giant Anton numbers (clamp 64-160px) with editorial labels for stats (8 / 32+ / 100 / etc.).
8. **Giant CTA section** — single huge word ("RAISE.", "TRAIN.", "JOIN.", "APPLY.", "ENROLL.", "DIRECT.", "REACH.") on full-bleed background. The whole section is clickable — opens the relevant modal or external link.
9. **Bold footer** — 4-col grid: brand block (logo + tagline + Facebook/LinkedIn icons) on left col-span-2 + Programs column + Company column + bottom-row centered copyright.
10. **Mobile sticky CTA** — black bar at the bottom on mobile with paper-bg primary action button.

### Modals (Bold-styled)

The shared shell at `src/components/ui/dialog.tsx` was patched once: close button (top-right ×) is now sharp 32×32 with 1.5px ink border, ink color, fills black/paper on hover. **All modals across the site inherit this**, including any not-yet-redesigned Apple pages.

The form bodies were redesigned for the two modals used by the bold pages:

- **`StandardFitModal`** + **`BookingOnboardingForm`** (`src/components/`) — strategy-call lead form. Two steps. Used everywhere there's a "Book a Call" CTA. All Supabase autosave, FB pixel `Lead` event, and Acuity redirect logic preserved.
- **`DirectiveApplicationModal`** — Apply for The Directive. Single form. All `directive_applications` insert + `send-directive-notification` invoke logic preserved.

The other modals (`BookingModal`, `CheckoutModal`, `JotFormModal`, `PartnershipSoldOutModal`, `WebsitesInquiryModal`, `GHLFormPopup`, `VideoModal`) were **not** restyled — they're not surfaced from any bold page yet. Restyle as needed when those pages are redesigned.

### Training page interactive demos

`/training` includes three custom-built animated demos that mirror AgencyBrain's training page (intentionally — Justin specified same animations, same structure, just bold styling):

- `src/components/training/VideoArchitectDemo.tsx` — Video → arrow → framework reveal sequence
- `src/components/training/ComprehensionDemo.tsx` — Typing answer → evaluating → rubric bars → score count-up → PASS badge → feedback
- `src/components/training/ContentGeneratorDemo.tsx` — Topic typing → button pulse → lesson typing → tab switch → quiz cards stagger in

All three: replay-on-scroll-back, respect `prefers-reduced-motion`, white card / ink border / paper inner panels, brand-blue accents.

### Newsletter form

**Removed.** Was a design placeholder with no backend wiring. Replaced across all 8 BoldFooter blocks with the brand info (SP word logo + tagline "High-performance coaching for insurance agency owners. Raise your standard and live the playbook." + Facebook + LinkedIn icons from `lucide-react`). Newsletter capture is **not currently implemented anywhere** — would need a Supabase table or external list (Mailchimp/ConvertKit/GHL/Beehiiv) to actually capture emails.

---

## Live functional integrations preserved across the rebrand

- ✅ **Stripe (Boardroom)** — `https://buy.stripe.com/aFa9AT4KOayO0hycG84Vy0l`
- ✅ **Stripe (AgencyBrain Core/Plus/Pro)** — via `create-agencybrain-checkout` Supabase function in the agencybrain repo. Plan IDs verified: `agencybrain_core` ($299), `agencybrain_plus` ($449), `agencybrain_pro` ($599). Stripe price IDs hardcoded in `/Users/standardmacbook/agencybrain/supabase/functions/_shared/agencyBrainPlans.ts`.
- ✅ **FastPayDirect (Boardroom alt CTA)** — `https://link.fastpaydirect.com/payment-link/68371b280a5741f8835218c8`
- ✅ **FastPayDirect (8-Week PIF $4500 + Weekly $625)** — preserved on Sales Experience page
- ✅ **createthestandard.com (Producer Challenge $299)** — `https://createthestandard.com/credit-card-page`
- ✅ **Acuity (Standard Fit booking)** — `https://AGENCYCOACHING.as.me/standardfit`
- ✅ **Wistia testimonial video** — Dan Westrick `p5r3aelfj0` (Sales Experience + 8-Week Apply)
- ✅ **Wistia walkthrough video** — Producer Challenge `1bz6nrl5ip` (vertical 9:16)
- ✅ **YouTube videos** — Boardroom walkthrough `36Ns-DrlHEA`, Boardroom pillars `jFDqWyLuwHI` `qUWOzQF1Xrg` `RMsIHtsv2ak`, Directive overview `GWA98sEVrVE`, Challenge explainer `1NzNXlsGOQs`
- ✅ **Vimeo VSL** — 8-Week Apply `1184535551`
- ✅ **Supabase autosave** — `booking_leads` table (BookingOnboardingForm session resume)
- ✅ **Supabase insert** — `directive_applications` table (DirectiveApplicationModal)
- ✅ **Meta Pixel `Lead` events** — fired on form completion (preserved in BookingOnboardingForm)
- ✅ **Email notifications** — `send-booking-notification`, `send-directive-notification` Supabase functions

---

## Outstanding decisions

1. **Brand guide canonical values** — V2 brand specs are still being collected from the design source. See `V2_BRAND_GUIDE_QUESTIONNAIRE.md` (alongside this file) for the open questions. Until those answers come back, the in-code values are estimates pulled from screenshot analysis.

2. **Newsletter capture** — pull a destination (Supabase table, Mailchimp, GHL, Beehiiv, etc.) before re-introducing the signup form. Currently no signup CTA exists anywhere on the site.

3. **Top nav** — the bold homepage nav reads "Programs / Software / 8-Week / Training / Contact". An "About" anchor link existed previously but was removed when the home page was reworked. Decide whether to restore an `/about` link in the top nav.

4. **Pages listed under "NOT yet rebranded" above** — prioritize which to redesign next if the bold rollout is going to ship the entire site. The biggest remaining footprints are `/owner-challenge`, `/producer-power-up`, and `/callscoring`.

5. **`DESIGN.md`** at the repo root is the V1 Apple-style brief and is now stale. Should be retired or rewritten against the bold V2 once the brand guide questionnaire is filled in.

---

## How to start a new context window

Suggested cold-open prompt:

> Read `BOLD_REBRAND_HANDOFF.md` and `V2_BRAND_GUIDE_QUESTIONNAIRE.md` in the repo root. We're mid-rebrand from an Apple-style aesthetic to a bold editorial aesthetic. Current state: 11 routes redesigned (homepage, sales experience, 8-week-apply, directive, boardroom, about, the-challenge, training, contact, plus their aliases). I want to continue with [TASK].
>
> Run `npm run dev` if the dev server isn't already running and confirm `localhost:8080/` loads the bold homepage.

Common tasks they'll likely ask for next:

- "Redesign `/owner-challenge` in the bold style" → follow the same pattern as `BoldDirective.tsx` (single-program landing) or `BoldProducerChallenge.tsx` (multi-section program landing)
- "Wire the newsletter signup to [destination]" → re-add the form block to `BoldFooter`, hit the destination from a Supabase Edge Function or directly via `fetch`
- "Update X copy / X feature / X bullet" → grep across `Bold*.tsx` for the existing string and edit in place
- "Redo the brand colors with the canonical values" → find/replace the `ink`/`paper`/`blue` constants across `src/pages/Bold*.tsx` and `src/components/training/*.tsx`

---

## File map

```
src/
├── pages/
│   ├── BoldMockup.tsx           ← homepage / `/`
│   ├── BoldSalesExperience.tsx  ← /sales-experience, /8-week
│   ├── BoldEightWeekApply.tsx   ← /8-week-apply (uses MinimalFooter, not BoldFooter)
│   ├── BoldDirective.tsx        ← /directive
│   ├── BoldBoardroom.tsx        ← /boardroom
│   ├── BoldAbout.tsx            ← /about
│   ├── BoldProducerChallenge.tsx ← /the-challenge
│   ├── BoldTraining.tsx         ← /training (with 3 demo components)
│   ├── BoldContact.tsx          ← /contact
│   ├── AppleMockup.tsx          ← legacy /apple
│   ├── SalesExperience.tsx      ← legacy /apple-sales-experience
│   ├── EightWeekApply.tsx       ← legacy /legacy-8-week-apply
│   ├── Directive.tsx            ← legacy /legacy-directive
│   ├── Boardroom.tsx            ← legacy /legacy-boardroom
│   ├── About.tsx                ← legacy /legacy-about
│   ├── TheChallenge.tsx         ← legacy /legacy-the-challenge
│   ├── TeamTraining.tsx         ← legacy /legacy-training
│   ├── Contact.tsx              ← legacy /legacy-contact
│   └── ... (other unredesigned pages)
├── components/
│   ├── training/                ← Bold-styled animated demos
│   │   ├── VideoArchitectDemo.tsx
│   │   ├── ComprehensionDemo.tsx
│   │   └── ContentGeneratorDemo.tsx
│   ├── BookingOnboardingForm.tsx ← Bold-styled (used by StandardFitModal)
│   ├── StandardFitModal.tsx      ← Bold-styled
│   ├── DirectiveApplicationModal.tsx ← Bold-styled
│   ├── ui/dialog.tsx             ← Patched: bold close button
│   └── ... (other components, not restyled)
├── App.tsx                      ← Route table
└── ...

BOLD_REBRAND_HANDOFF.md          ← This file
V2_BRAND_GUIDE_QUESTIONNAIRE.md  ← Open brand specs to confirm with designer
DESIGN.md                        ← V1 Apple-style brief (now stale)
index.html                       ← Google Fonts (Anton, Archivo Black, Bebas Neue, Oswald, Rajdhani, Inter)
```

---

## Quick reference: routes table

```ts
// src/App.tsx — current
<Route path="/" element={<BoldMockup />} />
<Route path="/bold" element={<BoldMockup />} />
<Route path="/apple" element={<AppleMockup />} />
<Route path="/sales-experience" element={<BoldSalesExperience />} />
<Route path="/8-week" element={<BoldSalesExperience autoOpenBooking />} />
<Route path="/apple-sales-experience" element={<SalesExperience />} />
<Route path="/8-week-apply" element={<BoldEightWeekApply />} />
<Route path="/legacy-8-week-apply" element={<EightWeekApply />} />
<Route path="/directive" element={<BoldDirective />} />
<Route path="/legacy-directive" element={<Directive />} />
<Route path="/boardroom" element={<BoldBoardroom />} />
<Route path="/legacy-boardroom" element={<Boardroom />} />
<Route path="/about" element={<BoldAbout />} />
<Route path="/legacy-about" element={<About />} />
<Route path="/the-challenge" element={<BoldProducerChallenge />} />
<Route path="/legacy-the-challenge" element={<TheChallenge />} />
<Route path="/thechallenge" element={<Navigate to="/the-challenge" replace />} />
<Route path="/training" element={<BoldTraining />} />
<Route path="/legacy-training" element={<TeamTraining />} />
<Route path="/contact" element={<BoldContact />} />
<Route path="/legacy-contact" element={<Contact />} />
<Route path="/legacy" element={<NewLanding />} />
// ...all other routes unchanged
```

---

## Cross-repo reference: where copy and Stripe price IDs come from

The agencybrain repo at `/Users/standardmacbook/agencybrain` is the source of truth for:

- **AgencyBrain pricing copy** — `src/components/marketing/AgencyBrainPricing.tsx` (Core/Plus/Pro tiers, taglines, eyebrow labels, bullet lists). Must stay in sync with `BoldMockup.tsx` programs section.
- **Stripe price IDs + plan metadata** — `supabase/functions/_shared/agencyBrainPlans.ts`
- **Training page structure** — `src/pages/TeamTraining.tsx` + `src/components/marketing/training/*.tsx`. The bold `/training` page mirrors this structure with bold styling.
- **Membership entitlements / call quotas** — `src/utils/membershipEntitlements.ts` (20 / 50 / 100 calls, $299 / $449 / $599)

Keep these in sync if the AgencyBrain pricing or training structure changes.
