# Public marketing advisor

Cloudflare Worker `standard-marketing-advisor`, account `15e266ed7b466f18564e6188d52383e6`.
URL: https://standard-marketing-advisor.justin-15e.workers.dev

The Standard homepage embeds STANDARDAI. Agency Brain and Live Call Coach embed Stanley on their exact public homepages only. Agency Brain's authenticated app, login route and LCC app are excluded by the host/path guard and page-local mounts. Agency Brain/LCC frontend publishing remains Justin-only through Lovable. Admin reads use Agency Brain’s public Supabase API key plus the signed-in user JWT for identity/role verification only; no service-role key or app customer data is used.

## Runtime

- Cloudflare serves the static chat UI and server-only anonymous knowledge/routing engine.
- The browser receives a 256-bit bearer token. Each token addresses a separate Durable Object; clients cannot supply history, brand overrides, model settings or prompts.
- A session expires after 24 hours; a Durable Object alarm removes its application data. New chat deletes the prior session and its review archive. Cloudflare/OpenAI provider retention policies still apply. No chat contents are emitted to application logs; Worker observability is disabled.
- OpenAI Responses uses `store: false`. The existing API key is only in the Worker secret store. Never put it in Vite variables, source, assets, logs or command arguments.
- The visible opening question counts toward the 2–4 discovery-question limit. The server validates grounded routing, refuses a fifth question and resolves action URLs from a fixed catalog. Coaching next-step replies supply `https://agencycoaching.as.me/standardfit`.
- Three brand views share the vetted knowledge, with public product context and Stanley identity for the two software sites. No live account, billing, scheduling, call or client data access.
- Messages are limited to 3,000 characters, 20 visitor turns and 40,000 accumulated characters. Idempotent request IDs allow response retrieval without paying for a second completion.
- Hashed-IP limits: 5 new chats/hour, 10/day; 30 messages/hour, 50/day. Global caps: 1,000 session creations/day and 250 message attempts/day across all three brands. Model calls have bounded retries and a 55-second deadline. Failed attempts count toward caps. These controls bound usage; they are not bot-proof identity checks.
- API writes require same-origin requests. Static framing is restricted to each brand's canonical domains. The founder-only `/admin/*` inbox validates the Agency Brain user with Supabase Auth and checks the current admin role, then requires Justin’s immutable user ID. No public transcript-list or knowledge-download endpoint exists.

## Maintenance

Use Node 22 or newer. From this directory: `npm ci`, `npm test`, `npm run knowledge`, then `npx wrangler deploy --dry-run`. Deploy with `npm run deploy` only for an authorized backend release. Set `OPENAI_API_KEY` with `wrangler secret put` using secure stdin. Health exposes readiness only at `/health`.

For immediate shutdown set `CHAT_ENABLED` to `false` in `wrangler.jsonc` and redeploy; fallback links remain usable. Change `DAILY_MESSAGE_LIMIT` deliberately, with budget review. Website widget removal is independent of backend shutdown. Existing session data is intentionally not shared with the local founder prototype.

The generated knowledge hash identifies the four source knowledge files. It does not mean every later code change or new product fact was founder-approved. Refresh dated capacity before representing it as current; the model is instructed never to describe a snapshot as live availability.

## Marketing Conversations inbox

Agency Brain `/admin/marketing-conversations` is restricted to Justin’s verified admin user ID, both in navigation and the Worker. Set `AGENCY_PUBLIC_KEY` to Agency Brain’s public/publishable API key (not a service key) with secure stdin. `AGENCY_AUTH_URL` is pinned in wrangler.jsonc. Production CORS permits only the canonical Agency Brain origins; never deploy `LOCAL_ADMIN_PREVIEW=true`. No Supabase schema changes or Edge deployment are required.

New sessions explicitly identify disclosure version `2026-10-31-review-v1`. Their transcript, routing evidence, recommendation, question count and next-step click receipts are retained in the INBOX Durable Object for up to 30 days from creation. Existing sessions without that disclosure are never retrospectively archived. The 24-hour visitor session remains separate. New chat deletes both active session and archive. Every archive read excludes expired rows; alarms remove expired application records. Provider backups and processing retention remain separate. No raw IP, visitor bearer token, admin JWT or email is stored in the inbox.

Click receipts are generated in the chat iframe, delivered using keepalive, validated against that visitor’s actual message/action, and deduplicated by event ID. Navigation never waits for telemetry; network failures can leave an unrecorded click, so the UI says “No recorded click.” Reads and tests of links from the admin detail view do not generate visitor clicks. Counts are for retained conversations matching the current filters, not lifetime totals. Full list pagination is 50 rows; aggregate queries cover the full filtered set.

Review notes never automatically alter the knowledge pack. Bookings/purchases remain unconfirmed until Justin explicitly saves a manual confirmation and evidence note. No automated scheduler/Stripe attribution is connected. Do not label a click as a booking or purchase.

Backend release: Node 22.13+; `npm test`, `npm run knowledge`, `npx wrangler deploy --dry-run`, then authorized `npm run deploy`. v2 adds only the MarketingInbox SQLite Durable Object. Agency Brain frontend release remains Justin-only in Lovable after its green PR is merged. Verify anonymous and ordinary-user inbox denial before testing the founder read.
