import { useState } from 'react';
import { supabase } from '@/app/lib/supabaseClient';
import { buildFlowPDFBlob } from '@/app/lib/generateFlowPDF';
import { FlowAnalysis, FlowQuestion, FlowSession, FlowTemplate } from '@/app/types/flows';

async function blobToBase64(blob: Blob): Promise<string> {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = '';
  const chunkSize = 0x8000;

  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }

  return btoa(binary);
}

async function readFunctionError(error: unknown): Promise<string> {
  const fallback = (error as { message?: string })?.message ?? 'Something went wrong';

  try {
    const context = (error as {
      context?: { json?: () => Promise<{ error?: string }> };
    })?.context;
    const body = await context?.json?.();
    return body?.error ?? fallback;
  } catch {
    return fallback;
  }
}

interface CreateShareParams {
  sessionId: string;
  session: FlowSession;
  template: FlowTemplate;
  questions: FlowQuestion[];
  analysis: FlowAnalysis | null;
  userName?: string;
}

export interface FlowShareResult {
  url: string;
  token: string;
  share_id: string;
}

export function useFlowShare() {
  const [creating, setCreating] = useState(false);
  const [revoking, setRevoking] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createShare = async (params: CreateShareParams): Promise<FlowShareResult> => {
    setCreating(true);
    setError(null);

    try {
      const blob = await buildFlowPDFBlob({
        session: params.session,
        template: params.template,
        questions: params.questions,
        analysis: params.analysis,
        userName: params.userName,
      });
      const pdfBase64 = await blobToBase64(blob);
      const { data, error: functionError } = await supabase.functions.invoke('create_flow_share', {
        body: { session_id: params.sessionId, pdf_base64: pdfBase64 },
      });

      if (functionError) {
        throw new Error(await readFunctionError(functionError));
      }

      const result = data as FlowShareResult;
      setShareUrl(result.url);
      setToken(result.token);
      return result;
    } catch (caughtError) {
      const message = caughtError instanceof Error
        ? caughtError.message
        : 'Failed to create share link';
      setError(message);
      throw caughtError;
    } finally {
      setCreating(false);
    }
  };

  const revokeShare = async (shareToken: string): Promise<void> => {
    setRevoking(true);
    setError(null);

    try {
      const { error: functionError } = await supabase.functions.invoke('revoke_flow_share', {
        body: { token: shareToken },
      });

      if (functionError) {
        throw new Error(await readFunctionError(functionError));
      }

      setShareUrl(null);
      setToken(null);
    } catch (caughtError) {
      const message = caughtError instanceof Error
        ? caughtError.message
        : 'Failed to revoke share link';
      setError(message);
      throw caughtError;
    } finally {
      setRevoking(false);
    }
  };

  return {
    creating,
    revoking,
    shareUrl,
    token,
    error,
    createShare,
    revokeShare,
  };
}
