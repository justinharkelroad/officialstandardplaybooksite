# Certified Standard alignment review

Reviewed November 1, 2026 against fetched `origin/main` at
`8cda85667a19e1ae4db12df5c760b302115d8c74` and these public pages:

- [Coaching page](https://standardplaybook.com/certified-standard/?src=home-programs)
- [Agency Brain sales page](https://myagencybrain.com/certifiedstandard)
- [Verified pricing section](https://myagencybrain.com/certifiedstandard#pricing)

The supplied alignment review was read in full. Its quoted content was used as
product evidence and checked against the current live destination before editing.
Changes are isolated in `codex/certified-standard-alignment`; existing pending work
in the original checkout was not included. No merge, deployment, or Lovable action.

## Changes

The coaching page keeps its Anton/Archivo typography, warm paper, ink, blue, owner
voice, and marquee. It now leads with producer readiness, reviewable work, real
producer guide previews (including the closing PDF's Draft status), and The
Confirmation's debrief, live proof, 30-day coaching window, and owner sign-off.
The curriculum is optional to expand. Stale counts and download gates are removed.

The page and homepage feeder explain the 17 conversation modules, four knowledge
commitments, unscored practice versus 80% scored checks, owner seat rules, and
one-time 750 voice minutes per learner seat. Pricing is $399 per learner seat, one
time, purchased and delivered through Agency Brain. Training evidence and
owner-entered business metrics are distinguished explicitly.

Purchase links use the verified Agency Brain pricing section and preserve only
`src` and known UTM fields. Footer curriculum navigation retains the inbound
query. This verifies the referral handoff only: checkout conversion attribution
was not tested and is not claimed. No checkout or purchase was initiated.

## Validation

- `node --import tsx --test src/data/certifiedStandard.test.ts src/app/lib/*.test.ts`:
  **45 passed**, including handoff source/hash and query allowlist tests.
  This is equivalent to the unit script with the new handoff tests added; the
  direct Node loader avoids the sandbox's restriction on tsx CLI IPC sockets.
- ESLint on all changed TypeScript production files and the handoff test: passed.
- TypeScript for changed production entry points and their imports: passed.
- `tsc --noEmit -p tsconfig.node.json`: passed.
- Full `tsc --noEmit -p tsconfig.app.json`: **four pre-existing TS2345 errors**,
  at `useCore4Stats.ts:162,170` and `useFocusItems.ts:257,352`. The diagnostics
  match a clean archive of `origin/main` exactly after normalizing the path prefix.
- `npm run build:pages`: passed, including OG consistency and 21 stamped routes.
  Existing Vite large-chunk warning remains.
- `git diff --check`: passed. Impeccable mechanical detector: no findings.
- Production-preview browser checks: 320, 390, 768, 1440px; no page overflow or
  out-of-bounds text after correcting the training-loop grid at 320px. See
  [browser-checks.json](browser-checks.json).
- Real guide assets load; sample inside pages open at full size. The owner
  scoreboard preview is readable and the owner PDF cover is labeled as a preview.
- Curriculum and module disclosures open. Owner-seat FAQ opens with keyboard
  Enter. Footer goes to the real curriculum section and preserves `src`.
- Runtime metadata checked with a trailing slash and query string. Stamped static
  HTML and runtime share the product title, description, canonical, and real
  `/og/certified-standard.jpg` image (HTTP 200).
- Homepage feeder checked at desktop and 390px; its purchase link carries
  `src=home-band` and targets `#pricing`.

Final checks used Node v22.23.1 (matching the package engine requirement) and the
existing installed dependency tree without changing lockfiles.

## Screenshots

| Surface | Desktop | Mobile (390px) |
| --- | --- | --- |
| Hero | [Desktop](desktop-hero.png) | [Mobile](mobile-hero.png) |
| Producer guides | [Desktop](desktop-guides.png) | [Mobile](mobile-guides.png) |
| Inside pages | [Desktop](desktop-inside-guides.png) | [Draft disclosure](mobile-draft.png) |
| The Confirmation | [Desktop](desktop-confirmation.png) | [Mobile](mobile-confirmation.png) |
| Owner sign-off | Included above | [Mobile](mobile-signoff.png) |
| Owner-seat FAQ | — | [Keyboard expanded](mobile-faq.png) |
| Homepage feeder | [Desktop](desktop-homepage.png) | [Mobile](mobile-homepage.png) |
