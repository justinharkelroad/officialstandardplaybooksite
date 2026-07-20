import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders, handleOptions } from '../_shared/cors.ts';
import {
  isResponse,
  jsonResponse,
  requireActiveMember,
} from '../_shared/memberAuth.ts';

const BUCKET = 'flow-shares';
const MAX_PDF_BYTES = 10_485_760;
const MAX_BASE64_LENGTH = Math.ceil(MAX_PDF_BYTES / 3) * 4;
const PDF_MAGIC = '%PDF-';

interface CreateFlowShareBody {
  session_id: string;
  pdf_base64: string;
}

function decodeBase64(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function hasPdfMagic(bytes: Uint8Array): boolean {
  if (bytes.length < PDF_MAGIC.length) return false;

  for (let index = 0; index < PDF_MAGIC.length; index += 1) {
    if (bytes[index] !== PDF_MAGIC.charCodeAt(index)) return false;
  }

  return true;
}

function publicPdfUrl(supabaseUrl: string, token: string): string {
  return `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${token}.pdf`;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') return handleOptions(req);
  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);

  try {
    let body: Partial<CreateFlowShareBody>;

    try {
      body = await req.json() as Partial<CreateFlowShareBody>;
    } catch {
      return jsonResponse({ error: 'Invalid JSON body' }, 400);
    }

    if (!body.session_id || typeof body.session_id !== 'string') {
      return jsonResponse({ error: 'session_id is required' }, 400);
    }
    if (!body.pdf_base64 || typeof body.pdf_base64 !== 'string') {
      return jsonResponse({ error: 'pdf_base64 is required' }, 400);
    }
    if (body.pdf_base64.length > MAX_BASE64_LENGTH) {
      return jsonResponse({ error: 'PDF exceeds maximum size' }, 413);
    }

    const member = await requireActiveMember(req);
    if (isResponse(member)) return member;

    const { data: session, error: sessionError } = await member.supabase
      .from('flow_sessions')
      .select('id, user_id, status')
      .eq('id', body.session_id)
      .maybeSingle();

    if (sessionError) {
      console.error('create_flow_share session lookup failed:', sessionError.code, sessionError.message);
      return jsonResponse({ error: 'Failed to load Flow' }, 500);
    }
    if (!session || session.user_id !== member.userId) {
      return jsonResponse({ error: 'Forbidden' }, 403);
    }
    if (session.status !== 'completed') {
      return jsonResponse({ error: 'Flow is not completed' }, 409);
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    if (!supabaseUrl) {
      console.error('create_flow_share missing SUPABASE_URL');
      return jsonResponse({ error: 'Share service is unavailable' }, 500);
    }

    const { data: existing, error: existingError } = await member.supabase
      .from('flow_shares')
      .select('id, token')
      .eq('flow_session_id', body.session_id)
      .eq('revoked', false)
      .maybeSingle();

    if (existingError) {
      console.error('create_flow_share existing lookup failed:', existingError.code, existingError.message);
      return jsonResponse({ error: 'Failed to check existing share' }, 500);
    }
    if (existing) {
      return jsonResponse({
        url: publicPdfUrl(supabaseUrl, existing.token),
        token: existing.token,
        share_id: existing.id,
      });
    }

    let pdfBytes: Uint8Array;

    try {
      pdfBytes = decodeBase64(body.pdf_base64);
    } catch {
      return jsonResponse({ error: 'pdf_base64 is not valid base64' }, 400);
    }

    if (!hasPdfMagic(pdfBytes)) {
      return jsonResponse({ error: 'Uploaded file is not a PDF' }, 400);
    }
    if (pdfBytes.byteLength > MAX_PDF_BYTES) {
      return jsonResponse({ error: 'PDF exceeds maximum size' }, 413);
    }

    const token = crypto.randomUUID();
    const pdfPath = `${token}.pdf`;
    const { data: inserted, error: insertError } = await member.supabase
      .from('flow_shares')
      .insert({
        flow_session_id: body.session_id,
        created_by_user_id: member.userId,
        token,
        pdf_path: pdfPath,
        revoked: false,
      })
      .select('id')
      .single();

    if (insertError || !inserted) {
      if (insertError?.code === '23505') {
        const { data: winner } = await member.supabase
          .from('flow_shares')
          .select('id, token')
          .eq('flow_session_id', body.session_id)
          .eq('revoked', false)
          .maybeSingle();

        if (winner) {
          return jsonResponse({
            url: publicPdfUrl(supabaseUrl, winner.token),
            token: winner.token,
            share_id: winner.id,
          });
        }
      }

      console.error('create_flow_share insert failed:', insertError?.code, insertError?.message);
      return jsonResponse({ error: 'Failed to create share' }, 500);
    }

    const { error: uploadError } = await member.supabase.storage
      .from(BUCKET)
      .upload(pdfPath, pdfBytes, {
        contentType: 'application/pdf',
        cacheControl: '60',
        upsert: false,
      });

    if (uploadError) {
      console.error('create_flow_share upload failed:', uploadError.message);
      const { error: rollbackError } = await member.supabase
        .from('flow_shares')
        .delete()
        .eq('id', inserted.id);

      if (rollbackError) {
        console.error('create_flow_share rollback failed:', rollbackError.code, rollbackError.message);
      }

      return jsonResponse({ error: 'Failed to upload PDF' }, 500);
    }

    return jsonResponse({
      url: publicPdfUrl(supabaseUrl, token),
      token,
      share_id: inserted.id,
    });
  } catch (error) {
    console.error('create_flow_share unexpected error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
