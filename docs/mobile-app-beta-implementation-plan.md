# Standard Playbook Mobile App — Beta Implementation Plan

> Status: implementation handoff
> Written: 2026-07-12
> Target: installable, signed iOS TestFlight and Google Play Internal Testing builds
> Native strategy: Capacitor, sharing the existing React/Vite member application

## 0. Mission

Turn the existing members-only application at `standardplaybook.com/app` into
signed iOS and Android applications without destabilizing the public website,
the existing browser member app, or the live Supabase/Lovable backend.

The first blocking stop is **not public store release**. It is:

1. a signed iOS build installed through TestFlight;
2. a signed Android App Bundle installed through Google Play Internal Testing;
3. successful real-device completion of the critical-path test matrix in this
   document; and
4. a documented go/no-go decision for the public-store compliance phase.

Do not claim this milestone is complete based only on Simulator, Android
Emulator, `vite preview`, or an unsigned local APK. Voice, microphone,
authentication persistence, audio, keyboard, and app lifecycle must be proven
on physical devices.

## 1. Product and policy decisions already made

These are requirements, not open design questions:

- Standard Playbook Mobile is a companion app for existing coaching clients.
- Existing clients receive access through administrator-created accounts.
- There is no self-signup in the mobile app.
- There is no price, checkout, subscription selector, upgrade prompt, purchase
  link, or instruction to buy outside the app.
- The first beta does not implement Apple In-App Purchase or Google Play
  Billing.
- The native app contains the member product only. It does not contain the
  marketing site.
- The existing web member app remains supported at `/app`.
- Capacitor is the v1 native strategy. Do not begin a React Native rewrite.
- Supabase/Lovable remains the backend. Do not fork or replace it for mobile.
- Public launch comes only after the signed-beta gate and a separate compliance
  pass.

Use this exact internal policy statement when reviewing UI and metadata:

> Standard Playbook Mobile is a login-only companion application for existing
> coaching clients. It contains no purchase flow, external purchase link,
> pricing, upgrade solicitation, or instruction to purchase outside the app.

## 2. Current system — read before changing anything

### Frontend

- React 18 + TypeScript + Vite.
- The public website and member product currently share one Vite build.
- `src/main.tsx` mounts the public/web `App`.
- `src/App.tsx` owns the web route tree.
- The member code is lazy-loaded at `/login` and `/app/*`.
- `src/app/MemberAppRoutes.tsx` owns member routes.
- Member-specific styles are in `src/app/app.css` and scoped with
  `.member-app`.
- The member application has browser-dependent voice, audio, viewport,
  storage, and lifecycle behavior that must be tested in native WebViews.

### Backend

- Supabase project: `puidotfmyrouxezsorlt`, hosted inside Lovable Cloud.
- Authentication is email/password plus an active `public.members` row.
- There is no public self-signup UI.
- All member data is protected by RLS and the active-member kill switch.
- Edge Functions provide AI, voice, audio, debrief, flow, daily-frame, and
  life-target behavior.
- Mobile must use the same public Supabase URL and publishable key as web.
- Never put a service-role key, AI key, ElevenLabs secret, or other server
  secret into the native bundle.

### Deployment ownership

There are three different production paths:

| Change | Deployment owner |
|---|---|
| `src/**`, web frontend | Cloudflare Pages from `main` |
| `supabase/functions/**` | Lovable Cloud; manually request deploy in Lovable chat |
| `supabase/migrations/**` | Manually execute reviewed SQL in Lovable Cloud SQL editor |

The mobile project introduces a fourth path:

| Change | Deployment owner |
|---|---|
| `ios/**`, iOS archive | Xcode/App Store Connect/TestFlight |
| `android/**`, Android bundle | Android Studio/Gradle/Play Console |

Never press Lovable's Publish button. Never assume pushing a function deploys
it. Never run `supabase db push`, `supabase db reset`, or `supabase link`
against production.

Read before implementation:

- `docs/handoffs/member-app-status-handoff.md`
- `docs/handoffs/member-app-acceptance-report.md`
- `BLOCKED.md`
- `src/App.tsx`
- `src/app/MemberAppRoutes.tsx`
- `src/app/lib/auth.tsx`
- `src/app/hooks/useFlowAgentSession.ts`
- `src/app/lib/thetaAudio.ts`
- `public/_headers`

