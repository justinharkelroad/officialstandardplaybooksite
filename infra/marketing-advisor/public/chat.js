import {replyBubbles,bubblePause,waitForBubble} from './messages.mjs';
const configs={
 standard:{name:'STANDARDAI',image:'/standardai.png',subtitle:'Justin’s approach. Your next move.',hello:'What’s happening in your agency that you want to change?',disclosure:'AI guide based on Justin’s approach—not Justin personally.',fallback:'https://agencycoaching.as.me/standardfit',label:'Book a fit call',privacy:'https://standardplaybook.com/privacy'},
 agencybrain:{name:'Stanley',image:'/stanley.webp',subtitle:'Your Agency Brain guide.',hello:'What’s taking more work than it should in your agency right now?',disclosure:'Stanley is an AI product guide, with no access to your account.',fallback:'https://myagencybrain.com/info',label:'Explore Agency Brain',privacy:'https://myagencybrain.com/privacy'},
 livecallcoach:{name:'Stanley',image:'/stanley.webp',subtitle:'Your Live Call Coach guide.',hello:'Where are your reps getting stuck on calls?',disclosure:'Stanley is an AI product guide, with no access to your calls or account.',fallback:'https://livecallcoach.ai/#pricing',label:'See Live Call Coach',privacy:'https://myagencybrain.com/privacy'},
};
const brand=new URL(location.href).searchParams.get('brand')||'standard';
const config=configs[brand]||configs.standard;
const $=id=>document.getElementById(id);
document.body.dataset.brand=brand;document.title=config.name;
$('name').textContent=config.name;$('portrait').src=config.image;$('subtitle').textContent=config.subtitle;
$('disclosure').textContent=config.disclosure;$('fallback').href=config.fallback;$('fallback').textContent=config.label;$('privacy').href=config.privacy;
const storageKey='marketing-advisor-v1-'+brand;
let token=null,session=null,busy=false,pending=null,playback=null;
try{token=localStorage.getItem(storageKey);}catch{/* Storage can be disabled in embedded browsers. */}
function remember(value){token=value;try{value?localStorage.setItem(storageKey,value):localStorage.removeItem(storageKey);}catch{/* In-memory conversations still work. */}}
function lock(value){busy=value;$('send').disabled=value;$('fresh').disabled=value;$('message').readOnly=value;}
function showError(message){$('error').textContent=message;$('error').hidden=!message;}
function scroll(){const box=$('messages');box.scrollTop=box.scrollHeight;}
function bubble(text,role){const p=document.createElement('p');p.className='bubble '+role;p.textContent=text;$('messages').append(p);scroll();}
const allowedHosts=new Set(['standardplaybook.com','myagencybrain.com','livecallcoach.ai','agencycoaching.as.me']);
function actions(items=[],messageId){if(!items.length)return;const group=document.createElement('div');group.className='actions';for(const [actionIndex,item] of items.entries()){try{const url=new URL(item.url);if(url.protocol!=='https:'||!allowedHosts.has(url.hostname))continue;const a=document.createElement('a');a.href=url.href;a.target='_blank';a.rel='noopener noreferrer';a.textContent=item.label;a.addEventListener('click',()=>recordClick(messageId,actionIndex));group.append(a);}catch{/* Only validated catalog links are usable. */}}$('messages').append(group);scroll();}
function recordClick(messageId,actionIndex){
 if(!token||!messageId)return;
 const headers={'Content-Type':'application/json',Authorization:'Bearer '+token};
 const body=JSON.stringify({messageId,actionIndex,eventId:crypto.randomUUID()});
 // Do not delay navigation. Retry the same receipt once; server deduplicates it.
 const send=()=>fetch('/api/click',{method:'POST',headers,body,keepalive:true});
 void send().then(r=>{if(!r.ok&&r.status>=500)return send();}).catch(()=>send().catch(()=>{}));
}
$('fallback').addEventListener('click',()=>recordClick('fallback',0));
function render(){ $('messages').replaceChildren();if(!session?.messages.length){bubble(config.hello,'assistant');return;}for(const m of session.messages){for(const text of m.role==='assistant'?replyBubbles(m.text):[m.text])bubble(text,m.role);actions(m.actions,m.id);}}
async function api(path,method='GET',data){const response=await fetch(path,{method,headers:{...(data?{'Content-Type':'application/json'}:{}),...(token?{Authorization:'Bearer '+token}:{})},body:data?JSON.stringify(data):undefined,signal:AbortSignal.timeout(65000)});const result=await response.json();if(!response.ok){if(response.status===410||response.status===401){remember(null);session=null;pending=null;}throw new Error(result.error||'Chat is unavailable. Please try again.');}return result;}
async function ensureSession(){if(session)return;if(token){try{session=await api('/api/session');if(session.brand!==brand){remember(null);session=null;}else return;}catch(e){if(token)throw e;}}const result=await api('/api/session','POST',{brand,reviewPolicy:'2026-10-31-review-v1'});remember(result.token);session=result.session;}
$('skip').onclick=()=>playback?.abort();
$('fresh').onclick=async()=>{if(busy)return;lock(true);showError('');try{if(token)await api('/api/session','DELETE');remember(null);session=null;pending=null;$('message').value='';render();}catch(e){showError(e.message);}finally{lock(false);$('message').focus();}};
$('composer').onsubmit=async event=>{event.preventDefault();if(busy)return;const text=$('message').value.trim();if(!text)return;lock(true);showError('');$('typing').hidden=false;
 try{await ensureSession();if(!pending||pending.text!==text)pending={text,requestId:crypto.randomUUID()};render();bubble(text,'user');session=await api('/api/message','POST',pending);pending=null;$('message').value='';const response=session.messages.at(-1);playback=new AbortController();$('skip').hidden=false;const parts=replyBubbles(response.text);for(let i=0;i<parts.length;i++){if(i)await waitForBubble(bubblePause(parts[i-1]),playback.signal);bubble(parts[i],'assistant');}actions(response.actions,response.id);
 }catch(e){showError(e.name==='TimeoutError'?'That reply is taking longer than expected. Send again to retrieve it.':e.message);render();}
 finally{playback=null;$('typing').hidden=true;$('skip').hidden=true;lock(false);$('message').focus();}
};
$('message').addEventListener('keydown',event=>{if(event.key==='Enter'&&!event.shiftKey&&!event.isComposing){event.preventDefault();$('composer').requestSubmit();}});
render();if(token){lock(true);ensureSession().then(render).catch(e=>showError(e.message)).finally(()=>lock(false));}
