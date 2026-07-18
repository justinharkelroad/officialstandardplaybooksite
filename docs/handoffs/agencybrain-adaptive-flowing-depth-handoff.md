# AgencyBrain — Adaptive Flowing Depth Implementation Handoff

> Prepared 2026-07-18 for the agent implementing Standard Playbook's adaptive Flowing experience in `/Users/standardmacbook/agencybrain`.
>
> Source implementation: Standard Playbook branch `codex/adaptive-flowing-depth`, commit `0153301`.
>
> Read this document completely before editing AgencyBrain. Also read AgencyBrain's root `AGENTS.md` and `supabase/AGENTS.md` completely and follow any newer repository rules.

## Exact copy/paste prompt for the AgencyBrain agent

```text
Implement the AgencyBrain work described in the attached
agencybrain-adaptive-flowing-depth-handoff.md file.

Read the attached handoff, the AgencyBrain root AGENTS.md, and
supabase/AGENTS.md completely before editing. Audit current code and production
contracts before making assumptions. Use the sibling Standard Playbook repo at
/Users/standardmacbook/officialstandardplaybooksite, remote branch
codex/adaptive-flowing-depth, commit 0153301, as the behavioral reference.

Required outcome: Prayer and Bible Flows gain persisted, adaptive Flowing depth
with exactly one active question. After an official answer, Flowing may provide
a reflection and one consequential probe. If a probe exists, withhold the next
official question until the member answers the probe; then render the resolution
before releasing the official question. Persist and resume that state across
refresh, retry, text/voice changes, and completion. Show the entire coach turn
in results and include it in analysis/memory distillation.

Do not copy Standard Playbook auth or tenancy assumptions. Preserve
AgencyBrain's verified owner agency scope and existing session-token runtime.
Do not route Staff Portal Flows through owner flow_sessions. Staff remains on
the legacy path unless you first add and verify a separate actor-scoped staff
schema, Edge contract, and x-staff-session support as described in the handoff.

Every active AgencyBrain Flowing, Prayer/Bible, Flow analysis/action, and Life
Targets/Personal Growth OpenAI default or deployment override covered by this
handoff must be exactly gpt-5.4-mini. Do not add or retain a gpt-4o-mini fallback
in those paths. Use max_completion_tokens and reasoning_effort for GPT-5.4 mini;
use JSON mode where JSON is required. Do not blindly rename transcription model
IDs or unrelated AI workflows; inventory them separately and report them.

Implement additively behind disabled-by-default depth configuration. Add tests
for the one-active-question invariant, retries, reload, editing, final-answer
probes, voice autosave, tenant isolation, and safe failure behavior. Run the
repository-required TypeScript, build, Vitest, Deno, migration-collision, Edge
config, and protected-workflow checks. Do not merge or push to main before an
authorized operator confirms the production migration/model secrets/functions
are deployed in the exact rollout order. Report completed work, test evidence,
remaining rollout steps, and any Staff Portal deferral explicitly.
```

## The product problem

The existing agent-driven Flow runtime advances a deterministic official question spine. Its coaching can reflect or challenge, but it cannot safely pursue the most consequential thing the member just revealed.

The earlier Standard Playbook implementation briefly rendered both an AI follow-up and the next official question. That created two active questions. A safety patch removed coaching questions, but it also removed depth.

The correct fix is a persisted state machine, not a stronger prompt:

```text
official answer saved
        |
        v
Flowing reflection + optional probe
        |
        +-- no probe --------> release next official question
        |
        +-- probe present ---> persist pending probe
                               hide official question
                                      |
                                      v
                               member probe answer
                                      |
                                      v
                               persist resolution
                                      |
                                      v
                               release official question
```

At every instant there is exactly one active question.

## What depth means

Flowing should track a revisable session thesis instead of treating each answer as a disconnected reflection:

- central tension;
- emerging pattern;
- desired shift;
- transcript-grounded evidence;
- confidence: low, medium, or high.