## 3. Non-breaking architecture

### 3.1 Build two entry points from shared application code

Keep the current web entry unchanged:

```text
index.html -> src/main.tsx -> src/App.tsx
```

Add a mobile-only entry:

```text
mobile.html -> src/mobile/main.tsx -> src/mobile/MobileApp.tsx
                                      -> src/app/MemberAppRoutes.tsx
```

The compiled native bundle must contain only the login and member product. It
must not navigate to the marketing route tree on startup.

Recommended source layout:

```text
src/mobile/
  main.tsx
  MobileApp.tsx
  MobileLoginRoute.tsx        # only if the shared login cannot route cleanly
  NativeBootstrap.tsx
  nativePlatform.ts
  nativeLinks.ts
  nativePermissions.ts
  nativeStorage.ts
  nativeAudio.ts              # add only when required by device evidence
  nativeLifecycle.ts
  mobile.css
```

Prefer shared components. Do not copy `src/app` into a second tree. A mobile
adapter may import Capacitor; shared business components should not import
Capacitor directly unless the native behavior is inseparable and guarded.

### 3.2 Keep routing mode explicit

The current app uses `BrowserRouter`. Capacitor can support browser history,
but native deep links and refresh behavior must be intentional.

Preferred implementation:

- extract the providers and route content needed by both surfaces;
- keep `BrowserRouter` for the web app;
- use a mobile router configured and tested for bundled assets;
- preserve canonical in-app paths such as `/app/core4` in a single route map;
- translate external native links into those internal paths in one adapter.

Do not globally replace `BrowserRouter` in `src/App.tsx`. Do not mass-edit all
member navigation calls until the mobile router has a failing test proving it
is necessary.

### 3.3 Use bundled assets, not a remote website wrapper

Capacitor `webDir` must point to a mobile-specific build output such as
`dist-mobile`. Do not set `server.url` to the production website in release
configuration. A development-only live-reload URL may be used locally and must
never be committed as the release behavior.

This keeps the app functional as a real packaged application shell and avoids
turning the binary into a generic web bookmark.

### 3.4 Use a platform adapter boundary

Expose small functions/hooks such as:

```ts
isNativePlatform()
openExternalUrl(url)
shareOrDownloadFile(input)
requestMicrophonePermission()
getAppLifecycleState()
persistNativePreference(key, value)
```

Web implementations must retain current behavior. Native implementations may
use Capacitor plugins. Avoid platform checks scattered across dozens of pages.

## 4. Repository and Git guardrails

Before implementation:

1. Confirm `git status --short`.
2. Preserve every pre-existing user change.
3. Create a branch such as `codex/mobile-capacitor-beta` unless the user directs
   otherwise.
4. Record the current web build result and key bundle filenames.
5. Do not combine unrelated cleanup, redesign, or dependency upgrades with the
   mobile conversion.

Every phase must preserve these regression gates:

```bash
npm run build
npm run lint
```

The current repo may contain pre-existing lint failures. If so, capture the
baseline exact output before editing and require no new failures in changed
files. Do not silently reformat the whole repository.

Add scripts rather than changing existing meanings:

```json
{
  "build": "vite build",
  "build:mobile": "vite build --config vite.mobile.config.ts",
  "mobile:sync": "npm run build:mobile && cap sync",
  "mobile:ios": "npm run mobile:sync && cap open ios",
  "mobile:android": "npm run mobile:sync && cap open android"
}
```

`npm run build` must continue producing the same web application for
Cloudflare Pages.

## 5. Phase-by-phase implementation

## Phase 0 — prerequisites and ownership

### User-owned prerequisites

Confirm or create:

- Apple Developer organization membership.
- App Store Connect access with Account Holder/Admin/App Manager roles as
  appropriate.
- Google Play Console organization account.
- D-U-N-S and legal entity data matching both accounts.
- A dedicated app support email.
- Public privacy-policy URL.
- Public support URL.
- Final app display name.
- Approved bundle ID/package name; default proposal:
  `com.standardplaybook.app`.
- At least one physical iPhone and one physical Android phone.
- A permanent fictional reviewer/beta account with full member access.

Do not block local shell work while account enrollment is pending, but account
verification can block signed distribution. Surface this immediately.

