# Install the Standard Agency Intelligence Skills

This is a one-time, project-local installation. The five skills analyze agency report exports on this computer. They do not upload reports or contact anyone.

## Instruction to send in Codex or Cowork

> Install all five Standard Agency Intelligence skills from the `STANDARD-SKILLS` folder for this platform and this `MY BIZ BRAIN` project only. Run `install-standard-skills.py` with the available Python interpreter. If Python is unavailable, stop and explain that the validated installer could not run; do not manually overwrite any existing skill folder. Do not create `READY.txt` unless all five skills validate. Do not upload, move, or alter any source agency report.

The installer detects Codex or Claude from the platform-specific starter file. If it needs an explicit platform, use:

- Codex: `python3 install-standard-skills.py --platform codex`
- Claude/Cowork: `python3 install-standard-skills.py --platform claude`

When the receipt says `5/5 skills passed`, return to the pre-work page and complete the `READY.txt` test.

If the skills were installed previously, the installer stops without changing them. Only use `--replace` when the attendee intentionally wants to update this Standard pack. Replacement moves the prior Standard skill folders and receipt into a timestamped `.standard-skill-backups` folder before installing the new copies.

## Safety boundary

- Source exports stay outside `MY BIZ BRAIN`; point a skill at them when needed.
- Nothing sends to staff, clients, or prospects without the agency owner's sign-off.
- Never treat a commission exception as proof of underpayment without the governing carrier schedule.
- Never confirm coverage, quote a rate, bind a policy, or change pricing, commission, or compensation.
