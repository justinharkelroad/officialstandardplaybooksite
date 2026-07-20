# Standard Playbook Mobile release facts

Only non-secret release facts belong in this file. Reviewer passwords, signing
keys, provisioning profiles, and account recovery information must not be
committed.

| Fact | Current decision/status |
|---|---|
| App display name | Standard Playbook |
| Apple bundle ID | `com.standardplaybook.app` (proposed; user must confirm availability before registration) |
| Google Play application ID | `com.standardplaybook.app` (proposed; user must confirm before first Play upload) |
| Apple team ID | `[USER TO PROVIDE — non-secret identifier]` |
| Support email | `[USER TO PROVIDE]` |
| Support URL | `[USER TO PROVIDE — must be public]` |
| Privacy-policy URL | `[USER TO PROVIDE — must be public]` |
| Minimum iOS | iOS 14 (Capacitor 7 foundation; revisit against audience before distribution) |
| Minimum Android | Android 6 / API 23 (Capacitor 7 foundation) |
| Android target | API 35 or higher, matching the current Google Play submission requirement |
| Apple Developer membership | `[USER TO CONFIRM]` |
| App Store Connect role/agreements | `[USER TO CONFIRM]` |
| Google Play organization enrollment/agreements | `[USER TO CONFIRM]` |
| Physical iPhone availability | `[USER TO CONFIRM MODEL/OS]` |
| Physical Android availability | `[USER TO CONFIRM MODEL/OS]` |
| Reviewer/beta account owner | `[USER TO PROVIDE OWNER; password stays in store console/password manager]` |

Internal policy statement:

> Standard Playbook Mobile is a login-only companion application for existing
> coaching clients. It contains no purchase flow, external purchase link,
> pricing, upgrade solicitation, or instruction to purchase outside the app.
