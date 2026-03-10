# GEO Audit Report: standardplaybook.com

**Date:** March 10, 2026
**Business:** The Standard Playbook — High-performance coaching for elite entrepreneurs
**Location:** Fort Wayne, IN
**Business Type:** Coaching / Agency
**Pages Analyzed:** 12 (full sitemap)

---

## Composite GEO Score: 21/100 — CRITICAL

```
 0        20        40        60        80       100
 |=========|=========|=========|=========|=========|
 [######                                           ]  21/100
          ^
      YOU ARE HERE
```

**Interpretation:** The Standard Playbook is **virtually invisible to AI search engines**. The site has a fundamental rendering architecture that prevents AI crawlers from reading any page content, compounded by near-zero external brand presence.

---

## Score Breakdown

| Category | Weight | Score | Weighted | Status |
|----------|--------|-------|----------|--------|
| AI Citability & Visibility | 25% | 12/100 | 3.0 | CRITICAL |
| Brand Authority Signals | 20% | 5/100 | 1.0 | CRITICAL |
| Content Quality & E-E-A-T | 20% | 38/100 | 7.6 | POOR |
| Technical Foundations | 15% | 32/100 | 4.8 | POOR |
| Structured Data | 10% | 18/100 | 1.8 | CRITICAL |
| Platform Optimization | 10% | 24/100 | 2.4 | CRITICAL |
| **COMPOSITE** | **100%** | | **20.6 → 21** | **CRITICAL** |

---

## AI Platform Readiness

| Platform | Score | Status |
|----------|-------|--------|
| Google AI Overviews | 18/100 | Critical |
| Bing Copilot | 21/100 | Critical |
| ChatGPT Web Search | 22/100 | Critical |
| Google Gemini | 26/100 | Poor |
| Perplexity AI | 15/100 | Critical |

**Strongest:** Google Gemini (26) — Organization schema provides minimal Knowledge Graph seeding
**Weakest:** Perplexity AI (15) — Zero community validation, no Reddit/forum presence, JS rendering blocks crawler

---

## The #1 Problem: AI Crawlers See an Empty Page

This is the single most critical finding. **The entire site is invisible to AI search engines.**

The Standard Playbook is built as a **client-side rendered React SPA** on the Lovable platform. Every page serves this HTML body:

```html
<body>
  <div id="root"></div>
</body>
```

**What AI crawlers actually see when they visit any page:**

| Element | What's There |
|---------|-------------|
| Title | "The Standard Playbook - Raise Your Standard" (same on ALL pages) |
| Description | "High-performance coaching for elite entrepreneurs..." (same on ALL pages) |
| Body content | **Empty** — 0 words |
| Headings | **None** |
| Links | **None** |
| Images | **None** |

All 12 pages return **identical HTML** with the **same ETag** (`685478e03e169a63b91fdf9c1d9d3fc5`). The client-side JavaScript router determines which "page" to show, but crawlers never execute that JavaScript.

A Prerender.io token exists (`oqzOUR0M1oiz5juB6KYX`), suggesting awareness of the problem, but **prerendering is not functioning** — bot user agents still receive the empty SPA shell.

**Impact:** Until this is fixed, every other optimization in this report has zero effect.

---

## Detailed Findings by Category

---

### 1. AI Citability & Visibility — 12/100

| Component | Score |
|-----------|-------|
| Citability (passage quality) | 5/100 |
| Brand Mentions | 5/100 |
| Crawler Access | 65/100 |
| llms.txt | 0/100 |

**Citability (5/100):** Zero citable passages exist in server-rendered HTML. The only text available to AI crawlers is the meta description ("High-performance coaching for elite entrepreneurs. Join The Standard Playbook and elevate your business to new heights.") — a generic tagline indistinguishable from thousands of coaching sites. No statistics, no FAQ content, no case studies, no specific claims AI could quote.

**Crawler Access (65/100):** AI crawlers are technically *allowed* (not blocked in robots.txt), but they receive an empty page. The robots.txt only explicitly names Googlebot, Bingbot, facebookexternalhit, and Twitterbot — no AI-specific crawlers (GPTBot, ClaudeBot, PerplexityBot).

