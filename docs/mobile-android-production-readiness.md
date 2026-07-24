# Standard Playbook Android production readiness

Last verified: July 24, 2026

## Current state

- Google Play organization account: Standard Playbook INC.
- Package: `com.standardplaybook.app`.
- Internal track: active with `1.0.2 - Internal Beta 3` (`versionCode 3`).
- Production track: unlocked, inactive, and eligible for a new release.
- Next release: `1.0.3` (`versionCode 4`).
- Minimum Android: API 23.
- Target Android: API 35. This is valid for the initial public submission before
  Google Play's August 31, 2026 API 36 deadline.
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

## Verification completed

- TypeScript: `npx tsc --noEmit`
- Unit tests: 8 passed
- Release-file ESLint: passed
- Production web build: passed
- Mobile production build: passed
- Mobile bundle inspection: passed (4.1 MB)
- Capacitor Android sync: passed
- Android lint: passed
- Android unit-test task: passed (`NO-SOURCE`)
- Android debug APK: built
- Android release AAB: built (4.4 MB)
- The existing local upload keystore certificate matches the SHA-256 upload
  certificate registered in Google Play.

The repository-wide `npm run lint` command remains red on unrelated,
pre-existing lint debt and generated Android build intermediates. The files
changed for this release pass scoped ESLint.

## Required before rollout

1. Deploy the corrected public privacy and deletion pages.
2. Sign `app-release.aab` with the existing Google Play upload key. The upload
   keystore and its passwords must remain outside Git.
3. Install build 4 on at least one physical Android device and complete a
   smoke test: sign in, Daily, Weekly, Monthly, Quarterly, one Flow, one
   Debrief, voice/microphone permission, offline banner, external links,
   settings/support, and sign out.
4. In Google Play, select production countries/regions and create the
   production release.
5. Upload the signed build 4 AAB, add release notes, and resolve every Play
   pre-review error.
6. Preview and confirm the release, then send the changes for review.
7. After approval, publish with a controlled rollout and monitor crashes,
   ANRs, sign-in, and support reports before increasing to 100%.

## Suggested production release notes

> Standard Playbook is now available on Android for existing coaching members.
> This release brings the Daily, Weekly, Monthly, and Quarterly planning
> rhythm, guided Flows and Debriefs, voice-enabled coaching tools, mobile
> support diagnostics, and account/privacy controls into the native app.

## Next Android platform deadline

Upgrade the project to target API 36 before submitting an app update on or
after August 31, 2026. Treat that as the first post-launch platform maintenance
release rather than blocking this initial API 35 submission.
