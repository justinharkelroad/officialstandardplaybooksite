import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import {
  isResponse,
  jsonResponse,
  requireActiveMember,
} from '../_shared/memberAuth.ts';
import { handleOptions } from '../_shared/cors.ts';

const BUCKET = 'flow-shares';

interface RevokeFlowShareBody {
  token?: string;
}

serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') return handleOptions(req);
  if (req.method !== 'POST') return jsonResponse({ error: 'Method not allowed' }, 405);

  try {
    let body: RevokeFlowShareBody;

    try {
      body = await req.json() as RevokeFlowShareBody;
    } catch {
      return jsonResponse({ error: 'Invalid JSON body' }, 400);
    }

    if (!body.token || typeof body.token !== 'string') {
      return jsonResponse({ error: 'token is required' }, 400);
    }

    const member = await requireActiveMember(req);
    if (isResponse(member)) return member;

    const { data: share, error: shareError } = await member.supabase
      .from('flow_shares')
      .select('id, created_by_user_id, pdf_path, revoked')
      .eq('token', body.token)
      .maybeSingle();

    if (shareError) {
      console.error('revoke_flow_share lookup failed:', shareError.code, shareError.message);
      return jsonResponse({ error: 'Failed to load share' }, 500);
    }
    if (!share) {
      return jsonResponse({ error: 'Share not found' }, 404);
    }
    if (share.created_by_user_id !== member.userId) {
      return jsonResponse({ error: 'Forbidden' }, 403);
    }
    if (share.revoked) {
      return jsonResponse({ ok: true });
    }

    const { error: removeError } = await member.supabase.storage
      .from(BUCKET)
      .remove([share.pdf_path]);

    if (removeError) {
      console.error('revoke_flow_share object removal failed:', removeError.message);
      return jsonResponse({ error: 'Failed to delete shared PDF' }, 500);
    }

    const { error: updateError } = await member.supabase
      .from('flow_shares')
      .update({ revoked: true })
      .eq('id', share.id);

    if (updateError) {
      console.error('revoke_flow_share update failed:', updateError.code, updateError.message);
      return jsonResponse({ error: 'Failed to revoke share' }, 500);
    }

    return jsonResponse({ ok: true });
  } catch (error) {
    console.error('revoke_flow_share unexpected error:', error);
    return jsonResponse({ error: 'Internal server error' }, 500);
  }
});
