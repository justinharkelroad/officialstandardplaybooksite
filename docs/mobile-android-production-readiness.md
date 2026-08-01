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
- Production draft: build 5 is saved in Publishing overview at 100% rollout,
  pending Google Play quick checks and an explicit send-for-review decision.
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
- Production: the same build and release notes were promoted into a saved
  production change; it has not been submitted for review.

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
3. Review the completed Google Play quick checks and the expected device-
   support warning caused by Capacitor 8's API 24 minimum. Play currently
   reports 1,209 fewer supported legacy devices than build 4.
4. Submit the saved `1.0.4` production change for review only after the
   authenticated physical-device pass is accepted.
5. After approval, publish with a controlled rollout and monitor crashes,
   ANRs, sign-in, and support reports before increasing to 100%.

## Suggested production release notes

> This update improves Android 16 compatibility, edge-to-edge display behavior,
> memory use, and app performance.

## Google Play deadline

Google Play reports that the production app's highest non-compliant target is
API 35 and requires a production update targeting API 36 or higher by August
31, 2026. Build 5 satisfies the source and bundle requirement; the policy item
will clear only after the production update is published successfully.
