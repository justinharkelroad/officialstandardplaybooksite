export const TTL=24*60*60*1000;
export const MAX_TURNS=20;
export const TOKEN_PATTERN=/^[a-f0-9]{64}$/;
export const REQUEST_ID_PATTERN=/^[a-f0-9-]{36}$/i;
export const HOSTS={standard:['https://standardplaybook.com','https://www.standardplaybook.com'],agencybrain:['https://myagencybrain.com','https://www.myagencybrain.com'],livecallcoach:['https://livecallcoach.ai','https://www.livecallcoach.ai']};
export function validMessage(body) {
 return body && Object.keys(body).sort().join(',')==='requestId,text' && typeof body.text==='string' && body.text.trim().length>0 && body.text.length<=3000 && REQUEST_ID_PATTERN.test(body.requestId??'');
}
export function clientSession(session) {
 return {brand:session.brand,expiresAt:session.expiresAt,messages:session.messages.map(m=>({id:m.id,role:m.role,text:m.text,actions:m.actions??[]}))};
}
export async function digest(text) {return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)))].map(x=>x.toString(16).padStart(2,'0')).join('');}
export function randomToken(){return [...crypto.getRandomValues(new Uint8Array(32))].map(x=>x.toString(16).padStart(2,'0')).join('');}
export const json=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