**llms.txt (0/100):** No llms.txt file exists at `/llms.txt` or `/llms-full.txt`. Both return 404.

---

### 2. Brand Authority Signals — 5/100

| Platform | Status | Impact |
|----------|--------|--------|
| Wikipedia / Wikidata | Absent | No entity for AI knowledge bases to anchor |
| Reddit | Absent | Zero discussions; Perplexity/ChatGPT cannot find community validation |
| YouTube | Absent | No channel; missing from the #2 search engine |
| LinkedIn | Absent | Company page returns 404; critical gap for B2B coaching |
| Google Business Profile | Absent | No local presence for Fort Wayne, IN |
| Trustpilot / BBB / G2 | Absent | No third-party reviews anywhere |
| Twitter/X | Minimal | Referenced in schema but activity unverified |
| Facebook | Minimal | Pixel present (suggests ad activity) but no confirmed page |

**Summary:** The Standard Playbook has near-zero external footprint. When an AI model is asked about coaching for entrepreneurs or insurance agency growth, it has no third-party sources to corroborate the brand's existence, expertise, or reputation.

---

### 3. Content Quality & E-E-A-T — 38/100

| Dimension | Score | Key Issue |
|-----------|-------|-----------|
| Experience | 11/25 | 1 text testimonial (Nick Siciliano, Allstate), 1 video (Dan Westrick); no before/after metrics |
| Expertise | 10/25 | Coach "Justin" referenced but no last name, no credentials, no bio page |
| Authoritativeness | 7/25 | Zero external citations, zero media mentions, no industry recognitions |
| Trustworthiness | 12/25 | HTTPS, contact info, privacy/terms pages; but no reviews, no editorial standards |

**Content extracted from JS bundle reveals real substance:**
- 6 distinct coaching programs with detailed structures (Boardroom mastermind, Directive, Partnership, Sales Experience, Producer Power-Up 6-week program, Owner Challenge)
- Insurance agency-specific terminology used correctly (producers, policy counts, onboarding)
- Pricing transparency: $299/mo (Boardroom), $299/producer (Challenge), $299-499/mo (Call Scoring)
- FAQ sections with specific time commitments
- The business operates as "Standard Playbook INC" DBA "Agency Brain"

**But this content is trapped inside JavaScript and invisible to crawlers.**

**Critical gaps:**
- No blog or educational content (0 articles)
- No case studies with measurable outcomes
- No author/founder credentials page
- Zero outbound editorial links to authoritative sources
- No publication or update dates on any page

---

### 4. Technical Foundations — 32/100

| Category | Score | Status |
|----------|-------|--------|
| Server-Side Rendering | 5/100 | CRITICAL — Pure CSR SPA |
| Meta Tags & Indexability | 50/100 | WARN — All pages share identical meta tags |
| Crawlability | 60/100 | WARN — Sitemap present but no lastmod dates |
| Security Headers | 65/100 | FAIR — Missing CSP, X-Frame-Options |
| Core Web Vitals Risk | 25/100 | HIGH RISK — JS-dependent rendering, no preloads |
| Mobile Optimization | 40/100 | WARN — Viewport tag correct but can't verify layout |
| URL Structure | 90/100 | GOOD — Clean, descriptive, properly hyphenated |
| Response & Status | 70/100 | FAIR — 200 OK, HTTPS redirect works |

**Critical technical issues:**
1. **All 12 pages serve identical HTML** — same title, same description, same canonical URL (all point to homepage), same ETag
2. **Every inner page canonical points to `/`** — tells search engines that /boardroom, /about, /contact are all duplicates of the homepage
3. **www.standardplaybook.com does not redirect to non-www** — duplicate site issue
4. **OG image points to `officialstandardplaybooksite.lovable.app`** — exposes Lovable platform origin
5. **Missing security headers:** No Content-Security-Policy, no X-Frame-Options, no Permissions-Policy
6. **3 font families loaded render-blocking** (Oswald, Rajdhani, Inter with multiple weights)

---

### 5. Structured Data — 18/100

**Found:** 1 schema block — Organization (JSON-LD), identical on all pages

