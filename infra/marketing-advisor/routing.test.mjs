import {getKnowledge} from './knowledge.mjs';
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {generateReply} from './engine/core.mjs';
import {routingState,chooseRoute,validatePlan,validateRoutedReply,routeMetadata} from './engine/routing.mjs';
const k=getKnowledge('standard');
const plan=(patch={})=>({intent:'discover',need:'build-management-system',confidence:'clear',requestedOffers:[],evidence:['We have no management process.'],coachingPreference:'yes',ownsCore:false,phoneCompatibility:'unknown',rationale:'They need to build the management process.',...patch});
const history=n=>Array.from({length:n},()=>({role:'assistant',text:'What is missing?',routing:{askedQuestion:true,stage:'discovery'}}));
const written={reply:'Here is the next step.',question:'',sourceIds:[],actionIds:[],focus:'offer-fit'};

test('normal discovery asks two questions before recommending a clear fit',()=>{
  for(const n of [0,1]) assert.equal(chooseRoute(k,history(n),plan()).mode,'discover');
  for(const n of [2,3,4]){
    const r=chooseRoute(k,history(n),plan());assert.equal(r.mode,'recommend');assert.equal(r.target,'eight-week');assert.deepEqual(r.actionIds,['eight-week']);
  }
});
test('uncertain fit asks at most four questions then offers a human fit conversation',()=>{
  for(const n of [0,1,2,3]) assert.equal(chooseRoute(k,history(n),plan({confidence:'unclear'})).allowedQuestions,1);
  const r=chooseRoute(k,history(4),plan({confidence:'unclear'}));assert.equal(r.mode,'handoff');assert.deepEqual(r.actionIds,['fit']);assert.equal(r.allowedQuestions,0);
});
test('each need maps to its designated program with grounded clear fit',()=>{
  for(const rule of k.routing.rules){
    const r=chooseRoute(k,history(4),plan({need:rule.need,phoneCompatibility:'supported'}));
    assert.equal(r.target,rule.offer==='directive'?'fit':rule.offer);
  }
});
test('direct factual detours answer without spending a discovery question',()=>{
  for(const n of [0,2,4]){
    const r=chooseRoute(k,history(n),plan({intent:'direct-question',requestedOffers:['boardroom']}));
    assert.equal(r.mode,'answer');assert.equal(r.allowedQuestions,0);
    assert.equal(routeMetadata(k,r,plan()).questionsAsked,n);
  }
});
test('ready buyers and explicit fit-call requests skip discovery; closed Directive is not sold',()=>{
  assert.equal(chooseRoute(k,[],plan({intent:'ready',requestedOffers:['boardroom']})).mode,'destination');
  assert.deepEqual(chooseRoute(k,[],plan({intent:'ready',requestedOffers:['fit']})).actionIds,['fit']);
  assert.equal(chooseRoute(k,[],plan({intent:'ready',requestedOffers:['directive']})).mode,'handoff');
  assert.deepEqual(chooseRoute(k,[],plan({intent:'ready',requestedOffers:['ai-install']})).actionIds,['ai-install']);
});
test('a clear private-coaching need hands off after two questions when the matching offer is closed',()=>{
 const p=plan({need:'private-owner-coaching'});
 assert.equal(chooseRoute(k,history(1),p).mode,'discover');
 for(const n of [2,3,4]) {
  const r=chooseRoute(k,history(n),p);assert.equal(r.mode,'handoff');assert.equal(r.target,'fit');assert.equal(r.allowedQuestions,0);assert.match(r.reason,/unavailable/);
 }
});
test('no purchase, refusal and already-owned benefits never force a sale',()=>{
  assert.equal(chooseRoute(k,[],plan({need:'no-gap'})).mode,'no-purchase');
  assert.equal(chooseRoute(k,history(4),plan({intent:'decline'})).mode,'decline');
  for(const need of ['agency-operations','completed-call-review','self-paced-training']){
    const r=chooseRoute(k,history(4),plan({need,ownsCore:true}));assert.equal(r.mode,'use-existing');assert.deepEqual(r.actionIds,[]);
  }
});
test('incompatible phones and refused coaching cannot become forced recommendations at the cap',()=>{
  for(const phoneCompatibility of ['unknown','unsupported']) assert.equal(chooseRoute(k,history(4),plan({need:'live-call-help',phoneCompatibility})).mode,'handoff');
  assert.equal(chooseRoute(k,history(4),plan({coachingPreference:'no'})).mode,'handoff');
});
test('stored metadata survives roundtrip and legacy question turns cannot restart discovery',()=>{
  const saved=JSON.parse(JSON.stringify(history(3)));
  assert.equal(routingState(saved,k.routing).questionsAsked,3);
  const legacy=Array.from({length:8},()=>({role:'assistant',text:'What happens?'}));
  assert.equal(chooseRoute(k,legacy,plan()).mode,'recommend');
  assert.equal(routingState([{role:'user',text:'Why?'}],k.routing).questionsAsked,0);
});
test('post-recommendation corrections can reroute but cannot restart questions',()=>{
  const routed=[{role:'assistant',text:'Try Boardroom.',routing:{askedQuestion:false,stage:'routed'}}];
  assert.equal(chooseRoute(k,routed,plan({need:'producer-sales-skills'})).target,'certified');
  assert.equal(chooseRoute(k,routed,plan({confidence:'unclear'})).mode,'handoff');
});
test('grounding rejects invented evidence and assistant quotations',()=>{
  assert.throws(()=>validatePlan(plan(),k,[],'Hello'),/evidence/);
  assert.throws(()=>validatePlan(plan(),k,[{role:'assistant',text:'We have no management process.'}],'Hello'),/evidence/);
  assert.equal(validatePlan(plan(),k,[],'We have no management process.').confidence,'clear');
  assert.equal(validatePlan(plan({evidence:['"We have no management process."']}),k,[],'We have no management process.').confidence,'clear');
  assert.throws(()=>validatePlan(plan({evidence:['"Invented need"']}),k,[],'Hello'),/evidence/);
});
test('a fifth question, disguised action mismatch, or extra question fails the output contract',()=>{
  const closed=chooseRoute(k,history(4),plan());
  assert.throws(()=>validateRoutedReply({...written,question:'What is next?'},closed));
  assert.throws(()=>validateRoutedReply({...written,reply:'Another question?'},closed));
  assert.throws(()=>validateRoutedReply({...written,actionIds:['boardroom']},closed));
  const open=chooseRoute(k,[],plan());
  assert.throws(()=>validateRoutedReply({...written,question:'Who? What?'},open));
  assert.throws(()=>validateRoutedReply(written,open));
  assert.throws(()=>validateRoutedReply({...written,question:'\u200b?'},open));
  assert.ok(validateRoutedReply({...written,question:'What is missing?'},open));
});

