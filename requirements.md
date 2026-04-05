# Maya's Piano Journey — Finalized Requirements

> This document supersedes the original `requirements.md` attachment. It reflects all decisions made during the requirements review session.

---

## Project Overview

A personal, family-friendly website documenting a young girl's piano learning journey. Serves as a long-term archive and scrapbook for family and close friends. Complements an existing Instagram account (`maya.on.keys`) that handles video content.

---

## Tech Stack

- **Static site generator**: [Eleventy (11ty)](https://www.11ty.dev/)
- **Templating**: Nunjucks
- **Styling**: Tailwind CSS
- **CMS**: [Decap CMS](https://decapcms.org/) (Git-based, served at `/admin/`)
- **Deployment**: Netlify (free tier)
- **Authentication**: Netlify Identity + Git Gateway
- **GitHub username**: `melkisetech`
- **Initial URL**: Auto-assigned Netlify subdomain (e.g. `mayaonkeys.netlify.app`) — custom domain can be wired later via Netlify settings
- **Custom domain**: Not configured in v1 (can be added later)
- **11ty `pathPrefix`**: Not required (Netlify deploys at root `/`)

> Keep dependencies minimal. Pure static output — no server-side rendering, no API routes.

---

## Pages & Sections

### 1. Home (`/`)

- Hero section: site title ("Maya's Piano Journey"), short tagline, decorative illustration or photo
- Stats row: months playing (computed client-side from `startDate`), songs learned, practice days per week — sourced from `_data/config.json`
- Preview of 3 most recent milestone entries with a "See all" link
- "Songs I Can Play" preview (top 3–5) with a "See full list" link
- Instagram link banner pointing to `maya.on.keys`

### 2. About (`/about`)

- Short bio paragraph (editable via `_data/config.json`)
- Optional photo of Maya at the piano
- Fun facts: favorite song, favorite composer, favorite practice snack — from `_data/config.json`

### 3. Songs (`/songs`)

- Full list of songs Maya has learned or is currently learning
- Each song: title, composer/source, status (`learned` | `learning`), optional date learned
- Visual status badges: green for `learned`, amber for `learning`
- Data sourced from `_data/songs.json`

### 4. Milestones (`/milestones`)

- Chronological timeline of progress entries, newest first
- Each entry: date, title, short description (2–4 sentences)
- Entries may include plain markdown links to specific Instagram posts
- Written by the parent as `.md` files in `/content/milestones/`
- List-only view — no individual detail pages
- Simple, clean timeline UI — no animations required

### 5. Videos (`/videos`)

- Embeds a LightWidget feed (Instagram feed widget)
- No manually curated video list — the LightWidget embed code is stored in `_data/config.json`
- No `videos.json` needed

---

## Removed from Scope (vs. original spec)

- **Guestbook** — cut entirely (no `/guestbook` page, no backend)
- **`videos.json`** — replaced by LightWidget embed in config
- **Password protection** — not needed for v1
- **Vercel** — replaced by GitHub Pages

---

## Data Model

### `_data/config.json`

```json
{
  "name": "Maya",
  "startDate": "2025-10",
  "practicePerWeek": 5,
  "bio": "Maya started piano lessons at age 5...",
  "instagramHandle": "maya.on.keys",
  "instagramUrl": "https://instagram.com/maya.on.keys",
  "lightwidgetEmbedCode": "<script src='https://cdn.lightwidget.com/widgets/lightwidget.plugin.js'></script><iframe src='...' scrolling='no' ...></iframe>",
  "funFacts": {
    "favoriteSong": "Twinkle Twinkle",
    "favoriteComposer": "Still deciding!",
    "practiceSnack": "Apple slices"
  }
}
```

> `startDate` is used by a client-side JS snippet to compute "months playing" dynamically in the visitor's browser.

### `_data/songs.json`

> **Schema change from original spec**: The root array is wrapped in an object so Decap CMS's list widget can bind to the `songs` key. Templates reference `songs.songs` instead of `songs`.

```json
{
  "songs": [
    {
      "id": "1",
      "title": "Twinkle Twinkle Little Star",
      "composer": "Traditional",
      "status": "learned",
      "dateLearned": "2025-11"
    },
    {
      "id": "2",
      "title": "Für Elise (intro)",
      "composer": "Beethoven",
      "status": "learning",
      "dateLearned": null
    }
  ]
}
```

### `content/milestones/*.md`

```
---
title: First Performance
date: 2026-03-10
---
Maya played for grandma and grandpa over a video call.
Watch the video on [Instagram](https://instagram.com/p/...).
```

---

## Design Requirements

- Warm, soft, child-friendly aesthetic — not babyish, but approachable
- Color palette: soft purple, teal, and warm white — no harsh colors
- Typography: clean sans-serif for body, optional playful display font for headings
- Fully responsive, mobile-first
- No dark mode required
- Minimal animations — subtle fade-ins at most
- Accessibility: semantic HTML, sufficient color contrast, alt text on images

---

## Privacy & Safety

- No full name, school name, or location anywhere on the site
- First name only ("Maya")
- Photos optional — no identifiable background details required
- No tracking pixels, ad scripts, or third-party analytics

---

## Content Management

The parent (non-developer) updates content via the **Decap CMS admin UI** at `/admin/`. Login is by email and password — no GitHub account required.

| Content | CMS Collection | Underlying File |
|---|---|---|
| Bio & fun facts | Settings → General | `_data/config.json` |
| Stats (practice days) | Settings → General | `_data/config.json` |
| Add / edit a song | Songs → Song List | `_data/songs.json` |
| Add a milestone | Milestones → New entry | `content/milestones/YYYY-MM-DD-slug.md` |
| Update Instagram feed widget | Settings → General | `_data/config.json` |
| Upload photos | Media library (built into CMS) | `public/images/` |

> Direct GitHub file editing remains possible as a fallback for developers, but the CMS UI is the intended method for day-to-day updates.

---

## Suggested File Structure

```
/
├── admin/
│   ├── index.html          # Decap CMS UI entry point
│   └── config.yml          # CMS schema (collections, backend, media)
├── _data/
│   ├── config.json
│   └── songs.json          # Root array wrapped in object: { "songs": [...] }
├── content/
│   └── milestones/         # .md files, one per milestone
├── _includes/
│   ├── base.njk            # Base layout
│   ├── song-card.njk
│   ├── milestone-entry.njk
│   └── stats-banner.njk
├── pages/
│   ├── index.njk           # Home
│   ├── about.njk
│   ├── songs.njk
│   ├── milestones.njk
│   └── videos.njk
├── public/
│   └── images/
├── .eleventy.js            # 11ty config — includes passthrough copy for /admin
├── tailwind.config.js
├── netlify.toml            # Netlify build settings and Identity redirect rules
└── package.json
```

> **`songs.json` schema change**: The bare root array (`[...]`) must be wrapped in an object (`{ "songs": [...] }`) for Decap CMS's list widget to bind correctly. Update the songs template to read `songs.songs` instead of `songs`.

---

## Decap CMS Configuration

### `admin/index.html`

Minimal loader that pulls the Decap CMS bundle from CDN:

```html
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="robots" content="noindex" />
  <title>Maya's Site Admin</title>
</head>
<body>
  <script src="https://unpkg.com/decap-cms@^3.0.0/dist/decap-cms.js"></script>
</body>
</html>
```

### `admin/config.yml`

```yaml
backend:
  name: git-gateway
  branch: main

media_folder: "public/images"
public_folder: "/images"

collections:
  - name: "settings"
    label: "Site Settings"
    files:
      - name: "general"
        label: "General"
        file: "_data/config.json"
        fields:
          - { label: "Maya's Name", name: "name", widget: "string" }
          - { label: "Start Date", name: "startDate", widget: "string", hint: "Format: YYYY-MM" }
          - { label: "Practice Days Per Week", name: "practicePerWeek", widget: "number" }
          - { label: "Bio", name: "bio", widget: "text" }
          - { label: "Instagram Handle", name: "instagramHandle", widget: "string" }
          - { label: "Instagram URL", name: "instagramUrl", widget: "string" }
          - { label: "LightWidget Embed Code", name: "lightwidgetEmbedCode", widget: "text" }
          - label: "Fun Facts"
            name: "funFacts"
            widget: "object"
            fields:
              - { label: "Favorite Song", name: "favoriteSong", widget: "string" }
              - { label: "Favorite Composer", name: "favoriteComposer", widget: "string" }
              - { label: "Practice Snack", name: "practiceSnack", widget: "string" }

  - name: "songs"
    label: "Songs"
    files:
      - name: "song_list"
        label: "Song List"
        file: "_data/songs.json"
        fields:
          - label: "Songs"
            name: "songs"
            widget: "list"
            fields:
              - { label: "ID", name: "id", widget: "string" }
              - { label: "Title", name: "title", widget: "string" }
              - { label: "Composer", name: "composer", widget: "string" }
              - label: "Status"
                name: "status"
                widget: "select"
                options: ["learned", "learning"]
              - { label: "Date Learned", name: "dateLearned", widget: "string", required: false, hint: "Format: YYYY-MM, leave blank if still learning" }

  - name: "milestones"
    label: "Milestones"
    folder: "content/milestones"
    create: true
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    fields:
      - { label: "Title", name: "title", widget: "string" }
      - { label: "Date", name: "date", widget: "datetime", date_format: "YYYY-MM-DD", time_format: false }
      - { label: "Description", name: "body", widget: "markdown" }
```

### `netlify.toml`

Required for Netlify Identity redirect and build settings:

```toml
[build]
  command = "npm run build"
  publish = "_site"

[[redirects]]
  from = "/admin/"
  to = "/admin/index.html"
  status = 200
```

### 11ty passthrough copy

Add to `.eleventy.js` so the admin folder is included in the build output:

```js
eleventyConfig.addPassthroughCopy("admin");
```

---

## Deployment

- **Platform**: Netlify (free tier) — connects directly to the `melkisetech/mayaonkeys.com` GitHub repo
- **Build command**: `npx @11ty/eleventy` (or `npm run build`)
- **Publish directory**: `_site`
- **CI/CD**: Netlify auto-builds on every push to `main`; no GitHub Actions workflow needed for deployment
- **Identity**: Enable Netlify Identity (free tier) → invite the parent via email → they set a password
- **Git Gateway**: Enable under Netlify → Identity → Services → Git Gateway (allows the CMS to commit on behalf of the user)
- **Custom domain**: Wire up later via Netlify → Domain settings (no code changes needed)

---

## Out of Scope (v1)

- User authentication or login (beyond CMS admin access)
- Guestbook or comment system
- Video hosting
- Password protection
- Multi-language support
- PWA / offline support
- Automated Instagram syncing

---

## Stretch Goals (v2)

- Practice tracker: visual goal board Maya can interact with
- "Composer of the Month" spotlight section
- Printable certificate generator ("I learned a new song!")
- Dark mode