```json
{
  "@type": "Organization",
  "name": "The Standard Playbook",
  "description": "High-performance coaching for elite entrepreneurs",
  "url": "https://standardplaybook.com",
  "contactPoint": { "telephone": "+1-260-515-1349", "email": "info@standardplaybook.com" },
  "address": { "addressLocality": "Fort Wayne", "addressRegion": "IN", "addressCountry": "US" },
  "sameAs": ["https://twitter.com/standardplaybook"]
}
```

**Issues with existing schema:**
- `email` placed on ContactPoint (non-standard; should be on Organization)
- Address missing streetAddress and postalCode
- sameAs has only 1 platform (Twitter) — needs 5+
- No `founder`, `foundingDate`, `areaServed`, `knowsAbout`, or `hasOfferCatalog`

**Missing schema types (critical for coaching business):**

| Schema Type | Priority | Purpose |
|-------------|----------|---------|
| ProfessionalService | Critical | Replace generic Organization; enables local business features |
| Person (founder) | Critical | Coach identity = brand identity; E-E-A-T signal |
| Service (x6 programs) | High | Tell AI what each program is and who it serves |
| Review / AggregateRating | High | Social proof for AI citation decisions |
| FAQPage | Medium | AI models heavily cite Q&A formatted content |
| WebSite | Medium | Establish site identity in search |
| BreadcrumbList | Low | Hierarchical navigation context |
| speakable | Low | Forward-looking AI assistant readiness |

---

### 6. Platform Optimization — 24/100

**Google AI Overviews (18/100):** Zero heading tags in server HTML. No question-based headings, no answer-target patterns, no lists/tables/FAQ markup. All content trapped in JavaScript.

**ChatGPT Web Search (22/100):** No Wikipedia/Wikidata entity. Brand name "Standard Playbook" is generic and ambiguous. No expert attribution visible. No quotable factual statements.

**Perplexity AI (15/100):** Zero community validation (no Reddit, no forums, no reviews). No original data or research. No freshness signals. PerplexityBot sees empty page.

**Google Gemini (26/100):** No YouTube channel, no Google Business Profile, no Google Scholar presence. Organization schema provides minimal Knowledge Graph data. Gemini may partially render JS content.

**Bing Copilot (21/100):** No IndexNow support, no Bing Webmaster Tools verification. No LinkedIn company page for Microsoft ecosystem signals. Bingbot's JS rendering is weak.

---

## Prioritized Action Plan

### Phase 1: Foundation Fixes (Weeks 1-2) — CRITICAL

These must happen first. Nothing else matters until the site is visible to crawlers.

#### 1. Implement Server-Side Rendering or Working Pre-rendering
**Impact:** Unlocks ALL other optimizations | **Effort:** High | **Affects:** All platforms

The site delivers zero content to any crawler. Options:
- **Best:** Migrate to Next.js with SSR/SSG (complete rebuild but future-proof)
- **Good:** Fix Prerender.io integration to serve pre-rendered HTML to ALL bot user agents (GPTBot, ClaudeBot, PerplexityBot, Googlebot, Bingbot)
- **Interim:** Use Cloudflare Workers to serve static HTML snapshots to bot user agents
- **Test:** Run `curl -s https://standardplaybook.com/boardroom` — if body contains only `<div id="root"></div>`, prerendering is not working

#### 2. Create Unique Per-Page Meta Tags
**Impact:** Enables individual page indexing | **Effort:** Medium | **Affects:** All platforms

Every page needs its own:
- `<title>` (e.g., "Boardroom Mastermind for Agency Owners | The Standard Playbook")
- `<meta name="description">` describing that specific page
- `<link rel="canonical">` self-referencing (e.g., `/boardroom` canonicals to `/boardroom`, NOT `/`)
- Unique `og:url`, `og:title`, `og:description`

Currently all 12 pages are indistinguishable — search engines treat them as duplicates.

#### 3. Fix Canonical Tags
**Impact:** Prevents inner page suppression | **Effort:** Low | **Affects:** All platforms

Every page's canonical currently points to the homepage. This tells Google/Bing that `/boardroom`, `/about`, `/directive`, etc. are all duplicates of `/`. Fix to self-referencing canonicals immediately.

---

### Phase 2: Entity Building (Weeks 2-4) — HIGH

#### 4. Create Google Business Profile
**Impact:** Fastest entity signal | **Effort:** Low (15 minutes) | **Affects:** Gemini, Google AIO, Perplexity

