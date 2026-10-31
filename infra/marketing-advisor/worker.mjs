import {authorizeAdmin,adminCors} from './admin-auth.mjs';
import {MarketingInbox,inboxStub,snapshot,REVIEW_POLICY} from './inbox.mjs';
export {MarketingInbox};
import {generateReply} from './engine/core.mjs';
import {getKnowledge,BRANDS,OPENERS} from './knowledge.mjs';
import {TTL,MAX_TURNS,TOKEN_PATTERN,HOSTS,validMessage,clientSession,digest,randomToken,json} from './security.mjs';
const unavailable=()=>json({error:'Chat is unavailable right now. You can still use the next-step link below.'},503);
async function body(request) {
 if(!request.headers.get('Content-Type')?.startsWith('application/json'))throw new Error('Invalid content type');
 // Bound streamed bytes even when Content-Length is missing or dishonest.
 const reader=request.body?.getReader();if(!reader)throw new Error('Missing body');
 let size=0;const chunks=[];
 for(;;){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>16000){await reader.cancel();throw new Error('Body too large');}chunks.push(value);}
 const bytes=new Uint8Array(size);let offset=0;for(const part of chunks){bytes.set(part,offset);offset+=part.length;}
 return JSON.parse(new TextDecoder().decode(bytes));
}
async function consume(env,key,limits) {
 const stub=env.QUOTAS.get(env.QUOTAS.idFromName(key));
 const r=await stub.fetch('https://quota/consume',{method:'POST',body:JSON.stringify(limits)});
 return r.ok;
}
function sessionStub(env,token){return env.SESSIONS.get(env.SESSIONS.idFromName(token));}
export default {
 async fetch(request,env) {
  const url=new URL(request.url);
  try {
   if(url.pathname.startsWith('/admin/')) {
    if(request.method==='OPTIONS')return adminCors(new Response(null,{status:204}),request,env);
    const auth=await authorizeAdmin(request,env);
    if(auth.error)return adminCors(auth.error,request,env);
    let response;
    try {
     const target={ '/admin/conversations':'/list','/admin/conversation':'/detail','/admin/review':'/review' }[url.pathname];
     if(!target || (target==='/review'?request.method!=='POST':request.method!=='GET'))response=json({error:'Not found.'},404);
     else response=await inboxStub(env).fetch('https://inbox'+target+url.search,{method:target==='/review'?'POST':'GET',...(target==='/review'?{body:JSON.stringify({...await body(request),actor:auth.userId})}:{})});
    }catch{response=json({error:'The conversation inbox is unavailable. Try again shortly.'},503);}
    return adminCors(response,request,env);
   }
   if(url.pathname==='/health')return json({service:'standard-marketing-advisor',version:'2026-10-31-inbox-v2',ready:env.CHAT_ENABLED==='true'&&Boolean(env.OPENAI_API_KEY)});
   if(url.pathname.startsWith('/api/')) {
    if((request.headers.get('Origin') && request.headers.get('Origin')!==url.origin) || (request.method!=='GET' && request.headers.get('Origin')!==url.origin))return json({error:'Open the chat from its website.'},403);
    if(env.CHAT_ENABLED!=='true'||!env.OPENAI_API_KEY)return unavailable();
    const ipHash=await digest(request.headers.get('CF-Connecting-IP')||'local-development');
    if(url.pathname==='/api/session' && request.method==='POST') {
     const input=await body(request);
     if(Object.keys(input).some(key=>!['brand','reviewPolicy'].includes(key))||!BRANDS.includes(input.brand)||(input.reviewPolicy!==undefined&&input.reviewPolicy!==REVIEW_POLICY))return json({error:'Invalid chat request.'},400);
     if(!await consume(env,'create-ip-'+ipHash,{hour:5,day:10})||!await consume(env,'create-global',{day:1000}))return json({error:'Too many new chats. Please return to your existing conversation or try again later.'},429);
     const token=randomToken();const result=await sessionStub(env,token).fetch('https://session/init',{method:'POST',body:JSON.stringify({brand:input.brand,reviewPolicy:input.reviewPolicy})});
     if(!result.ok)return unavailable();return json({token,session:await result.json()});
    }
    const token=request.headers.get('Authorization')?.replace(/^Bearer /,'');
    if(!TOKEN_PATTERN.test(token??''))return json({error:'Start a new conversation.'},401);
    const stub=sessionStub(env,token);
    if(url.pathname==='/api/session' && request.method==='GET')return stub.fetch('https://session/read');
    if(url.pathname==='/api/session' && request.method==='DELETE')return stub.fetch('https://session/delete',{method:'DELETE'});
    if(url.pathname==='/api/click' && request.method==='POST') {
     const input=await body(request);return stub.fetch('https://session/click',{method:'POST',body:JSON.stringify(input)});
    }
    if(url.pathname==='/api/message' && request.method==='POST') {
     const input=await body(request);if(!validMessage(input))return json({error:'Send a message of up to 3,000 characters.'},400);
     // The session owns its history and brand; callers never supply either.
     return stub.fetch('https://session/message',{method:'POST',body:JSON.stringify({...input,ipHash})});
    }
    return json({error:'Not found.'},404);
   }
   if(request.method!=='GET'&&request.method!=='HEAD')return json({error:'Not found.'},404);
   const brand=url.searchParams.get('brand')||'standard';
   if(!BRANDS.includes(brand))return json({error:'Unknown chat.'},404);
   if(!['/','/index.html','/chat.js','/chat.css','/messages.mjs','/standardai.png','/stanley.webp'].includes(url.pathname))return json({error:'Not found.'},404);
   const asset=await env.ASSETS.fetch(request);const response=new Response(asset.body,asset);
   const local=['127.0.0.1','localhost'].includes(url.hostname)?' http://127.0.0.1:* http://localhost:*':'';
   response.headers.set('Content-Security-Policy',`default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors ${HOSTS[brand].join(' ')}${local}`);
   response.headers.set('X-Robots-Tag','noindex, nofollow, noarchive');response.headers.set('Referrer-Policy','no-referrer');response.headers.set('X-Content-Type-Options','nosniff');response.headers.set('Cache-Control','no-store');
   return response;
  } catch {return json({error:'The chat could not process that request. Please try again.'},400);}
 }
};

