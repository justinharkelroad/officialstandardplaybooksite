import { supabase } from "@/integrations/supabase/client";
import * as tus from "tus-js-client";

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
  testimonial?: {
    enabled: boolean;
    intro_vimeo_id: string;
    prompt_dismissed_at: string | null;
    submitted_at: string | null;
  };
}

export interface AiInstallPortalTestimonial {
  id: string;
  original_filename: string;
  size_bytes: number;
  submitted_at: string;
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
  testimonial: AiInstallPortalTestimonial | null;
}

export interface AiInstallPortalAdminData {
  rows: AiInstallPortalAdminRow[];
  testimonialPromptEnabled: boolean;
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

export async function loadAiInstallPortalAdminRows(): Promise<AiInstallPortalAdminData> {
  const result = await invokeFunction<{
    rows: AiInstallPortalAdminRow[];
    testimonial_prompt_enabled: boolean;
  }>(
    "ai-install-portal-admin",
    { action: "list" },
  );
  return {
    rows: result.rows,
    testimonialPromptEnabled: result.testimonial_prompt_enabled ?? false,
  };
}

export async function skipAiInstallTestimonial(): Promise<string> {
  const result = await invokeFunction<{ prompt_dismissed_at: string }>(
    "ai-install-portal",
    { action: "testimonial_skip" },
  );
  return result.prompt_dismissed_at;
}

export async function uploadAiInstallTestimonial(
  file: File,
  onProgress: (percent: number) => void,
): Promise<{ testimonialId: string; submittedAt: string }> {
  const prepared = await invokeFunction<{
    testimonial_id: string;
    storage_path: string;
    upload_token: string;
  }>("ai-install-portal", {
    action: "testimonial_upload_url",
    filename: file.name,
    content_type: file.type,
    size_bytes: file.size,
    consent_granted: true,
  });

  try {
    await uploadTestimonialResumably(file, prepared.storage_path, prepared.upload_token, onProgress);
  } catch (error) {
    if (!shouldUseSignedUploadFallback(error)) throw error;
    const { error: fallbackError } = await supabase.storage
      .from("ai-install-testimonials")
      .uploadToSignedUrl(prepared.storage_path, prepared.upload_token, file, {
        contentType: file.type,
        upsert: false,
      });
    if (fallbackError) throw fallbackError;
    onProgress(100);
  }
  const completed = await invokeFunction<{ submitted_at: string }>("ai-install-portal", {
    action: "testimonial_complete",
    testimonial_id: prepared.testimonial_id,
  });
  return { testimonialId: prepared.testimonial_id, submittedAt: completed.submitted_at };
}

export async function setAiInstallTestimonialPromptEnabled(enabled: boolean): Promise<void> {
  await invokeFunction("ai-install-portal-admin", { action: "set_testimonial_prompt", enabled });
}

export async function getAiInstallTestimonialReviewUrl(testimonialId: string): Promise<string> {
  const result = await invokeFunction<{ url: string }>("ai-install-portal-admin", {
    action: "testimonial_download",
    testimonial_id: testimonialId,
  });
  return result.url;
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

async function uploadTestimonialResumably(
  file: File,
  storagePath: string,
  signedToken: string,
  onProgress: (percent: number) => void,
): Promise<void> {
  const projectUrl = String(import.meta.env.VITE_SUPABASE_URL || "");
  const publishableKey = String(import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "");
  const endpoint = resumableStorageEndpoint(projectUrl);

  await new Promise<void>((resolve, reject) => {
    const upload = new tus.Upload(file, {
      endpoint,
      retryDelays: [0, 1000, 3000, 5000, 10000],
      chunkSize: 6 * 1024 * 1024,
      uploadSize: file.size,
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      headers: {
        apikey: publishableKey,
        "x-signature": signedToken,
        "x-upsert": "false",
      },
      metadata: {
        bucketName: "ai-install-testimonials",
        objectName: storagePath,
        contentType: file.type,
        cacheControl: "3600",
      },
      onError: (error) => reject(error),
      onProgress: (uploaded, total) => {
        onProgress(total > 0 ? Math.round((uploaded / total) * 100) : 0);
      },
      onSuccess: () => resolve(),
    });
    upload.start();
  });
}

function resumableStorageEndpoint(projectUrl: string): string {
  const url = new URL(projectUrl);
  if (!url.hostname.endsWith(".supabase.co")) {
    return `${url.origin}/storage/v1/upload/resumable`;
  }
  const directStorageHost = url.hostname.replace(".supabase.co", ".storage.supabase.co");
  return `${url.protocol}//${directStorageHost}/storage/v1/upload/resumable`;
}

function shouldUseSignedUploadFallback(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error);
  return message.includes("new row violates row-level security policy") ||
    message.includes("Invalid Compact JWS") ||
    message.includes("InvalidUploadSignature");
}