### Agent deliverable

Create `docs/mobile-release-facts.md` containing only non-secret facts and
placeholders:

- app name;
- bundle ID/package;
- Apple team ID placeholder;
- Play application ID;
- support/privacy URLs;
- minimum supported OS decisions;
- account status;
- reviewer-account owner (never store password in Git).

Gate: facts and missing prerequisites are explicit.

## Phase 1 — freeze and characterize the web baseline

Run and record:

- `git status --short`;
- `npm run build`;
- `npm run lint`;
- key route smoke tests for `/`, `/login`, `/app`;
- production environment variable names, never secret values;
- current mobile viewport screenshots for login, hub, Core 4, playbook, a text
  flow, voice flow, debrief, life targets, and theta audio.

Create a short baseline report under `docs/mobile/`. Include known failures.

Gate:

- web build output is known;
- no hidden dependency on a local-only environment value;
- all existing user changes are accounted for.

## Phase 2 — introduce the mobile build without native projects

Implement:

1. `mobile.html`.
2. `vite.mobile.config.ts` with output `dist-mobile`.
3. `src/mobile/main.tsx`.
4. `src/mobile/MobileApp.tsx`.
5. Mobile-only provider and routing composition.
6. `build:mobile` script.

Requirements:

- `/login` or the mobile login route renders directly.
- Authenticated users reach the member hub.
- No marketing page is bundled into the mobile entry through direct imports.
- The member application retains existing scoped theme behavior.
- The web build remains unchanged in behavior.
- Mobile production environment variables are validated at startup with a
  useful non-secret error screen if absent.
- `VITE_ELEVENLABS_AGENT_ID` must be present during mobile production builds;
  otherwise Vite can dead-code-eliminate the voice path, as happened before.

Add a bundle inspection gate:

- no Supabase service-role key name/value;
- no Anthropic/OpenAI/ElevenLabs secret;
- no marketing checkout URLs;
- no Stripe purchase links;
- expected public Supabase URL and publishable key only.

Gate: `npm run build` and `npm run build:mobile` both pass, and the mobile build
runs in a normal browser at mobile viewport without importing the marketing
route tree.

## Phase 3 — add Capacitor and native projects

Install a single compatible Capacitor major version for:

- `@capacitor/core`;
- `@capacitor/cli`;
- `@capacitor/ios`;
- `@capacitor/android`;
- `@capacitor/app`;
- `@capacitor/browser`;
- `@capacitor/keyboard`;
- `@capacitor/status-bar`;
- `@capacitor/preferences`;
- `@capacitor/share`;
- `@capacitor/filesystem` only if file evidence requires it.

Do not install push, biometric, or background-audio plugins in the foundation
commit. Add capabilities only as their phase begins.

Create `capacitor.config.ts`:

- `appId`: approved stable identifier;
- `appName`: approved name;
- `webDir`: `dist-mobile`;
- no production `server.url`;
- explicit keyboard/status-bar preferences only after device testing.

Run:

```bash
npx cap add ios
npx cap add android
npm run mobile:sync
```

Commit the `ios/` and `android/` projects unless the chosen team policy
explicitly says otherwise. Native signing secrets, keystores, provisioning
profiles, local SDK paths, and generated archives must be ignored.

Set minimum OS versions based on the current Capacitor release and project
audience; document the choice. Target the current Google Play-required API
level at submission time, not a hardcoded value copied from an old plan.

Gate:

- iOS project compiles in Simulator;
- Android project compiles in Emulator;
- both launch the bundled member app;
- neither requires the production website to render its first screen;
- normal web build still passes.

## Phase 4 — native shell and lifecycle

Implement and verify:

- splash screen and application icon set;
- safe-area padding on every top-level member surface;
- status-bar appearance in light and dark themes;
- Android hardware back behavior;
- iOS swipe/back behavior where supported;
- keyboard resize behavior on chat, login, debrief, and life-target forms;
- app background/resume handling;
- connection-loss and backend-unavailable screen;
- external URLs opened using the system browser;
- mail links handled by the OS;
- no exit from the native app into marketing routes by accidental navigation.

Do not hide layout problems with a global arbitrary padding. Use safe-area
tokens in the shell and immersive frame, then test individual exceptions.

Gate: physical-device shell smoke test passes on one iPhone and one Android
phone, excluding voice/audio feature acceptance.

