

## Offer Section Overhaul for Conversion Clarity

### What Changes

Replace the current "Choose Your Path" section (3 flip-cards + separate Producer Challenge banner) with a clean, scannable 4-card grid. No flip animations, no video backgrounds in cards — just clear offer hierarchy.

### New Section Structure

**Header**
- Headline: "Pick your entry point. Raise the standard."
- Subhead: "No contracts. Just the right move for where your agency is right now."

**4 Cards in a 2x2 grid (stacking to 1-column on mobile)**

| Card | Label | Price | CTA | Action |
|------|-------|-------|-----|--------|
| The Boardroom | MEMBERSHIP | $299/mo | Join The Boardroom | Opens Stripe link in new tab |
| 6 Week Producer Challenge | TEAM EXECUTION SPRINT | $299 per producer | Start the 6 Week Challenge | Links to myagencybrain.com/six-week-challenge |
| 8 Week Experience | MANAGER TRAINING | (no price shown) | Book a Strategy Call | Opens existing BookingModal |
| The Directive | PRIVATE COACHING | Application Only | Apply for Directive | Opens existing DirectiveApplicationModal |

The 6 Week Challenge card gets small support text below CTA: "Strong first step before Boardroom, 8 Week Experience, or Directive."

**Bottom Strip**
- "Not sure where to start?"
- "Book a quick strategy call. We'll map your best first move."
- CTA: "Book Your Strategy Call" (opens BookingModal)

### What Gets Removed
- Flip-card behavior (front/back faces, 3D perspective)
- Video backgrounds on offer cards
- Sound toggle buttons
- "See What's Included" flip triggers
- Separate ProducerChallengeBar section (challenge is now integrated as Card 2)
- The old OffersGrid component (already not used on this page, but stays in codebase for other pages)

### Card Design
- Dark card with subtle border (`border-white/10`, hover `border-blue-500/40`)
- Label tag at top (small uppercase, blue-400)
- Title in Oswald bold
- One-liner description
- 3 bullet points with blue checkmark icons
- Price line (or "Application Only")
- Full-width rounded CTA button (white bg, black text)
- Consistent padding and spacing across all cards

### Technical Details

**File: `src/pages/NewLanding.tsx`**
1. Replace the `offers` array and `OfferLadderSection` component with a new clean card-based section
2. Remove the `ProducerChallengeBar` component entirely
3. Import `BookingModal` for the 8 Week and bottom strip CTAs
4. Keep `DirectiveApplicationModal` for the Directive card
5. Remove video refs, muted/flipped state management, and flip logic
6. Update the page composition: remove `<ProducerChallengeBar />` from the render

**Placeholders resolved:**
- Challenge URL: `https://myagencybrain.com/six-week-challenge` (external link, new tab)
- 8 Week Price: Not shown
- Directive Price: "Application Only"
- Strategy Call: Uses existing `BookingModal` component

### Mobile Behavior
- Cards stack single-column
- Tight padding (p-6 on mobile, p-8 on desktop)
- Text sizes scale down appropriately
- No horizontal overflow

