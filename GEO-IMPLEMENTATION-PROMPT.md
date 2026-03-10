# GEO Compliance Implementation Prompt

> Paste this prompt into Claude Code from inside your project directory (with GEO-AUDIT-REPORT.md present).

---

## The Prompt

```
Read GEO-AUDIT-REPORT.md in this project. This is a GEO audit of standardplaybook.com — a React SPA built on Lovable (Vite + React). I need you to systematically fix every issue to reach 100% GEO compliance. Attack these in the correct order — each phase builds on the previous one.

IMPORTANT: Before making any changes, explore the full project structure and understand how the Lovable/Vite/React app is organized. Identify where the index.html template lives, how routing works, and where page components are defined.

---

## PHASE 1: RENDERING & CRAWLABILITY (Do this FIRST — nothing else matters until crawlers can see content)

### 1A. Fix Server-Side Rendering
The site is a pure CSR SPA — crawlers see only `<div id="root"></div>`. Fix this using ONE of these approaches (evaluate which is feasible for this project):

- **Option A (Preferred):** Add vite-plugin-ssr or vite-plugin-ssg to generate static HTML for all 12 routes at build time. This is the lowest-friction SSG approach for a Vite project.
- **Option B:** Implement prerender-spa-plugin to generate static HTML snapshots at build time for all routes.
- **Option C:** If the above aren't feasible, create a `/public` folder with static HTML fallback pages for each route that contain the full rendered content, meta tags, and schema — served to bot user agents via Cloudflare Workers or a simple middleware.

Whichever approach you choose, verify that running `curl -s https://standardplaybook.com/boardroom` (or the local build equivalent) returns actual HTML content in the body — not just `<div id="root"></div>`.

### 1B. Create Unique Per-Page Meta Tags
Every page currently shares identical meta tags. For each of these 12 routes, set UNIQUE values:

| Route | Title Pattern | Description (write unique, keyword-rich) |
|-------|--------------|------------------------------------------|
| `/` | The Standard Playbook — High-Performance Coaching for Elite Entrepreneurs | Main value prop + location |
| `/boardroom` | The Boardroom — Elite Mastermind for Insurance Agency Owners | The Standard Playbook | Program description |
| `/directive` | The Directive — Intensive Implementation Coaching | The Standard Playbook | Program description |
| `/partnership` | Partnership Program | The Standard Playbook | Program description |
| `/sales-experience` | 8-Week Sales Management Training | The Standard Playbook | Program description |
| `/producer-power-up` | Producer Power-Up — 6-Week Sales Transformation | The Standard Playbook | Program description |
| `/owner-challenge` | Owner Challenge | The Standard Playbook | Program description |
| `/app` | The Standard Playbook App — Sales Training & Accountability Platform | App description |
| `/about` | About The Standard Playbook — [Founder Name], Fort Wayne IN | Bio + mission |
| `/contact` | Contact The Standard Playbook — Fort Wayne, IN | Contact details |
| `/privacy` | Privacy Policy | The Standard Playbook | Standard |
| `/terms` | Terms of Service | The Standard Playbook | Standard |

For EACH page, set unique:
- `<title>`
- `<meta name="description">`
- `<link rel="canonical">` (SELF-REFERENCING — `/boardroom` canonicals to `/boardroom`, NOT `/`)
- `<meta property="og:title">`
- `<meta property="og:description">`
- `<meta property="og:url">` (must match canonical)

Use react-helmet-async, or set these in the SSG/prerender config, or manage them in each page component — whatever fits the project architecture.

### 1C. Fix the Canonical Tag
The current canonical on ALL pages points to `https://standardplaybook.com/`. Change each page to self-reference. This is critical — the current setup tells Google every inner page is a duplicate of the homepage.

---

## PHASE 2: STRUCTURED DATA (Do this while Phase 1 is being built)

### 2A. Upgrade Organization to ProfessionalService
Replace the existing Organization JSON-LD with ProfessionalService. Add ALL of these properties:

