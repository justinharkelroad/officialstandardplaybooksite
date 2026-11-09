import {test} from 'node:test';
import assert from 'node:assert/strict';
import worker,{VisitorSession} from './worker.mjs';
import {OPENERS,openerFor} from './knowledge.mjs';

class Storage{constructor(){this.data=new Map();}async get(k){return structuredClone(this.data.get(k));}async put(k,v){this.data.set(k,structuredClone(v));}async deleteAll(){this.data.clear();}async setAlarm(){}}
const req=(path,body)=>new Request('https://internal'+path,{method:body?'POST':'GET',...(body?{body:JSON.stringify(body)}:{})});

test('surface=start stores the surface and opens with the /start opener',async()=>{
 const storage=new Storage(),s=new VisitorSession({storage},{});
 await s.fetch(req('/init',{brand:'standard',surface:'start'}));
 const state=await storage.get('session');
 assert.equal(state.surface,'start');
 assert.equal(state.messages[0].text,openerFor('standard','start'));
 assert.notEqual(openerFor('standard','start'),OPENERS.standard);
});

test('no surface defaults to home and the home opener',async()=>{
 const storage=new Storage(),s=new VisitorSession({storage},{});
 await s.fetch(req('/init',{brand:'standard'}));
 const state=await storage.get('session');
 assert.equal(state.surface,'home');
 assert.equal(state.messages[0].text,OPENERS.standard);
});

test('the public endpoint passes a valid surface through and rejects bad input',async()=>{
 const quotas={idFromName:x=>x,get:()=>({fetch:async()=>new Response('{}')})};
 const session=new VisitorSession({storage:new Storage()},{});
 const env={CHAT_ENABLED:'true',OPENAI_API_KEY:'test',QUOTAS:quotas,SESSIONS:{idFromName:x=>x,get:()=>({fetch:(url,options)=>session.fetch(new Request(url,options))})}};
 const post=body=>new Request('https://chat/api/session',{method:'POST',headers:{Origin:'https://chat','Content-Type':'application/json'},body:JSON.stringify(body)});
 const ok=await worker.fetch(post({brand:'standard',surface:'start'}),env);
 assert.equal(ok.status,200);
 assert.equal((await ok.json()).session.messages[0].text,openerFor('standard','start'));
 assert.equal((await worker.fetch(post({brand:'standard',surface:'evil'}),env)).status,400);
 assert.equal((await worker.fetch(post({brand:'standard',bogus:'x'}),env)).status,400);
});
