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
   if(url.pathname==='/health')return json({service:'standard-marketing-advisor',version:'2026-10-31-v1',ready:env.CHAT_ENABLED==='true'&&Boolean(env.OPENAI_API_KEY)});
   if(url.pathname.startsWith('/api/')) {
    if((request.headers.get('Origin') && request.headers.get('Origin')!==url.origin) || (request.method!=='GET' && request.headers.get('Origin')!==url.origin))return json({error:'Open the chat from its website.'},403);
    if(env.CHAT_ENABLED!=='true'||!env.OPENAI_API_KEY)return unavailable();
    const ipHash=await digest(request.headers.get('CF-Connecting-IP')||'local-development');
    if(url.pathname==='/api/session' && request.method==='POST') {
     const input=await body(request);
     if(Object.keys(input).join(',')!=='brand'||!BRANDS.includes(input.brand))return json({error:'Invalid chat request.'},400);
     if(!await consume(env,'create-ip-'+ipHash,{hour:5,day:10})||!await consume(env,'create-global',{day:1000}))return json({error:'Too many new chats. Please return to your existing conversation or try again later.'},429);
     const token=randomToken();const result=await sessionStub(env,token).fetch('https://session/init',{method:'POST',body:JSON.stringify({brand:input.brand})});
     if(!result.ok)return unavailable();return json({token,session:await result.json()});
    }
    const token=request.headers.get('Authorization')?.replace(/^Bearer /,'');
    if(!TOKEN_PATTERN.test(token??''))return json({error:'Start a new conversation.'},401);
    const stub=sessionStub(env,token);
    if(url.pathname==='/api/session' && request.method==='GET')return stub.fetch('https://session/read');
    if(url.pathname==='/api/session' && request.method==='DELETE')return stub.fetch('https://session/delete',{method:'DELETE'});
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
 async alarm(){await this.ctx.storage.deleteAll();}
 async fetch(request) {
  const path=new URL(request.url).pathname;
  if(this.busy)return json({error:'A reply is already on its way. Please wait.'},409);
  this.busy=true;
  try {
   if(path==='/init') {
    if(await this.ctx.storage.get('session'))return json({error:'Already started.'},409);
    const {brand}=await request.json();if(!BRANDS.includes(brand))return json({error:'Invalid brand.'},400);
    const session={brand,expiresAt:Date.now()+TTL,messages:[{id:crypto.randomUUID(),role:"assistant",text:OPENERS[brand],routing:{askedQuestion:true,stage:"discovery"}}],receipts:[]};
    await this.ctx.storage.put('session',session);await this.ctx.storage.setAlarm(session.expiresAt);return json(clientSession(session));
   }
   const session=await this.ctx.storage.get('session');
   if(!session||session.expiresAt<=Date.now()){await this.ctx.storage.deleteAll();return json({error:'This conversation has expired. Start a new one.'},410);}
   if(path==='/delete'){await this.ctx.storage.deleteAll();return json({deleted:true});}
   if(path==='/read')return json(clientSession(session));
   if(path!=='/message')return json({error:'Not found.'},404);
   const input=await request.json();
   if(!validMessage({text:input.text,requestId:input.requestId}))return json({error:'Invalid message.'},400);
   const text=input.text.trim();const textHash=await digest(text);
   const prior=session.receipts.find(r=>r.id===input.requestId);
   if(prior)return prior.hash===textHash?json(clientSession(session)):json({error:'That request has already been used.'},409);
   if(session.messages.length>=MAX_TURNS*2||session.messages.reduce((n,m)=>n+m.text.length,0)+text.length>40000)return json({error:'This conversation is full. Start a fresh chat or use the next-step link.'},429);
   if(!await consume(this.env,'messages-ip-'+input.ipHash,{hour:30,day:50})||!await consume(this.env,'messages-global',{day:Number(this.env.DAILY_MESSAGE_LIMIT)||250}))return json({error:'The chat has reached its current limit. Please use the next-step link or try again later.'},429);
   let result;
   try {result=await generateReply(getKnowledge(session.brand),session.messages,text,{apiKey:this.env.OPENAI_API_KEY});}
   catch{return unavailable();}
   // Do not persist a result that crossed the session's fixed expiry.
   if(session.expiresAt<=Date.now()){await this.ctx.storage.deleteAll();return json({error:'This conversation has expired. Start a new one.'},410);}
   session.messages.push({id:crypto.randomUUID(),role:'user',text},{id:crypto.randomUUID(),role:'assistant',text:result.reply,actions:result.actions,routing:result.routing});
   session.receipts.push({id:input.requestId,hash:textHash});
   await this.ctx.storage.put('session',session);return json(clientSession(session));
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
