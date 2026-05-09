# Standard Playbook V2 Rebrand — Design Source File Request

**To:** [Design lead / agency on the rebrand]
**From:** Justin Harkelroad
**Purpose:** Lock the V2 brand guide as operational by pulling exact specs from the design source. Everything below is currently estimated from screenshot analysis and needs canonical confirmation before the guide can be used to brief Claude Code, build lead magnet pages, or hand to vendors.

**How to respond:** Fill in the blanks inline, attach source files where requested, send back as a single doc or thread. Don't worry about re-organizing — the structure here is just to make it easy to fill in.

---

## 1. File Deliverables (please share these)

The fastest way to make this guide operational is to share the source files directly. If you can send any of the following, most of the questions below answer themselves:

- [ ] Figma file (or other design tool) for the new site — read access is fine
- [ ] Brand style guide / design system doc, if one exists
- [ ] Logo files (SVG primary, all variants, all approved colors)
- [ ] Final font files + license documentation
- [ ] Color tokens / variables file (CSS, Figma tokens, JSON, whatever format you use)
- [ ] Photography assets (Believer cap photo, alley shot, any approved hero images) — final retouched versions
- [ ] Any motion / animation reference files (Lottie, video, Principle, etc.)

---

## 2. Color System

Current V2 brand guide has these as estimates. Please confirm or correct:

| Role | Estimated Hex | Confirmed Hex | Notes |
|------|---------------|---------------|-------|
| Primary Dark (black) | `#000000` | _____ | Pure black or slight off-black? |
| Primary Light (cream) | `#F4F1EB` | _____ | Warm or cool? |
| Accent Blue (electric) | `#1E5FE0` | _____ | Looks more saturated than Apple Blue — confirm exact value |
| Headline Dark on cream | `#0B0B0C` | _____ | |
| Body Dark on cream | `#2A2A2A` | _____ | |
| Body Light on black | `#E8E6E0` | _____ | Slightly warm white per screenshot — confirm |
| Muted Display Gray | `#9A958C` | _____ | Used on the "OBSESSION IS BUILDING AGENCIES" headline |
| Hairline on cream | `#D6D2C8` | _____ | |
| Hairline on black | `#1A1A1A` | _____ | |

Additional questions:
- Are there any approved color variants beyond what's shown in the homepage / Boardroom / AB training screenshots?
- Is there a status / alert color (red for "Sold Out," etc.) — V1 had `#FF3B30`, does V2 keep it or change?
- Any approved tints / opacity tokens (e.g. white at 70% for body on dark)?

---

## 3. Typography

### Display face (the heavy condensed all-caps face)

- [ ] Exact name: __________
- [ ] Foundry / source: __________
- [ ] License type: (e.g., commercial perpetual, web-only, document-only) __________
- [ ] License terms for: web ✓/✗  / print ✓/✗  / video ✓/✗  / client-deliverable docs ✓/✗
- [ ] Approved weights: __________
- [ ] Where to download / which user has the file: __________

### Body face (the clean modern sans)

- [ ] Exact name: __________
- [ ] Foundry / source: __________
- [ ] License type: __________
- [ ] Approved weights: __________

### Type scale — confirm or correct sizes/weights

| Role | Estimated | Confirmed |
|------|-----------|-----------|
| Mega Display (page closers like "RAISE.") | ~140-180px / weight 800-900 | _____ |
| Hero H1 | ~80-100px / weight 800-900 | _____ |
| Section H2 | ~48-64px / weight 800 | _____ |
| Sub-headline | ~36-44px / weight 700-800 | _____ |
| Card / Item Headline | ~20-24px / weight 800 | _____ |
| Body Lead | ~17-19px / weight 400 | _____ |
| Body | ~15-16px / weight 400 | _____ |
| Eyebrow / Kicker | ~11-12px / weight 500-600 / tracked +1.5-2px | _____ |
| Button | ~12-14px / weight 600 / tracked +1px | _____ |

### Letter-spacing (tracking)

- Display face: appears to be near-zero or slightly negative — confirm exact value: __________
- Eyebrow / kicker tracking: __________
- Button tracking: __________

### Line-height (leading)

- Hero / mega display line-height: __________
- Body line-height: __________

---

## 4. Logo & Wordmark

