# mayaonkeys.com

A family-friendly website documenting Maya's piano learning journey — milestones, song repertoire, videos, and more. Live at [mayaonkeys.com](https://www.mayaonkeys.com).

## Features

- **Song repertoire** — learned songs grouped by year, currently-learning section, external links to YouTube/Instagram/TikTok
- **Oldie Goldie** — practice randomiser that picks 3 mystery songs from the learned pool via flip-card envelopes
- **Milestones** — timestamped entries with images, grouped by year
- **Videos** — embedded video page
- **Artwork banner** — parallax scroll hero image across all pages
- **SEO** — sitemap, Open Graph tags, Twitter Cards, canonical URLs, per-page meta descriptions, favicon
- **CMS** — Decap CMS at `/admin` for content editing (requires Netlify Identity)

## Tech Stack

- **[Eleventy (11ty)](https://www.11ty.dev/)** v3 — static site generator
- **[Nunjucks](https://mozilla.github.io/nunjucks/)** — templating language
- **[Tailwind CSS](https://tailwindcss.com/)** v3 — utility-first CSS framework
- **[Decap CMS](https://decapcms.org/)** — content management via `/admin`
- **[Netlify](https://www.netlify.com/)** — hosting and deployment

## Project Structure

```
mayaonkeys.com/
├── _data/              # Global data files (site config)
├── _includes/          # Nunjucks layout and component partials
│   ├── base.njk        # Base layout (head, nav, footer, SEO tags)
│   ├── song-card.njk   # Song card with external link auto-labelling
│   ├── milestone-entry.njk
│   └── stats-banner.njk
├── admin/              # Decap CMS configuration and UI
├── content/
│   ├── songs/          # Individual song markdown files
│   └── milestones/     # Milestone markdown files with images
├── pages/              # Top-level page templates (.njk)
│   ├── index.njk       # Homepage
│   ├── about.njk       # About Maya
│   ├── songs.njk       # Currently learning + year navigation
│   ├── songs-year.njk  # Year-based learned songs pages (/songs/{year}/)
│   ├── milestones.njk  # All milestones grouped by year
│   ├── videos.njk      # Video embeds
│   └── sitemap.njk     # Auto-generated sitemap.xml
├── public/             # Static files served at site root
│   ├── css/            # Compiled Tailwind CSS output
│   ├── images/         # Banner, piano icon, milestone images
│   ├── robots.txt      # Search engine crawl rules
│   ├── favicon-16x16.png
│   └── favicon-32x32.png
├── src/css/styles.css  # Tailwind CSS source
├── .eleventy.js        # Eleventy configuration (collections, filters)
├── tailwind.config.js  # Tailwind theme customisation
├── netlify.toml        # Netlify build and redirect settings
├── brand-guidelines.html  # Visual brand reference page
├── PLAN.md             # Implementation plan with issue tracking
├── SEO_PLAN.md         # SEO audit and improvement roadmap
├── LICENSE.md          # Dual license (MIT code, all rights reserved content)
└── _site/              # Build output — generated, not committed
```

## Running Locally

### Prerequisites

- [Node.js](https://nodejs.org/) v20 or later
- npm (bundled with Node.js)

### Setup

```bash
# Install dependencies
npm install
```

### Development server

```bash
npm start
```

This compiles Tailwind CSS first, then starts the Eleventy dev server with live reload at `http://localhost:8080`.

### Production build

```bash
npm run build
```

Outputs the static site to the `_site/` directory.

## Deploying to Netlify

### Automatic deploys (recommended)

1. Push the repository to GitHub (or GitLab / Bitbucket).
2. Log in to [Netlify](https://app.netlify.com) and click **Add new site → Import an existing project**.
3. Connect your Git provider and select this repository.
4. Netlify will auto-detect the settings from `netlify.toml`:
   - **Build command:** `npm run build`
   - **Publish directory:** `_site`
   - **Node version:** 20
5. Click **Deploy site**.

Every push to the configured branch triggers a new deploy automatically.

### Manual deploy via Netlify CLI

```bash
# Install the Netlify CLI globally
npm install -g netlify-cli

# Authenticate
netlify login

# Build the site
npm run build

# Deploy a preview
netlify deploy --dir=_site

# Deploy to production
netlify deploy --dir=_site --prod
```

### Environment & redirects

The `netlify.toml` file configures:
- The build command and publish directory
- Node.js version (`20`)
- A redirect so the Decap CMS admin SPA loads correctly at `/admin/`
- A role-based redirect for Netlify Identity email confirmation

## Content Management

Site content lives in markdown files and a JSON config:

| Content type | Location |
|---|---|
| Songs | `content/songs/*.md` — front matter: `title`, `composer` (optional), `status`, `dateLearned`, `externalLink`, `externalLinkLabel` |
| Milestones | `content/milestones/*.md` — front matter: `title`, `date`, `image`, `imageAlt`, `externalLink`, `externalLinkLabel` |
| Site config | `_data/config.json` — name, bio, start date, Instagram, fun facts |

Content can also be managed through the Decap CMS UI at `/admin` (requires Netlify Identity).

### Song statuses

- `learned` — appears on year pages (`/songs/{year}/`) and in the Oldie Goldie pool
- `learning` — appears on the main `/songs/` page under "Currently Learning"

### External link auto-labelling

Songs and milestones support an `externalLink` field. The display label is auto-detected from the URL domain (`youtube.com` → "Watch on YouTube", `instagram.com` → "View on Instagram", etc.) or overridden with `externalLinkLabel`.

## Customisation

- **Brand colours and fonts** — edit `tailwind.config.js`
- **Navigation and base layout** — edit `_includes/base.njk`
- **Eleventy collections and filters** — edit `.eleventy.js`
- **CMS fields and collections** — edit `admin/config.yml`
