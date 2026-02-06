

## Fix: Update Email "From" Address

### Problem
The edge function uses `booking@send.standardplaybook.com` as the sender, but only `standardplaybook.com` is verified in Resend. This causes a 403 validation error on every submission.

### Change
**File:** `supabase/functions/send-booking-notification/index.ts`

Update line 35 from:
```
from: "Standard Playbook <booking@send.standardplaybook.com>",
```
to:
```
from: "Standard Playbook <booking@standardplaybook.com>",
```

That is the only change needed. Once deployed, email notifications will send successfully using your verified domain.