- [ ] Is the new primary mark just "STANDARD" set in the display face, with no border? Or is there a refined logo treatment?
- [ ] Does the cross-in-the-T detail from V1 carry forward?
- [ ] Approved logo variants (white on black, black on cream, monochrome single-color, anything else): __________
- [ ] Is there a "Standard Playbook" wordmark separate from the "STANDARD" mark, or is "STANDARD" sufficient by itself?
- [ ] Minimum size for digital (px) and print (in/mm)?
- [ ] Clear space / safe zone rule?
- [ ] Any animated logo treatment (for video intros, loading states)?

---

## 5. Visual Motifs

### 5.1 Diagonal Tape Banner

This is the most distinctive new motif. Need to lock specs:

- [ ] Tape angle (degrees from horizontal): __________
- [ ] Tape height (px on desktop): __________
- [ ] Tape height behavior on mobile: __________
- [ ] Marker between text repeats: dot, diamond, or other? __________
- [ ] Marker color (electric blue?) and size: __________
- [ ] Spacing between text repeats: __________
- [ ] Does the tape extend beyond canvas edges, or is it contained within container width?
- [ ] What text rotates through (just "STANDARD PLAYBOOK," or context-specific like "TEAM TRAINING" / "THE BOARDROOM")?

### 5.2 Polaroid Photo Treatment

- [ ] White border thickness (px): __________
- [ ] Bottom border thicker than other three sides (true polaroid proportions)? __________
- [ ] Tilt range (degrees): __________
- [ ] Drop shadow yes/no — and if yes, exact spec (offset, blur, color, opacity): __________
- [ ] Aspect ratio of polaroid frame: __________
- [ ] How are multi-polaroid clusters arranged (overlap rules, tilt variation)? __________

### 5.3 Numbered List Architecture

- [ ] Number font: body face? Same as eyebrow? Custom? __________
- [ ] Number color: electric blue, or sometimes black? __________
- [ ] Number size (px): __________
- [ ] Number weight: __________
- [ ] Spacing between number and item content: __________
- [ ] Are leading zeroes always used (01, not 1)? __________
- [ ] Does the numbering reset at each section, or run continuously down a page?

### 5.4 Slash-Prefix Eyebrow

- [ ] Format: `/ SECTION NAME` — confirm slash + space + name pattern
- [ ] Is the slash always present, or sometimes omitted? __________
- [ ] Color (matches body? matches accent?): __________

### 5.5 Single-Word Page Closer

- [ ] Approved word library so far: RAISE, TRAIN, JOIN — others approved? __________
- [ ] Always full-bleed background? __________
- [ ] Always with period? __________
- [ ] Black canvas with white text, or also cream canvas with black text? __________
- [ ] Position on page: directly above footer always, or with spacing? __________

---

## 6. UI Components

### 6.1 Buttons

- [ ] Filled primary button: confirm `#000000` background with `#FFFFFF` text on cream canvas
- [ ] On black canvas, what's the filled primary button? Inverted (white bg, black text)?
- [ ] Outline button border thickness (1px, 2px?): __________
- [ ] Button corner radius — square (0px) or slightly rounded (2-4px)? __________
- [ ] Button vertical padding: __________
- [ ] Button horizontal padding: __________
- [ ] Hover state spec (color shift, opacity change, etc.): __________
- [ ] Active / pressed state: __________
- [ ] Disabled state: __________
- [ ] Are arrows (`→`) part of the button, or separate? Spec for placement and size?

### 6.2 Forms

- [ ] Input style: bottom-border only, full box, or other? __________
- [ ] Border color: __________
- [ ] Focus state: __________
- [ ] Error state: __________
- [ ] Placeholder color and weight: __________
- [ ] Input height: __________

### 6.3 Cards / List Items

- [ ] Pricing list item (the numbered programs on "PICK YOUR PATH"): hairline divider style, padding, typography per element — confirm exact specs
- [ ] Are there any card components beyond list items, or is the brand truly card-free?
- [ ] "MOST POPULAR" tag spec: dimensions, color, position relative to its row

### 6.4 Dividers

- [ ] Hairline weight (1px, 0.5px?): __________
- [ ] Hairline color on cream: __________
- [ ] Hairline color on black: __________
- [ ] Are tape banners considered the only "section divider," or do hairlines also serve that role?

---

## 7. Layout & Grid