For the representative Prayer transcript, the deeper issue was not merely “be present with family.” The meaningful tension developed across the session: desire for presence, dependence on God, a building/movement identity, marital conflict, intent versus impact, and a declared relational action. Flowing should notice and carefully investigate that arc without inventing motives, diagnoses, shame, or divine certainty.

Allowed:

- “I notice a tension between wanting her to feel heard and describing your conclusion as already closed.”
- “There may be a difference between improving delivery and making genuine room for her perspective.”

Disallowed:

- “You are manipulating your wife.”
- “Your ego is terrified.”
- “God is dismantling your identity.”

Intensity means directness, not certainty.

## Non-negotiable interaction contract

1. Save the official answer before asking Flowing for coaching.
2. Flowing returns a reflection and either zero or one probe.
3. If a probe exists, `next_question` must be absent from every text, voice, tool, recovery, and rendered payload.
4. The next member message answers the probe, not the next official question.
5. Persist the probe answer separately from `responses_json`; never assign it the next official question ID.
6. Flowing resolves the probe answer and cannot ask a second probe from that answer.
7. Render or speak the resolution before releasing the official question.
8. A final-answer probe blocks `complete_flow_session` until resolved.
9. `get_flow_state` returns a pending probe and reports incomplete while it exists.
10. Refresh, reconnect, retry, and text/voice switching restore the pending probe.
11. Do not race coaching against a browser timeout. A late probe after the official question becomes visible is invalid.
12. Editing an official answer invalidates the coach row derived from the old answer.
13. Provider failure on the initial coaching call fails open with no probe.
14. Provider failure during resolution still saves the probe answer and releases the official spine; resolution may be null.
15. Database failure while saving a probe answer leaves the client pending so the member can retry.

## Critical production finding from Standard Playbook rollout

The first authenticated Standard Playbook production test exposed a response-contract race that unit and build checks had not caught.

### Observed failure

The initial coaching call persisted a valid probe, but the insert response returned the database field `id` instead of the public API field `coach_message_id`. The client used this condition:

```ts
Boolean(coach.probe && coach.coach_message_id)
```

It therefore treated the first response as reflection-only and rendered the deterministic next official question. A later `get_flow_state` call found the persisted pending probe and rendered it too. The member saw two active questions.

### Required prevention

1. The Edge insert response must explicitly serialize `id` as `coach_message_id` rather than returning the raw database row.
2. The text and voice clients must treat a non-empty persisted `probe` as the navigation authority even if an older endpoint omits `coach_message_id`.
3. `coach_message_id` remains required in the formal API contract, but navigation must fail closed on probe presence, not fail open on a missing identifier.
4. A newly inserted probe, an idempotently returned probe, and a reload-restored probe must all withhold `next_question` identically.
5. Add regression coverage for the insert serialization and perform a real deployed text test; unit tests alone did not expose this cross-layer mismatch.

The Standard Playbook fix is in functional commit `4141c07` and integrated production commit `53db345`.

## Verified AgencyBrain starting point

The AgencyBrain repository currently has:

- owner agent runtime in `public.flow_sessions`;
- `session_token`, `current_question_id`, and `agent_metadata` added by `20260518100000_phase_2a_session_columns.sql`;
- `start_flow_session`, `get_flow_state`, `submit_flow_answer`, `complete_flow_session`, and `save_flow_agent_responses`;
- text and ElevenLabs orchestration in `src/hooks/useFlowAgentSession.ts`;
- API types/calls in `src/lib/flowAgentApi.ts`;
- results in `src/pages/flows/FlowComplete.tsx` and `src/components/flows/FlowReportCard.tsx`;
- separate `staff_flow_sessions` and `analyze_staff_flow_session` contracts;
- a repository rule explicitly prohibiting Staff Portal from entering the Brain-only agent runtime until staff schema/token support exists.

The audit did not find a deployed `flow_coach_reflect` or portable `_shared/flowCoach` layer in AgencyBrain. Treat Standard Playbook as the reference implementation and AgencyBrain as an adaptation, not as an already-complete port.

## GPT-5.4 mini contract