Set up GBP for "The Standard Playbook" at Fort Wayne, IN. Category: "Business Coach" or "Business Consultant." Add photos, hours, description. Actively solicit Google Reviews.

#### 5. Establish LinkedIn Company Page
**Impact:** Critical B2B signal + Microsoft ecosystem | **Effort:** Low | **Affects:** Bing Copilot, ChatGPT, Perplexity

Create full company page with description, industry (Professional Training & Coaching), headquarters, employee connections. Post weekly.

#### 6. Create YouTube Channel
**Impact:** 2nd largest search engine + Gemini signal | **Effort:** Medium | **Affects:** Gemini, Perplexity, Google AIO

Publish 5-10 initial videos: coaching methodology, client testimonials, entrepreneurship insights. Link in schema sameAs.

#### 7. Expand Schema sameAs to 5+ Platforms
**Impact:** Entity graph for AI recognition | **Effort:** Low | **Affects:** All platforms

Update Organization schema sameAs from 1 link (Twitter) to include: LinkedIn, Facebook, YouTube, Google Business Profile, and Wikidata (once created).

#### 8. Create Wikidata Entry
**Impact:** Strongest entity signal for ChatGPT/Perplexity | **Effort:** Low-Medium | **Affects:** ChatGPT, Perplexity, Gemini

Create Wikidata item with: instance of (business), industry, location, website, social profiles.

---

### Phase 3: Content & Schema (Weeks 3-6) — HIGH

#### 9. Establish Author/Founder Identity
**Impact:** E-E-A-T foundation | **Effort:** Low | **Affects:** All platforms

The coach "Justin" needs: full name, professional bio, credentials, Person schema, linked LinkedIn profile, headshot. For a coaching business, the founder IS the brand.

#### 10. Add Service Schema to All Program Pages
**Impact:** AI understanding of offerings | **Effort:** Medium | **Affects:** Google AIO, ChatGPT, Bing Copilot

Add JSON-LD Service schema to each of the 6 program pages (Boardroom, Directive, Partnership, Sales Experience, Producer Power-Up, Owner Challenge) with name, description, provider, audience, pricing.

#### 11. Upgrade to ProfessionalService Schema
**Impact:** Local SEO + richer Knowledge Graph | **Effort:** Low | **Affects:** Gemini, Google AIO

Replace generic Organization with ProfessionalService. Add: complete address, geo coordinates, areaServed, foundingDate, founder, knowsAbout, hasOfferCatalog.

#### 12. Create and Deploy llms.txt
**Impact:** Direct AI model guidance | **Effort:** Low | **Affects:** AI models that support the standard

Deploy at `/llms.txt` with site description, program pages, and contact info.

#### 13. Add FAQ Sections with FAQPage Schema
**Impact:** Highest-cited content format by AI | **Effort:** Medium | **Affects:** Google AIO, ChatGPT, Perplexity

Add server-rendered FAQ sections to each service page. Encode as FAQPage schema. Use real questions clients ask.

---

### Phase 4: Authority Building (Weeks 4-12) — MEDIUM

#### 14. Launch Blog / Content Hub
**Impact:** Renewable citable content | **Effort:** High (ongoing) | **Affects:** All platforms

Publish 2-4 articles/month on insurance agency growth, sales coaching, producer training. Each 1,500+ words with original insights, data, and author attribution. Target topics where "Standard Playbook" could be cited as a source.

#### 15. Build Case Studies with Metrics
**Impact:** Proof + citable data | **Effort:** Medium | **Affects:** All platforms

Create dedicated case study pages with specific outcomes: "Client X grew revenue by Y% in Z months." Include full names, companies, before/after numbers.

#### 16. Seed Community Presence on Reddit
**Impact:** Perplexity + ChatGPT citation source | **Effort:** Medium (ongoing) | **Affects:** Perplexity, ChatGPT

Genuine participation in r/entrepreneur, r/insurance, r/smallbusiness, r/sales. Share expertise organically. Build brand footprint over 3-6 months.

#### 17. Claim Review Platform Profiles
**Impact:** Third-party validation | **Effort:** Low | **Affects:** All platforms