## Phase 5 — authentication and closed-access behavior

Preserve the existing security model:

- Supabase email/password login;
- `members` row required;
- `is_active` required;
- admin deactivate/reactivate remains authoritative;
- RLS remains the data boundary.

Implement/test:

- session persists across force-quit and relaunch;
- token refresh after backgrounding;
- expired/invalid refresh token returns cleanly to login;
- deactivated account loses data access and cannot silently remain usable;
- sign-out clears user-specific temporary state;
- switching accounts does not expose the prior user's local data;
- no self-signup, forgot-password purchase copy, or access-sales link;
- login text uses neutral companion-app wording.

Audit local storage keys including:

- `life-targets-storage`;
- `theta-track-session`;
- `theta_session_id`;
- theme preference;
- flow mode preference;
- sidebar preference.

Classify each as user-specific or device-wide. Clear user-specific data on
sign-out/account change. Use Capacitor Preferences only where WebView storage
loss would damage the experience; do not gratuitously migrate every key.

Gate: the auth lifecycle matrix passes on physical iOS and Android devices.

## Phase 6 — microphone and ElevenLabs voice

Treat voice as its own risk milestone.

Native configuration:

- iOS `NSMicrophoneUsageDescription` with plain-language purpose;
- Android `RECORD_AUDIO` permission;
- no unused camera/location permissions;
- verify secure HTTPS/WSS transport;
- preserve required `blob:`/worklet behavior inside the packaged WebView.

Test states:

1. permission not yet requested;
2. allowed;
3. denied once;
4. permanently denied / settings required;
5. microphone in use by another application;
6. wired headset;
7. Bluetooth headset;
8. interruption by phone call/Siri/Google Assistant;
9. app backgrounded during connection;
10. network loss during a flow;
11. screen locked during a session;
12. reconnect/retry without duplicate conversations.

Instrument non-sensitive diagnostics for beta:

- connection phase;
- permission state;
- transport selected;
- session ID or correlation ID where safe;
- sanitized server error code;
- no transcript or personal answer in diagnostic logs by default.

Do not change the proven server transport or ElevenLabs agent configuration
based on speculation. Capture device evidence first. Never edit AgencyBrain's
unprefixed ElevenLabs tools; Standard Playbook owns only the `sp_*` tools.

Gate: one complete voice flow succeeds on physical iOS and Android, with one
connection and no retry loop. Text mode must still work after voice changes.

## Phase 7 — generated audio, files, and sharing

Verify current theta/90 Day Audio behavior in both WebViews.

Implement the smallest native layer required for:

- play/pause/seek;
- device audio route changes;
- downloaded/generated file handling;
- native share sheet;
- clear user feedback while generating/downloading;
- cleanup of temporary files;
- no accidental backup of large generated temporary files.

Background/lock-screen playback is optional for the first signed beta. If it
is not implemented, the UI must not promise it. If implemented, add the
appropriate iOS background mode and Android media-session/service deliberately
and extend the test matrix.

Gate: generated audio can be created, played, stopped, and shared or saved on
both physical platforms without exposing signed URLs or secrets.

## Phase 8 — critical product regression

Run the following as a normal member on both platforms:

- login and relaunch;
- Hub weekly score;
- all four Core 4 completions and notes;
- create/schedule/complete a Power Play;
- drag/set One Big Thing;
- Daily Frame completion;
- Monthly Mission creation;
- Life Targets brainstorm through cascade;
- text Flow completion and analysis;
- voice Flow completion;
- Debrief completion and coaching analysis;
- theta/90 Day Audio generation and playback;
- dark/light theme;
- sign out and sign back in.

Run admin/security checks separately:

- client A cannot see client B's data;
- inactive member cannot access tables/functions;
- reviewer account contains fictional data;
- service secrets are absent from the binary;
- production backend remains accessible during review.

Gate: no P0/P1 defects and no known data-loss issue. P2 issues must be listed
with owner and disposition before distribution.

## Phase 9 — beta-only observability and support

Before external testers, establish:

- a crash-reporting decision;
- a privacy-reviewed error-reporting provider or a deliberate no-SDK beta
  logging strategy;