- Required model ID: `gpt-5.4-mini`.
- Optional pinned snapshot: `gpt-5.4-mini-2026-03-17`.
- Official model reference: https://developers.openai.com/api/docs/models/gpt-5.4-mini
- AgencyBrain may keep Chat Completions initially.
- Use `max_completion_tokens`, not legacy `max_tokens`, for GPT-5.4 mini calls.
- Start coaching/resolution at `reasoning_effort: "low"`.
- Request `{ "type": "json_object" }` response format when the prompt requires JSON.
- Validate and bound every provider response before persistence.

Affected AgencyBrain paths found during the handoff audit that currently contain `gpt-4o-mini` and must be migrated as part of this Personal Growth scope:

- `supabase/functions/evaluate_answer_quality/index.ts`
- `supabase/functions/analyze_flow_session/index.ts`
- `supabase/functions/analyze_staff_flow_session/index.ts`
- `supabase/functions/refine_flow_action_item/index.ts`
- `supabase/functions/resolve_bible_scripture/index.ts`
- `supabase/functions/life_targets_measurability/index.ts`
- `supabase/functions/life_targets_monthly_missions/index.ts`
- `supabase/functions/life_targets_daily_actions/index.ts`

Add and use these environment variables where appropriate:

- `FLOW_COACH_MODEL=gpt-5.4-mini`
- `FLOW_COACH_DISTILL_MODEL=gpt-5.4-mini`
- `FLOW_ANALYSIS_MODEL=gpt-5.4-mini`
- `FLOW_ACTION_MODEL=gpt-5.4-mini`
- `FLOW_QUALITY_OPENAI_MODEL=gpt-5.4-mini`
- `BIBLE_FLOW_REFERENCE_MODEL=gpt-5.4-mini`
- `BIBLE_FLOW_RESPONSE_MODEL=gpt-5.4-mini`
- `BIBLE_FLOW_THEME_MODEL=gpt-5.4-mini`
- `LIFE_TARGETS_MODEL=gpt-5.4-mini`
- an explicit staff-analysis variable if AgencyBrain separates owner and staff analysis models.

Do not assume code defaults override production secrets. Inspect and explicitly replace any affected secret whose current value is `gpt-4o-mini`.

AgencyBrain contains unrelated `gpt-4o-mini` uses outside this Flow/Personal Growth scope. Inventory and report them. Do not silently convert unrelated structured parsers, training, Client Intelligence, Call Coach, or transcription paths without validating their API/options/output contracts. In particular, `gpt-4o-mini-transcribe` is a distinct transcription model ID and is not a search-and-replace target for this task.

## Portable source files

Use these Standard Playbook files from commit `0153301` as the behavioral reference:

- `supabase/functions/_shared/flowCoach/types.ts`
- `supabase/functions/_shared/flowCoach/index.ts`
- `supabase/functions/_shared/flowCoach/index_test.ts`
- `supabase/functions/flow_coach_reflect/index.ts`
- `supabase/functions/get_flow_state/index.ts`
- `supabase/functions/save_flow_agent_responses/index.ts`
- `supabase/functions/analyze_flow_session/index.ts`
- `supabase/functions/flow_coach_backfill/index.ts`
- `src/app/lib/flowAgentApi.ts`
- `src/app/hooks/useFlowAgentSession.ts`
- `src/app/hooks/useFlowCoach.ts`
- `src/app/pages/flows/FlowComplete.tsx`
- `src/app/components/flows/FlowReportCard.tsx`
- `supabase/migrations/20260718190000_adaptive_flow_coach.sql`

Do not wholesale replace AgencyBrain's corresponding runtime files. Diff them and port the state-machine behavior while preserving AgencyBrain's newer voice recovery, autosave, rich-text, interpolation, answer editing, completion-action loop, feature flags, logging, and error-sanitization rules.

## AgencyBrain schema design

### Owner/Brain path

Add an AgencyBrain migration with a unique unused 14-digit version. At handoff creation, `20260718190000` appeared available, but the implementing agent must rerun the repository-wide collision check immediately before creating/committing it.

Add the equivalent owner-path fields:

`flow_coach_messages`:

