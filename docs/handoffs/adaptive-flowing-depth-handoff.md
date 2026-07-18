# Adaptive Flowing Depth — Standard Playbook + AgencyBrain Handoff

> Created 2026-07-18 after comparing the Standard Playbook Prayer Flow with Justin's Wake Up Warrior Bible/Prayer transcript.
>
> This document supersedes the former “short interleaved reflection only” interaction contract for agent-driven Prayer and Bible Flows. Existing security, ownership, memory-authenticity, and safety requirements remain mandatory.

## Copy/paste prompt for the next Standard Playbook or AgencyBrain agent

```text
Read docs/handoffs/adaptive-flowing-depth-handoff.md completely before editing.
Audit the current repository against every requirement and acceptance test in it.
Preserve the shared portable flowCoach core contract between Standard Playbook
and AgencyBrain. Implement only missing pieces, do not weaken the one-active-
question invariant, do not fabricate or loosely paraphrase member memory, and
do not introduce any gpt-4o-mini fallback. The required model is
gpt-5.4-mini. Run the documented verification suite and report exactly which
deployment, migration, backfill, and external dashboard steps remain.
```

## Product outcome

Flowing may interrupt the official Flow spine with one consequential coaching probe when a member's answer exposes a contradiction, emotional charge, causal story, identity pattern, or commitment that the remaining fixed questions will not adequately investigate.

There is always exactly one active question:

```text
official answer saved
        |
        v
Flowing reflection + optional probe
        |
        +-- probe=null ------> release next official question
        |
        +-- probe present ---> pause official question
                                  |
                                  v
                            member probe answer
                                  |
                                  v
                            Flowing resolution
                                  |
                                  v
                         release next official question
```

The coach cannot create an uncontrolled conversation. It receives a maximum probe budget from the template (three for Prayer and Bible), asks no more than one probe per official answer, never probes titles or trivial answers, and cannot ask a second probe in response to a probe answer.

## Why this architecture exists

The first Flowing version implemented one to three short reflection sentences after every answer. It could see the transcript but could not pursue anything it noticed. A later safety fix prohibited questions because a coach question and the deterministic next Flow question were rendered simultaneously.

That fixed the visible race but capped depth. The new protocol fixes the race at the state-machine level: Flowing may ask a probe, but the official question is withheld until that probe is resolved.

## Non-negotiable model contract

- Active default model: `gpt-5.4-mini`.
- Current pinned snapshot if pinning is required: `gpt-5.4-mini-2026-03-17`.
- Supported API surfaces: Responses and Chat Completions.
- Standard Playbook currently keeps its Chat Completions transport and uses `max_completion_tokens` plus `reasoning_effort`.
- Coaching and resolution start at `reasoning_effort: low`; tune only through transcript evals.
- No active code, fallback, example, or deployment setting may use `gpt-4o-mini`.
- Production must set or resolve these environment variables to `gpt-5.4-mini`: `FLOW_COACH_MODEL`, `FLOW_COACH_DISTILL_MODEL`, `FLOW_ANALYSIS_MODEL`, `FLOW_ACTION_MODEL`, `BIBLE_FLOW_REFERENCE_MODEL`, `BIBLE_FLOW_RESPONSE_MODEL`, `BIBLE_FLOW_THEME_MODEL`, and `LIFE_TARGETS_MODEL`.

Official model reference: https://developers.openai.com/api/docs/models/gpt-5.4-mini

## Shared coach protocol

### Official-answer result

```json
{
  "coach_message_id": "uuid",
  "reflection": "Transcript-grounded interpretation.",
  "probe": "One consequential question, or null?",
  "working_thesis": {
    "central_tension": "string or null",
    "emerging_pattern": "string or null",
    "desired_shift": "string or null",
    "evidence": ["short transcript-grounded evidence"],
    "confidence": "low|medium|high"
  },
  "memory_refs": []
}
```

### Probe-answer result

```json
{
  "coach_message_id": "uuid",
  "resolution": "What the probe answer clarified.",
  "probe_resolved": true,
  "working_thesis": {},
  "memory_refs": []
}
```

### Working-thesis law

The thesis is a revisable hypothesis, never a diagnosis or verdict. It gives each model call a coherent session arc: central tension, emerging pattern, desired shift, evidence, and confidence. User-facing language must distinguish observation from inference.

Allowed:

- “I notice a tension between wanting her to feel heard and describing the conclusion as closed.”
- “There may be a difference between improving delivery and making genuine room for her perspective.”

Disallowed:

- “You are strategically manipulating your wife.”
- “Your ego is terrified.”
- “God is dismantling your identity.”

Intensity is directness, not certainty.

## Persistence contract

Migration: `supabase/migrations/20260718190000_adaptive_flow_coach.sql`

`flow_coach_messages` adds `probe`, `probe_answer`, `resolution`, `working_thesis`, and `probe_answered_at`.

`flow_templates` adds `coach_depth_enabled` and `coach_max_probes` (0–5).

Prayer and Bible are configured with depth enabled, a maximum of three probes, hard-but-calibrated flow-specific charters, and question-level memory themes.