```json
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "The Standard Playbook",
  "alternateName": "Standard Playbook",
  "description": "High-performance coaching for elite entrepreneurs specializing in insurance agency growth, sales training, and producer development in Fort Wayne, Indiana.",
  "url": "https://standardplaybook.com",
  "logo": { "@type": "ImageObject", "url": "https://standardplaybook.com/og-image.png" },
  "telephone": "+1-260-515-1349",
  "email": "info@standardplaybook.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "[NEED FROM OWNER]",
    "addressLocality": "Fort Wayne",
    "addressRegion": "IN",
    "postalCode": "[NEED FROM OWNER]",
    "addressCountry": "US"
  },
  "areaServed": { "@type": "Country", "name": "United States" },
  "priceRange": "$$$",
  "foundingDate": "[NEED FROM OWNER]",
  "founder": {
    "@type": "Person",
    "name": "[NEED FROM OWNER - Justin's full name]",
    "jobTitle": "Founder & Head Coach"
  },
  "knowsAbout": ["Executive Coaching", "Insurance Agency Growth", "Sales Training", "Producer Development", "Business Coaching", "Leadership Development"],
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Coaching Programs",
    "itemListElement": [
      { "@type": "OfferCatalog", "name": "Boardroom", "url": "https://standardplaybook.com/boardroom" },
      { "@type": "OfferCatalog", "name": "The Directive", "url": "https://standardplaybook.com/directive" },
      { "@type": "OfferCatalog", "name": "Partnership", "url": "https://standardplaybook.com/partnership" },
      { "@type": "OfferCatalog", "name": "Sales Experience", "url": "https://standardplaybook.com/sales-experience" },
      { "@type": "OfferCatalog", "name": "Producer Power Up", "url": "https://standardplaybook.com/producer-power-up" },
      { "@type": "OfferCatalog", "name": "Owner Challenge", "url": "https://standardplaybook.com/owner-challenge" }
    ]
  },
  "sameAs": [
    "https://twitter.com/standardplaybook",
    "[ADD LINKEDIN URL]",
    "[ADD FACEBOOK URL]",
    "[ADD YOUTUBE URL]",
    "[ADD INSTAGRAM URL]"
  ]
}
```

Leave [NEED FROM OWNER] placeholders with TODO comments — I'll fill these in.

### 2B. Add Person Schema for Founder
Add to homepage and /about page:

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "[Justin's full name]",
  "jobTitle": "Founder & Head Coach",
  "worksFor": { "@type": "Organization", "name": "The Standard Playbook" },
  "knowsAbout": ["Executive Coaching", "Insurance Agency Growth", "Sales Leadership"],
  "sameAs": ["[LinkedIn personal URL]", "[Twitter personal URL]"]
}
```

### 2C. Add Service Schema to Each Program Page
For EACH of the 6 program pages, add a Service JSON-LD block:

- `/boardroom` → Service: "Boardroom" (Elite Mastermind)
- `/directive` → Service: "The Directive" (Intensive Implementation)
- `/partnership` → Service: "Partnership"
- `/sales-experience` → Service: "Sales Experience" (8-Week Training)
- `/producer-power-up` → Service: "Producer Power-Up" (6-Week Transformation)
- `/owner-challenge` → Service: "Owner Challenge"

Each should include: name, description (pull from page content), provider (link to Organization), serviceType, audience, url, and pricing if visible on the page.

### 2D. Add WebSite Schema to Homepage

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "The Standard Playbook",
  "url": "https://standardplaybook.com",
  "description": "High-performance coaching for elite entrepreneurs",
  "publisher": { "@type": "Organization", "name": "The Standard Playbook" }
}
```

### 2E. Add BreadcrumbList Schema to All Inner Pages
Each inner page gets a BreadcrumbList with Home → Page Name.

### 2F. Add FAQPage Schema
If any service pages have FAQ sections, encode them as FAQPage JSON-LD. Pull the actual Q&A content from the page components.

### 2G. Add speakable Property
Add speakable to the ProfessionalService schema targeting H1 and main description selectors.

---

## PHASE 3: ROBOTS, SITEMAP & AI CRAWLER ACCESS

### 3A. Update robots.txt
Replace with:

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /private/

User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: OAI-SearchBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

Sitemap: https://standardplaybook.com/sitemap.xml
```

Remove the crawl-delay (unnecessary for 12 pages).

### 3B. Update sitemap.xml
Add `<lastmod>` dates (use today's date for now) to every entry. Keep existing priority and changefreq values.

### 3C. Create llms.txt
Create `/public/llms.txt` with:

```markdown
# The Standard Playbook

> High-performance coaching for elite entrepreneurs specializing in insurance agency growth, producer development, and sales training. Based in Fort Wayne, Indiana.

