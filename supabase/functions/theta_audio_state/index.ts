// theta_audio_state — ported to the Standard Playbook member app.
// Auth: requireActiveMember replaces the source's verifyRequest + agency/tier
// gates. Rows are member-owned (user_id).
import { corsHeaders, handleOptions } from "../_shared/cors.ts";
import { requireActiveMember } from "../_shared/memberAuth.ts";
import {
  THETA_CATEGORIES,
  thetaActorColumns,
  thetaRowBelongsToActor,
  validateThetaAffirmations,
  validateThetaSessionId,
  validateThetaTargets,
  validateThetaTone,
} from "./thetaAudio.ts";

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return handleOptions(req);

  try {
    const member = await requireActiveMember(req);
    if (member instanceof Response) return member;
    const admin = member.supabase;
    const userId = member.userId;

    const body = await req.json().catch(() => ({})) as Record<string, unknown>;
    const action = typeof body.action === "string" ? body.action : "";
    const session = validateThetaSessionId(body.sessionId);
    if (!session.ok) return json({ error: session.error }, 400);

    const { data: existingTarget, error: targetLookupError } = await admin
      .from("theta_targets")
      .select("*")
      .eq("session_id", session.value)
      .maybeSingle();

    if (targetLookupError) {
      console.error("[theta_audio_state] target lookup failed", targetLookupError);
      return json({ error: "Failed to load the audio session." }, 500);
    }

    const targetIsOwned = Boolean(existingTarget && thetaRowBelongsToActor(existingTarget, userId));

    if (action === "save_targets") {
      const targets = validateThetaTargets(body.targets);
      if (!targets.ok) return json({ error: targets.error }, 400);
      if (existingTarget && !targetIsOwned) {
        return json({ error: "Audio session not found." }, 404);
      }

      const record = {
        session_id: session.value,
        ...targets.value,
        ...thetaActorColumns(userId),
      };
      const result = existingTarget
        ? await admin
          .from("theta_targets")
          .update(record)
          .eq("id", existingTarget.id)
          .select()
          .single()
        : await admin
          .from("theta_targets")
          .insert(record)
          .select()
          .single();

      if (result.error) {
        console.error("[theta_audio_state] target save failed", result.error);
        return json({ error: "Failed to save targets." }, 500);
      }
      return json({ target: result.data });
    }

    if (action === "get_targets") {
      return targetIsOwned
        ? json({ target: existingTarget })
        : json({ target: null });
    }

    if (!targetIsOwned || !existingTarget) {
      return json({ error: "Save your targets before continuing." }, 404);
    }

    if (action === "save_affirmations") {
      const affirmations = validateThetaAffirmations(body.affirmations);
      if (!affirmations.ok) return json({ error: affirmations.error }, 400);
      const tone = validateThetaTone(body.tone);
      if (!tone.ok) return json({ error: tone.error }, 400);

      const actor = thetaActorColumns(userId);
      const records = THETA_CATEGORIES.flatMap((category) =>
        affirmations.value[category].map((text, orderIndex) => ({
          target_id: existingTarget.id,
          session_id: session.value,
          category,
          text,
          order_index: orderIndex,
          tone: tone.value,
          ...actor,
        }))
      );
      const { data, error } = await admin
        .from("theta_affirmations")
        .upsert(records, { onConflict: "session_id,category,order_index" })
        .select();

      if (error) {
        console.error("[theta_audio_state] affirmation save failed", error);
        return json({ error: "Failed to save affirmations." }, 500);
      }
      return json({ affirmations: data ?? [] });
    }

    if (action === "get_affirmations") {
      const { data, error } = await admin
        .from("theta_affirmations")
        .select("*")
        .eq("session_id", session.value)
        .eq("user_id", userId)
        .order("category")
        .order("order_index");

      if (error) {
        console.error("[theta_audio_state] affirmation load failed", error);
        return json({ error: "Failed to load affirmations." }, 500);
      }
      return json({ affirmations: data ?? [] });
    }

    return json({ error: "Unknown audio state action." }, 400);
  } catch (error) {
    console.error("[theta_audio_state] unexpected error", error);
    return json({ error: "Unexpected 90 Day Audio error." }, 500);
  }
});
