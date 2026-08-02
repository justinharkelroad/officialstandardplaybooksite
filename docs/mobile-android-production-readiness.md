# Standard Playbook Android production readiness

Last verified: August 1, 2026

## Current state

- Google Play organization account: Standard Playbook INC.
- Package: `com.standardplaybook.app`.
- Internal track: `1.0.4 - Android 16 Maintenance` (`versionCode 5`) is
  available to internal testers.
- Production track: `1.0.3 - Android Public Launch` (`versionCode 4`) is at
  full rollout and available on Google Play in one country/region.
- Maintenance release: `1.0.4` (`versionCode 5`).
- Production submission: build 5 was submitted for Google Play review at 100%
  rollout on August 1, 2026. Publishing overview reports `Changes in review`.
  Managed publishing is off, so an approved change may publish automatically.
- Minimum Android: API 24.
- Compile and target Android: API 36.
- Google Play policy action: publish an API 36 production update by August 31,
  2026 to retain the ability to release app updates.
- Public privacy URL: `https://standardplaybook.com/privacy`.
- Public account-deletion URL:
  `https://standardplaybook.com/data-deletion`.
- Support: `info@standardplaybook.com` and
  `https://standardplaybook.com/contact`.

## Verified in source

- The native app is a login-only companion for existing members.
- The mobile bundle contains no marketing routes, purchase flow, pricing,
  upgrade solicitation, or external purchase instructions.
- Android requests only internet and microphone permissions. Microphone access
  is tied to deliberate voice features.
- External web, email, and phone links leave the app through the platform
  browser or operating-system handler.
- The app includes an in-app Settings & Support screen linking to support,
  privacy, and account deletion.
- Support diagnostics exclude journal answers, transcript text, passwords, and
  authentication tokens.
- The privacy policy describes Standard Playbook rather than Agency Brain and
  matches the app's account, coaching, AI, voice, and diagnostic data flows.
- Capacitor is upgraded to 8.5.0, including its Android 16 and iOS scene
  lifecycle foundations.
- Edge-to-edge behavior uses Capacitor's System Bars API and CSS safe-area
  insets. Unused legacy status-bar, keyboard, and splash-screen native plugins
  are no longer packaged.
- Android release builds enable R8 code shrinking, resource shrinking, and the
  optimized resource shrinker.

## Verification completed

- TypeScript: `npx tsc --noEmit`
- Unit tests: 15 passed
- Release-file ESLint: passed
- Production web build: passed
- Mobile production build: passed
- Mobile bundle inspection: passed (4.1 MB)
- Capacitor Android and iOS sync: passed
- Capacitor doctor: Android and iOS passed
- Android release lint: passed (0 errors; 29 non-blocking warnings)
- Android unit-test task: passed (`NO-SOURCE`)
- Android R8 release AAB: built (3.0 MB)
- Bundletool validation: passed; the AAB declares `minSdk 24`, `targetSdk 36`,
  `versionCode 5`, and `versionName 1.0.4` and includes R8 mapping metadata.
- Signed AAB: built outside Git; its signer certificate exactly matches the
  SHA-256 upload certificate registered in Google Play.
- Android 16/API 36 emulator: cold launch passed for the optimized release
  code. Login layout, light/dark system-bar contrast, edge-to-edge safe areas,
  keyboard resizing, Android back dismissal, and the offline banner passed;
  no app crash or fatal runtime error was observed.
- iOS simulator build with Xcode 26.6: passed for the iOS 15 deployment target
  and Capacitor 8 scene lifecycle.
- Google Play bundle processing: passed. Play reports build 5 as API 24+,
  target SDK 36, with the ReTrace mapping file attached.
- Internal testing: `1.0.4 - Android 16 Maintenance` was published to internal
  testers on August 1, 2026.
- Production: the same build and release notes were promoted and submitted for
  review after explicit authorization on August 1, 2026.
- Google Play pre-submission quick checks: passed with the message that the
  change can now be sent for review.
- Google Play post-submission checks: passed; Publishing overview reports
  `Your changes are now in review`.
- Google Play policy status: `App must target Android 16 (API level 36) or
  higher` is marked `Violation fixed`, fixed August 1, 2026 at 5:49 PM.

The repository-wide `npm run lint` command remains red on unrelated,
pre-existing lint debt and generated Android build intermediates. The files
changed for this release pass scoped ESLint.

## Required before rollout

1. Install build 5 on at least one physical Android device. Complete an
   authenticated smoke test: sign in, Daily, Weekly, Monthly, Quarterly, one Flow, one
   Debrief, voice/microphone permission, offline banner, external links,
   settings/support, and sign out.
2. Install the Play-delivered internal build on the physical test device and
   repeat the authenticated smoke test.
3. Accept the expected device-support warning caused by Capacitor 8's API 24
   minimum. Play reports 1,209 fewer supported legacy devices than build 4.
4. Monitor Google Play review and any reviewer feedback. Because managed
   publishing is off, an approval can start the configured 100% rollout
   automatically.
5. After publication, monitor crashes, ANRs, sign-in, and support reports.

## Suggested production release notes

> This update improves Android 16 compatibility, edge-to-edge display behavior,
> memory use, and app performance.

## Google Play deadline

Google Play previously reported that the production app's highest
non-compliant target was API 35 and required an API 36 update by August 31,
2026. After build 5 was accepted on the internal track and saved as a
production change, Play marked the policy item `Violation fixed` on August 1,
2026. The production change was submitted for review on August 1, 2026 and is
now awaiting Google's decision.