- app version/build number visible in settings or support diagnostics;
- a support contact inside the app;
- a sanitized diagnostic export or copy action;
- backend correlation IDs for failed Edge Function calls where feasible.

Do not add advertising SDKs, tracking pixels, Meta Pixel, or website analytics
to the mobile bundle. Any telemetry must be disclosed and data-minimized.

Gate: a tester can report a problem with version, platform, and sanitized error
context without sending private journal content.

## Phase 10 — prepare signed distribution

### iOS

In Xcode/App Store Connect:

- choose the correct organization team;
- register the bundle ID;
- configure automatic/manual signing per team policy;
- set version and monotonically increasing build number;
- provide icons and launch assets;
- archive a Release build;
- run archive validation;
- upload to App Store Connect;
- complete export-compliance questions;
- add beta description and review notes;
- add a working demo/reviewer account through secure App Store Connect fields;
- distribute first internally, then to an external TestFlight group if needed.

The reviewer account password must never be committed to Git.

### Android

In Android Studio/Play Console:

- finalize application ID;
- use Play App Signing;
- create and securely back up the upload key;
- never commit keystore or passwords;
- set versionName/versionCode;
- generate a signed release AAB;
- run bundle inspection;
- upload to Internal Testing;
- add testers and opt-in link;
- complete required preliminary app-content forms for the selected track.

Gate: signed builds are installable through TestFlight and Google Play Internal
Testing, not side-loaded.

## Phase 11 — signed-beta acceptance gate

Use release builds downloaded from the stores. Do not use Xcode-run or
Android-Studio-run binaries for final acceptance.

Required devices:

- at least one current iPhone;
- at least one smaller/older supported iPhone if available;
- at least one Pixel or reference Android device;
- at least one Samsung device before public launch;
- iPad only if the listing declares iPad support.

Required conditions:

- Wi-Fi;
- cellular;
- network loss/recovery;
- fresh install;
- upgrade from the prior beta build;
- force quit/relaunch;
- background for 30+ minutes;
- light/dark mode;
- large text/accessibility sizing sanity check;
- microphone allow/deny;
- low-storage sanity check for generated audio.

Exit criteria:

- both store-delivered builds install and launch;
- the entire Phase 8 journey passes;
- voice passes on both platforms;
- no cross-user storage leakage;
- no P0/P1 defect;
- known issues are documented;
- beta feedback channel is working;
- the web build and production website remain unaffected.

This is the first requested stopping point. Report evidence and wait for the
user's go-ahead before beginning public-store submission work.

## 6. Work deliberately deferred until after signed beta

These are public-launch requirements or enhancements, not prerequisites for
the first signed internal beta unless store tooling forces them earlier:

- member-facing account deletion initiation;
- public web deletion-request URL;
- final privacy policy/legal review;
- App Store Privacy Nutrition Label;
- Google Play Data Safety form;
- final age/content ratings;
- final screenshots, preview video, subtitle, keywords, and descriptions;
- production support workflow;
- push notifications and reminder preferences;
- universal links/App Links from emails and notifications;
- biometric local unlock;
- background audio;
- public TestFlight/external beta beyond the minimum useful pilot;
- public App Store and Play production submission.

Account deletion and privacy disclosures are mandatory before public launch.
Do not interpret their deferral as optional.

## 7. Follow-on public launch plan

After the user approves the signed beta:

1. Fix beta defects and repeat signed acceptance.
2. Add Settings/Profile with support, privacy, terms, version, logout, and
   deletion initiation.
3. Implement audited account/data deletion across Supabase Auth, member rows,
   user-owned tables, storage, and permitted retention records.
4. Publish the web deletion-request route required for Google policy.
5. Finalize privacy policy and data inventory for Supabase, Lovable, OpenAI,
   Anthropic, ElevenLabs, crash reporting, and notifications.
6. Decide and implement push notifications if included in v1 public scope.
7. Produce screenshots using fictional data.
8. Write store copy with no pricing or external purchase messaging.
9. Write Apple review notes explaining the existing-client companion model and
   supply a full-access demo account.
10. Complete Apple privacy/age/export-compliance forms.
11. Complete Google Data Safety/content/access/deletion forms.
12. Submit iOS for review and Android production rollout.
13. Respond to review questions with consistent product facts; do not invent a
    new business model in reviewer correspondence.