- [ ] Container max-width on desktop: __________
- [ ] Grid columns + gutter spec: __________
- [ ] Vertical spacing between sections (V1 was 200px+ — confirm V2 spec): __________
- [ ] Mobile breakpoint(s): __________
- [ ] How does the mega-display typography behave at <768px? Does "RAISE YOUR STANDARD" stay one line, wrap, or shrink? __________
- [ ] Hero section height: full viewport, fixed, or content-driven? __________

---

## 8. Photography Style

- [ ] Approved photography treatments: full-color, grayscale, desaturated — what's the rule? __________
- [ ] Any color filters / LUTs applied to brand photography? __________
- [ ] Hero photography: full-bleed only, or also polaroid? __________
- [ ] Stock photography allowed yes/no? If yes, with what restrictions?
- [ ] List of approved hero photos and their canonical use case: __________

---

## 9. Motion & Interaction

- [ ] Any signature scroll behaviors (parallax, reveal, sticky elements)? __________
- [ ] Tape banner: static, or does it scroll horizontally? Marquee speed? __________
- [ ] Hover states for cards / list items / buttons — spec? __________
- [ ] Page transitions (if any): __________
- [ ] Loading states / skeleton screens: __________

---

## 10. Strategic / Cross-System Questions

These aren't visual-spec questions — they're decisions the rebrand should resolve before V2 lands.

- [ ] **Agency Brain product UI** (the actual app, not the marketing page): does it adopt V2 visual language, stay on its current system, or develop a distinct-but-related sibling brand?
- [ ] **Lead magnet pages** (e.g. /mirror): are these treated as full-brand expressions, or simplified versions? Should the diagonal tape banner appear on a quiz-style page, or is it reserved for marketing pages?
- [ ] **Document deliverables** (PDFs, workbooks, slide decks): does the heavy display typography carry into print/document work, or is there a quieter document brand?
- [ ] **Email templates** (Brevo): how should V2 typography render in email, where display fonts can't be guaranteed? Web-safe fallbacks?
- [ ] **Social content templates**: how does the brand express on a 1080x1080 IG square or 9:16 Reel cover? Are there prebuilt templates?
- [ ] **The Mirror workbook** (currently on V1): does the workbook get re-skinned to V2, or is it considered a separate sub-brand product?
- [ ] **Existing assets transition plan**: what's the rollout order for re-skinning V1 surfaces (sales pages, Formula site, Standard Playbook docs, etc.)?

---

## 11. What I Need Back, Prioritized

If you can only get to part of this in the first pass, here's the priority:

**Top priority (blocks the V2 brand guide from going operational):**
1. Exact display face name + license terms
2. Exact body face name
3. Exact hex values for the three core colors (black, cream, electric blue)
4. Logo files (SVG, all variants)

**Second priority (blocks specific upcoming builds, like the /mirror lead magnet page):**
5. Tape banner specs (angle, height, marker style)
6. Button specs (radius, padding, hover states)
7. Mobile breakpoint behavior for mega display headlines
8. Numbered list architecture specs

**Third priority (nice to have for full-system completeness):**
9. Photography style guidelines
10. Motion principles
11. Cross-system strategic decisions (AB product UI, document brand, etc.)

---

## 12. Timeline

- [ ] When does the new site go live? __________
- [ ] When is the V2 brand pack expected to be deliverable-ready? __________
- [ ] Who owns ongoing brand stewardship after launch? __________

---

## Appendix — Current implementation values (from `BOLD_REBRAND_HANDOFF.md`)

These are the values the rebrand has been built against in code so far. They should be replaced with the canonical values once confirmed:

- **Display face:** `Anton` (Google Fonts), fallback `Archivo Black`, `Oswald`, `Impact`
- **Editorial fallback:** `Archivo Black` (used for some mid-weight display)
- **Body face:** `Inter` (already loaded in `index.html`)
- **Ink:** `#0A0A0B`
- **Paper:** `#F4F2EE`
- **Brand blue:** `#2080FF`
- **Red (alerts):** `#C8102E` (used on /8-week-apply Fit Check + Producer Challenge problem block)

Once the design source confirms the canonical values, find/replace these constants across all `Bold*.tsx` files in `src/pages/` and the demo components in `src/components/training/`.

*Once these are answered, fold the canonical specs into a `brand-guide-v2.md` and retire `DESIGN.md` (V1 Apple-style brief) as historical reference.*
