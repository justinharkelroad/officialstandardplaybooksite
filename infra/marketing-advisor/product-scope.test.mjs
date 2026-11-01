import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {getKnowledge,OPENERS} from './knowledge.mjs';
import {generateReply,responseSchema} from './engine/core.mjs';
import {chooseRoute,planSchema,validatePlan,validateRoutedReply} from './engine/routing.mjs';
import worker,{VisitorSession} from './worker.mjs';
const k=getKnowledge('livecallcoach');
const text='The person just blew them off on the set time to call back';
const plan=(patch={})=>({patternId:'missed-call-plays',intent:'discover',need:'producer-sales-skills',confidence:'clear',requestedOffers:[],evidence:[text],coachingPreference:'unknown',ownsCore:false,phoneCompatibility:'unknown',rationale:'The reps miss their closing move.',...patch});
const history=[
 {role:'assistant',text:OPENERS.livecallcoach,routing:{askedQuestion:true,stage:'discovery'}},
 {role:'user',text:'Actually asking for the close for sure'},
 {role:'assistant',text:'How are they practicing that part of the conversation today?',routing:{askedQuestion:true,stage:'discovery'}},
 {role:'user',text:'Role play i guess?'},
 {role:'assistant',text:'What happened on the last call where they did not ask for the close?',routing:{askedQuestion:true,stage:'discovery'}},
];
const written={reply:'Live Call Coach can show the approved closing move during the call and review it afterward.',question:'',sourceIds:['live-call-coach'],actionIds:[],focus:'answer'};
function provider(classification,answers=[written]) {
 let writes=0;const requests=[];
 const fetcher=async(_url,options)=>{
  const request=JSON.parse(options.body);requests.push(request);
  const value=request.text.format.name==='standard_routing_plan'?classification:answers[Math.min(writes++,answers.length-1)];
  return new Response(JSON.stringify({status:'completed',output:[{content:[{type:'output_text',text:JSON.stringify(value)}]}]}));
 };
 return {fetcher,requests};
}
test('LCC catalog, examples, actions and provider schemas stay within its product',()=>{
 assert.deepEqual(k.pack.offers.map(o=>o.id),['live-call-coach']);
 assert.deepEqual(k.pack.actions.map(a=>a.id),['live-call-coach']);
 assert.equal(k.pack.actions[0].url,'https://livecallcoach.ai/#pricing');
 assert.deepEqual(planSchema(k).properties.requestedOffers.items.enum,['live-call-coach']);
 assert.deepEqual(responseSchema(k).properties.actionIds.items.enum,['live-call-coach']);
 assert.ok(!k.ids.includes('certified'));
 assert.ok(k.routing.rules.every(r=>r.offer==='live-call-coach'));
 assert.doesNotMatch(k.voice+JSON.stringify(k.examples),/Certified Standard|Boardroom|8-Week|STANDARDAI/);
 for(const brand of ['standard','agencybrain']) {
  const other=getKnowledge(brand);assert.ok(other.pack.offers.some(o=>o.id==='certified'));
  assert.equal(chooseRoute(other,history,plan()).target,'certified');assert.notEqual(k.hash,other.hash);
 }
 assert.deepEqual(getKnowledge('livecallcoach'),k,'brand reads cannot mutate each other');
});
test('generated LCC hash includes the product profile as well as base knowledge',async()=>{
 const parts=await Promise.all(['pack.json','voice.md','examples.json','routing.json','live-call-coach.json'].map(name=>readFile(new URL('./knowledge/'+name,import.meta.url),'utf8')));
 const hash=values=>createHash('sha256').update(values.join('')).digest('hex');
 assert.equal(hash(parts),k.hash);
 parts[4]+=' ';
 assert.notEqual(hash(parts),k.hash);
});
test('screenshot replay checks setup instead of routing closing skills to Certified Standard',()=>{
 const r=chooseRoute(k,history,plan());
 assert.equal(r.mode,'discover');assert.equal(r.allowedQuestions,1);assert.equal(r.target,'live-call-coach');assert.deepEqual(r.actionIds,[]);
 assert.match(r.reason,/phone provider/);
 const supported=chooseRoute(k,history,plan({phoneCompatibility:'supported'}));
 assert.equal(supported.mode,'recommend');assert.deepEqual(supported.actionIds,['live-call-coach']);
});
test('the cap and legacy off-product next steps never escape the product',()=>{
 const legacy=[...history,{role:'assistant',text:'Certified Standard looks like the best fit.',routing:{mode:'recommend',stage:'routed',target:'certified',askedQuestion:false}}];
 for(const messages of [legacy,[...history,history[0]]]) for(const intent of ['discover','next-step','ready']) {
  const r=chooseRoute(k,messages,plan({intent}));assert.equal(r.allowedQuestions,0);assert.deepEqual(r.actionIds,['live-call-coach']);assert.equal(r.target,'live-call-coach');assert.notEqual(r.mode,'handoff');
 }
});
test('unsupported setups, refusals, privacy boundaries and no-gap reports do not force a sale',()=>{
 for(const patch of [{phoneCompatibility:'unsupported'},{intent:'decline'},{intent:'boundary'},{need:'no-gap'}]) {
  const r=chooseRoute(k,history,plan(patch));assert.deepEqual(r.actionIds,[]);assert.equal(r.allowedQuestions,0);
 }
 assert.equal(chooseRoute(k,[],plan({intent:'direct-question'})).allowedQuestions,0);
 for(const phoneCompatibility of ['unknown','unsupported']) assert.notEqual(chooseRoute(k,history,plan({phoneCompatibility})).mode,'recommend');
});
test('foreign destinations fail even if a planner or writer tries to supply them',()=>{
 for(const id of ['certified','fit','agency-brain','boardroom']) {
  assert.throws(()=>validatePlan(plan({intent:'ready',requestedOffers:[id]}),k,history,text));
  const r=chooseRoute(k,history,plan({intent:'ready',requestedOffers:[id]}));assert.deepEqual(r.actionIds,['live-call-coach']);
  assert.throws(()=>validateRoutedReply({...written,actionIds:[id]},r));
 }
 const r=chooseRoute(k,history,plan({phoneCompatibility:'supported'}));
 for(const reply of ['Certified Standard looks like the best fit.','Explore Agency Brain.','Book a fit call with Justin.','Team Standard is the next step.']) assert.throws(()=>validateRoutedReply({...written,reply},r),/product scope/);
 assert.ok(validateRoutedReply({...written,reply:'A separate Agency Brain subscription is not required.'},r));
});
test('generation uses product-only planning and repairs an off-product reply before returning it',async()=>{
 const p=provider(plan(),[{...written,reply:'Certified Standard looks like the best fit.',question:'Which phone system are your reps using?'},{...written,question:'Which phone system are your reps using?'}]);
 const result=await generateReply(k,history,text,{apiKey:'synthetic',fetcher:p.fetcher});
 assert.equal(p.requests.length,3);assert.match(p.requests[0].instructions,/Live Call Coach product conversation only/);
 assert.doesNotMatch(p.requests[0].instructions,/producer skill practice \(certified\)/);
 assert.doesNotMatch(p.requests[1].instructions,/Certified Standard|Book a fit call|What does Boardroom cost/);
 assert.equal(result.routing.questionsAsked,4);assert.equal(result.routing.target,'live-call-coach');assert.doesNotMatch(result.reply,/Certified/);
 const malicious=provider(plan({phoneCompatibility:'supported'}),[{...written,reply:'Certified Standard is a better fit.'}]);
 await assert.rejects(generateReply(k,history,text,{apiKey:'synthetic',fetcher:malicious.fetcher}),/routing checks/);
});
class Storage {
 constructor(){this.data=new Map();}
 async get(key){return structuredClone(this.data.get(key));}
 async put(key,value){this.data.set(key,structuredClone(value));}
 async setAlarm(){}
}
test('public Worker uses the stored LCC brand, saves its CTA and preserves exact retries',async t=>{
 const storage=new Storage(),p=provider(plan({phoneCompatibility:'supported'}));t.mock.method(globalThis,'fetch',p.fetcher);
 const quotas={idFromName:x=>x,get:()=>({fetch:async()=>new Response('{}')})};
 const session=new VisitorSession({storage},{OPENAI_API_KEY:'synthetic',QUOTAS:quotas});
 await session.fetch(new Request('https://session/init',{method:'POST',body:JSON.stringify({brand:'livecallcoach'})}));
 const saved=await storage.get('session');saved.messages=history;await storage.put('session',saved);
 const env={CHAT_ENABLED:'true',OPENAI_API_KEY:'synthetic',QUOTAS:quotas,SESSIONS:{idFromName:x=>x,get:()=>({fetch:(url,options)=>session.fetch(new Request(url,options))})}};
 const requestId=crypto.randomUUID();
 const request=body=>new Request('https://chat/api/message',{method:'POST',headers:{Origin:'https://chat','Content-Type':'application/json',Authorization:'Bearer '+'a'.repeat(64)},body:JSON.stringify(body)});
 assert.equal((await worker.fetch(request({text,requestId,brand:'standard'}),env)).status,400);assert.equal(p.requests.length,0);
 const response=await worker.fetch(request({text,requestId}),env);assert.equal(response.status,200);
 const body=await response.json();assert.equal(body.brand,'livecallcoach');
 assert.deepEqual(body.messages.at(-1).actions.map(a=>a.url),['https://livecallcoach.ai/#pricing']);
 assert.equal((await storage.get('session')).messages.at(-1).routing.target,'live-call-coach');
 assert.equal((await worker.fetch(request({text,requestId}),env)).status,200);assert.equal(p.requests.length,2);
});
