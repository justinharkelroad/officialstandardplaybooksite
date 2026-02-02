

# Slideshow Landing Page: "The Profit Exists In The Disciplined Details"

## Overview
A private, presenter-controlled slideshow at `/presentation` for your live presentation. Same structure as before, but every section now frames the systems as **profit drivers through efficiency and disciplined attention to detail**.

---

## Updated Slideshow Structure (20 minutes / ~25-30 slides)

### Opening Hook (2-3 min | Slides 1-4)
1. **Title Slide** - "The Profit Exists In The Disciplined Details"
2. **The Question** - "Where is your profit hiding?"
3. **Hidden Inefficiencies** - Every undisciplined detail is profit walking out the door
4. **Four Profit Leaks Grid** - Unpredictable Revenue (forecasting failure), Inconsistent Activity (wasted capacity), Zero Accountability (standards that slip), Painful Onboarding (slow ramp = lost profit)

### The System Overview (1-2 min | Slides 5-6)
5. **The Solution** - "Profit is the result of efficiency. Efficiency is the result of discipline."
6. **Three Pillars as Profit Drivers** - Visual showing: Process (captures every opportunity), Accountability (eliminates waste), Coaching (compounds efficiency)

### Pillar 1: The Sales Process (4-5 min | Slides 7-12)
7. **Pillar 1 Title** - "The Details That Capture Every Dollar"
8. **Why It Matters** - Sloppy calls = leaked opportunities = lost profit
9. **Part 1: Rapport and Discovery** - Control the frame, uncover all lines of business (detail: missed cross-sells are hidden profit leaks)
10. **Part 2: The Liability Conversation** - Build value before price (detail: shortcuts here cost you premium)
11. **Part 3: The Assumptive Close** - Close on the first call (detail: follow-ups are inefficient; close now)
12. **Visual Flow** - The disciplined process that captures maximum value from every conversation

### Pillar 2: The Accountability Engine (6-7 min | Slides 13-21)
13. **Pillar 2 Title** - "The Engine That Eliminates Waste"
14. **The Hidden Cost of Inconsistency** - Subjective standards = wasted payroll, missed targets, profit drain
15. **The Quad Intro** - Four metrics that define productive versus wasteful days
16. **The Quad Metrics** - Outbound Calls, Talk Time, Quoted Households, Items Sold (each one a detail that compounds)
17. **The Quad Rule** - "Hit 2 of 4 every day. Discipline in the details."
18. **Consequence Ladder Title** - "Protecting Your Profit With Clear Standards"
19. **Consequence Ladder Visual** - 8-step escalation with the "why": underperformance unchecked bleeds profit
20. **Call Scoring** - "Objective measurement. Every detail scored. No guesswork."
21. **Why It Works** - "Ambiguity is expensive. Clarity is profitable."

### Pillar 3: The Coaching Cadence (3-4 min | Slides 22-25)
22. **Pillar 3 Title** - "The Rhythm That Compounds Efficiency"
23. **Weekly Rhythm Visual** - Monday (Goals), Tues/Thurs (1-on-1s), Wednesday (Role-Play), Friday (Review) - each touchpoint prevents profit leaks
24. **Why Rhythm Matters** - "Consistent attention to detail prevents small problems from becoming expensive ones"
25. **The Result** - "A team that operates efficiently because the details are non-negotiable"

### The Transformation (2-3 min | Slides 26-28)
26. **From Inefficiency to Profit** - The shift from chaos to discipline
27. **Three Outcomes Reframed** - 
   - Certainty = Predictable profit
   - Accountability = Efficient operations
   - Scalability = Profitable growth
28. **The Promise** - "Profit is not luck. It is the result of disciplined attention to detail."

### Close (1-2 min | Slides 29-30)
29. **The Guarantee** - "If you don't have a clear path to more efficient, profitable operations, I'll work for free until you do."
30. **CTA Slide** - Large QR code + "Book Your Strategy Call" + URL text backup

---

## Technical Implementation

### File Structure
```text
src/pages/Presentation.tsx           (Main slideshow page)
src/components/presentation/
  SlideContainer.tsx                 (Navigation wrapper)
  slides/
    OpeningSlides.tsx                (Slides 1-4)
    SystemOverviewSlides.tsx         (Slides 5-6)
    SalesProcessSlides.tsx           (Slides 7-12)
    AccountabilitySlides.tsx         (Slides 13-21)
    CoachingSlides.tsx               (Slides 22-25)
    TransformationSlides.tsx         (Slides 26-28)
    CTASlide.tsx                     (Slides 29-30)
```

### Controls
- Left/Right arrow keys and click zones to navigate
- Space bar to advance
- Progress dots at bottom
- F key for fullscreen mode
- Private route (not in navigation, noindex)

### Visual Design
- Dark background with blue accents (matching your site)
- Oswald uppercase headlines, Inter body text
- Large readable text (48px+ headlines, 24px+ body)
- Staggered animations as content reveals
- Consequence ladder with color progression (green to red)
- QR code dynamically generated for your booking link

---

## Key Framing Shifts

| Original Framing | Profit-Focused Framing |
|------------------|------------------------|
| "Scalable Sales Team" | "Profit in the Disciplined Details" |
| "Chaos of Inconsistency" | "Hidden Inefficiencies Bleeding Profit" |
| "Operating System" | "Profit through Efficiency and Discipline" |
| "Certainty, Accountability, Scalability" | "Predictable Profit, Efficient Ops, Profitable Growth" |
| "Why It Works" | "Ambiguity is expensive. Clarity is profitable." |