- `flow_session_id uuid` referencing `flow_sessions(id)` with deletion behavior matching existing personal-growth history rules;
- `question_id text`;
- `answer_excerpt text` with a strict bound;
- `answer_hash text`;
- `reflection text`;
- `probe text null`;
- `probe_answer text null`;
- `resolution text null`;
- `working_thesis jsonb not null default '{}'`;
- `memory_refs jsonb not null default '[]'`;
- `model text`;
- token counts;
- `probe_answered_at timestamptz null`;
- timestamps;
- unique `(flow_session_id, question_id)`;
- a partial index for pending probes.

If AgencyBrain already receives the earlier coach/memory schema from another branch, extend it additively rather than creating a parallel duplicate table.

`flow_templates`:

- `coach_enabled boolean not null default false` if absent;
- `coach_intensity` constrained to the shared union;
- `coach_prompt text`;
- `coach_question_notes jsonb`;
- `coach_depth_enabled boolean not null default false`;
- `coach_max_probes smallint not null default 0 check between 0 and 5`.

Depth must default off. Enable only Prayer and Bible with `coach_max_probes=3` after the runtime is deployed.

### Tenancy, ownership, and RLS

AgencyBrain is multi-tenant. Preserve these laws:

1. A coach row belongs to the verified owner/member who owns the referenced `flow_sessions` row.
2. Browser-supplied agency IDs, user IDs, profile data, memory, or answer history are never trusted.
3. Session-token Edge verification remains the runtime authorization boundary for owner agent sessions.
4. Service-role queries must always re-derive session owner and template from the verified session.
5. Any authenticated direct read policy must follow AgencyBrain's existing owner/agency access helpers and must not create cross-agency personal-coaching access.
6. Raw responses, probes, prayer text, and memory must not appear in logs.
7. Admin access must follow existing explicit AgencyBrain rules; `profiles.role` alone must not broaden personal coaching visibility.

Add tenant-isolation tests for two agencies and two actors in one agency.

### Staff path

Do not point Staff Portal at owner `flow_sessions` or owner coach tables.

Choose and report one of these explicitly:

**Recommended first release:** owner/Brain adaptive Flowing only. Keep Staff Portal on its existing legacy Flow path. Do not display a depth flag or agent route to staff.

**Future staff parity:** create additive actor-scoped staff coach persistence tied to `staff_flow_sessions`, verify every request with `x-staff-session`/`x-staff-session-token`, enforce same-agency staff scope below the UI, and preserve the existing staff session status contract. Staff profile/session/reflection rows may never receive permissive `USING (true)` policies. Only enable staff after separate text, voice (if supported), reload, and tenancy tests pass.

Do not make staff parity an accidental side effect of owner-path work.

## Edge contract

### `flow_coach_reflect`

Support two mutually exclusive modes.

Official answer request:

```json
{
  "session_id": "uuid",
  "session_token": "token",
  "question_id": "story",
  "answer": "member answer",
  "allow_probe": true
}
```

Response:

```json
{
  "coach_message_id": "uuid",
  "reflection": "transcript-grounded reflection",
  "probe": "one consequential question or null",
  "working_thesis": {
    "central_tension": "string or null",
    "emerging_pattern": "string or null",
    "desired_shift": "string or null",
    "evidence": ["short transcript-grounded evidence"],
    "confidence": "low"
  },
  "memory_refs": []
}
```

Probe-answer request:

```json
{
  "session_id": "uuid",
  "session_token": "token",
  "question_id": "story",
  "probe_answer": "member follow-up",
  "allow_probe": false
}
```

Response:

```json
{
  "coach_message_id": "uuid",
  "resolution": "what the follow-up clarified or null",
  "probe_resolved": true,
  "working_thesis": {},
  "memory_refs": []
}
```

Requirements:

- Verify the session before reading any member data.
- Use the persisted official answer, not browser text, as source of truth.
- Compare a SHA-256 answer hash to reject stale probes.
- Reuse the unique coach row on retries; do not duplicate provider billing.
- Serialize a newly inserted row with `coach_message_id: saved.id`; never return only raw `id`.
- A resolved historical row must return `probe=null` to live orchestration even though its stored probe remains available for summaries.
- Enforce per-template maximum probes and no probe for titles/trivial answers.
- Never ask more than one question in a probe.
- The resolution call has `allow_probe=false` and cannot recursively probe.
- Initial model/provider failure fails open.
- Resolution failure still persists the member's answer and resolves the pending state.
- Bound answer lengths, retrieved memory, prompt size, provider output, token budget, and daily coached-session usage.

### `get_flow_state`

Query the newest row where `probe is not null and probe_answer is null` for the verified session. Return:

```json
{
  "coach_probe": {
    "coach_message_id": "uuid",
    "question_id": "story",
    "reflection": "...",
    "probe": "..."
  },
  "is_complete": false
}
```

When no pending probe exists, `coach_probe` must be `null`. Do not expose another actor's coach state.

### `save_flow_agent_responses`

When an official answer changes, delete or invalidate the coach row derived from that exact question before allowing coaching to regenerate. Preserve AgencyBrain's existing rich-text sanitation, conditional-question pruning, analysis/PDF invalidation, current-question recalculation, and completion regeneration behavior.

### `analyze_flow_session`

Include each persisted reflection, probe, member probe answer, and resolution beneath the correct official answer. Include probe answers in bounded memory distillation. Never promote an AI thesis or resolution to a member fact; store exact member language as the evidence source.

### Backfill

Backfill is not a launch blocker. If implemented:

- require an active authorized admin;
- serialize small batches;
- resume with a cursor;
- deduplicate;
- never disable authentication or use a browser service-role bypass;
- prioritize Justin's history if authorized;
- keep external Warrior transcripts out of git and logs.

## Prompt and parser contract

The model must return structured JSON, not presentation prose:

```json
{
  "reflection": "string",
  "probe": "string or null",
  "working_thesis": {
    "central_tension": "string or null",
    "emerging_pattern": "string or null",
    "desired_shift": "string or null",
    "evidence": ["string"],
    "confidence": "low|medium|high"
  },
  "memory_refs": ["server-issued token only"]
}
```

Server rendering must:

- reject malformed JSON;
- reject a reflection containing a question;
- reject probes containing multiple question marks or not ending in `?`;
- force `probe=null` when disabled, ineligible, trivial, or budget-exhausted;
- strip fabricated history or memory references;
- preserve only exact server-authorized memory quotations;
- soften hard intensity for crisis, grief, or trauma;
- never claim to speak for God;
- keep long reflections roughly 60–140 words and trivial reflections to one short sentence.

Member text must be delimited as untrusted data so prompt injection in an answer cannot alter the system contract.

## Prayer and Bible charters

Port the Prayer and Bible configuration from Standard Playbook's adaptive migration, but map notes to AgencyBrain's actual question IDs after querying the live/current `questions_json`. Do not assume the two repositories have identical IDs or ordering.

Prayer should investigate:

- control versus surrender;
- speed/work versus presence;
- intent versus relational impact;
- identity story versus felt emotion;
- stated desire versus embodied action.

Bible should investigate:

- information versus formation;
- stated belief versus practiced behavior;
- control versus trust;
- insight versus measurable execution;
- start/stop/sustain story and cost.

Never replace the official Flow spine. Probes are bounded interruptions only.

## React text orchestration

Port the state behavior into AgencyBrain's `src/hooks/useFlowAgentSession.ts` while preserving its current protections.

Official-answer turn:

1. Submit the official answer.
2. Request coaching.
3. If there is no probe, render reflection followed by the official next question.
4. If there is a probe, store pending state and render reflection plus probe in one ordered assistant message.
5. Do not render or enable the official question.
6. Determine pending navigation from `Boolean(coach.probe)`, not from `Boolean(coach.probe && coach.coach_message_id)`. Use the identifier for persistence/diagnostics, not as permission to release the official spine.

Probe-answer turn:

