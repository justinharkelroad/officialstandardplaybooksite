# AI Install portal assets

This directory is the source for the private `ai-install-portal` Supabase
Storage bucket. It is intentionally outside `public/` so the website build does
not expose these copies at stable public URLs.

Run `npm run sync:aiinstall-portal-assets` with `SUPABASE_URL` and
`SUPABASE_SERVICE_ROLE_KEY` set to create or update the private bucket and
upload the seven protected files. The Edge Function returns a five-minute
signed URL only after validating active email access and platform entitlement.