export class VisitorSession {
 constructor(ctx,env){this.ctx=ctx;this.env=env;this.busy=false;}
 async sync(session) {
  if(session.reviewPolicy!==REVIEW_POLICY||!session.archiveDirty)return;
  const saved=await inboxStub(this.env).fetch('https://inbox/snapshot',{method:'POST',body:JSON.stringify(snapshot(session))});
  if(!saved.ok)throw new Error('Archive unavailable');
  session.archiveDirty=false;await this.ctx.storage.put('session',session);
  await this.ctx.storage.setAlarm(session.expiresAt);
 }
 async alarm(){
  if(this.busy){await this.ctx.storage.setAlarm(Date.now()+30000);return;}
  this.busy=true;try{
  const session=await this.ctx.storage.get('session');if(!session)return;
  if(session.expiresAt<=Date.now()){await this.ctx.storage.deleteAll();return;}
  try{await this.sync(session);}catch{await this.ctx.storage.setAlarm(Math.min(Date.now()+60000,session.expiresAt));}
  }finally{this.busy=false;}
 }
 async fetch(request) {
  const path=new URL(request.url).pathname;
  if(this.busy)return json({error:'A reply is already on its way. Please wait.'},409);
  this.busy=true;
  try {
   if(path==='/init') {
    if(await this.ctx.storage.get('session'))return json({error:'Already started.'},409);
    const {brand,reviewPolicy}=await request.json();if(!BRANDS.includes(brand))return json({error:'Invalid brand.'},400);
    const now=Date.now();const session={id:crypto.randomUUID(),brand,reviewPolicy,createdAt:now,updatedAt:now,expiresAt:now+TTL,messages:[{id:crypto.randomUUID(),at:now,role:"assistant",text:OPENERS[brand],routing:{askedQuestion:true,stage:"discovery"}}],receipts:[]};
    session.archiveDirty=reviewPolicy===REVIEW_POLICY;
    await this.ctx.storage.put('session',session);await this.ctx.storage.setAlarm(session.archiveDirty?Math.min(Date.now()+60000,session.expiresAt):session.expiresAt);
    try{await this.sync(session);}catch{/* The durable alarm retries; creation still returns the visitor credential. */}
    return json(clientSession(session));
   }
   const session=await this.ctx.storage.get('session');
   if(!session||session.expiresAt<=Date.now()){await this.ctx.storage.deleteAll();return json({error:'This conversation has expired. Start a new one.'},410);}
   if(path==='/delete'){if(session.reviewPolicy===REVIEW_POLICY){const r=await inboxStub(this.env).fetch('https://inbox/delete?id='+session.id,{method:'DELETE'});if(!r.ok&&r.status!==404)throw new Error('Delete failed');}await this.ctx.storage.deleteAll();return json({deleted:true});}
   if(path==='/read')return json(clientSession(session));
   if(path==='/click'){
    const event=await request.json();
    if(session.reviewPolicy!==REVIEW_POLICY)return json({saved:false});
    const isFallback=event.messageId==='fallback'&&event.actionIndex===0;
    if(!/^[0-9a-f-]{36}$/i.test(event.eventId||'')||!Number.isInteger(event.actionIndex)||event.actionIndex<0||(!isFallback&&!session.messages.find(m=>m.id===event.messageId)?.actions?.[event.actionIndex]))return json({error:'Invalid action.'},400);
    await this.sync(session);
    return inboxStub(this.env).fetch('https://inbox/click',{method:'POST',body:JSON.stringify({eventId:event.eventId,messageId:event.messageId,actionIndex:event.actionIndex,conversationId:session.id})});
   }
   if(path!=='/message')return json({error:'Not found.'},404);
   const input=await request.json();
   if(!validMessage({text:input.text,requestId:input.requestId}))return json({error:'Invalid message.'},400);
   const text=input.text.trim();const textHash=await digest(text);
   const prior=session.receipts.find(r=>r.id===input.requestId);
   if(prior){if(prior.hash!==textHash)return json({error:'That request has already been used.'},409);await this.sync(session);return json(clientSession(session));}
   if(session.messages.length>=MAX_TURNS*2||session.messages.reduce((n,m)=>n+m.text.length,0)+text.length>40000)return json({error:'This conversation is full. Start a fresh chat or use the next-step link.'},429);
   if(!await consume(this.env,'messages-ip-'+input.ipHash,{hour:30,day:50})||!await consume(this.env,'messages-global',{day:Number(this.env.DAILY_MESSAGE_LIMIT)||250}))return json({error:'The chat has reached its current limit. Please use the next-step link or try again later.'},429);
   let result;
   try {result=await generateReply(getKnowledge(session.brand),session.messages,text,{apiKey:this.env.OPENAI_API_KEY});}
   catch{return unavailable();}
   // Do not persist a result that crossed the session's fixed expiry.
   if(session.expiresAt<=Date.now()){await this.ctx.storage.deleteAll();return json({error:'This conversation has expired. Start a new one.'},410);}
   session.updatedAt=Date.now();session.messages.push({id:crypto.randomUUID(),at:session.updatedAt,role:'user',text},{id:crypto.randomUUID(),at:session.updatedAt,role:'assistant',text:result.reply,actions:result.actions,routing:result.routing});
   session.receipts.push({id:input.requestId,hash:textHash});
   session.archiveDirty=session.reviewPolicy===REVIEW_POLICY;await this.ctx.storage.put('session',session);if(session.archiveDirty)await this.ctx.storage.setAlarm(Math.min(Date.now()+60000,session.expiresAt));await this.sync(session);return json(clientSession(session));
  } catch {return unavailable();} finally {this.busy=false;}
 }
}
export class Quota {
 constructor(ctx){this.ctx=ctx;}
 async alarm(){await this.ctx.storage.deleteAll();}
 async fetch(request) {
  const limits=await request.json();const now=Date.now();
  const allowed=await this.ctx.storage.transaction(async store=>{
   const saved=await store.get('counts')||{};
   const next={};for(const [period,max] of Object.entries(limits)){
    const bucket=Math.floor(now/(period==='hour'?3600000:86400000));const count=saved[period]?.bucket===bucket?saved[period].count:0;
    if(count>=max)return false;next[period]={bucket,count:count+1};
   }
   await store.put('counts',next);return true;
  });
  await this.ctx.storage.setAlarm(now+TTL*2);
  return json({allowed},allowed?200:429);
 }
}
