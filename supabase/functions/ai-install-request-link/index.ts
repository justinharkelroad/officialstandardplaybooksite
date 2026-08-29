import { handleOptions } from "../_shared/cors.ts";
import { jsonResponse } from "../_shared/memberAuth.ts";

const EMAIL_ACCESS_DISABLED_RESPONSE = {
  error: "Email access is disabled. Ask the workshop host for a one-time activation code.",
};

Deno.serve((req) => {
  if (req.method === "OPTIONS") return handleOptions(req);
  return jsonResponse(EMAIL_ACCESS_DISABLED_RESPONSE, 410);
});