## Programs
- [Boardroom](https://standardplaybook.com/boardroom): Elite mastermind for insurance agency owners — peer accountability, strategy sessions, and growth frameworks.
- [The Directive](https://standardplaybook.com/directive): Intensive implementation coaching for rapid business transformation.
- [Partnership](https://standardplaybook.com/partnership): [Pull description from page content]
- [Sales Experience](https://standardplaybook.com/sales-experience): 8-week sales management training program.
- [Producer Power-Up](https://standardplaybook.com/producer-power-up): 6-week sales transformation with daily modules, accountability tracking, and the Core 4 system.
- [Owner Challenge](https://standardplaybook.com/owner-challenge): [Pull description from page content]

## Platform
- [Standard Playbook App](https://standardplaybook.com/app): Sales training and accountability platform with call scoring, role-play practice, and performance tracking.

## About
- [About Us](https://standardplaybook.com/about): Learn about our mission, team, and coaching philosophy.

## Contact
- Phone: +1-260-515-1349
- Email: info@standardplaybook.com
- Location: Fort Wayne, IN
- [Contact Page](https://standardplaybook.com/contact)
```

Pull actual program descriptions from the page components to replace placeholders.

### 3D. Create llms-full.txt
Create a more detailed version at `/public/llms-full.txt` with expanded descriptions for each program (2-3 paragraphs each), pricing info, FAQ content, and testimonials — pulled from the actual page component content.

---

## PHASE 4: TECHNICAL FIXES

### 4A. Fix OG Image URL
Change all references from `officialstandardplaybooksite.lovable.app/og-image.png` to `standardplaybook.com/og-image.png`. Ensure the image file exists at that path in `/public`.

### 4B. Fix www/non-www
Add a redirect rule (via Cloudflare, _redirects file, or server config) to 301 redirect www.standardplaybook.com → standardplaybook.com.

### 4C. Add Security Headers
If using Cloudflare, create/update `_headers` file or configure in the deployment:
- `Content-Security-Policy` (appropriate for the site's scripts/styles)
- `X-Frame-Options: DENY`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### 4D. Optimize Font Loading
- Reduce Google Fonts to only the weights actually used
- Add `<link rel="preload">` for critical font CSS
- Consider self-hosting fonts for performance

### 4E. Add Resource Hints
- `<link rel="preload">` for the main JS bundle
- `<link rel="dns-prefetch">` for third-party domains (Facebook, analytics)

### 4F. Implement IndexNow
Create an IndexNow key file at `/public/indexnow-key.txt` and add the verification meta tag to the HTML head.

---

## PHASE 5: CONTENT IMPROVEMENTS (Code-level changes)

### 5A. Add Visible Publication Dates
Add a "Last updated: [date]" element to each service page, visible in the rendered content.

### 5B. Add Author Attribution
On every service/content page, add a visible author section: "[Founder Name], Founder & Head Coach" with a link to the /about page.

### 5C. Add Outbound Editorial Links
Where appropriate in service page content, add links to authoritative external sources (industry associations, relevant research, frameworks referenced).

### 5D. Clarify Standard Playbook / Agency Brain Relationship
The privacy policy references "Standard Playbook INC doing business as Agency Brain." Add a brief clarification on the About page explaining the relationship between these brands.

---

## VERIFICATION CHECKLIST

After all changes, verify:
- [ ] `curl -s [each route]` returns actual HTML content (not empty div)
- [ ] Each page has unique title, description, canonical, OG tags
- [ ] Each page's canonical is self-referencing
- [ ] ProfessionalService schema validates at schema.org validator
- [ ] Person schema present on homepage + /about
- [ ] Service schema on all 6 program pages
- [ ] FAQPage schema on pages with FAQ content
- [ ] BreadcrumbList on all inner pages
- [ ] WebSite schema on homepage
- [ ] robots.txt includes all AI crawler directives
- [ ] sitemap.xml has lastmod dates
- [ ] llms.txt accessible at /llms.txt
- [ ] llms-full.txt accessible at /llms-full.txt
- [ ] OG image points to standardplaybook.com (not lovable.app)
- [ ] www redirects to non-www
- [ ] Security headers present (CSP, X-Frame-Options, Permissions-Policy)
- [ ] No render-blocking font issues
- [ ] IndexNow key deployed

Work through these phases sequentially. After completing each phase, show me what was changed and confirm the verification items for that phase pass. Ask me for any [NEED FROM OWNER] values before proceeding past those items.
```

---

## MANUAL ACTIONS (Not code — you do these yourself)

These require logging into external platforms. Do them in parallel with Phase 2-3:

- [ ] **Google Business Profile** — Create at business.google.com for Fort Wayne, IN. Category: "Business Coach"
- [ ] **LinkedIn Company Page** — Create at linkedin.com/company/setup. Industry: Professional Training & Coaching
- [ ] **YouTube Channel** — Create at youtube.com. Upload 5-10 coaching videos
- [ ] **Wikidata Entry** — Create at wikidata.org with business properties
- [ ] **Bing Webmaster Tools** — Verify at bing.com/webmasters, submit sitemap
- [ ] **Facebook Business Page** — Create/verify and link
- [ ] **Trustpilot / BBB** — Claim profiles, request client reviews
- [ ] **Reddit** — Begin genuine participation in r/entrepreneur, r/insurance, r/sales
- [ ] **Collect from clients:** 8-12 testimonials with full names, companies, and specific measurable outcomes

Once you create LinkedIn, YouTube, Facebook, etc. — give the URLs to Claude Code so it can update the sameAs schema array and llms.txt.
