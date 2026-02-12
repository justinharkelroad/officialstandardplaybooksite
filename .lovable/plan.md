

## Rebuild: 8-Week Sales Experience Page as a Scrollytelling Funnel

### Philosophy

Strip the page down to the same architecture as `/new`: a single-file component with a sticky scrollytelling hero, followed by lean scroll sections. One idea per screen. No grids. No icon cards. The goal is emotional momentum toward a single action: book the call.

### Page Structure (8 Beats)

```text
SCROLLYTELLING HERO (sticky video, ~500vh)
  |
  |-- Fade 1: Hook + CTA
  |       "Stop managing chaos. Start running a system."
  |       [BOOK YOUR STRATEGY CALL] button right here
  |
  |-- Fade 2: The Problem (one sentence)
  |       "Great month. Bad month. Great month. Bad month."
  |       "That's not a sales team. That's a coin flip."
  |
  |-- Fade 3: The Promise
  |       "In 8 weeks, you'll have certainty."
  |       "A process. A scorecard. A rhythm. A guarantee."
  |
  |-- Fade 4: The Guarantee
  |       "If you don't have a clear path, I'll give you
  |        your money back. And work for free until you do."
  |
POST-HERO SECTIONS (normal scroll, Reveal animations)
  |
  |-- Section: Agency Brain Screens (carousel or stacked)
  |       Show 4-5 key screenshots from the app that are
  |       used inside the 8-week program:
  |       - Sales Dashboard (daily tracking)
  |       - Call Scoring (quality control)
  |       - Target Setting (weekly goals)
  |       - Habit Tracking (Core 4 discipline)
  |       Each with a one-line caption, no cards/grids
  |
  |-- Section: Success Story
  |       Dan Westrick video (vertical, Wistia embed)
  |       One quote line: "He paid attention to my culture first."
  |
  |-- Section: What's Included (simplified)
  |       Not a 9-item checklist. Instead, 3-4 bold lines:
  |       "8 weekly coaching calls. Graded calls every week.
  |        Your sales process, documented. Your accountability
  |        system, deployed."
  |
  |-- Section: Final CTA
  |       Same guarantee text repeated
  |       [BOOK YOUR STRATEGY CALL] button
  |
  |-- Footer
```

### What Gets Cut

- **SalesThreePillars, SalesPillarOne, SalesPillarTwo, SalesPillarThree**: All four sections teaching the framework in detail. The scrollytelling hero replaces this with emotional shorthand ("A process. A scorecard. A rhythm."). The detail belongs on the call, not the page.
- **SalesProblem (4 icon cards)**: Replaced by one fade with two punchy lines.
- **SalesBoxedFeatures (9-item checklist)**: Condensed to 3-4 bold statements.
- **SalesTransformation (3 outcome cards)**: The transformation IS the guarantee. No need for a separate section.
- **Navigation bar**: Removed (single-action page principle from the landing page design system).

### What Stays (Simplified)

- **Video**: The YouTube hero video moves to the scrollytelling background (or becomes a looping ambient clip like `/new` uses). The full testimonial video stays in the success story section.
- **Guarantee**: Stays but appears twice -- once in the hero fades, once at the bottom.
- **Agency Brain screenshots**: New addition showing how the tech supports the 8-week program.
- **Success Story**: Stays, simplified to video + one line.

### Technical Implementation

**File: `src/pages/SalesExperience.tsx`**

Complete rewrite as a single-file component following the exact same pattern as `NewLanding.tsx`:

1. **ScrollytellingHero component** (internal to the file)
   - `useScroll` + `useTransform` with the same clamped `lerp` helper
   - Background: either the existing YouTube video converted to a looping `.mp4`, or one of the existing Supabase-hosted videos
   - 4 fade segments with opacity transforms at non-overlapping scroll ranges
   - Fade 1 includes a `pointer-events-auto` CTA button (the only interactive element in the hero)

2. **AgencyBrainShowcase component** (internal)
   - Reuses the same Embla carousel from `NewLanding.tsx` but with a curated subset of `brainCards` (4-5 cards relevant to the 8-week program)
   - OR: a simpler stacked layout with `Reveal` animations showing one screenshot per scroll beat

3. **SuccessStory component** (internal)
   - Wistia embed centered, with one `Reveal`-animated quote line above

4. **IncludedSection component** (internal)
   - 3-4 bold text lines with `Reveal` animations, no cards or grids

5. **FinalCTA component** (internal)
   - Guarantee text + BookingModal button

6. **Sticky mobile CTA** at the bottom (already exists, keep it)

### Key Differences from /new

- The CTA button appears in Fade 1 (not buried in offer cards)
- The guarantee is a scroll beat, not a separate FAQ section
- Agency Brain screens are shown as "this is what you'll use" proof, not a feature tour
- No offer ladder (this IS the offer -- the 8-week program)
- The existing components (SalesPillarOne, SalesPillarTwo, etc.) remain in the codebase but are no longer imported -- they can be removed later if desired

### Files Changed

- **`src/pages/SalesExperience.tsx`** -- Full rewrite as single-file scrollytelling page
- No new files needed (all components are internal to the page file, matching the `/new` pattern)
- Existing section components are untouched (just no longer imported)

