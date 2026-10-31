import {test} from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import worker,{VisitorSession} from './worker.mjs';
import {MarketingInbox,REVIEW_POLICY,REVIEW_TTL,snapshot} from './inbox.mjs';
import {authorizeAdmin,adminCors,FOUNDER_ID} from './admin-auth.mjs';
import {digest} from './security.mjs';

function fixture(){
 const db=new DatabaseSync(':memory:');const ctx={storage:{sql:{exec(query,...args){const statement=db.prepare(query);return {toArray:()=>statement.all(...args),[Symbol.iterator]:function*(){yield* statement.all(...args);}};}},setAlarm:async at=>{ctx.alarm=at;}}};
 // Cloudflare exec executes immediately; adapt Node's prepare to those semantics.
 ctx.storage.sql.exec=(query,...args)=>{const stmt=db.prepare(query);const rows=stmt.all(...args);return {toArray:()=>rows,[Symbol.iterator]:()=>rows[Symbol.iterator]()};};
 return new MarketingInbox(ctx);
}
const req=(path,data,method)=>new Request('https://internal'+path,{method:method||(data?'POST':'GET'),...(data?{body:JSON.stringify(data)}:{})});
function sample(brand='standard',createdAt=Date.now()){
 return {id:crypto.randomUUID(),brand,reviewPolicy:REVIEW_POLICY,createdAt,updatedAt:createdAt,messages:[{id:crypto.randomUUID(),role:'assistant',text:'What happened?',routing:{askedQuestion:true}},{id:crypto.randomUUID(),role:'user',text:'We need help enforcing the standard.'},{id:crypto.randomUUID(),role:'assistant',text:'Team Standard is the fit.',actions:[{label:'Book a fit call',url:'https://agencycoaching.as.me/standardfit'}],routing:{mode:'recommend',target:'team-standard',patternId:'unenforced-standards',rationale:'The team has written expectations but they are not enforced.'}}]};
}
async function seed(inbox,s=sample()){assert.equal((await inbox.fetch(req('/snapshot',snapshot(s)))).status,200);return s;}
const detail=async(inbox,id)=>(await inbox.fetch(req('/detail?id='+id))).json();
test('snapshot preserves transcript, rationale and question count without session credentials',()=>{const s=sample();s.receipts=['secret'];s.token='secret';const result=snapshot(s);assert.equal(result.questions,1);assert.equal(result.recommendation,'team-standard');assert.match(result.reason,/written expectations/);assert.ok(!JSON.stringify(result).includes('secret'));});
test('click receipts are validated and deduplicated; snapshots cannot erase reviews or clicks',async()=>{
 const inbox=fixture(),s=await seed(inbox);const click={conversationId:s.id,messageId:s.messages[2].id,actionIndex:0,eventId:crypto.randomUUID()};
 assert.equal((await inbox.fetch(req('/click',{...click,actionIndex:6}))).status,400);
 for(let i=0;i<2;i++)assert.equal((await inbox.fetch(req('/click',click))).status,200);
 await inbox.fetch(req('/review?id='+s.id,{verdict:'sounds-like-me',outcome:'unknown',note:'Good',actor:FOUNDER_ID}));
 s.messages.push({id:crypto.randomUUID(),role:'user',text:'Thanks'});await seed(inbox,s);
 const c=await detail(inbox,s.id);assert.equal(c.clickCount,1);assert.equal(c.review.note,'Good');assert.equal(c.clicks[0].url,'https://agencycoaching.as.me/standardfit');
});
test('inbox filters, complete aggregate counts and pagination agree',async()=>{
 const inbox=fixture();for(let i=0;i<52;i++)await seed(inbox,sample('agencybrain',Date.now()-i));await seed(inbox,sample('standard'));
 const first=await(await inbox.fetch(req('/list?brand=agencybrain'))).json();assert.equal(first.items.length,50);assert.equal(first.stats.started,52);assert.equal(first.stats.recommended,52);assert.equal(first.hasMore,true);
 const second=await(await inbox.fetch(req('/list?brand=agencybrain&offset=50'))).json();assert.equal(second.items.length,2);assert.equal(second.hasMore,false);
 const clicks=await(await inbox.fetch(req('/list?clicked=yes'))).json();assert.equal(clicks.stats.started,0);
 const injected=await(await inbox.fetch(req('/list?brand='+encodeURIComponent("' OR 1=1 --")))).json();assert.equal(injected.items.length,0);
});
test('retention hides expired rows on every read and alarm removes them',async()=>{
 const inbox=fixture(),s=await seed(inbox);inbox.sql.exec('UPDATE conversations SET expires_at=? WHERE id=?',Date.now()-1,s.id);assert.equal((await inbox.fetch(req('/detail?id='+s.id))).status,404);
 assert.equal(inbox.sql.exec('SELECT count(*) AS count FROM conversations').toArray()[0].count,0);
 const expired=snapshot(sample('standard',Date.now()-REVIEW_TTL-1));assert.equal((await inbox.fetch(req('/snapshot',expired))).status,400);
});
test('confirmed outcomes require evidence and never derive from a click',async()=>{
 const inbox=fixture(),s=await seed(inbox);assert.equal((await inbox.fetch(req('/review?id='+s.id,{verdict:'sounds-like-me',outcome:'booked',note:'',actor:FOUNDER_ID}))).status,400);
 assert.equal((await inbox.fetch(req('/review?id='+s.id,{verdict:'sounds-like-me',outcome:'booked',note:'Verified booking in scheduler',actor:FOUNDER_ID}))).status,200);
 const list=await(await inbox.fetch(req('/list'))).json();assert.equal(list.stats.booked,1);assert.equal(list.stats.clicked,0);
});
test('delete removes both review and transcript',async()=>{const inbox=fixture(),s=await seed(inbox);assert.equal((await inbox.fetch(req('/delete?id='+s.id,null,'DELETE'))).status,200);assert.equal((await inbox.fetch(req('/detail?id='+s.id))).status,404);});
const env={AGENCY_AUTH_URL:'https://project.supabase.co',AGENCY_PUBLIC_KEY:'publishable'};
const adminReq=(origin='https://myagencybrain.com',token='user-jwt')=>new Request('https://service/admin/conversations',{headers:{Origin:origin,Authorization:'Bearer '+token}});
const authFetcher=(id,roles=[{role:'admin'}])=>async url=>Response.json(url.includes('/auth/v1/user')?{id}:roles);
test('only verified founder with a current admin role can read',async()=>{
 assert.equal((await authorizeAdmin(adminReq(),env,authFetcher(FOUNDER_ID))).userId,FOUNDER_ID);
 for(const identity of ['owner','key-employee','staff','another-admin'])assert.equal((await authorizeAdmin(adminReq(),env,authFetcher(identity))).error.status,403);
 assert.equal((await authorizeAdmin(adminReq(),env,authFetcher(FOUNDER_ID,[]))).error.status,403);
 assert.equal((await authorizeAdmin(new Request('https://service/admin/conversations'),env)).error.status,401);
 assert.equal((await authorizeAdmin(adminReq(),env,async()=>new Response('',{status:401}))).error.status,401);
 assert.equal((await authorizeAdmin(adminReq(),env,async()=>{throw new Error('offline');})).error.status,503);
});
test('admin CORS rejects foreign and local production origins; visitor API never exposes inbox',async()=>{
 assert.equal((await authorizeAdmin(adminReq('https://evil.example'),env)).error.status,403);
 assert.equal((await authorizeAdmin(adminReq('http://localhost:5173'),env)).error.status,403);
 const cors=adminCors(Response.json({}),adminReq(),env);assert.equal(cors.headers.get('Access-Control-Allow-Origin'),'https://myagencybrain.com');assert.equal(cors.headers.get('Cache-Control'),'no-store');
 const response=await worker.fetch(new Request('https://service/api/admin',{headers:{Authorization:'Bearer bad'}}),{CHAT_ENABLED:'true',OPENAI_API_KEY:'test'});assert.equal(response.status,401);
});
class Storage{constructor(){this.data=new Map();}async get(k){return structuredClone(this.data.get(k));}async put(k,v){this.data.set(k,structuredClone(v));}async deleteAll(){this.data.clear();}async setAlarm(at){this.alarm=at;}}
test('visitor session validates ownership of click and deletes archived history',async()=>{
 const inbox=fixture(),s=await seed(inbox),storage=new Storage();s.expiresAt=Date.now()+86400000;s.receipts=[];await storage.put('session',s);
 const visitor=new VisitorSession({storage},{INBOX:{idFromName:v=>v,get:()=>({fetch:(url,init)=>inbox.fetch(new Request(url,init))})}});
 assert.equal((await visitor.fetch(req('/click',{eventId:crypto.randomUUID(),messageId:crypto.randomUUID(),actionIndex:0}))).status,400);
 assert.equal((await visitor.fetch(req('/click',{eventId:crypto.randomUUID(),messageId:s.messages[2].id,actionIndex:0,conversationId:'someone-else'}))).status,200);
 assert.equal((await detail(inbox,s.id)).clickCount,1);
 assert.equal((await visitor.fetch(req('/delete'))).status,200);assert.equal((await inbox.fetch(req('/detail?id='+s.id))).status,404);
});
test('archive failure retains receipt for retry without regenerating an AI response',async()=>{
 const storage=new Storage(),s=sample();s.expiresAt=Date.now()+86400000;s.archiveDirty=true;const id=crypto.randomUUID();s.receipts=[{id,hash:await digest('same')}];await storage.put('session',s);
 let calls=0;const visitor=new VisitorSession({storage},{INBOX:{idFromName:v=>v,get:()=>({fetch:async()=>{calls++;return new Response('{}',{status:calls===1?503:200});}})}});
 assert.equal((await visitor.fetch(req('/message',{requestId:id,text:'same'}))).status,503);assert.equal((await storage.get('session')).archiveDirty,true);
 assert.equal((await visitor.fetch(req('/message',{requestId:id,text:'same'}))).status,200);assert.equal((await storage.get('session')).archiveDirty,false);
});
test('legacy sessions never gain retrospective archive permission',async()=>{const storage=new Storage(),s=sample();delete s.reviewPolicy;s.archiveDirty=true;s.expiresAt=Date.now()+86400000;await storage.put('session',s);const visitor=new VisitorSession({storage},{});await visitor.sync(s);assert.equal((await visitor.fetch(req('/read'))).status,200);});
test('new disclosed sessions enter the inbox and a footer click uses the server catalog',async()=>{
 const inbox=fixture(),storage=new Storage(),visitor=new VisitorSession({storage},{INBOX:{idFromName:v=>v,get:()=>({fetch:(url,init)=>inbox.fetch(new Request(url,init))})}});
 assert.equal((await visitor.fetch(req('/init',{brand:'livecallcoach',reviewPolicy:REVIEW_POLICY}))).status,200);
 const s=await storage.get('session');assert.equal((await detail(inbox,s.id)).questions,1);
 assert.equal((await visitor.fetch(req('/click',{eventId:crypto.randomUUID(),messageId:'fallback',actionIndex:0,url:'https://evil.example'}))).status,200);
 const c=await detail(inbox,s.id);assert.equal(c.clicks[0].url,'https://livecallcoach.ai/#pricing');assert.equal(c.recommendation,null);
});
