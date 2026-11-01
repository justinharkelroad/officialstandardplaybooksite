# Live Call Coach marketing advisor product scope

Rule: A Live Call Coach visitor session uses a product-only catalog, examples, classification schema and server router. Its only navigable product action is the Live Call Coach plans page. A missed close, uncertain fit, unsupported calling setup, exhausted question budget or old off-product recommendation must never route that visitor into another offer or a general fit call. Preserve honest compatibility checks, factual answers, refusal and no-purchase outcomes.

Why: Sharing the general catalog router allowed a product-specific conversation about missed closing moves to recommend Certified Standard.

Regression enforcer: `infra/marketing-advisor/product-scope.test.mjs` replays the reported closing/roleplay/callback conversation, exercises old recommendation history, limits and unsupported setups, rejects foreign action IDs and named off-product replies, and verifies the public Worker uses its stored brand and retains exact-retry receipts. `security.test.mjs` retains visitor isolation and public endpoint checks. Standard and Agency Brain retain their existing catalog routing.

The product profile is generated and hashed from `knowledge/live-call-coach.json` alongside the base knowledge sources. Its reviewed capabilities come from Agency Brain `origin/main` `src/components/marketing/live-call-coach/data.ts`: focused skill games, configurable approved wording, live next-move prompts, a manager-reviewed script draft and separate after-call review. This change does not expand verified pricing or claim live account access.

<details>
<summary>Incident history</summary>

On November 1, 2026, a Live Call Coach marketing chat discussing reps not asking for the close, roleplay practice and missed callbacks recommended Certified Standard. The brand adapter changed identity and the opener but left all offers and general recommendation rules available. Product scope now applies before general catalog routing, including follow-ups to an older off-product recommendation. The response validator also rejects named cross-sells before saving a new reply.

</details>
