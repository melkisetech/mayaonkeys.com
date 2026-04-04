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
- **Deployment**: GitHub Actions → GitHub Pages
- **GitHub username**: `melkisetech`
- **Initial URL**: `melkisetech.github.io/mayaonkeys.com`
- **Custom domain**: Not configured in v1 (can be added later)
- **11ty `pathPrefix`**: `/mayaonkeys.com/`

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

```json
[
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

The parent (non-developer) updates content by editing files directly in the GitHub repo:

| Content | Method |
|---|---|
| Bio & fun facts | Edit `_data/config.json` |
| Stats (practice days) | Edit `_data/config.json` |
| Add a new song | Edit `_data/songs.json` |
| Add a milestone | Add a `.md` file to `content/milestones/` |
| Update Instagram feed widget | Edit `lightwidgetEmbedCode` in `_data/config.json` |

---

## Suggested File Structure

```
/
├── _data/
│   ├── config.json
│   └── songs.json
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
├── .eleventy.js            # 11ty config (pathPrefix, collections, etc.)
├── tailwind.config.js
└── package.json
```

---

## Deployment

- **Platform**: GitHub Pages (`melkisetech.github.io/mayaonkeys.com`)
- **CI/CD**: GitHub Actions — build with 11ty on push to `main`, deploy to `gh-pages` branch
- **Custom domain**: Wire up later via GitHub Pages settings (no code changes needed beyond removing `pathPrefix`)

---

## Out of Scope (v1)

- User authentication or login
- Guestbook or comment system
- Video hosting
- Password protection
- Multi-language support
- PWA / offline support
- Automated Instagram syncing
- CMS UI (Decap CMS / Netlify CMS)

---

## Stretch Goals (v2)

- Practice tracker: visual goal board Maya can interact with
- "Composer of the Month" spotlight section
- Printable certificate generator ("I learned a new song!")
- Optional Notion CMS integration
- Dark mode
