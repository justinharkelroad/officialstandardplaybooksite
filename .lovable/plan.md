

## Onboarding Form with Database Storage

### Overview
We'll connect Lovable Cloud to your project, create a database table to store form submissions, and build a two-step intake form that appears before the Acuity booking calendar. Every field auto-saves to your database as the user fills it out -- so even if they abandon the form, you still have their info.

### Step 1 -- Enable Lovable Cloud
Connect Lovable Cloud to the project so we have a database and edge functions available.

### Step 2 -- Create Database Table
A `booking_leads` table to store all submissions:

| Column | Type | Notes |
|--------|------|-------|
| id | uuid (primary key) | Auto-generated |
| session_id | text | Unique browser session ID to track partial saves |
| full_name | text | |
| email | text | |
| cell_phone | text | Personal cell, not agency phone |
| primary_carrier | text | |
| whats_working | text | What's working in their sales team |
| whats_not_working | text | What's not working |
| desired_outcome | text | Desired outcome for the call |
| committed | boolean | Whether they committed to showing up |
| completed | boolean | Whether they made it to the calendar step |
| created_at | timestamp | Auto-set |
| updated_at | timestamp | Updated on each field save |

No authentication required -- this is a public lead capture form, so we'll set up open insert/update policies.

### Step 3 -- Build the Two-Step Form

**New file:** `src/components/BookingOnboardingForm.tsx`

**Step 1 of 2 -- Contact Info:**
- Full Name (required)
- Email (required, validated)
- Cell Phone (required) with helper text: *"Please enter your personal cell phone, NOT your agency phone number"*
- "Next" button

**Step 2 of 2 -- Qualifying Questions:**
- Primary Carrier
- "What do you feel like is WORKING right now inside of your sales team?"
- "What do you feel like is NOT WORKING right now inside of your sales team?"
- "What is the desired outcome in your mind for our call?"
- "Are you committed to showing up for the call?" (dropdown: Yes / No)
  - Selecting "No" disables and greys out the "Continue to Booking" button
  - Selecting "Yes" enables the button
- "Back" button to return to Step 1

**Auto-save behavior:**
- On first interaction, a new row is inserted into `booking_leads` with a browser-generated session ID
- As the user fills out each field, the row is updated in real-time (debounced ~1 second)
- This means you capture partial leads even if they abandon the form
- LocalStorage stores the session ID so returning visitors resume where they left off

### Step 4 -- Modify BookingModal

**File:** `src/components/BookingModal.tsx`

- Add a `step` state: `"form"` or `"schedule"`
- When modal opens, show the onboarding form first
- When the form is completed (committed = Yes, all fields filled), transition to `"schedule"` to show the Acuity iframe
- Mark the `booking_leads` row as `completed = true`

### Styling
- Matches existing dark theme with gold accents
- Step progress indicator at the top (Step 1 of 2 / Step 2 of 2)
- Smooth transitions between steps

### What You Get
- A `booking_leads` table in your Lovable Cloud database you can view, export, and query
- Every visitor's info captured the moment they start typing -- even abandoners
- Full qualifying data for everyone who makes it to the calendar

