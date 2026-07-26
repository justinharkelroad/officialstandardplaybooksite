# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/666a4afa-628a-46d0-87e0-db3a92ce6c29

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/666a4afa-628a-46d0-87e0-db3a92ce6c29) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

**Pushing to `main` deploys.** There is no manual publish step.

standardplaybook.com is served by the **Cloudflare Pages** project
`officialstandardplaybooksite`, connected to `justinharkelroad/officialstandardplaybooksite`.
Config confirmed in the Cloudflare dashboard 2026-07-26:

| Setting | Value |
|---|---|
| Production branch | `main` |
| Automatic deployments | Enabled |
| Build command | `npm run build:pages` |
| Build output directory | `dist` |
| Root directory | repo root |
| Build watch paths | `*` |
| Build system version | 3 |
| Build env | `BASE_URL=https://standardplaybook.com`, `PUPPETEER_SKIP_DOWNLOAD=true` |

Domains: `standardplaybook.com`, `www.standardplaybook.com`,
`officialstandardplaybooksite.pages.dev`.

Because the build command is `build:pages`, every deploy runs `scripts/og-stamp.mjs`.
Per-route OG and meta tags come from `scripts/og-routes.json`, which is a SEPARATE
source from `src/data/seoConfig.ts` and from the page components. Changing page copy
does not change what search engines and link previews read. Update all of them.

`public/_headers` and `public/_redirects` are Cloudflare Pages convention files and
are served as response headers and redirects.

The Lovable "Share then Publish" flow described in the original scaffold README
does NOT publish this site. Do not rely on it.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
