# Public marketing advisor

Cloudflare Worker `standard-marketing-advisor`, account `15e266ed7b466f18564e6188d52383e6`.
URL: https://standard-marketing-advisor.justin-15e.workers.dev

The Standard homepage embeds STANDARDAI. Agency Brain and Live Call Coach embed Stanley on their exact public homepages only. Agency Brain's authenticated app, login route and LCC app are excluded by the host/path guard and page-local mounts. Agency Brain/LCC frontend publishing remains Justin-only through Lovable. No Supabase or app credentials are used here.

## Runtime

- Cloudflare serves the static chat UI and server-only anonymous knowledge/routing engine.
- The browser receives a 256-bit bearer token. Each token addresses a separate Durable Object; clients cannot supply history, brand overrides, model settings or prompts.
- A session expires after 24 hours; a Durable Object alarm removes its application data. New chat deletes the prior session. Cloudflare/OpenAI provider retention policies still apply. No chat contents are emitted to application logs; Worker observability is disabled.
- OpenAI Responses uses `store: false`. The existing API key is only in the Worker secret store. Never put it in Vite variables, source, assets, logs or command arguments.
- The visible opening question counts toward the 2–4 discovery-question limit. The server validates grounded routing, refuses a fifth question and resolves action URLs from a fixed catalog. Coaching next-step replies supply `https://agencycoaching.as.me/standardfit`.
- Three brand views share the vetted knowledge, with public product context and Stanley identity for the two software sites. No live account, billing, scheduling, call or client data access.
- Messages are limited to 3,000 characters, 20 visitor turns and 40,000 accumulated characters. Idempotent request IDs allow response retrieval without paying for a second completion.
- Hashed-IP limits: 5 new chats/hour, 10/day; 30 messages/hour, 50/day. Global caps: 1,000 session creations/day and 250 message attempts/day across all three brands. Model calls have bounded retries and a 55-second deadline. Failed attempts count toward caps. These controls bound usage; they are not bot-proof identity checks.
- API writes require same-origin requests. Static framing is restricted to each brand's canonical domains. No founder-review, transcript-list or knowledge-download endpoint exists.

## Maintenance

Use Node 22 or newer. From this directory: `npm ci`, `npm test`, `npm run knowledge`, then `npx wrangler deploy --dry-run`. Deploy with `npm run deploy` only for an authorized backend release. Set `OPENAI_API_KEY` with `wrangler secret put` using secure stdin. Health exposes readiness only at `/health`.

For immediate shutdown set `CHAT_ENABLED` to `false` in `wrangler.jsonc` and redeploy; fallback links remain usable. Change `DAILY_MESSAGE_LIMIT` deliberately, with budget review. Website widget removal is independent of backend shutdown. Existing session data is intentionally not shared with the local founder prototype.

The generated knowledge hash identifies the four source knowledge files. It does not mean every later code change or new product fact was founder-approved. Refresh dated capacity before representing it as current; the model is instructed never to describe a snapshot as live availability.
