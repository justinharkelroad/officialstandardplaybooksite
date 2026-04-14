

## Plan: Auto-Open Booking Modal on `/8-week` Route + Fix Build Error

### What We're Building
A new route `/8-week` that loads the Sales Experience page with the booking modal automatically open on arrival — a shareable link you can send people directly to the booking flow.

### Build Error Fix
The AppleMockup.tsx file has a type error: the `action` field type union is `'directive' | 'link' | 'sold-out'` but the code checks for `'booking'` which no longer exists. We'll remove that dead branch.

### Steps

1. **Fix AppleMockup.tsx build error** — Remove the `program.action === 'booking'` branch (lines 860-870) since no program uses that action anymore. This is dead code causing the TS error.

2. **Add `autoOpenBooking` prop to SalesExperience page** — Accept an optional prop that, when true, opens the BookingModal on mount. We'll use React state + useEffect to auto-trigger the modal open.

3. **Update BookingModal to support controlled open state** — Add optional `defaultOpen` or `externalOpen`/`onOpenChange` props so the parent can force it open on mount.

4. **Add `/8-week` route in App.tsx** — Render `<SalesExperience autoOpenBooking />` so visiting `/8-week` loads the sales page with the modal immediately visible.

### Technical Details

- **BookingModal** gets an optional `defaultOpen?: boolean` prop. When true, the modal starts open.
- **SalesExperience** gets an optional `autoOpenBooking?: boolean` prop, passed through to its BookingModal instances (specifically the hero CTA one).
- **Route**: `/8-week` → `<SalesExperience autoOpenBooking />`
- The existing `/sales-experience` route remains unchanged (modal does not auto-open).

