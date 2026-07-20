import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { corsHeaders, handleOptions } from '../_shared/cors.ts';
import { createServiceClient, jsonResponse } from '../_shared/memberAuth.ts';

const BUCKET = 'flow-shares';
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') return handleOptions(req);
  if (req.method !== 'GET') return jsonResponse({ error: 'Method not allowed' }, 405);

  try {
    const token = new URL(req.url).searchParams.get('token');
    if (!token || !UUID_PATTERN.test(token)) {
      return jsonResponse({ error: 'Shared PDF not found' }, 404);
    }

    const supabase = createServiceClient();
    const { data: share, error: shareError } = await supabase
      .from('flow_shares')
      .select('pdf_path, revoked')
      .eq('token', token)
      .maybeSingle();

    if (shareError) {
      console.error('download_flow_share lookup failed:', shareError.code, shareError.message);
      return jsonResponse({ error: 'Unable to load shared PDF' }, 500);
    }
    if (!share || share.revoked) {
      return jsonResponse({ error: 'Shared PDF not found' }, 404);
    }

    const { data: pdf, error: downloadError } = await supabase.storage
      .from(BUCKET)
      .download(share.pdf_path);

    if (downloadError || !pdf) {
      console.error('download_flow_share storage download failed:', downloadError?.message);
      return jsonResponse({ error: 'Shared PDF is unavailable' }, 404);
    }

    return new Response(pdf, {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="standard-playbook-flow.pdf"',
        'Content-Length': String(pdf.size),
        'Cache-Control': 'private, no-store, max-age=0',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('download_flow_share unexpected error:', error);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
});
