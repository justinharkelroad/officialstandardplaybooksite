# Boardroom software bundles — November 10, 2026

Public sales route: `/boardroom#pricing`. New customers can choose Boardroom with Core ($399/month), Plus ($549/month), or Pro ($699/month). Other public Boardroom purchase entry points now lead to this chooser.

## Billing evidence

- [Boardroom checkout classification and Payment Link allowlist](https://github.com/justinharkelroad/agencybrain/blob/main/supabase/functions/_shared/boardroomCheckout.ts): $399 membership, Core included; Plus adds $150 and Pro adds $300.
- [Webhook consumer](https://github.com/justinharkelroad/agencybrain/blob/main/supabase/functions/stripe-webhook/index.ts) uses `resolveBoardroomCheckoutPurchase` and `boardroomTokenMetadata`.
- [Existing software feature definitions](https://github.com/justinharkelroad/agencybrain/blob/main/src/components/subscription/CoreProUpgradeModal.tsx): 20/50/100 monthly call scores; Plus builders and 240 Studio minutes; Pro includes Plus, 600 Studio roleplay minutes, HR Suite and priority support.

No Stripe objects, billing functions, or Mirror Credit rules were changed. No new credit claim is made for Plus or Pro.

## Customer safeguards

Checkout URLs never render while this site's session is checking, signed in, or unavailable. An explicit new-customer confirmation is required after a successful signed-out session check. Sign-in removes checkout links; sign-out resets confirmation. Session failures/timeouts fail closed, including an empty initial auth event after a failed session read.

The marketing site's origin cannot read an Agency Brain session on `myagencybrain.com`. The explicit confirmation addresses this boundary without claiming cross-domain detection. Existing Boardroom/Agency Brain customers are directed to the app to upgrade their current subscription. No public checkout component is imported into member routes.

## Verification

- `npm run test:boardroom`: 9 passing tests, including exact URLs/prices, confirmation, signed-in states, auth races/errors/timeouts, and checkout ownership/route boundaries.
- `npm run test:unit`: 42 passing tests.
- Funnel and Certified Standard tests: 17 passing tests.
- ESLint on all changed TypeScript files, TypeScript app check, `git diff --check`, and production build passed.
- Browser tested against the production build using `npm run preview`, at requested widths 320, 390, 768 and 1440. No page/card horizontal overflow; all three checkout buttons remain reachable.
- Clicked each button in the built page. Each opened its exact supplied Stripe URL and displayed $399, $549 or $699 monthly, respectively. Plus showed $399 + $150; Pro showed $399 + $300. No payment was submitted.
- Fixed pre-existing 12-column grid gap floors that widened the phone viewport and pushed controls offscreen. Desktop spacing is preserved.

The repository's existing package manifest and lockfile are out of sync for `drizzle-kit`, `drizzle-orm` and `postgres`, so a direct `npm ci` fails before this change. For validation, Node 22 ran `npm ci` in a temporary directory with the lockfile's own root manifest and used those exact locked dependencies. Dependency declarations and lockfile were preserved; only a pricing-test script was added to package.json. Existing build warnings about bundle size and old Browserslist data remain.

## Screenshots from the built page

[Desktop, 1440px](desktop.png) · [Phone, 390px](phone.png)

## SEO and included-value follow-up

The Core card now labels the included software as **Agency Brain Core ($299/mo value)**, with the value in blue. The membership price remains $399/month.

Search, Open Graph and Twitter descriptions name Core/Plus/Pro at $399/$549/$699 per month. FAQ structured data and both AI-readable reference files agree. The same Service schema supplies three named monthly USD offers to the browser and the static Cloudflare HTML, so JavaScript-free crawlers receive the prices too. The browser replaces the marked static block instead of adding a duplicate. Offer URLs use the guarded public pricing section.

Validation: `npm run test:boardroom:seo` passed the production Pages build, four pricing/metadata/schema regressions and the OG-stamping regression. All nine checkout tests, app type checking and changed-file lint passed. Browser inspection found exactly one Service schema with three offers after hydration; the blue label and page fit 320px, 390px and 1440px widths without horizontal overflow.

[Updated Core card, desktop](core-value-desktop.png) · [Updated Core card, phone](core-value-phone.png)
