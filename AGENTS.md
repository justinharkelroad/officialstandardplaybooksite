# Working Rules

- **Life Targets state must stay server-authoritative.** Debounced Daily Proof
  selection and idea-pool writes must flush successfully before Back, Continue,
  or quarter-change navigation. A clean/saved indicator must never be inferred
  solely because both browser and database state are empty.
- **Optional Daily Proof completion must be explicit.** Reviewing the Daily Proof
  step with zero selected actions is valid and must persist a reviewed marker;
  do not infer workflow completion only from non-empty action arrays.
- **Quarter and month resets must be actor-scoped below the UI.** Quarter reset
  must derive `auth.uid()` and delete the quarterly row plus all matching Brain
  Dump rows transactionally. Month reset must derive `auth.uid()` and archive
  only that member's active rows for the validated month. Keep downstream
  Weekly work unless the confirmation explicitly includes it.
