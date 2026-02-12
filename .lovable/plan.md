

## Fix: Agency Brain Section Gets a Blue Background

### The Problem
Segment D ("Agency Brain" intro) currently fades in over the background video. The video shows through behind it, creating a messy look with the person's hands and whiteboard visible behind the Agency Brain logo and text.

### What Changes

**File: `src/pages/NewLanding.tsx`**

1. **Fade the video out earlier** -- Change `videoOpacity` to reach 0 by the time Segment D starts (around 68% scroll progress instead of 85-100%). This ensures the video is completely gone before Agency Brain appears.

2. **Add a blue background layer that fades in with Segment D** -- Inside the sticky container, add a new `motion.div` background layer tied to `dOpacity` (or a similar timing). This layer will be a solid deep navy gradient (`bg-gradient-to-b from-[#020617] to-black`) that covers the entire viewport, sitting behind the Segment D text but in front of the (now-invisible) video.

3. **Smooth transition** -- The background layer will start fading in slightly before Segment D's text, so by the time the Agency Brain logo appears, the background is fully blue/navy. No video bleed-through.

### Technical Detail

Inside the sticky container, before Segment D's text layer:

- A new `motion.div` with `absolute inset-0` and `bg-gradient-to-b from-[#020617] to-black`
- Its opacity tied to a new transform that fades from 0 to 1 between roughly 62-70% scroll progress (bridging the gap between Segment C fading out and Segment D fading in)
- The video opacity adjusted to fade out between 55-68% instead of 85-100%

This creates a clean visual handoff: video fades out, blue background fades in, then Agency Brain text appears on top of it.
