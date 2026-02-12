

## Root Cause: Why Fixed Positioning Fails Here

The current approach uses `position: fixed` for the video and all three text segments. While this avoids the `overflow-x-hidden` breaking `sticky`, it creates a different problem: **fixed elements live outside the normal document flow entirely**. They're always visible in the viewport, and the only thing controlling their appearance is the `scrollYProgress` value from Framer Motion.

The issues you're seeing:
- **"Barely scrolling"**: The 400vh container means you have to scroll through 300vh of distance, but the fixed text barely moves (only 60-80px of Y offset). It feels unresponsive.
- **"It's back" / reappearing content**: The scroll progress ranges have gaps (e.g., Segment A ends at 20%, Segment B starts at 25%), creating moments where nothing is visible, then content snaps in. The transforms may also extrapolate outside their defined ranges.
- **Content not transitioning properly to the blue section**: The fixed layer sits on top of everything, and while `z-20` on later sections should cover it, the transition is harsh.

## The Actual Fix: Use `overflow-x: clip` Instead of `overflow-x: hidden`

The reason we abandoned `sticky` in the first place is that `overflow-x: hidden` on the page wrapper breaks it. But there's a CSS property that clips overflow WITHOUT creating a scroll container: **`overflow-x: clip`**.

With `clip`, `position: sticky` works perfectly, and the implementation becomes dramatically simpler and more reliable.

## Technical Changes

**File: `src/pages/NewLanding.tsx`**

### 1. Page wrapper: swap `overflow-x-hidden` for `overflow-x: clip`

Change the outer div's class from `overflow-x-hidden` to use inline style `overflowX: 'clip'`. Tailwind doesn't have a `clip` utility, so this goes as an inline style.

### 2. Rewrite `ScrollytellingHero` to use sticky positioning

The new structure:

```
<section style={{ height: '400vh' }}>       <!-- tall scroll container -->
  <div class="sticky top-0 h-screen">       <!-- sticks to viewport -->
    <video ... />                            <!-- background video -->
    <div class="dark overlay" />             
    
    <!-- All three text segments, absolutely positioned, centered -->
    <!-- Each segment's opacity driven by container scrollYProgress -->
    <motion.div style={{ opacity: aOpacity }}> Segment A </motion.div>
    <motion.div style={{ opacity: bOpacity }}> Segment B </motion.div>
    <motion.div style={{ opacity: cOpacity }}> Segment C </motion.div>
  </div>
</section>
```

- The `sticky` div stays pinned for the full 300vh scroll range
- Text segments are `absolute inset-0` inside the sticky container, stacked on top of each other
- Only opacity changes (no Y movement) -- this prevents the "barely scrolling" feel. The text simply crossfades as you scroll, which feels intentional rather than sluggish
- Tighter, overlapping scroll ranges so there's never a blank moment:
  - Segment A: visible 0-18%, fading out 14-22%
  - Segment B: fading in 18-26%, visible 26-42%, fading out 42-50%
  - Segment C: fading in 46-54%, visible 54-80%, fading out 80-90%

### 3. Video fade-out at the end

- Video opacity goes from 1 to 0 between 85% and 100% progress, same as before but now driven through the sticky container

### 4. Subsequent sections

- `AgencyBrainSection` keeps its `bg-gradient-to-b from-[#020617] to-black` -- as the sticky container unsticks, this section naturally scrolls up and covers it
- No z-index hacks needed since sticky elements naturally get covered by subsequent content

## Why This Will Work

- `overflow-x: clip` prevents horizontal scroll without breaking `sticky`
- `sticky` is the browser-native way to pin content during scroll -- no JavaScript position management needed
- Crossfading text (opacity only, no Y movement) eliminates the "barely moving" problem
- Overlapping fade ranges ensure there's never a blank screen between segments
- No `position: fixed` means no layering conflicts with the rest of the page
