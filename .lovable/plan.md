## /calls landing page

A simple, shareable page where members can register for the three monthly recurring Zoom calls and jump into your personal meeting room. Designed to match the rest of the Bold site (deep navy + electric blue, Oswald headings, dark cards).

---

### Layout

```text
┌─────────────────── BoldNav ───────────────────┐

         CALLS / Monthly Standard Cadence (h1)
       Short supporting line (1 sentence)

┌────────────┬──────────────────────┬────────────┐
│ STANDARD   │   STANDARD BOARDROOM │ STANDARD   │
│   x        │   (dominant, larger, │   x        │
│ AGENCYBRAIN│    blue glow border) │   AI       │
│            │                      │            │
│ [logo]     │      [logo]          │ [logo]     │
│            │                      │            │
│ 3rd Wed    │  Next: Wed 5/20/26   │ 4th Wed    │
│ Next: 6/17 │  1:00–3:00 PM EST    │ Next: 6/24 │
│            │  (auto rolls over)   │            │
│ ID: 856…   │  ID: 862 3263 2504   │ ID: 852…   │
│ [Register] │   [Register on Zoom] │ [Register] │
└────────────┴──────────────────────┴────────────┘

┌──────────────────────────────────────────────┐
│  Justin's Standard Meeting Room              │
│  PMI: 571 693 9535                           │
│  [Join Justin's Room]                        │
└──────────────────────────────────────────────┘

──────────────── Footer ────────────────
```

- Desktop: 3 columns, center card visually dominant (taller, accent border, subtle blue glow, slightly larger logo & button).
- Mobile: stacks single column, Boardroom first.
- 4th "Personal Room" card spans full width below, lower visual weight.
- Each card shows: logo, call name, cadence label, **next meeting date/time**, **Meeting ID** (selectable text), Register button.
- All "Register" / "Join" buttons open the Zoom link in a new tab (`target="_blank"`, `rel="noopener noreferrer"`).

---

### Next-meeting date logic

A small helper `src/lib/callSchedule.ts`:

- Computes the Nth Wednesday of a given month in `America/New_York`.
- For each call, returns the next upcoming occurrence (today or later).
- Supports a `OVERRIDES` map keyed by `callId + YYYY-MM` so you can edit any single month's date/time in code (e.g. May 2026 Boardroom → `2026-05-20 13:00–15:00 EST`). Once that date passes, logic automatically resumes the standard cadence (2nd / 3rd / 4th Wednesday).
- Returns a formatted display string like `Wed, May 20, 2026 · 1:00–3:00 PM EST`.

No backend / no admin UI for v1 — overrides are a single constant at the top of the file you edit anytime. Easy to upgrade to a DB-backed admin later if you want.

---

### Data (hardcoded in `src/data/callsData.ts`)

```ts
[
  {
    id: 'boardroom',
    title: 'The Standard Boardroom',
    cadence: '2nd Wednesday Monthly',
    cadenceWeek: 2,
    duration: 60, // standard duration in minutes
    meetingId: '862 3263 2504',
    registerUrl: 'https://us06web.zoom.us/meeting/register/tZIvdOuurTkvGtB3DFPus_VohU6a22LFlb8t',
    logoUrl: '<public bucket>/Standard Boardroom Logo.png',
    dominant: true,
  },
  {
    id: 'agencybrain',
    title: 'Standard × AgencyBrain',
    cadence: '3rd Wednesday Monthly',
    cadenceWeek: 3,
    meetingId: '856 9609 1645',
    registerUrl: 'https://us06web.zoom.us/meeting/register/Tw3bEqWhQ5OZWfulbi0JFw',
    logoUrl: '<public bucket>/Standard Agencybrain Logo.png',
  },
  {
    id: 'ai',
    title: 'Standard × AI',
    cadence: '4th Wednesday Monthly',
    cadenceWeek: 4,
    meetingId: '852 6788 7373',
    registerUrl: 'https://us06web.zoom.us/meeting/register/wXNHPvTaTR6PcTImd_ZnNg',
    logoUrl: '<public bucket>/Standard Ai Training Logo.png',
  },
]

OVERRIDES = {
  'boardroom:2026-05': { date: '2026-05-20', start: '13:00', end: '15:00', tz: 'America/New_York' },
}
```

Personal room is a separate constant (PMI `571 693 9535`, link `https://us06web.zoom.us/s/5716939535?pwd=…`).

---

### Files

**New**
- `src/pages/Calls.tsx` — page (BoldNav + hero + cards grid + personal room card + Footer)
- `src/components/calls/CallCard.tsx` — reusable card with `dominant` variant
- `src/components/calls/PersonalRoomCard.tsx`
- `src/data/callsData.ts` — call definitions + overrides
- `src/lib/callSchedule.ts` — Nth-Wednesday + override + EST formatting helpers

**Edited**
- `src/App.tsx` — add `<Route path="/calls" element={<Calls />} />`
- `src/data/seoConfig.ts` (if it has per-route entries) — add `/calls` title/desc

No DB changes, no edge functions, no migrations.

---

### Technical details

- Logos are referenced via their Supabase Storage public URL (the `public` bucket already holds `Standard Boardroom Logo.png`, `Standard Agencybrain Logo.png`, `Standard Ai Training Logo.png`).
- Date math uses `Intl.DateTimeFormat` with `timeZone: 'America/New_York'` so the page is correct regardless of viewer timezone; DST handled automatically.
- Meeting IDs render in a `<span>` with `select-all` so a single click selects the full ID for copy.
- Page is public + indexable-ready, but unlinked from global nav (shareable direct URL only), matching the pattern of /welcometocoaching etc.
- Buttons reuse existing primary button styling (`bg-primary`, Oswald, rounded-pill). Dominant Boardroom card gets `ring-1 ring-primary/50 shadow-[0_0_60px_-15px_hsl(var(--primary)/0.6)]` and `md:scale-105`.

---

### Out of scope (call out if you want them later)

- Admin UI for editing dates (current plan = edit the constant in code).
- Calendar (.ics) download buttons.
- Auth-gating the page.
