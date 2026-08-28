import { supabase } from "@/integrations/supabase/client";

export type AiInstallPortalPlatform = "claude" | "codex" | "both";
export type AiInstallVideoId = "day-1" | "day-2";

export interface AiInstallPortalProgress {
  content_id: AiInstallVideoId;
  max_progress: number;
  started_at: string | null;
  completed_at: string | null;
  last_viewed_at: string;
}

export interface AiInstallPortalStatus {
  access: {
    email: string;
    full_name: string | null;
    platform: AiInstallPortalPlatform;
    expires_at: string | null;
  };
  videos: Array<{
    id: AiInstallVideoId;
    vimeo_id: string;
    title: string;
  }>;
  progress: AiInstallPortalProgress[];
}

export interface AiInstallPortalAdminRow {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  platform: AiInstallPortalPlatform;
  source: "manual" | "purchase";
  is_active: boolean;
  expires_at: string | null;
  first_login_at: string | null;
  last_login_at: string | null;
  login_count: number;
  last_magic_link_sent_at: string | null;
  magic_link_send_count: number;
  last_magic_link_error: string | null;
  created_at: string;
  progress: Partial<Record<AiInstallVideoId, {
    max_progress: number;
    completed_at: string | null;
    last_viewed_at: string;
  }>>;
  downloads: { count: number; last_at: string | null };
  ready_submitted_at: string | null;
}

export async function requestAiInstallPortalLink(email: string): Promise<void> {
  await invokeFunction("ai-install-request-link", { email });
}

export async function loadAiInstallPortalStatus(): Promise<AiInstallPortalStatus> {
  return invokeFunction<AiInstallPortalStatus>("ai-install-portal", { action: "status" });
}

export async function recordAiInstallVideoEvent(input: {
  contentId: AiInstallVideoId;
  event: "play" | "progress" | "complete";
  progressPercent: number;
}): Promise<void> {
  await invokeFunction("ai-install-portal", {
    action: "video",
    content_id: input.contentId,
    event: input.event,
    progress_percent: input.progressPercent,
  });
}

export async function getAiInstallPortalDownload(assetId: string): Promise<string> {
  const result = await invokeFunction<{ url: string }>("ai-install-portal", {
    action: "download",
    asset_id: assetId,
  });
  return result.url;
}

export async function recordAiInstallPortalSignOut(): Promise<void> {
  await invokeFunction("ai-install-portal", { action: "sign_out" });
}

export async function loadAiInstallPortalAdminRows(): Promise<AiInstallPortalAdminRow[]> {
  const result = await invokeFunction<{ rows: AiInstallPortalAdminRow[] }>(
    "ai-install-portal-admin",
    { action: "list" },
  );
  return result.rows;
}

export async function grantAiInstallPortalAccess(input: {
  email: string;
  fullName: string;
  platform: AiInstallPortalPlatform;
  expiresAt: string | null;
}): Promise<{ magic_link?: { status?: string; error?: string } }> {
  return invokeFunction("ai-install-portal-admin", {
    action: "grant",
    email: input.email,
    full_name: input.fullName,
    platform: input.platform,
    expires_at: input.expiresAt,
  });
}

export async function setAiInstallPortalAccessActive(
  accessId: string,
  isActive: boolean,
): Promise<void> {
  await invokeFunction("ai-install-portal-admin", {
    action: "set_active",
    access_id: accessId,
    is_active: isActive,
  });
}

export async function resendAiInstallPortalLink(
  accessId: string,
): Promise<{ magic_link?: { status?: string; error?: string } }> {
  return invokeFunction("ai-install-portal-admin", {
    action: "resend",
    access_id: accessId,
  });
}

export async function resetAiInstallPortalActivity(
  accessId: string,
  includeReady = true,
): Promise<void> {
  await invokeFunction("ai-install-portal-admin", {
    action: "reset_activity",
    access_id: accessId,
    include_ready: includeReady,
  });
}

async function invokeFunction<T = Record<string, unknown>>(
  name: string,
  body: Record<string, unknown>,
): Promise<T> {
  const { data, error } = await supabase.functions.invoke(name, { body });
  if (error) {
    let message = error.message;
    const response = (error as { context?: Response }).context;
    if (response) {
      try {
        const payload = await response.json();
        if (payload?.error) message = String(payload.error);
      } catch {
        // Keep the Supabase client message when the response is not JSON.
      }
    }
    throw new Error(message);
  }
  if (data?.error) throw new Error(String(data.error));
  return data as T;
}