One row remains unique by `(flow_session_id, question_id)`. A retry returns the existing reflection/probe. A probe answer updates that same row. Editing the official answer regenerates the row and clears stale probe state.

## One-active-question invariant

1. If `probe` is non-null, do not render, speak, or enable `next_question`.
2. The next user input is a probe answer, not an official Flow answer.
3. Save it separately; never put it under the next official question ID in `responses_json`.
4. Render/speak `resolution`, then release `next_question`.
5. If the probe follows the final official answer, do not call `complete_flow_session` until the probe resolves.
6. On reload, `get_flow_state` returns `coach_probe`; resume it before the official spine.
7. Do not race adaptive generation against a client timeout. A late probe after an official question appears is invalid.

## Standard Playbook implementation map

### Portable core

- `supabase/functions/_shared/flowCoach/types.ts`: structured thesis, coach-turn, and resolution types.
- `supabase/functions/_shared/flowCoach/index.ts`: structured prompt assembly, optional probe decision, resolution prompt, calibrated inference, memory-safe rendering, and GPT-5 reasoning parameters.
- `supabase/functions/_shared/flowCoach/index_test.ts`: injection, memory, question, probe, budget, and thesis tests.

### Edge functions

- `flow_coach_reflect`: official answer → reflection/probe/thesis; `probe_answer` → persisted answer/resolution/revised thesis; enforces probe budget; defaults to GPT-5.4 mini.
- `get_flow_state`: returns pending `coach_probe` and withholds completion.
- `save_flow_agent_responses`: invalidates the edited answer's stale reflection/probe row.
- `analyze_flow_session`: includes probe answers in analysis and memory distillation; defaults to GPT-5.4 mini.
- `flow_coach_backfill`: defaults to GPT-5.4 mini.

### React client

- `src/app/lib/flowAgentApi.ts`: pending-probe types and `answerFlowCoachProbe`.
- `src/app/hooks/useFlowAgentSession.ts`: text and ElevenLabs pause/resume, reload recovery, final-answer completion hold, and voice autosave suppression.
- `src/app/hooks/useFlowCoach.ts`: legacy wizard remains reflection-only with `allow_probe=false`; loads the complete persisted coach turn for summaries.
- Completion/history views show reflection, probe, member probe answer, and resolution beneath the associated official answer.

## AgencyBrain transplant instructions

AgencyBrain must adopt the protocol, not merely copy the prompt.

1. Copy `_shared/flowCoach/index.ts` and `types.ts` file-for-file unless AgencyBrain already has a newer audited portable core. Resolve differences in favor of the one-active-question and memory-authenticity laws.
2. Apply the equivalent migration. Preserve AgencyBrain's tenancy/staff/owner identity columns and RLS helpers; do not copy Standard Playbook's single-member auth assumptions.
3. Update AgencyBrain's coach wrapper to support official-answer and `probe_answer` modes.
4. Update its state endpoint to return pending probes and withhold completion.
5. Update every agent/text/voice client path. Application state—not an LLM prompt—must withhold the official question.
6. Include probe answers in completion analysis and memory distillation.
7. Port the Prayer and Bible charters and question-theme notes, adapting terminology only where required.
8. Remove every `gpt-4o-mini` fallback in affected AgencyBrain Flow paths and set `gpt-5.4-mini` defaults.
9. Regenerate Supabase types and fix real mismatches; do not widen types to `any` merely to silence errors.
10. Run the acceptance suite before enablement.

## Memory and historical depth

Adaptive probing creates current-session depth. Longitudinal depth still requires history.

1. Run `flow_coach_backfill` for completed Standard Playbook sessions while authenticated as an active admin.
2. Prioritize Justin's account even if the broader user count is small; he is the quality reference user with the deepest history.
3. Treat the external Warrior export as a separate private import project. Never commit raw personal transcripts. Convert authorized material into member-scoped source sessions or reviewed insight rows through an authenticated, auditable importer.
4. Preserve source title, flow type, date, step/theme, exact member quote, and salience.
5. Never import Warrior's coach assertions as facts. Import the member's words and commitments, not speculative AI labels.

## Golden-transcript quality rubric

Blind-review representative Prayer and Bible answers, including the Corina/tonality transcript, on:

1. Specificity: concrete facts and language from the answer.
2. Arc continuity: develops rather than restarts the thesis.
3. Consequence: identifies the tension that matters most.
4. Probe value: asks something the fixed spine will not already ask.
5. Calibration: marks hypotheses as hypotheses.
6. Spiritual integrity: supports reflection without claiming to speak for God.
7. Memory authenticity: only server-authorized exact quotes appear.
8. Action depth: connects insight to measurable relational behavior.
9. Restraint: no probe for “no,” titles, or already-complete answers.
10. Interaction correctness: never two active questions.

Reject dramatic output that invents motive, shame, pathology, divine certainty, or memory.

## Acceptance tests

### Core

- Long meaningful answer may produce one probe.
- Trivial/yes/no answer produces one short reflection and no probe.
- Probe with two question marks is rejected.
- Exhausted budget forces `probe=null`.
- Raw/fabricated memory claims are rejected.
- Hard intensity softens on grief/crisis/trauma.

