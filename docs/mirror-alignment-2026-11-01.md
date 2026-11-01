# Mirror sales-page alignment

Release: prepared on current `origin/main` for the authorized main push. Standard Playbook releases through Cloudflare from main. The original working checkout and its unrelated pending edits are preserved.

Compared the live Standard Playbook `/mirror` page and Agency Brain `/themirrorchallenge` on November 1, 2026. Cross-checked the approved Agency Brain sales copy, product screenshots, and enrollment component in `origin/main` at `9adaa8d1d246cddd46be6dd7ee78a502f68e6b76`. Both primary checkouts lag their remote main branches, so the new offer was taken from the remote-tracking source and live site, rather than the older Agency Brain working files. No Agency Brain files changed.

## Findings and changes

- Standard Playbook promoted a free 32-question assessment first; the paid challenge appeared near the bottom. Its local working file was older still and omitted the challenge section. `/mirror` now leads with the $197 challenge, keeping Standard Playbook's warm paper, black, blue, and condensed display typography.
- Aligned the hero, five-question preview, five pillars, four-step schedule, daily emails, weekly reflections, dossier, approved owner testimonials, pricing, and FAQs with the current Agency Brain offer.
- Included the 30-day access period after finishing and all-sales-final policy. Retained access to the full free assessment at `/mirror/score`.
- Purchase buttons now open the current Agency Brain challenge/enrollment page instead of the older direct Stripe payment link. That page owns the email capture, Stripe checkout, and account provisioning. A cold navigation does not reliably honor its `#buy` fragment, so the main purchase links intentionally use the page URL. The visitor uses Agency Brain's Start button to reach enrollment.
- Added Mirror-specific runtime and static social/search metadata. Fixed the OG stamper's replacement-string bug so `$197` is preserved literally rather than interpreted as a `$1` capture reference.

## Verification

- Production build and Cloudflare `build:pages`: passed.
- ESLint on changed Mirror TypeScript: passed.
- Regression test `node --test scripts/og-stamp.test.mjs`: passed. Covers literal prices, HTML escaping, metadata, and canonical URL.
- Parsed all 22 generated pages and compared their stamped descriptions against source: passed.
- Browser checks at widths 320, 390, 768, 1438, and 1440: no horizontal overflow. Product images loaded successfully.
- Five preview ratings of 3 produced 15/25. Native radio keyboard navigation increased the score to 16/25. Free assessment opened question 1 of 32.
- Purchase link opened the live Agency Brain challenge page; enrollment form exists there. No purchase or lead form was submitted.
- Full TypeScript check remains blocked by five diagnostics in unchanged member-app hooks: `useCore4Stats.ts` (2), `useFlowProfile.ts` (1), and `useFocusItems.ts` (2). None in the changed Mirror files.
- Design detector reported only Inter font warnings; retained because Inter is part of the existing Standard Playbook identity.

Screenshots: `output/mirror-alignment-2026-11-01/desktop.png` and `mobile.png`.

The existing product/design context files have legacy schema warnings. They were not changed; Impeccable `init` can refresh them separately.
