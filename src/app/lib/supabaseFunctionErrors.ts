import { FunctionsHttpError } from "@supabase/supabase-js";

type SupabaseFunctionErrorPayload = {
  error?: string | { message?: string; code?: string };
  message?: string;
  detail?: string;
  error_code?: string;
};

type SupabaseFunctionErrorOptions = {
  fallbackMessage?: string;
};

const DEFAULT_FUNCTION_ERROR_MESSAGE = "Something went wrong. Please try again.";
export const EXPIRED_LOGIN_MESSAGE = "Your login has expired. Refresh the app and try again.";

const FRIENDLY_FUNCTION_ERROR_MESSAGES: Record<string, string> = {
  voice_provider_quota_exceeded:
    "AI voice is temporarily unavailable because the voice provider quota is exhausted. Try again after voice service is restored.",
};

function isGenericSupabaseFunctionMessage(message: string): boolean {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("edge function returned a non-2xx status code") ||
    normalized.includes("failed to send a request to the edge function") ||
    normalized.includes("relay error invoking the edge function")
  );
}

function hasResponseContext(error: unknown): error is { context: Response } {
  return !!(error as { context?: unknown } | null)?.context;
}

async function readErrorResponsePayload(response: Response): Promise<SupabaseFunctionErrorPayload | null> {
  try {
    const payload = await response.clone().json();
    if (payload && typeof payload === "object") {
      return payload as SupabaseFunctionErrorPayload;
    }
  } catch {
    // Fall through to text parsing below.
  }

  try {
    const text = await response.clone().text();
    if (!text.trim()) return null;

    try {
      const payload = JSON.parse(text) as SupabaseFunctionErrorPayload;
      if (payload && typeof payload === "object") return payload;
    } catch {
      return { message: text };
    }
  } catch {
    return null;
  }

  return null;
}

export async function extractSupabaseFunctionErrorPayload(error: unknown): Promise<SupabaseFunctionErrorPayload | null> {
  if (!hasResponseContext(error)) return null;

  const context = error.context;
  if (typeof context.clone === "function") {
    return readErrorResponsePayload(context);
  }

  return null;
}

export async function extractSupabaseFunctionErrorMessage(error: unknown): Promise<string> {
  if (error instanceof FunctionsHttpError || hasResponseContext(error)) {
    const payload = await extractSupabaseFunctionErrorPayload(error);
    if (typeof payload?.error === "string" && payload.error.trim()) {
      return payload.error;
    }
    if (
      payload?.error &&
      typeof payload.error === "object" &&
      typeof payload.error.message === "string" &&
      payload.error.message.trim()
    ) {
      return payload.error.message;
    }
    if (typeof payload?.message === "string" && payload.message.trim()) {
      return payload.message;
    }
  }

  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  return DEFAULT_FUNCTION_ERROR_MESSAGE;
}

function isExpiredSessionMessage(message: string): boolean {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("invalid or expired token") ||
    normalized.includes("token expired") ||
    normalized.includes("unauthorized: token expired") ||
    normalized.includes("invalid or expired jwt") ||
    normalized.includes("jwt expired") ||
    normalized.includes("invalid jwt") ||
    normalized.includes("invalid or expired session") ||
    normalized.includes("auth session missing") ||
    normalized.includes("session expired")
  );
}

function toFriendlySupabaseFunctionErrorMessage(message: string, fallbackMessage: string): string {
  const friendlyMessage = FRIENDLY_FUNCTION_ERROR_MESSAGES[message];
  if (friendlyMessage) return friendlyMessage;

  if (isExpiredSessionMessage(message)) {
    return EXPIRED_LOGIN_MESSAGE;
  }

  if (isGenericSupabaseFunctionMessage(message)) {
    return fallbackMessage;
  }

  return message;
}

export async function getSupabaseFunctionErrorMessage(
  error: unknown,
  options: SupabaseFunctionErrorOptions = {},
): Promise<string> {
  const rawMessage = await extractSupabaseFunctionErrorMessage(error);
  return toFriendlySupabaseFunctionErrorMessage(
    rawMessage,
    options.fallbackMessage || DEFAULT_FUNCTION_ERROR_MESSAGE,
  );
}