1. Detect pending probe before resolving `current_question_id`.
2. Send input as `probe_answer` for the probe's original question ID.
3. On success, clear pending state.
4. Render resolution and official next question in one ordered assistant message.
5. Complete only after a final-answer probe resolves.

Reload:

1. Call `get_flow_state` before showing a first/current question.
2. Restore `coach_probe` if present.
3. Never flash the official question before replacing it with the probe.

## ElevenLabs/voice orchestration

AgencyBrain has extensive voice recovery rules. Preserve all of them.

- The application state machine, not the LLM prompt, owns progression.
- If `submit_flow_answer` returns `coach_probe`, the tool result returns `next_question=null` and `is_complete=false`.
- The voice agent speaks the persisted reflection and exact probe once, then stops.
- The next transcript/tool submit resolves the pending probe before resolving an official question ID.
- Suppress transcript autosave while a probe is pending so it cannot advance the official spine.
- Ignore punctuation-only and filler transcripts as AgencyBrain already requires.
- Duplicate/retried tool calls must return the existing pending probe without billing again.
- A resolved row must not re-open its original probe.
- Recovery after a tool error calls `get_flow_state` and honors `coach_probe` before `current_question`.
- Text/voice switching reuses the same session and pending probe.
- Do not expose backend failure details in spoken output.
- Do not call `start_flow_session` from the voice agent.

Because AgencyBrain requires browser proof for shared voice-hook changes, do not mark voice complete from unit tests alone. Capture the deployed bundle hash plus `[FlowAgentTool]`, `[FlowAgentToolReturn]`, `[FlowAgentToolError]`, and relevant Edge request/response metadata from a real authenticated voice turn without logging prayer content.

## Results, summaries, and analysis

Under each matched official response, display in order:

1. Flowing reflection;
2. Flowing probe;
3. member's follow-up answer;
4. Flowing resolution.

Do this in:

- `src/pages/flows/FlowComplete.tsx`;
- `src/components/flows/FlowReportCard.tsx`;
- any history/PDF path that currently shows official Flow responses;
- final analysis context.

Do not flatten probe answers into repeated official labels such as “I want God to know...”. Preserve the association with the original question.

## Required tests

### Shared core

- member answer is delimited as data;
- valid long answer may yield one probe;
- trivial/yes/no/title answer yields no probe;
- two-question probe is rejected;
- exhausted budget forces no probe;
- raw or fabricated memory is rejected;
- authorized exact quote is preserved;
- hard intensity softens for crisis context;
- malformed model JSON fails safely.

### Persistence/idempotency

- retry of official answer returns the same row;
- newly inserted coach response maps database `id` to API `coach_message_id`;
- client with a valid `probe` but missing `coach_message_id` still withholds the official question;
- resolved row returns no live pending probe;
- retry of probe answer does not rebill or duplicate;
- answer edit invalidates the stale row;
- provider failure before probe fails open;
- resolution provider failure saves answer and resolves;
- DB failure leaves client pending;
- pending query is session-scoped.

### Text

- no probe: reflection then next question;
- probe: reflection/probe and no next question;
- answer probe: resolution then next question;
- final-answer probe delays completion;
- refresh restores probe without flashing next question;
- text/voice switch preserves probe;
- rich-text official answers remain sanitized/rendered correctly;
- interpolated official prompts remain interpolated after release.

### Voice

- voice tool result with probe has no `next_question`;
- next transcript is routed to probe answer;
- autosave is suppressed while pending;
- stale empty/filler tool calls cannot advance;
- duplicate official submit does not release two questions;
- resolved probe cannot reopen;
- tool-error recovery prioritizes pending probe;
- final probe delays completion;
- deployed authenticated browser test proves the interaction.

### AgencyBrain security

- actor A cannot read/answer actor B's probe;
- agency A cannot read agency B coach rows;
- forged `user_id`/`agency_id` is ignored;
- invalid session token fails closed;
- service-role queries remain session-owner scoped;
- prayer/probe content is absent from provider/error logs;
- Staff Portal remains legacy and cannot enter owner runtime unless separate staff parity is deliberately implemented.

## Verification commands