### Text and voice

- Reflection fully renders/speaks, then probe.
- Official next question is absent while the probe is pending.
- Probe answer is not stored as an official answer.
- Resolution completes before the next official question.
- Final-answer probe delays completion.
- Voice autosave does not consume a probe answer.
- Reconnect during a probe resumes it.

### Persistence and failure

- Refresh restores a pending probe.
- Retry does not insert or bill a duplicate row.
- Editing an official answer invalidates stale probe state.
- Completion/history includes the entire coach turn under the right answer.
- Probe answers are eligible for memory distillation.
- Initial provider failure fails open without a probe.
- Resolution provider failure still saves the probe answer and releases the spine.
- Database failure leaves client pending state intact for retry.

## Deployment order

Do not invert this order:

1. Commit and push the implementation to a non-production feature branch.
2. Apply `20260718190000_adaptive_flow_coach.sql` to production.
3. Regenerate/verify database types.
4. Set every model environment variable listed above to `gpt-5.4-mini`; do not rely on an unknown existing override.
5. Deploy `flow_coach_reflect`, `get_flow_state`, `save_flow_agent_responses`, `analyze_flow_session`, `flow_coach_backfill`, `resolve_bible_scripture`, `refine_flow_action_item`, and the three `life_targets_*` functions changed by the model migration from that feature branch.
6. Verify the production database has the new columns and both deployed coach endpoints respond without schema errors.
7. Merge/promote the exact verified feature-branch commit to `main`; Cloudflare may now deploy the frontend.
8. Run new Prayer Flows in text and voice.
9. Refresh during a pending probe and verify resume.
10. Verify the completed summary contains the entire coach turn.
11. Run authenticated memory backfill and verify a real callback.

The migration must precede edge and frontend deployment because both query the new columns.

## Exact production-rollout prompt

Give this to a Lovable or AgencyBrain agent that has production Supabase and GitHub access:

```text
Read docs/handoffs/adaptive-flowing-depth-handoff.md completely. Work from the
published adaptive-flowing-depth feature branch and do not rewrite the
implementation.

Execute the production rollout in this exact order:
1. Confirm the branch commit passes TypeScript, build, Deno checks, and the
   shared flowCoach tests.
2. Apply only supabase/migrations/20260718190000_adaptive_flow_coach.sql.
3. Verify flow_coach_messages has probe, probe_answer, resolution,
   working_thesis, and probe_answered_at; verify flow_templates has
   coach_depth_enabled and coach_max_probes; verify Prayer and Bible are
   enabled with coach_max_probes=3.
4. Set FLOW_COACH_MODEL, FLOW_COACH_DISTILL_MODEL, FLOW_ANALYSIS_MODEL,
   FLOW_ACTION_MODEL, BIBLE_FLOW_REFERENCE_MODEL, BIBLE_FLOW_RESPONSE_MODEL,
   BIBLE_FLOW_THEME_MODEL, and LIFE_TARGETS_MODEL to exactly gpt-5.4-mini.
   There must be no gpt-4o-mini override.
5. Deploy flow_coach_reflect, get_flow_state, save_flow_agent_responses,
   analyze_flow_session, flow_coach_backfill, resolve_bible_scripture,
   refine_flow_action_item, life_targets_daily_actions,
   life_targets_measurability, and life_targets_monthly_missions from the
   feature-branch commit. Preserve each function's existing verify_jwt setting
   from supabase/config.toml.
6. Smoke-test schema compatibility and report the deployed function versions.
7. Only after steps 2-6 succeed, merge that exact commit into main and verify
   Cloudflare deploys it. Do not make unrelated code or schema changes.
8. Test a new Prayer Flow in text: a meaningful answer may yield one Flowing
   reflection plus one probe; the next official question must remain hidden
   until the probe is answered; the resolution must appear before that next
   official question.
9. Refresh while the probe is pending and confirm it resumes. Complete the Flow
   and confirm the summary contains reflection, probe, member probe answer, and
   resolution under the correct official answer.
10. Repeat the one-active-question test in voice mode.

Backfill is non-blocking for launch because the app has almost no historical
users. Do not weaken authentication to run it. If an active admin session is
available, run serialized limit=10 batches; otherwise report it as deferred.

Stop immediately and report the exact failing step if any migration, function
deployment, model setting, or smoke test fails. Do not merge main after a
failure.
```

## Rollback

```sql
UPDATE public.flow_templates
SET coach_depth_enabled = false,
    coach_max_probes = 0
WHERE slug IN ('prayer', 'bible');
```

This returns Flowing to reflection-only behavior without deleting coach rows or memory. Do not drop columns or delete member history as a rollback.

## Status at handoff creation

- Portable structured core: implemented.
- Persistent migration and Prayer/Bible charters: implemented in repo; production application pending.
- Text and voice-agent orchestration: implemented in repo.
- Completion/history rendering: implemented in repo.
- GPT-5.4 mini migration: implemented in repo; production environment verification pending.
- Production migration/edge deployment: external rollout step.
- Authenticated historical backfill: external rollout step.
- Private Warrior-history import: not performed; requires a separate authorized import workflow.
