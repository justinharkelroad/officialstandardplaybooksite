

## Fix: Hero Video Parallax Scrollytelling

### Root Cause

The parent wrapper `<div className="bg-black min-h-screen text-white overflow-x-hidden">` uses `overflow-x-hidden`, which breaks `position: sticky` in browsers. The video was scrolling away with normal flow instead of staying pinned, resulting in a blank black screen in the middle of the scroll range.

### The Fix

Replace the `sticky` approach with a `fixed` video background, controlled by scroll progress. This is immune to parent `overflow` settings.

### Technical Changes (all in `src/pages/NewLanding.tsx`)

**1. Replace `ScrollytellingHero` component structure:**

- The `<video>` moves into a **`position: fixed`** container (instead of `sticky`), pinned to the full viewport. Its visibility is driven by `scrollYProgress` of the outer section ref, so it only shows while the user is within the hero scroll range.
- The three text segments (A: logo/headline, B: Core 4 pillars, C: problem/Agency Brain) become **normal flow `div`s**, each `h-screen` tall, stacked vertically inside the `400vh` container. Each is wrapped in a `motion.div` using `useScroll({ target: segmentRef, offset: ['start end', 'end start'] })` to independently track when that specific segment enters/exits the viewport.
- Each text segment animates its own opacity and Y-offset based on its individual scroll progress -- no shared progress calculation, no gap in visibility.

**2. Video visibility control:**

- A `useMotionValueEvent` on the container's `scrollYProgress` toggles a state `isInHero`. When `scrollYProgress` is between 0 and 0.95, the fixed video is visible (opacity 1). Above 0.95, it fades out.
- Alternatively, use `useTransform` on the container progress to drive the video container's opacity directly via `motion.div style`.

**3. Z-index layering:**

- Fixed video container: `z-index: 0`
- Text segments: `z-index: 10` (so text appears above video)
- Sections after the hero (AgencyBrainSection, etc.): `z-index: 20` with solid `bg-*` backgrounds so they naturally cover the fixed video as the user scrolls past the hero

**4. Page wrapper:**

- Keep `overflow-x-hidden` (it's needed elsewhere) -- the `fixed` approach doesn't depend on it

### Visual Behavior (unchanged from plan)

```text
Scroll 0-30%:   Video pinned, Logo + "You built the agency" visible, fading out
Scroll 25-55%:  Video pinned, Core 4 pillars fade in and out
Scroll 50-85%:  Video pinned, "Most agencies run on duct tape" + Agency Brain
Scroll 85-100%: Video fades out, transitions to Agency Brain carousel
```

### Why This Works

- `position: fixed` is not affected by ancestor `overflow` properties
- Each text segment tracks its own scroll independently, eliminating the gap/blank issue
- The sections after the hero use solid backgrounds with higher z-index, naturally covering the fixed video layer