14. Release gradually where the stores support phased/staged rollout.
15. Monitor crashes, auth failures, voice failures, backend health, and support.

## 8. File-level change map

Expected new or changed files during the beta foundation:

```text
package.json                         # additive mobile scripts/dependencies
package-lock.json / bun.lock         # update consistently with repo policy
mobile.html                          # mobile Vite HTML entry
vite.mobile.config.ts                # separate dist-mobile build
capacitor.config.ts                  # native shell config
src/mobile/**                        # mobile composition/adapters only
src/app/MemberAppRoutes.tsx          # small extraction only if required
src/app/pages/Login.tsx              # neutral mobile-safe copy/route adapter
src/app/components/AppShell.tsx      # safe-area/native shell integration
src/app/components/ImmersiveFrame.tsx# safe area/keyboard integration
src/app/hooks/useFlowAgentSession.ts # evidence-driven WebView fixes only
src/app/lib/thetaAudio.ts             # evidence-driven native file/audio adapter
ios/**                               # generated native project + reviewed edits
android/**                           # generated native project + reviewed edits
.gitignore                           # signing/build artifacts only
docs/mobile/**                       # baseline and beta evidence
```

Files that should not need structural changes for the foundation:

```text
src/main.tsx
src/App.tsx
supabase/migrations/**
supabase/functions/**
public/_headers
```

If implementation appears to require changing those, pause and document why.
`public/_headers` does not control a bundled Capacitor WebView; copying random
CSP fixes there may change the website without fixing native behavior.

## 9. Definition of done for each commit/PR

Every meaningful change must state:

- what mobile behavior it adds;
- why shared web behavior remains safe;
- commands/tests run;
- physical devices tested, if applicable;
- known untested behavior;
- screenshots or logs without private user content;
- whether any backend deployment is required;
- whether any store-console action is required.

Never combine a backend migration with native shell generation in one opaque
commit. Keep foundation, lifecycle, auth, voice, audio, and distribution
changes reviewable independently.

## 10. Stop conditions requiring user input

Pause and ask before:

- choosing a different bundle ID after it has been registered;
- enrolling or paying for a developer account;
- accepting new Apple/Google legal agreements for the user;
- creating or rotating signing keys without a confirmed custody/backup plan;
- changing the business model or adding purchase messaging;
- enabling a paid third-party crash/analytics service;
- changing Supabase production schema or deploying new Edge Functions solely
  for mobile;
- changing the ElevenLabs production agent or its tools;
- deleting production user data;
- uploading a build to a public production track;
- submitting the app for public review/release.

Local builds, Simulator/Emulator compilation, non-secret project generation,
and internal code/tests are normal implementation work and do not need repeated
approval.

## 11. Handoff prompt for a fresh Codex agent

Use the following prompt with this repository:

> Implement the Standard Playbook Capacitor mobile beta by following
> `docs/mobile-app-beta-implementation-plan.md` exactly. Begin at Phase 0/1,
> inspect the current worktree, and preserve all existing user changes. The
> web build and `/app` browser product must continue working. Build a separate
> bundled mobile entry; do not wrap the remote website, do not rebuild in React
> Native, do not add purchases, and do not change the live Supabase/Lovable
> architecture without explicit approval. Work phase by phase with small
> commits and verification evidence. Stop only when blocked by a listed
> user-owned prerequisite or when signed TestFlight and Google Play Internal
> Testing builds pass the Phase 11 acceptance gate. Do not proceed to public
> store submission without approval.

## 12. Final beta evidence template

```markdown
# Mobile signed-beta report

## Builds
- iOS version/build:
- TestFlight group/build link or App Store Connect identifier:
- Android versionCode/versionName:
- Play Internal Testing release identifier:
- Git commit:

## Devices
- iOS:
- Android:

## Gates
- Web build:
- Mobile web build:
- iOS archive validation:
- Android release bundle:
- Auth persistence:
- Deactivation:
- Text flow:
- Voice flow:
- Debrief:
- Life Targets:
- Generated audio:
- Cross-user isolation:
- Secrets scan:

## Known issues
- Severity / issue / workaround / owner

## Public-launch blockers
- Account deletion:
- Privacy/data disclosures:
- Store metadata/assets:
- Push/background audio decisions:

## Recommendation
- GO / NO-GO for public-launch compliance phase
```
