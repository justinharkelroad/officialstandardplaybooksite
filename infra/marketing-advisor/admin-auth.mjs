import {json} from './security.mjs';

export const FOUNDER_ID='9061db1c-2bf4-4f3d-870c-a522b5f1e1db';
export const ADMIN_ORIGINS=['https://myagencybrain.com','https://www.myagencybrain.com'];
export async function authorizeAdmin(request,env,fetcher=fetch) {
 const origin=request.headers.get('Origin');
 const allowed=ADMIN_ORIGINS.includes(origin)||(env.LOCAL_ADMIN_PREVIEW==='true'&&/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin||''));
 if(origin&&!allowed)return {error:json({error:'Open this inbox from Agency Brain.'},403)};
 if(!env.AGENCY_AUTH_URL||!env.AGENCY_PUBLIC_KEY)return {error:json({error:'The conversation inbox is not configured yet.'},503)};
 const authorization=request.headers.get('Authorization');
 if(!/^Bearer [^\s]+$/.test(authorization||''))return {error:json({error:'Sign in to your admin account.'},401)};
 try {
  const headers={Authorization:authorization,apikey:env.AGENCY_PUBLIC_KEY};
  const userResponse=await fetcher(env.AGENCY_AUTH_URL+'/auth/v1/user',{headers,signal:AbortSignal.timeout(8000)});
  if(!userResponse.ok)return {error:json({error:userResponse.status>=500?'Account verification is unavailable. Try again shortly.':'Sign in to your admin account.'},userResponse.status>=500?503:401)};
  const user=await userResponse.json();
  if(user.id!==FOUNDER_ID)return {error:json({error:'This inbox is restricted to Justin’s admin account.'},403)};
  const roles=await fetcher(env.AGENCY_AUTH_URL+'/rest/v1/user_roles?select=role&user_id=eq.'+encodeURIComponent(user.id)+'&role=eq.admin',{headers,signal:AbortSignal.timeout(8000)});
  if(!roles.ok)return {error:json({error:'We could not verify admin access. Try again shortly.'},503)};
  const rows=await roles.json();
  if(!Array.isArray(rows)||!rows.some(row=>row.role==='admin'))return {error:json({error:'Admin access is required.'},403)};
  return {userId:user.id};
 }catch{return {error:json({error:'We could not reach account verification. Try again shortly.'},503)};}
}
export function adminCors(response,request,env) {
 const origin=request.headers.get('Origin');
 const headers=new Headers(response.headers);
 if(ADMIN_ORIGINS.includes(origin)||(env.LOCAL_ADMIN_PREVIEW==='true'&&/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin||'')))headers.set('Access-Control-Allow-Origin',origin);
 headers.set('Access-Control-Allow-Headers','Authorization, Content-Type');
 headers.set('Access-Control-Allow-Methods','GET, POST, OPTIONS');
 headers.set('Vary','Origin');headers.set('Cache-Control','no-store');
 return new Response(response.body,{status:response.status,headers});
}