The implementing agent must adapt commands to AgencyBrain's package scripts and run at minimum:

```bash
git diff --check
npm run typecheck
npm run build
npx vitest run src/tests/useFlowAgentSession.test.ts src/tests/flowAgentApi.test.ts
deno test supabase/functions/_shared/flowCoach/index_test.ts
deno check supabase/functions/flow_coach_reflect/index.ts
deno check supabase/functions/get_flow_state/index.ts
deno check supabase/functions/save_flow_agent_responses/index.ts
deno check supabase/functions/analyze_flow_session/index.ts
```

Also run:

- all new coach/state/security tests;
- relevant Flow session and completion tests;
- Staff Flow tests proving no regression;
- migration version collision check across `supabase/migrations`;
- Edge function/config parity gates;
- AgencyBrain's protected-workflow audit before push.

If `npm run typecheck` is not a real script, use the repository's actual TypeScript command and document it. Do not hide unrelated failures or widen types to `any`.

## Safe rollout order

AgencyBrain's Edge functions auto-deploy from `main`, so do not put schema-dependent code on `main` first.

1. Commit and push to a non-production feature branch.
2. Confirm the migration version is unique.
3. Apply the additive migration to production.
4. Verify tables, columns, indexes, RLS/policies, and Prayer/Bible configuration.
5. Set every affected production model secret explicitly to `gpt-5.4-mini`.
6. Deploy the changed/new Edge functions from the feature-branch commit with the correct existing `verify_jwt` settings.
7. Smoke-test Edge/schema/model compatibility using an authorized owner account.
8. Only then merge the exact verified commit into `main` and allow frontend/automatic Edge deployment.
9. Verify the deployed frontend bundle hash.
10. Run authenticated Prayer text tests.
11. Refresh during a pending probe and verify exact resume.
12. Verify final results include the entire coach turn.
13. Run the real authenticated voice test and capture required sanitized logs.
14. Keep Staff Portal on legacy Flows unless the separate staff parity implementation was explicitly completed and tested.
15. Run optional authenticated backfill last.

Do not weaken authentication to make a smoke test or backfill pass.

## Feature enablement and rollback

Depth must be controlled by database configuration, independently of code deployment.

Emergency rollback:

```sql
UPDATE public.flow_templates
SET coach_depth_enabled = false,
    coach_max_probes = 0
WHERE slug IN ('prayer', 'bible');
```

This restores reflection-only progression while preserving member history. Do not drop columns or delete coaching rows as rollback.

If the coach endpoint itself is unstable, also disable the existing coach-enabled configuration for the affected templates using the exact column names implemented in AgencyBrain. Preserve official Flow answering and completion.

## Definition of done

The AgencyBrain implementation is complete only when:

- Prayer and Bible owner Flows demonstrate materially deeper, transcript-grounded coaching;
- the fixed Flow spine remains deterministic;
- there is never more than one active question;
- text, voice, retry, edit, reconnect, refresh, and final completion preserve the state machine;
- the entire coach turn is persisted and visible in results;
- analysis and memory use probe answers without treating AI inference as fact;
- affected Personal Growth paths and production secrets use `gpt-5.4-mini` with no `gpt-4o-mini` fallback;
- tenancy, actor scope, and personal-coaching privacy tests pass;
- Staff Portal behavior is explicitly preserved or separately implemented, never accidentally mixed;
- migration and deployment evidence is recorded;
- real browser text and voice acceptance tests pass after deployment.

## Required completion report

The AgencyBrain agent must return:

1. branch and commit SHA;
2. exact files changed;
3. migration filename and production status;
4. model defaults and secret names verified;
5. Edge functions deployed and their verification settings;
6. unit/type/build/Deno/security results;
7. text transcript evidence showing one active question;
8. deployed bundle hash and sanitized voice log evidence;
9. Staff Portal status: intentionally legacy or separately completed;
10. backfill status;
11. any remaining manual/Lovable steps;
12. rollback readiness.

Do not report “done” if production secrets, migration, Edge deployment, bundle verification, or real voice proof are still pending. Label each pending item plainly.
