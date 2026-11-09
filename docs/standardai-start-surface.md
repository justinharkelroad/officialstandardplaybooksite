# STANDARDAI on /start: the `surface=start` contract

The `/start` VSL funnel now mounts STANDARDAI, the same advisor used on the
home page. The only difference is a query param the site passes to the worker:

```
https://standard-marketing-advisor.justin-15e.workers.dev/?brand=standard&surface=start
```

Status: **implemented, not yet deployed.** The Worker source lives in this repo
at `infra/marketing-advisor/`, and the `surface=start` behavior below is built
and tested there (see "What the Worker now does"). It is live for visitors only
after an authorized `npm run deploy` of that Worker (its CI runs tests and a
`wrangler deploy --dry-run` on the PR, but does not deploy). Until that deploy,
`surface=start` rides on the URL but the live Worker still opens with the
home-page question.

## What the site already does (this repo)

- `src/components/marketing/advisorScope.ts` allows the advisor on `/` and
  `/start` only, on the Standard hosts.
- `src/components/marketing/MarketingAdvisor.tsx` takes an optional `surface`
  prop and appends `&surface=<value>` to the iframe URL.
- `src/pages/funnel/Start.tsx` mounts `<MarketingAdvisor brand="standard" surface="start" />`.

No other surface values exist yet. Home page passes none.

## What the Worker now does when `surface=start`

Treat it as the VSL funnel, not the general home-page conversation.

### Goal
Route the visitor to exactly one of the two paths on the page, matched to the
video's close:

1. **The Boardroom**, $399/mo, weekly group coaching, Agency Brain Core
   included, Monday 1pm EST, cancel any time. The self-serve "start this week"
   path. On-page action: "Join the Boardroom." Offer page: `/boardroom`.
2. **Book a call**, a 45-minute 1:1 with Justin, for owners ready for a bigger
   move and the commitment it takes. On-page action: "Book a call" which goes
   to `/book` (the five-question router; the bigger-commitment offers route to
   Justin's calendar).

Do not push Team Standard as a primary path. It stays a side option. There is
no call with anyone but Justin.

### Opener
Tailored to someone who just watched (or is watching) the VSL, not "Welcome to
Standard Playbook." Something like: acknowledge they are weighing the two
paths, then ask the one question that sorts them (roughly: are you ready to
move now, or do you want to talk it through first).

### Knowledge it should carry
- The two paths above, their price, cadence, and on-page action.
- One-on-one coaching is currently **full**; the Directive is **waitlist**.
  Do not offer an open 1:1 seat. Point ready buyers to Book a call.
- The guarantee language already on the page (do not invent new terms).
- The eight objections the page already anticipates, so the bot can answer
  them in Justin's voice:
  1. Is it worth the money?
  2. I don't have time.
  3. Will this work for my carrier?
  4. My producers won't change.
  5. I've tried coaching before.
  6. What if I want to cancel? (Boardroom cancels any time.)
  7. Do I need Agency Brain too? (Boardroom includes Agency Brain Core.)
  8. What's the difference between Boardroom and Team Standard?

### Deep links the bot can hand out
- Book a call: `https://standardplaybook.com/book`
- The Boardroom: `https://standardplaybook.com/boardroom` (or the same checkout
  the "Join the Boardroom" button uses; wire the exact Stripe link worker-side).
- Not sure: `https://standardplaybook.com/decision` (the 2-minute quiz).

### Tone
Justin's voice from the VSL: direct, commitment-forward, no hype. The close
mirrors the video: do not book a call unless you are ready to commit, and that
is okay either way.

## To extend later
Add more `surface` values the same way (for example `surface=booked` on the
confirmation page). The site change is one prop; the behavior is all worker-side.
