
## 3D Coverflow Carousel for Agency Brain

### What Changes
Replace the current flat side-by-side carousel with a **3D coverflow-style carousel** where:

- The **active card** is front-and-center, full size, fully opaque
- **Adjacent cards** scale down (~75%), fade slightly, and shift behind the center card using CSS `translateZ` and `scale`
- **Further cards** are hidden or barely visible, creating depth
- Swiping/dragging rotates cards forward and backward in a smooth loop
- Works on both desktop (drag + arrows) and mobile (swipe)

### Visual Effect
```text
  ┌─────┐                         ┌─────┐
  │     │   ┌───────────────┐     │     │
  │ dim │   │               │     │ dim │
  │small│   │  ACTIVE CARD  │     │small│
  │     │   │   full size   │     │     │
  │     │   │               │     │     │
  └─────┘   └───────────────┘     └─────┘
   behind        front              behind
   z:-100        z:0                z:-100
   scale:0.75    scale:1            scale:0.75
   opacity:0.4   opacity:1          opacity:0.4
```

### Technical Approach

**Keep Embla Carousel** as the swipe/drag engine (already installed), but override the visual presentation:

1. **Track scroll progress per slide** using Embla's `scrollProgress()` API to calculate each card's distance from center
2. **Apply dynamic inline styles** to each card based on distance:
   - `transform: scale(factor) translateX(pull) translateZ(depth)`
   - `opacity` fades with distance
   - `zIndex` ensures the center card is on top
3. **CSS perspective** on the container (`perspective: 1200px`) enables the 3D depth
4. **Remove the partial-card clipping** — cards that are far from center will be fully visible but small and behind, not cut off at edges
5. **Dot indicators and arrows** remain unchanged

### Files Modified
- **`src/pages/NewLanding.tsx`** — only the `AgencyBrainSection` component changes:
  - Add a `useEffect` that listens to Embla's `scroll` event and computes per-slide transforms
  - Change carousel slide sizing to `flex-[0_0_80%] md:flex-[0_0_50%]` centered
  - Apply computed `style` (scale, translateX, opacity, zIndex) to each slide wrapper
  - Add `perspective` and `transform-style: preserve-3d` to the carousel viewport
