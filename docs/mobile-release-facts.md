# Standard Playbook Mobile release facts

Only non-secret release facts belong in this file. Reviewer passwords, signing
keys, provisioning profiles, and account recovery information must not be
committed.

| Fact | Current decision/status |
|---|---|
| App display name | Standard Playbook |
| Apple bundle ID | `com.standardplaybook.app` (native project configured; App Store registration remains to be verified) |
| Google Play application ID | `com.standardplaybook.app` (registered in Google Play) |
| Apple team ID | `[USER TO PROVIDE — non-secret identifier]` |
| Support email | `info@standardplaybook.com` |
| Support URL | `https://standardplaybook.com/contact` |
| Privacy-policy URL | `https://standardplaybook.com/privacy` |
| Account-deletion URL | `https://standardplaybook.com/data-deletion` |
| Minimum iOS | iOS 15 (Capacitor 8 foundation) |
| Minimum Android | Android 7 / API 24 (Capacitor 8 foundation) |
| Android production version | `1.0.3` (`versionCode 4`), full rollout |
| Android maintenance release | `1.0.4` (`versionCode 5`) |
| Android compile/target | API 36; required by Google Play for updates after August 31, 2026 |
| Google Play upload certificate SHA-256 | `B6:C5:C7:0A:10:B7:2D:DD:5F:EF:AE:06:34:D4:85:E8:89:1C:20:A3:3B:0A:8A:6C:F5:65:3D:DC:33:89:F3:D9` |
| Apple Developer membership | `[USER TO CONFIRM]` |
| App Store Connect role/agreements | `[USER TO CONFIRM]` |
| Google Play organization enrollment/agreements | Active organization account: Standard Playbook INC |
| Google Play current track | Internal testing `1.0.4 - Android 16 Maintenance` (`versionCode 5`) is available to testers; production `1.0.3 - Android Public Launch` (`versionCode 4`) remains live, with build 5 saved as an unsubmitted production change |
| Physical iPhone availability | `[USER TO CONFIRM MODEL/OS]` |
| Physical Android availability | A tester is signed in; confirm one complete install-and-use pass on a physical device before rollout |
| Reviewer/beta account owner | Standard Playbook admin; credentials stay only in the Play Console/password manager |

Internal policy statement:

> Standard Playbook Mobile is a login-only companion application for existing
> coaching clients. It contains no purchase flow, external purchase link,
> pricing, upgrade solicitation, or instruction to purchase outside the app.
