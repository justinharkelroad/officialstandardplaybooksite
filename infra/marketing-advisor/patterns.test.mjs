import {getKnowledge} from './knowledge.mjs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {generateReply} from './engine/core.mjs';
import {chooseRoute,validatePlan,routeMetadata} from './engine/routing.mjs';
const ROOT=new URL('./',import.meta.url);
const k=getKnowledge('standard');
const plan={patternId:'leaking-leads',intent:'discover',need:'unclear',confidence:'unclear',requestedOffers:[],evidence:['Follow-up disappears.'],coachingPreference:'unknown',ownsCore:false,phoneCompatibility:'unknown',rationale:'Need to distinguish tracking from a missing process.'};
const history=n=>Array.from({length:n},()=>({role:'assistant',text:'What is missing?',routing:{askedQuestion:true,stage:'discovery'}}));

test('anonymous patterns contain only curated discovery fields and valid candidate needs',()=>{
 assert.equal(k.routing.problemPatterns.length,20);
 assert.equal(new Set(k.routing.problemPatterns.map(p=>p.id)).size,20);
 for(const p of k.routing.problemPatterns){
  assert.deepEqual(Object.keys(p).sort(),['id','title','distinguishingQuestions','candidateNeeds','guardrail'].sort());
  assert.equal(p.distinguishingQuestions.length,2);
  assert.ok(p.distinguishingQuestions.every(q=>q.endsWith('?')));
  assert.ok(p.candidateNeeds.length>=2);
  assert.ok(p.candidateNeeds.every(n=>k.routing.rules.some(r=>r.need===n)));
  assert.ok(p.guardrail.length>20);
 }
});
test('each of the 20 patterns has a separate synthetic routing scenario',async()=>{
 const cases=JSON.parse(await readFile(new URL('fixtures/problem-scenarios.json',ROOT),'utf8'));
 assert.equal(cases.length,27);
 for(const p of k.routing.problemPatterns){
  const c=cases.find(c=>c.id===p.id);assert.ok(c);
  assert.ok(c.answers.length>=2);assert.ok(k.pack.actions.some(a=>a.id===c.expectedTarget));
 }
});
test('pattern hints alone cannot create a recommendation and cannot reset the four-question cap',()=>{
 for(const p of k.routing.problemPatterns){
  for(const n of [0,1,2,3]) assert.equal(chooseRoute(k,history(n),{...plan,patternId:p.id}).mode,'discover');
  const end=chooseRoute(k,history(4),{...plan,patternId:p.id});
  assert.equal(end.target,'fit');assert.equal(end.allowedQuestions,0);
 }
});
test('visitor clarification determines the route for identical lead-leakage symptoms',()=>{
 for(const [need,target] of [['agency-operations','agency-brain'],['build-management-system','eight-week'],['owner-accountability','boardroom']]){
  const result=chooseRoute(k,history(2),{...plan,need,confidence:'clear'});
  assert.equal(result.target,target);assert.equal(result.allowedQuestions,0);
 }
});
test('pattern metadata validates against the catalog and survives JSON storage',()=>{
 const p=validatePlan(plan,k,[],'Follow-up disappears.');
 const meta=routeMetadata(k,chooseRoute(k,[],p),p);
 assert.equal(JSON.parse(JSON.stringify(meta)).patternId,'leaking-leads');
 assert.throws(()=>validatePlan({...plan,patternId:'invented-pattern'},k,[],'Follow-up disappears.'));
});
test('both classifier and writer receive pattern guidance, while writer gets only the selected pattern',async()=>{
 const requests=[];
 await generateReply(k,[],'Follow-up disappears.',{apiKey:'test',fetcher:async(_url,options)=>{
  const request=JSON.parse(options.body);requests.push(request);
  const value=request.text.format.name==='standard_routing_plan'?plan:{reply:'Let’s separate the process from the tracking.',question:'Is there a clear follow-up process already?',sourceIds:['followup'],actionIds:[],focus:'clarify'};
  return {ok:true,json:async()=>({status:'completed',output:[{content:[{type:'output_text',text:JSON.stringify(value)}]}]})};
 }});
 assert.ok(requests[0].instructions.includes('commission-complexity'));
 assert.ok(requests[1].instructions.includes('leaking-leads'));
 assert.ok(requests[1].instructions.includes(k.routing.problemPatterns.find(p=>p.id==='leaking-leads').guardrail));
 assert.ok(!requests[1].instructions.includes('commission-complexity'));
});
test('pattern edits invalidate exact-pack approval through the knowledge hash',async()=>{
 const files=await Promise.all(['pack.json','voice.md','examples.json','routing.json'].map(f=>readFile(new URL('knowledge/'+f,ROOT),'utf8')));
 const hash=parts=>createHash('sha256').update(parts.join('')).digest('hex');
 assert.equal(hash(files),k.hash);
 files[3]=files[3].replace('My team misses the numbers','Our team misses the numbers');
 assert.notEqual(hash(files),k.hash);
});
