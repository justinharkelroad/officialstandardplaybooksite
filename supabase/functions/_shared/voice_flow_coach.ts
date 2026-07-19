import {
  detectFlowToolExecutor,
  getFlowConversationId,
} from "./flow_agent_runtime.ts";

export const REACT_CLIENT_TOOL_EXECUTOR = "react_client_tools";

export function shouldRunServerVoiceCoach(
  req: Request,
  body: Record<string, unknown> | null,
): boolean {
  if (body?.client_tool_executor === REACT_CLIENT_TOOL_EXECUTOR) return false;

  return Boolean(getFlowConversationId(body)) ||
    detectFlowToolExecutor(req) === "elevenlabs_server_webhook";
}
