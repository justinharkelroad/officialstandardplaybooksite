
## Full-Width Producer Challenge Banner with Flip Card

### What You'll Get

A new full-width banner section placed below the three offer cards and above the footer on the `/new` page. Here's the layout:

**Front Face (Banner):**
- Full-width dark card/bar spanning the page
- Background video playing (same style as the offer cards -- autoplaying, muted, looping)
- Video container is cropped to roughly 60% of normal video height using `object-cover` with `object-position: top` so the top/center of the video is visible, not letterboxed
- Overlaid with a dark gradient so text is readable
- Content overlaid: tag line ("THE CHALLENGE"), title ("6 Week Producer Challenge"), a short subtitle ("Transform your producer from reactive chaos to systematic execution -- in 42 days."), price ("$299 / per producer"), and a "Buy a Seat" button linking to the existing checkout URL (`https://createthestandard.com/credit-card-page`)
- A "See What's Included" flip trigger (same blue text link style as the offer cards)
- Sound toggle button in the corner

**Back Face (Flip Card):**
- Same dimensions as the front, dark bg with blue accent border
- Title + "What's Included" header
- Benefits list with check icons:
  - 30 Daily Action Reports Sent to You
  - 6 Weekly Discovery Stack Reflections
  - Core 4 Framework (Body, Being, Balance, Business)
  - Full App Access During Challenge
  - Daily Accountability System
  - Sales Process Training Modules
  - Direct Visibility into Producer Growth
  - Rolling Enrollment (Sign Up Friday, Start Monday)
- "Buy a Seat" button repeated at the bottom
- Flip-back button (rotate icon) in the corner

### Technical Details

**File modified:** `src/pages/NewLanding.tsx` only

1. Add a new `ProducerChallengeBar` component inside `NewLanding.tsx` (below `OfferLadderSection`)
2. Uses the same flip-card pattern already established (perspective, `transform-style: preserve-3d`, `rotateY(180deg)`, `backface-visibility: hidden`)
3. Video container uses `h-[280px] md:h-[360px]` (roughly 60% of a 16:9 video height) with `object-cover` and `object-position: top` to crop and show the upper portion
4. Reuses the existing video from the challenge page or a placeholder -- will use the same Wistia/YouTube embed approach or an mp4 if one exists in storage
5. Renders between `<OfferLadderSection />` and the footer in the `NewLanding` component
6. State: single boolean `flipped` for the flip toggle
7. "Buy a Seat" opens the existing checkout link in a new tab