function fakeProvider(classification, answers) {
  let writes=0;const requests=[];
  const fetcher=async(_url,options)=>{
    const request=JSON.parse(options.body);requests.push(request);
    const isPlan=request.text.format.name==='standard_routing_plan';
    const value=isPlan?classification:answers[Math.min(writes++,answers.length-1)];
    return {ok:true,json:async()=>({status:'completed',model:'test',output:[{content:[{type:'output_text',text:JSON.stringify(value)}]}],usage:{input_tokens:1,output_tokens:1,total_tokens:2}})};
  };
  return {fetcher,requests};
}
test('end-to-end generation enforces route, persists count metadata, and supplies the selected CTA',async()=>{
  const provider=fakeProvider(plan(),[{...written,reply:'The 8-Week Experience fits the management process you need to build.'}]);
  const result=await generateReply(k,history(2),'We have no management process.',{apiKey:'test',fetcher:provider.fetcher});
  assert.equal(result.routing.questionsAsked,2);assert.equal(result.routing.stage,'routed');assert.equal(result.actions[0].id,'eight-week');assert.equal(provider.requests.length,2);
});
test('writer gets one repair attempt and cannot leak a fifth discovery question',async()=>{
  const provider=fakeProvider(plan(),[{...written,question:'One more question?'}]);
  await assert.rejects(generateReply(k,history(4),'We have no management process.',{apiKey:'test',fetcher:provider.fetcher}),/routing checks/);
  assert.equal(provider.requests.length,3);
});
test('malformed evidence gets one bounded repair and never becomes a recommendation',async()=>{
  const provider=fakeProvider(plan(),[written]);let calls=0;
  const fetcher=async(url,options)=>{
    if(calls++===0) return {ok:true,json:async()=>({status:'completed',output:[{content:[{type:'output_text',text:JSON.stringify(plan({evidence:['Invented need']}))}]}],usage:{total_tokens:1}})};
    return provider.fetcher(url,options);
  };
  const result=await generateReply(k,history(2),'We have no management process.',{apiKey:'test',fetcher});
  assert.equal(result.routing.target,'eight-week');assert.equal(calls,3);
  const invalid=fakeProvider(plan({evidence:['Invented need']}),[written]);
  await assert.rejects(generateReply(k,history(2),'Hello',{apiKey:'test',fetcher:invalid.fetcher}),/prototype checks/);
  assert.equal(invalid.requests.length,2);
});
test('a factual answer between discoveries preserves the count and the next qualifying reply routes',async()=>{
  const msgs=history(2);
  const direct=fakeProvider(plan({intent:'direct-question',requestedOffers:['eight-week']}),[{...written,reply:'$4,500 paid in full, or eight weekly payments of $625.'}]);
  const first=await generateReply(k,msgs,'We have no management process. What does the eight-week program cost?',{apiKey:'test',fetcher:direct.fetcher});
  msgs.push({role:'assistant',text:first.reply,routing:first.routing});
  const next=fakeProvider(plan(),[written]);
  const second=await generateReply(k,msgs,'We have no management process.',{apiKey:'test',fetcher:next.fetcher});
  assert.equal(second.routing.questionsAsked,2);assert.equal(second.routing.target,'eight-week');
});
