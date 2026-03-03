

## Problem Diagnosis

I verified in the browser that clicking the hero "Book Your Strategy Call" button on `/sales-experience` does NOT open the Standard Fit modal, even though the browser reports the click as "successful." The same pattern works perfectly on the homepage.

**Root cause**: The scrollytelling architecture on `/sales-experience` stacks 5 `absolute inset-0` fade layers inside a `position: sticky` container. Even with `pointer-events: none` on some layers, the overlapping layers swallow real browser clicks before they reach the button. The `useTransform`-based dynamic pointer-events approach is unreliable because:
1. Framer Motion's `useTransform` for `pointerEvents` applies as an inline style on a `motion.div`, but the timing of style application during scroll can lag behind actual pointer hit-testing
2. Other fade layers (Fade 2, 3, 4) that have `pointer-events-none` via className are still present as `absolute inset-0` DOM elements — browsers can still intercept events on these in certain scroll states

**Why the homepage works**: On the homepage, the "Book a Discovery Call" button is a native `<button>` with `pointer-events-auto` inside a layer that uses `pointer-events-none` via **className** (not dynamic motion style). The modal is rendered inline. But more importantly, the homepage layers are simpler and don't have 5 competing absolute overlays.

## Plan: Complete Architecture Change for CTA Buttons

**Strategy**: Remove the CTA button from inside the scrollytelling sticky container entirely. Instead, place a **fixed-position CTA** that sits above the scrollytelling section with a proper `z-index`, completely independent of the fade layer stack.

### Changes to `src/pages/SalesExperience.tsx`:

1. **Remove the button from Fade 1** (lines 125-129) — delete the `pointer-events-auto` div and Button from inside the fade layer. Keep the text content.

2. **Add a fixed/absolute CTA outside the sticky container** — Place the "Book Your Strategy Call" button and `StandardFitModal` as a sibling of the sticky `<div>`, positioned with CSS `position: absolute` at the bottom-center of the visible area, with `z-index: 50` so it sits above all fade layers. Use scroll-driven opacity to show/hide it in sync with Fade 1's visibility.

3. **Replace the FinalCTA BookingModal with StandardFitModal** (lines 427-433) — The bottom-of-page "Book Your Strategy Call" currently uses the old `BookingModal`. Replace it with a state-controlled `StandardFitModal`, same as the homepage pattern.

4. **Replace the mobile sticky CTA BookingModal with StandardFitModal** (lines 458-464) — Same treatment for the fixed mobile CTA at the bottom of the page.

### Specifically:

**Hero CTA** — Move button out of the sticky container entirely. Render it as a `position: fixed` element with `z-index: 50`, centered, that fades out when scrollYProgress exceeds 0.08 (matching Fade 1 timing). This guarantees no overlay can block it.

**Final CTA** — Replace `<BookingModal trigger={...} />` with `<Button onClick={() => setFinalModalOpen(true)}>` + `<StandardFitModal open={finalModalOpen} onOpenChange={setFinalModalOpen} />`. This is the exact pattern that works on the homepage.

**Mobile sticky CTA** — Same replacement as Final CTA.

### Why this will work:
- The button lives in a completely separate DOM layer from the scrollytelling overlays
- No `absolute inset-0` elements sit between the button and the user's click
- The `z-index: 50` on the fixed button ensures it's above the sticky container (no z-index) and all its children
- This mirrors the homepage's proven architecture where the button and modal are outside overlay stacks

