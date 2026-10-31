import {getKnowledge} from './knowledge.mjs';
import {test} from 'node:test';
import assert from 'node:assert/strict';

import {chooseRoute,planSchema} from './engine/routing.mjs';
const k=getKnowledge('standard');
const plan={intent:'next-step',evidence:['ok so whats next'],requestedOffers:[],need:'unclear',confidence:'unclear'};
const recommended=target=>[{role:'assistant',text:'A question?',routing:{askedQuestion:true,stage:'discovery'}},{role:'assistant',text:'Another question?',routing:{askedQuestion:true,stage:'discovery'}},{role:'assistant',text:'Here is the fit.',routing:{mode:'recommend',target,stage:'routed',askedQuestion:false}}];
test('next-step intent is explicit in the provider contract',()=>assert.ok(planSchema(k).properties.intent.enum.includes('next-step')));
test('coaching next steps always supply the booking button without another question',()=>{
 for(const target of ['eight-week','boardroom','standard90','team-standard']) {
  const r=chooseRoute(k,recommended(target),plan);
  assert.equal(r.mode,'destination');assert.deepEqual(r.actionIds,['fit']);assert.equal(r.allowedQuestions,0);assert.equal(r.questionsAsked,2);
 }
});
test('software and training retain their own destinations',()=>{
 for(const target of ['agency-brain','certified'])assert.deepEqual(chooseRoute(k,recommended(target),plan).actionIds,[k.pack.offers.find(o=>o.id===target).actionId]);
});
test('a factual detour does not lose the recommendation context',()=>{
 const messages=[...recommended('eight-week'),{role:'assistant',text:'Eight weeks.',routing:{mode:'answer',target:null,stage:'routed'}}];
 assert.deepEqual(chooseRoute(k,messages,plan).actionIds,['fit']);
});
test('no recommendation or later refusal cannot create a forced booking',()=>{
 assert.deepEqual(chooseRoute(k,[],plan).actionIds,[]);
 const messages=[...recommended('eight-week'),{role:'assistant',text:'Understood.',routing:{mode:'decline',target:null,stage:'routed'}}];
 assert.deepEqual(chooseRoute(k,messages,plan).actionIds,[]);
});
