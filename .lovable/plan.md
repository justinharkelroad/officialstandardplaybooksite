

## Plan: New Landing Page with Auto-Opening Intake Modal

### What You'll Get

A new route (e.g., `/fit` or `/start`) that loads the existing homepage (NewLanding) but **immediately opens a modal form** on top of it. The form collects the same info as the current 8-Week booking flow (name, email, phone, carrier, what's working/not working, desired outcome, commitment check). On submit, it:

1. Saves the lead to the database (same `booking_leads` table, with a `source` field so you can distinguish these from 8-week leads)
2. Fires an email notification to `info@standardplaybook.com` (reuses existing `send-booking-notification` edge function)
3. Redirects them to `https://AGENCYCOACHING.as.me/standardfit` to book their call (instead of embedding Acuity inline)

### Technical Steps

**1. Database migration** -- Add a `source` column to `booking_leads`
- `ALTER TABLE booking_leads ADD COLUMN source text DEFAULT 'eight-week';`
- This lets you filter leads by origin (`eight-week` vs `standard-fit`) without a new table

**2. New page component: `src/pages/StandardFit.tsx`**
- Renders `<NewLanding />` as the background
- Immediately opens a Dialog modal containing a version of the `BookingOnboardingForm`
- On form completion: calls `send-booking-notification`, then redirects to `https://AGENCYCOACHING.as.me/standardfit` (external link, not embedded)
- If user closes the modal, they just see the normal landing page and can re-trigger it via a CTA

**3. New reusable modal: `src/components/StandardFitModal.tsx`**
- Wraps `BookingOnboardingForm` in a Dialog that auto-opens
- Passes `source="standard-fit"` so the DB record is tagged
- On complete: redirects to the Acuity link instead of showing embedded scheduler

**4. Update `BookingOnboardingForm`**
- Accept optional `source` prop (defaults to `'eight-week'`)
- Accept optional `onCompleteRedirectUrl` prop
- Save `source` to the database on insert/update
- When `onCompleteRedirectUrl` is provided, open that URL on completion instead of calling the parent's `onComplete`

**5. Route registration in `App.tsx`**
- Add `/fit` route pointing to `StandardFit` page

**6. No changes to the email edge function** -- it already sends the same fields. The notification will work identically.

### User Flow

1. User visits `/fit`
2. Landing page loads, modal immediately appears on top
3. Step 1: Name, email, phone
4. Step 2: Carrier, what's working, what's not, desired outcome, commitment check
5. Submit → data saved, email sent to you, user redirected to `https://AGENCYCOACHING.as.me/standardfit`

### What Stays the Same
- Existing `/` homepage and all booking flows remain untouched
- The 8-week booking modal continues to work exactly as before
- All auto-save and session recovery behavior is preserved

