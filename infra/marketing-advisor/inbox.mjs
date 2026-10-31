import {json} from './security.mjs';

export const REVIEW_POLICY='2026-10-31-review-v1';
export const REVIEW_TTL=30*24*60*60*1000;
export const FALLBACK_ACTIONS={standard:{label:'Book a fit call (footer)',url:'https://agencycoaching.as.me/standardfit'},agencybrain:{label:'Explore Agency Brain (footer)',url:'https://myagencybrain.com/info'},livecallcoach:{label:'See Live Call Coach (footer)',url:'https://livecallcoach.ai/#pricing'}};
const UUID=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const inboxStub=env=>env.INBOX.get(env.INBOX.idFromName('marketing-conversations-v1'));
export function snapshot(session) {
 const assistant=session.messages.filter(m=>m.role==='assistant');
 const recommended=assistant.filter(m=>m.routing?.mode==='recommend'||m.routing?.mode==='handoff');
 const recommendation= recommended.at(-1) || assistant.findLast(m=>m.routing?.mode==='destination');
 const latest=assistant.findLast(m=>m.routing?.patternId&&m.routing.patternId!=='none');
 return {id:session.id,brand:session.brand,createdAt:session.createdAt,updatedAt:session.updatedAt,expiresAt:session.createdAt+REVIEW_TTL,
  policy:session.reviewPolicy,version:session.messages.length,questions:assistant.filter(m=>m.routing?.askedQuestion).length,
  recommendation:recommendation?.routing?.target||null,reason:recommendation?.routing?.rationale||null,
  pattern:latest?.routing?.patternId||null,messages:session.messages.map(({id,role,text,actions,routing,at})=>({id,role,text,actions:actions||[],routing,at}))};
}

