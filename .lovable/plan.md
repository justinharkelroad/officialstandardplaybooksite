

## Extend the Hero Video Parallax Across Sections 1 and 2

### What Changes

Right now, Section 1 (HookSection) has `background.mp4` as a sticky video with text scrolling over it, but Section 2 (PivotSection) has its own solid dark background (`bg-[#020617]`). When you scroll from Section 1 into Section 2, the video disappears and gets replaced by the dark background.

After this change, the video will **stay pinned on screen** while you scroll through both sections. The text from Section 1 scrolls away, and Section 2's text scrolls up over the same video — one continuous parallax experience.

### How It Looks

```text
SCROLL POSITION 1 (top):
┌─────────────────────────────┐
│  [background.mp4 playing]   │
│                             │
│  [Logo]                     │
│  "You built the agency..."  │
│                             │
└─────────────────────────────┘

SCROLL POSITION 2 (middle):
┌─────────────────────────────┐
│  [same video, still pinned] │
│                             │
│  BUSINESS. BEING. BODY.     │
│  BALANCE.                   │
│                             │
└─────────────────────────────┘

SCROLL POSITION 3 (continuing):
┌─────────────────────────────┐
│  [same video, still pinned] │
│                             │
│  "Most agencies run on      │
│   duct tape and gut..."     │
│  "Yours won't."             │
│  [Agency Brain logo]        │
│                             │
└─────────────────────────────┘

SCROLL POSITION 4 (exiting):
Video fades/scrolls away, Agency Brain carousel begins
```

### Technical Approach

**File:** `src/pages/NewLanding.tsx`

1. **Merge HookSection and PivotSection into one component** — wrap both sets of text content inside a single tall scroll container (roughly `400vh`) with the video as the shared sticky background

2. **Sticky video layer** — one `sticky top-0 h-screen` container holds the `<video>` and dark overlay, staying pinned the entire time

3. **Three scroll-driven text segments** stacked vertically inside the tall container, each using Framer Motion's `useScroll` + `useTransform` for independent parallax movement and opacity:
   - Segment A: The logo + "You built the agency" headline (current Section 1 content)
   - Segment B: The Core 4 pillars (BUSINESS, BEING, BODY, BALANCE)
   - Segment C: "Most agencies run on duct tape" + "Yours won't" + Agency Brain intro (current Section 2 content)

4. **Scroll-driven opacity** — each text segment fades in as it enters and fades out as it leaves, creating smooth transitions between the three content blocks over the same video

5. **Remove PivotSection as a standalone component** — its content moves into the merged section. Update the `NewLanding` component JSX to render the new merged section instead of `HookSection` + `PivotSection`

6. **Exit transition** — at the bottom of the scroll range, the video fades out and the page transitions into the Agency Brain carousel section with its dark background
