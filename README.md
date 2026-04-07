# mayaonkeys.com

A family-friendly website documenting Maya's piano learning journey — milestones, songs, videos, and more.

## Tech Stack

- **[Eleventy (11ty)](https://www.11ty.dev/)** v3 — static site generator
- **[Nunjucks](https://mozilla.github.io/nunjucks/)** — templating language
- **[Tailwind CSS](https://tailwindcss.com/)** v3 — utility-first CSS framework
- **[Netlify CMS](https://v1.netlifycms.org/)** — content management via `/admin`
- **[Netlify](https://www.netlify.com/)** — hosting and deployment

## Project Structure

```
mayaonkeys.com/
├── _data/              # Global data files (site config, songs list)
├── _includes/          # Nunjucks layout partials and components
├── admin/              # Netlify CMS configuration and UI
├── content/
│   └── milestones/     # Markdown files for milestone entries
├── pages/              # Top-level page templates (.njk)
├── public/             # Static files served at the site root
│   └── css/            # Compiled CSS output (generated)
│   └── images/         # Site images
├── src/
│   └── css/
│       └── styles.css  # Tailwind CSS source
├── .eleventy.js        # Eleventy configuration
├── netlify.toml        # Netlify build and redirect settings
├── tailwind.config.js  # Tailwind theme customisation
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
- A redirect so the Netlify CMS admin SPA loads correctly at `/admin/`
- A role-based redirect for Netlify Identity email confirmation

## Content Management

Site content lives in two places:

| Content type | Location |
|---|---|
| Milestones | `content/milestones/*.md` |
| Song repertoire | `_data/songs.json` |
| Site configuration (name, bio, Instagram, etc.) | `_data/config.json` |

You can also manage content through the CMS UI at `/admin` (requires Netlify Identity to be enabled on the site).

## Customisation

- **Brand colours and fonts** — edit `tailwind.config.js`
- **Navigation and base layout** — edit `_includes/base.njk`
- **Eleventy collections and plugins** — edit `.eleventy.js`