/** Only the Worker binding can call this object. No public URL or visitor token reads the index. */
export class MarketingInbox {
 constructor(ctx){
  this.ctx=ctx;this.sql=ctx.storage.sql;
  this.sql.exec(`CREATE TABLE IF NOT EXISTS conversations (id TEXT PRIMARY KEY,brand TEXT NOT NULL,created_at INTEGER NOT NULL,updated_at INTEGER NOT NULL,expires_at INTEGER NOT NULL,version INTEGER NOT NULL,questions INTEGER NOT NULL,recommendation TEXT,pattern TEXT,snapshot TEXT NOT NULL,review TEXT NOT NULL DEFAULT '{}',clicks TEXT NOT NULL DEFAULT '[]')`);
  this.sql.exec('CREATE INDEX IF NOT EXISTS inbox_created ON conversations(created_at DESC,id)');
  this.sql.exec('CREATE INDEX IF NOT EXISTS inbox_expiry ON conversations(expires_at)');
 }
 prune(){this.sql.exec('DELETE FROM conversations WHERE expires_at<=?',Date.now());}
 async alarm(){this.prune();await this.schedule();}
 async schedule(){const next=this.sql.exec('SELECT min(expires_at) AS next FROM conversations').toArray()[0]?.next;if(next)await this.ctx.storage.setAlarm(next);}
 row(id){return this.sql.exec('SELECT * FROM conversations WHERE id=? AND expires_at>?',id,Date.now()).toArray()[0];}
 summary(row){const s=JSON.parse(row.snapshot),review=JSON.parse(row.review),clicks=JSON.parse(row.clicks);return {id:row.id,brand:row.brand,createdAt:row.created_at,updatedAt:row.updated_at,expiresAt:row.expires_at,questions:row.questions,recommendation:row.recommendation,pattern:row.pattern,reason:s.reason,preview:s.messages.find(m=>m.role==='user')?.text.slice(0,180)||'Conversation started',messageCount:s.messages.length,clickCount:clicks.length,lastClickAt:clicks.at(-1)?.at||null,review};}
 async fetch(request){
  this.prune();const url=new URL(request.url);
  if(url.pathname==='/snapshot'){
   const s=await request.json();
   if(!UUID.test(s.id)||s.policy!==REVIEW_POLICY||s.expiresAt<=Date.now())return json({error:'Invalid snapshot'},400);
   this.sql.exec(`INSERT INTO conversations (id,brand,created_at,updated_at,expires_at,version,questions,recommendation,pattern,snapshot) VALUES (?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET updated_at=excluded.updated_at,version=excluded.version,questions=excluded.questions,recommendation=excluded.recommendation,pattern=excluded.pattern,snapshot=excluded.snapshot WHERE excluded.version>conversations.version`,s.id,s.brand,s.createdAt,s.updatedAt,s.expiresAt,s.version,s.questions,s.recommendation,s.pattern,JSON.stringify(s));
   await this.schedule();return json({saved:true});
  }
  if(url.pathname==='/click'){
   const event=await request.json();const row=this.row(event.conversationId);if(!row)return json({error:'Not found'},404);
   const s=JSON.parse(row.snapshot);const action=event.messageId==='fallback'&&event.actionIndex===0?FALLBACK_ACTIONS[s.brand]:s.messages.find(m=>m.id===event.messageId)?.actions[event.actionIndex];
   if(!UUID.test(event.eventId)||!action)return json({error:'Invalid action'},400);
   const clicks=JSON.parse(row.clicks);if(clicks.some(e=>e.eventId===event.eventId))return json({saved:true});
   if(clicks.length>=100)return json({error:'Click limit reached'},429);
   clicks.push({eventId:event.eventId,messageId:event.messageId,actionIndex:event.actionIndex,label:action.label,url:action.url,at:Date.now()});
   this.sql.exec('UPDATE conversations SET clicks=? WHERE id=?',JSON.stringify(clicks),row.id);return json({saved:true});
  }
  if(url.pathname==='/list'){
   const clauses=['expires_at>?'];const values=[Date.now()];
   for(const [param,col] of [['brand','brand'],['recommendation','recommendation'],['pattern','pattern']]){const v=url.searchParams.get(param);if(v&&v!=='all'){clauses.push(col+'=?');values.push(v);}}
   const days=Number(url.searchParams.get('days')||30);if(![1,7,30].includes(days))return json({error:'Invalid date range'},400);
   clauses.push('created_at>=?');values.push(Date.now()-days*86400000);
   const clicked=url.searchParams.get('clicked');if(clicked==='yes')clauses.push("clicks!='[]'");if(clicked==='no')clauses.push("clicks='[]'");
   const review=url.searchParams.get('review');if(review&&review!=='all'){clauses.push("COALESCE(json_extract(review,'$.verdict'),'unreviewed')=?");values.push(review);}
   const where=clauses.join(' AND '),offset=Number(url.searchParams.get('offset')||0);if(!Number.isSafeInteger(offset)||offset<0||offset>100000)return json({error:'Invalid page'},400);
   const rows=this.sql.exec('SELECT * FROM conversations WHERE '+where+' ORDER BY created_at DESC,id LIMIT 51 OFFSET ?',...values,offset).toArray();
   const stats=this.sql.exec(`SELECT count(*) AS started,COALESCE(sum(recommendation IS NOT NULL),0) AS recommended,COALESCE(sum(clicks!='[]'),0) AS clicked,COALESCE(sum(json_extract(review,'$.outcome')='booked'),0) AS booked,COALESCE(sum(json_extract(review,'$.outcome')='purchased'),0) AS purchased FROM conversations WHERE ${where}`,...values).toArray()[0];
   return json({items:rows.slice(0,50).map(row=>this.summary(row)),hasMore:rows.length>50,stats});
  }
  const id=url.searchParams.get('id');if(!UUID.test(id||''))return json({error:'Not found'},404);const row=this.row(id);if(!row)return json({error:'Conversation expired or unavailable.'},404);
  if(url.pathname==='/delete'){this.sql.exec('DELETE FROM conversations WHERE id=?',id);return json({deleted:true});}
  if(url.pathname==='/detail')return json({...this.summary(row),messages:JSON.parse(row.snapshot).messages,clicks:JSON.parse(row.clicks),policy:JSON.parse(row.snapshot).policy});
  if(url.pathname==='/review'){
   const input=await request.json();
   if(!['unreviewed','sounds-like-me','wrong-recommendation','needs-work'].includes(input.verdict)||!['unknown','booked','purchased','not-converted'].includes(input.outcome)||typeof input.note!=='string'||input.note.length>2000||(['booked','purchased'].includes(input.outcome)&&!input.note.trim()))return json({error:'Choose a review status and add evidence for a confirmed booking or purchase.'},400);
   const review={verdict:input.verdict,outcome:input.outcome,note:input.note.trim(),reviewedAt:Date.now(),reviewedBy:input.actor};
   this.sql.exec('UPDATE conversations SET review=? WHERE id=?',JSON.stringify(review),id);return json({review});
  }
  return json({error:'Not found'},404);
 }
}