Create profiles on: Trustpilot, BBB (Fort Wayne, IN), Clutch. Request client reviews.

---

### Phase 5: Technical Polish (Weeks 2-6) — MEDIUM

#### 18. Fix www/non-www Duplication
301 redirect `www.standardplaybook.com` → `standardplaybook.com`

#### 19. Fix OG Image URL
Change from `officialstandardplaybooksite.lovable.app/og-image.png` to `standardplaybook.com/og-image.png`

#### 20. Add Missing Security Headers
Content-Security-Policy, X-Frame-Options, Permissions-Policy via Cloudflare

#### 21. Update robots.txt with AI Crawler Directives
Add explicit `Allow` for GPTBot, ClaudeBot, PerplexityBot, Google-Extended

#### 22. Implement IndexNow for Bing
Generate key, deploy verification file, set up automatic pings

#### 23. Add lastmod Dates to Sitemap
Include accurate modification dates for all 12 URLs

#### 24. Verify in Bing Webmaster Tools
Add msvalidate.01 meta tag, submit sitemap

#### 25. Optimize Font Loading
Reduce from 3 font families to essential weights. Add preload hints.

---

## Quick Wins (Can Do Today)

| Action | Time | Impact |
|--------|------|--------|
| Create Google Business Profile | 15 min | Gemini, Google AIO entity signal |
| Create LinkedIn company page | 20 min | Bing Copilot, entity resolution |
| Fix OG image URL | 5 min | Social sharing credibility |
| Update robots.txt with AI crawlers | 10 min | Signal AI-welcoming intent |
| Deploy llms.txt | 15 min | Direct AI model guidance |
| Add lastmod to sitemap | 10 min | Crawl prioritization |
| Set up Bing Webmaster Tools | 15 min | Bing Copilot indexing |

---

## The Standard Playbook / Agency Brain Relationship

The privacy policy reveals the business operates as **"Standard Playbook INC doing business as Agency Brain"** with a separate domain (myagencybrain.com). This brand duality creates confusion:
- Which is the primary brand?
- Are they the same service?
- Which should AI models cite?

**Recommendation:** Clarify the relationship publicly on the About page. Consider consolidating under one brand for AI discoverability, or use schema markup to explicitly link both entities.

---

## Projected Score Improvement

| Phase | Actions | Projected Score | Timeline |
|-------|---------|----------------|----------|
| Current state | — | **21/100** | — |
| Phase 1 (Foundation) | SSR + unique meta tags + canonicals | **35-40/100** | Weeks 1-2 |
| Phase 2 (Entity) | GBP + LinkedIn + YouTube + sameAs + Wikidata | **45-50/100** | Weeks 2-4 |
| Phase 3 (Content & Schema) | Author identity + Service schema + FAQ + llms.txt | **55-65/100** | Weeks 3-6 |
| Phase 4 (Authority) | Blog + case studies + Reddit + reviews | **65-75/100** | Weeks 4-12 |
| Phase 5 (Polish) | Security headers + IndexNow + font optimization | **70-80/100** | Weeks 2-6 |

---

## Methodology

This audit evaluates Generative Engine Optimization (GEO) readiness — how well a website is positioned to appear in AI-generated search results from ChatGPT, Perplexity, Google AI Overviews, Gemini, and Bing Copilot.

**Scoring weights:**
- AI Citability & Visibility (25%): Passage scoring, answer block quality, AI crawler access
- Brand Authority Signals (20%): Mentions on Reddit, YouTube, Wikipedia, LinkedIn; entity presence
- Content Quality & E-E-A-T (20%): Expertise signals, original data, author credentials
- Technical Foundations (15%): SSR, Core Web Vitals, crawlability, mobile, security
- Structured Data (10%): Schema completeness, JSON-LD validation, rich result eligibility
- Platform Optimization (10%): Platform-specific readiness across 5 AI search engines

**Tools used:** WebFetch (HTML analysis), curl (header inspection), robots.txt analysis, sitemap.xml parsing, schema.org validation, brand mention scanning across Wikipedia, Reddit, YouTube, LinkedIn, and review platforms.

---

*Report generated March 10, 2026 by Claude Code GEO Audit Tool*
*The Standard Playbook — https://standardplaybook.com*
