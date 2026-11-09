import base from './knowledge.generated.mjs';
export const BRANDS=['standard','agencybrain','livecallcoach'];
export function getKnowledge(brand) {
 if(!BRANDS.includes(brand))throw new Error('Unknown brand');
 const k=structuredClone(base);
 delete k.productProfiles;
 k.voice=k.voice.replaceAll('private prototype','public marketing guide').replaceAll('private-test','public');
 if(brand==='livecallcoach') {
  const profile=structuredClone(base.productProfiles.livecallcoach);
  k.productScope='live-call-coach';
  k.pack.offers=k.pack.offers.filter(o=>o.id===k.productScope);
  Object.assign(k.pack.offers[0],profile.offer);
  k.pack.actions=[profile.action];
  k.pack.version=profile.routing.version;
  k.pack.scope='Live Call Coach product guidance only; no account access or other offer recommendations';
  k.voice=profile.voice;
  k.examples=profile.examples;
  k.routing=profile.routing;
  k.hash=profile.hash;
  k.ids=[...k.pack.principles,...k.pack.offers].map(o=>o.id);
 }
 if(brand!=='standard') {
  k.voice=k.voice.replaceAll('STANDARDAI','Stanley');
  k.examples=JSON.parse(JSON.stringify(k.examples).replaceAll('STANDARDAI','Stanley'));
  k.voice+='\nYou are Stanley, the AI guide on '+(brand==='agencybrain'?'Agency Brain’s public homepage. Start with the agency workflow or operational problem. Explain software fit without requiring a coaching purchase.':'Live Call Coach’s public marketing homepage. Start with what happens on sales calls and confirm their calling setup before suggesting Live Call Coach. Explain live prompts versus after-call scoring clearly.')+' You have no access to the visitor’s account, calls, team, billing or private app. Do not give in-app support instructions from memory. Use verified public product pages for questions the pack cannot answer. Keep Justin’s practical diagnostic approach, but do not speak as Justin or imply he is personally in the chat.';
 }
 k.voice+='\nThis is a public visitor conversation. Never mention internal sources, local files, tests or pack approval. Do not ask for client names, policy numbers or sensitive records. If the user supplies them, avoid repeating them. Do not describe availability snapshots as live capacity.';
 return k;
}

export const OPENERS={standard:"What’s happening in your agency that you want to change?",agencybrain:"What’s taking more work than it should in your agency right now?",livecallcoach:"Where are your reps getting stuck on calls?"};

// Page the visitor came from. 'home' is the default; 'start' is the VSL funnel.
// Validated as a fixed enum, exactly like brand, so the client can never supply
// a free prompt. A surface only swaps the opener; routing stays grounded.
export const SURFACES=['home','start'];
export const SURFACE_OPENERS={
 'standard:start':"You just watched the whole case, so let’s not waste it. Tell me what you want to change in your agency, and whether you’re ready to move now or want to talk it through first.",
};
export function openerFor(brand,surface){return SURFACE_OPENERS[brand+':'+surface]??OPENERS[brand];}
