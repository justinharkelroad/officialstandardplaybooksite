# Refresh the `/links` booking CTA build

## Change
- Update only the existing **BOOK A FREE CALL** button in `src/pages/Links.tsx`.
- Preserve its position, styling, label, and `StandardFitModal` behavior.
- Add `aria-label="Book a free Standard Fit call"` and `data-cta="standard-fit-call"`.

## Verification
- Run the frontend build and confirm there are no preview build errors.
- Verify `/links` displays the CTA above **COACHING** and exposes both new attributes.
- Open the CTA and confirm the Standard Fit Application dialog appears without navigation.
- Do not publish the website.
