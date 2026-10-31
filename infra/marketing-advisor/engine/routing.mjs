import { z } from 'zod';

export function routingState(messages, policy) {
  let questionsAsked = 0, routed = false;
  for (const m of messages) {
    if (m.role !== 'assistant') continue;
    // Legacy chats count question-bearing turns conservatively; never reset them.
    questionsAsked += m.routing ? Number(m.routing.askedQuestion === true) : Number(/[?？]/.test(m.text));
    if (m.routing?.stage === 'routed' || (!m.routing && m.focus === 'offer-fit' && m.actions?.length)) routed = true;
  }
  return { questionsAsked: Math.min(questionsAsked, policy.maxQuestions), routed };
}

export function planSchema(k) {
  const offers = [...k.pack.offers.map(o => o.id), 'fit'];
  return { type:'object', additionalProperties:false, properties:{
    patternId:{type:'string',enum:['none',...k.routing.problemPatterns.map(p=>p.id)]},
    intent:{type:'string',enum:['discover','direct-question','next-step','ready','decline','boundary']},
    need:{type:'string',enum:[...k.routing.rules.map(r=>r.need),'no-gap','unclear']},
    confidence:{type:'string',enum:['clear','unclear']},
    requestedOffers:{type:'array',maxItems:2,items:{type:'string',enum:offers}},
    evidence:{type:'array',maxItems:4,items:{type:'string',minLength:1,maxLength:800}},
    coachingPreference:{type:'string',enum:['yes','no','unknown']},
    ownsCore:{type:'boolean'},
    phoneCompatibility:{type:'string',enum:['supported','unsupported','unknown']},
    rationale:{type:'string',maxLength:400},
  },required:['patternId','intent','need','confidence','requestedOffers','evidence','coachingPreference','ownsCore','phoneCompatibility','rationale'] };
}

export function validatePlan(value, k, messages, text) {
  const p=z.object({
    patternId:z.enum(['none',...k.routing.problemPatterns.map(p=>p.id)]).default('none'),
    intent:z.enum(['discover','direct-question','next-step','ready','decline','boundary']),
    need:z.enum([...k.routing.rules.map(r=>r.need),'no-gap','unclear']),
    confidence:z.enum(['clear','unclear']),requestedOffers:z.array(z.enum([...k.pack.offers.map(o=>o.id), 'fit'])).max(2),
    evidence:z.array(z.string().min(1).max(800)).max(4),
    coachingPreference:z.enum(['yes','no','unknown']),ownsCore:z.boolean(),
    phoneCompatibility:z.enum(['supported','unsupported','unknown']),rationale:z.string().max(400),
  }).strict().parse(value);
  // The planner may wrap a verbatim excerpt in quotation marks. Strip only
  // paired outer delimiters; the remaining text must still occur in user input.
  p.evidence=p.evidence.map(s=>s.trim().replace(/^["“]([\s\S]*)["”]$/, '$1'));
  const normalize=s=>s.replace(/[’‘]/g,"'").replace(/\s+/g,' ').trim().toLowerCase();
  const userTexts=[...messages.filter(m=>m.role==='user').map(m=>normalize(m.text)),normalize(text)];
  if(p.evidence.some(quote=>!userTexts.some(t=>t.includes(normalize(quote))))) throw new Error('Routing evidence must quote the visitor.');
  // A clear route needs at least one grounded visitor statement. Factual replies may not.
  if(!p.evidence.length) p.confidence='unclear';
  return p;
}

