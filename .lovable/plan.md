
# Update Presentation Slides 12 and 13

## Changes

### Page 12 (QuadIntroSlide)
- Remove the "The Quad" title heading
- Replace the description text with: "You must find the metrics that your agency defines as **productive** and **required habits** instead of just **"following the crowd"**."

### Page 13 (QuadMetricsSlide)
- Change the title from "The Four Metrics" to "The Four (**Possible**) Metrics" with "Possible" in red

---

## Technical Details

**File:** `src/components/presentation/slides/AccountabilitySlides.tsx`

**QuadIntroSlide (lines 52-68):**
- Remove the `<h2>The Quad</h2>` element
- Update paragraph text with new messaging and appropriate color highlights

**QuadMetricsSlide (line 97-98):**
- Update title to include "(Possible)" wrapped in `<span className="text-red-400">Possible</span>`