export function chooseRoute(k, messages, plan) {
  const state=routingState(messages,k.routing);
  const decision={...state, mode:'answer',target:null,actionIds:[],reason:'Answer the visitor directly.',allowedQuestions:0};
  const finish=(mode,target,reason,actions=[])=>({...decision,mode,target,reason,actionIds:actions});
  if(plan.intent==='decline') return finish('decline',null,'Respect the refusal. Do not pitch or ask another discovery question.');
  if(plan.intent==='boundary') return finish('boundary',null,'Answer within the privacy and identity boundaries. No discovery or sales pitch.');
  if(plan.intent==='next-step') {
    const previous = [...messages].reverse().find(m => m.role === 'assistant' && m.routing && m.routing.mode !== 'answer' && m.routing.mode !== 'discover');
    if (previous && ['recommend','handoff','destination'].includes(previous.routing.mode)) {
      const target = previous.routing.target;
      if (['eight-week','boardroom','standard90','team-standard','directive','fit'].includes(target))
        return finish('destination','fit','They want the next step after a coaching recommendation. Give the fit-call booking button now, with one short invitation to discuss their team and timing. Do not send them back to browse a program page or ask more discovery questions. Do not claim a booking was made.',['fit']);
      const action = k.pack.offers.find(o => o.id === target)?.actionId;
      if (action) return finish('destination',target,'Give the next step for the previously recommended offer. Use its existing destination and do not restart discovery.',[action]);
    }
    return finish('answer',null,'No active program recommendation to advance. Explain the current next step without inventing a booking need or restarting discovery.');
  }
  if(plan.intent==='direct-question') {
    return finish('answer',null,'Answer the factual question first. No discovery question and no unsolicited recommendation.',
      [...new Set(plan.requestedOffers.filter(id=>!(plan.ownsCore && ['agency-brain','call-scoring','training'].includes(id))).map(id=>k.pack.offers.find(o=>o.id===id)?.actionId).filter(Boolean))]);
  }
  const requested=plan.intent==='ready' && plan.evidence.length ? plan.requestedOffers[0] : null;
  if(requested==='fit') return finish('destination','fit','They requested a fit conversation. Provide the next step without more discovery.',['fit']);
  const offerId=requested || k.routing.rules.find(r=>r.need===plan.need)?.offer;
  const offer=k.pack.offers.find(o=>o.id===offerId);
  if(plan.need==='no-gap' && plan.confidence==='clear' && !requested) return finish('no-purchase',null,'No unmet need is supported. Recommend no purchase and give one practical takeaway.');
  // Respect existing ownership even when someone asks to buy Core again.
  if(['agency-brain','call-scoring','training'].includes(offerId) && plan.ownsCore) return finish('use-existing',offerId,'Core is already included with their Boardroom or already owned. Explain the relevant existing benefit (including its limits) before any purchase. Do not sell a duplicate.');
  if(requested) {
    if(!offer?.actionId) return finish('handoff','fit','The requested offer is unavailable. Explain that; a fit conversation can discuss alternatives, not reserve the unavailable offer.',['fit']);
    return finish('destination',offerId,'They explicitly requested this destination. Provide the next step without an interview. Do not claim verified suitability. If waitlisted, say waitlist. If Live Call Coach, state the compatibility requirement.',[offer.actionId]);
  }
  if((state.questionsAsked>=k.routing.minQuestions || state.routed) && offer && !offer.actionId && plan.confidence==='clear')
    return finish('handoff','fit',`${offer.name} matches the requested type of help but is unavailable. Explain that clearly and offer a fit conversation to discuss alternatives, not to reserve the unavailable offer. Do not keep qualifying an unavailable program.`,['fit']);
  const canRecommend=Boolean(offer?.actionId) && plan.confidence==='clear'
    && !(plan.coachingPreference==='no' && ['boardroom','eight-week','standard90','team-standard','directive'].includes(offerId))
    && !(offerId==='live-call-coach' && plan.phoneCompatibility!=='supported');
  if((state.questionsAsked>=k.routing.minQuestions || state.routed) && canRecommend)
    return finish('recommend',offerId,'Recommend this single best fit, explain why using the visitor’s evidence, and give its next step. No additional discovery question. Respect price, availability and inclusions.',[offer.actionId]);
  if(state.questionsAsked>=k.routing.maxQuestions || state.routed)
    return finish('handoff','fit','Discovery is finished but a supported program fit is not clear. Summarize what is known, acknowledge the uncertainty or incompatibility, and offer a fit conversation. Do not pretend there is a match. No more discovery questions.',['fit']);
  return {...decision,mode:'discover',reason:'Ask one useful question that distinguishes the remaining program fits. Ask about a recent event, current behavior, written expectations, authority or observable workflow. Infer the right help; never ask the visitor to choose a service category. Do not repeat questions or give an extended coaching lesson.',allowedQuestions:1};
}

export function isServiceChoiceQuestion(question) {
  return /\b(leadership (?:cadence|rhythm)|whole.agency implementation|manager.run accountability process|support modality)\b/i.test(question)
    || (/\b(want|prefer|looking for|(?:mainly )?need|kind of (?:help|support))\b/i.test(question)
      && /\b(coaching|system|software|implementation|training|course|certification|library)\b/i.test(question));
}

export function validateRoutedReply(reply, decision, messages = []) {
  if (/\b(leadership (?:cadence|rhythm)|support modality|implementation scope|management.system rebuild|manager.run accountability process)\b/i.test(`${reply.reply} ${reply.question}`))
    throw new Error('Use plain observable language instead of consultant jargon.');
  // Question lives in a separate field, preventing extra questions in coaching text.
  if(/[?？]/.test(reply.reply)) throw new Error('Put questions only in the question field.');
  if(decision.allowedQuestions) {
    if(!/[A-Za-z].*[A-Za-z]/.test(reply.question??'') || /[\p{Cc}\p{Cf}]/u.test(reply.question??'') || !reply.question?.trim().endsWith('?') || (reply.question.match(/\?/g)||[]).length!==1 || /[？\n]/.test(reply.question))
      throw new Error('Discovery requires exactly one question.');
    if (isServiceChoiceQuestion(reply.question)) throw new Error('Ask about observable behavior, not a service-category choice.');
    const normalized=s=>s.toLowerCase().replace(/[’‘]/g,"'").replace(/[^a-z0-9]+/g,' ').trim();
    const priorQuestions=messages.filter(m=>m.role==='assistant').flatMap(m=>m.text.split(/\n\s*\n/).filter(p=>p.includes('?')));
    if(priorQuestions.some(q=>normalized(q)===normalized(reply.question))) throw new Error('Ask a new concrete question, not a repeated question.');
  } else if(reply.question?.trim()) throw new Error('Discovery budget closed: no additional question.');
  if(!decision.allowedQuestions && /\b(tell me|let me know|could you share|can you share|walk me through)\b/i.test(reply.reply))
    throw new Error('Do not disguise another discovery prompt as a statement.');
  if(reply.actionIds.some(id=>!decision.actionIds.includes(id))) throw new Error('Action outside the server-selected route.');
  if(decision.mode==='discover' && reply.actionIds.length) throw new Error('Discovery cannot pitch a program yet.');
  return reply;
}

export function routeMetadata(k, decision, plan) {
  const askedQuestion=decision.mode==='discover';
  return {version:k.routing.version,mode:decision.mode,target:decision.target,askedQuestion,
    questionsAsked:decision.questionsAsked+Number(askedQuestion),
    stage:decision.routed || ['recommend','handoff','destination','no-purchase','use-existing'].includes(decision.mode) ? 'routed' : 'discovery',
    patternId:plan.patternId==='none'?null:(plan.patternId??null),evidence:plan.evidence,rationale:plan.rationale};
}
