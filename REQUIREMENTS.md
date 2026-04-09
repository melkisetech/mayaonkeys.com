# Maya's Piano Journey — Requirements

> Canonical specification for `mayaonkeys.com`. This document reflects all design and implementation decisions made to date and can be used to regenerate the project from scratch.

---

## Project Overview

A personal, family-friendly static website documenting a young girl's piano learning journey. Serves as a long-term digital archive and scrapbook for family and close friends. Complements an existing Instagram account (`maya.on.keys`) that handles video content.

---

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Static site generator | [Eleventy (11ty)](https://www.11ty.dev/) v3 | Nunjucks templating |
| Styling | [Tailwind CSS](https://tailwindcss.com/) v3 | Utility-first, custom theme |
| CMS | [Decap CMS](https://decapcms.org/) v3 | Git-based, served at `/admin/`, loaded via CDN |
| Hosting | [Netlify](https://www.netlify.com/) (free tier) | Auto-builds on push to `main` |
| Auth | Netlify Identity + Git Gateway | Email/password login for CMS (no GitHub account needed) |
| Date library | Luxon | Included with Eleventy v3 for date formatting filters |

- **GitHub repo**: `melkisetech/mayaonkeys.com`
- **Initial URL**: Netlify subdomain (e.g. `mayaonkeys.netlify.app`) — custom domain can be wired later via Netlify settings
- **No `pathPrefix`** — Netlify deploys at root `/`

> Keep dependencies minimal. Pure static output — no server-side rendering, no API routes.

---

## Pages & Sections

### 1. Home (`/`)

- Hero section: site title ("Maya's Piano Journey"), short tagline, decorative emoji/illustration
- Stats row: months playing (computed client-side from `config.startDate`), songs learned count, practice days per week — all sourced from `_data/config.json` and collections
- Preview of 3 most recent milestone entries with a "See all" link
- "Songs I Can Play" preview grid (top 4 learned songs) with a "Full list" link
- Instagram link banner pointing to `maya.on.keys`

### 2. About (`/about`)

- Short bio paragraph (editable via `_data/config.json`)
- Photo placeholder (emoji by default, customizable via CMS)
- Fun facts grid: favorite song, favorite composer, favorite practice snack — from `config.funFacts`
- Journey stats reusing the `stats-banner` component
- Call-to-action buttons

### 3. Songs (`/songs`)

Two sections on the main page:

1. **Currently Learning** — songs with `status: "learning"` (no date, small transient list)
2. **Learned Songs** — year-based navigation showing song count per year, linking to `/songs/{year}/` pages

#### Year Pages (`/songs/{year}/`)

- One static page per calendar year containing learned songs (e.g. `/songs/2025/`, `/songs/2026/`)
- Each song card displays: title, composer, status badge (green "Learned"), date learned
- Optional: book name and page number (rendered as "📖 Book Name · p. 24")
- Optional: external link button with smart label auto-detection (YouTube, Instagram, TikTok, Facebook)
- Back navigation to main songs page
- Previous/next year links

> Songs are stored as individual markdown files in `content/songs/`, not a JSON array. This unlocks 11ty native collections and year-based pagination, and gives each song its own editor page in Decap CMS.

### 4. Milestones (`/milestones`)

- Chronological timeline of progress entries, newest first
- Year grouping with anchor-based navigation (shows year headers when entries span 3+ years)
- Each entry: date, title, markdown-rendered description
- Optional photo thumbnail (112×112 / 144×144px) with lightbox button to expand full image
- Optional external link button (YouTube, Instagram, TikTok, etc.) with smart label auto-detection
- Written by the parent as `.md` files in `content/milestones/`
- List-only view — no individual detail pages

### 5. Videos (`/videos`)

- Embeds a LightWidget Instagram feed widget
- Fallback UI when no embed code is configured
- Direct link to Instagram profile
- No manually curated video list — the LightWidget embed code is stored in `_data/config.json`

---

## Data Model

### `_data/config.json` — Site Configuration

```json
{
  "url": "https://www.mayaonkeys.com",
  "name": "Maya",
  "startDate": "2025-10",
  "practicePerWeek": 5,
  "bio": "Maya started piano lessons at age 5...",
  "instagramHandle": "maya.on.keys",
  "instagramUrl": "https://instagram.com/maya.on.keys",
  "lightwidgetEmbedCode": "",
  "funFacts": {
    "favoriteSong": "Twinkle Twinkle Little Star",
    "favoriteComposer": "Still deciding!",
    "practiceSnack": "Apple slices"
  }
}
```

- `startDate` uses `YYYY-MM` format; months-playing is computed client-side in the visitor's browser
- `lightwidgetEmbedCode` is optional; videos page shows a fallback when empty

### `content/songs/*.md` — Individual Song Files

Each song is a standalone markdown file with front matter:

```markdown
---
title: Twinkle Twinkle Little Star
composer: Traditional
status: learned
dateLearned: "2025-11"
book: "Alfred's Premier Piano Course, Lesson 1A"
pageNumber: "24"
externalLink: "https://www.youtube.com/watch?v=..."
externalLinkLabel: "Watch on YouTube"
---
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | yes | Song name |
| `composer` | string | yes | Composer or source (e.g. "Traditional") |
| `status` | string | yes | `"learned"` or `"learning"` |
| `dateLearned` | string | no | `YYYY-MM` format — omit for learning songs |
| `book` | string | no | Name of the method book (e.g. "Alfred's Premier Piano Course") |
| `pageNumber` | string | no | Page number(s) in the book (e.g. `"24"` or `"24-25"`) |
| `externalLink` | string | no | URL to YouTube, Instagram, TikTok, etc. |
| `externalLinkLabel` | string | no | Custom button label — auto-detected from URL if omitted |

- Filenames are slugified titles (e.g. `twinkle-twinkle-little-star.md`)
- A `songs.11tydata.json` file in the directory sets `permalink: false` (songs don't render as individual pages)
- External link label auto-detection: "Watch on YouTube" for youtube.com/youtu.be, "View on Instagram" for instagram.com, "View on TikTok" for tiktok.com, "View on Facebook" for facebook.com, "View link" as fallback

### `content/milestones/*.md` — Milestone Entries

```markdown
---
title: First Full Song — Twinkle Twinkle!
date: 2025-11-20
image: /images/twinkle-performance.jpeg
imageAlt: Maya smiling at the piano after playing Twinkle Twinkle
externalLink: https://www.instagram.com/p/...
externalLinkLabel: "View on Instagram"
---
Maya played Twinkle Twinkle Little Star all the way through for the first time!
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | yes | Milestone heading |
| `date` | date | yes | `YYYY-MM-DD` format (parsed by 11ty) |
| `image` | string | no | Path to photo (e.g. `/images/photo.jpeg`) |
| `imageAlt` | string | no | Alt text for screen readers — defaults to title |
| `externalLink` | string | no | URL to Instagram post, YouTube video, etc. |
| `externalLinkLabel` | string | no | Custom button label — auto-detected from URL if omitted |
| body | markdown | yes | Full description, supports links and basic formatting |

- Filename format: `YYYY-MM-DD-slug.md`
- No individual detail pages — rendered inline on `/milestones/`
- Images display as 112×112px (desktop: 144×144px) thumbnails with a lightbox button that expands to full size
- External link label auto-detection matches the same rules as songs (YouTube, Instagram, TikTok, Facebook)

---

## Design Requirements

### Aesthetic
- Warm, soft, child-friendly — not babyish, but approachable
- Light mode only, no dark mode
- Minimal animations — subtle fade-ins at most

### Color Palette (Tailwind custom theme)

| Token | Hex | Usage |
|-------|-----|-------|
| `brand-purple-50` | `#f5f0ff` | Nav hover bg, active nav bg |
| `brand-purple-100` | `#ede0ff` | Card borders |
| `brand-purple-200` | `#d8c0ff` | Light accents |
| `brand-purple-300` | `#b899f7` | — |
| `brand-purple-400` | `#a87fda` | — |
| `brand-purple-500` | `#7c3aed` | Primary buttons, active nav text |
| `brand-purple-600` | `#6d28d9` | Button hover |
| `brand-purple-700` | `#1e1040` | Section titles, headings |
| `brand-teal-50` | `#f0fafa` | — |
| `brand-teal-100` | `#cceeee` | — |
| `brand-teal-200` | `#99dddd` | — |
| `brand-teal-300` | `#2bb5b5` | — |
| `brand-teal-400` | `#0d8080` | Secondary buttons, links |
| `brand-teal-500` | `#0a6666` | — |
| `brand-cream` | `#faf7f2` | Page background |
| `brand-dark` | `#1e1040` | Body text |

### Typography
- **Display font**: Nunito (rounded, friendly) — headings
- **Body font**: Inter (clean, readable) — body text
- Loaded via Google Fonts in the base layout

### Component Classes (Tailwind `@layer components`)
- `.btn-primary` — purple rounded-full button
- `.btn-secondary` — teal outlined rounded-full button
- `.card` — white card with purple border and shadow
- `.section-title` / `.section-subtitle` — heading typography
- `.badge-learned` — green status badge (emerald)
- `.badge-learning` — amber status badge
- `.nav-link` / `.nav-link--active` — desktop nav styling
- `.mobile-nav-link` / `.mobile-nav-link--active` — mobile nav styling

### Responsive Design
- Fully responsive, mobile-first
- Hamburger menu for screens < 640px with show/hide toggle
- `aria-controls` and `aria-expanded` on mobile menu button

### Accessibility
- Semantic HTML elements
- Sufficient color contrast
- Alt text on images
- ARIA labels on interactive elements

---

## Privacy & Safety

- No full name, school name, or location anywhere on the site
- First name only ("Maya")
- Photos optional — no identifiable background details required
- No tracking pixels, ad scripts, or third-party analytics
- `<meta name="robots" content="noindex, nofollow">` to prevent search engine indexing
- `robots.txt` also present in `public/`

---

## Eleventy Configuration (`.eleventy.js`)

### Passthrough Copy
- `admin/` — Decap CMS UI files
- `public/` → root — static assets (CSS, images, robots.txt)

### Collections

| Name | Source | Sort |
|------|--------|------|
| `milestones` | `content/milestones/*.md` | Newest first by `date` |
| `songs` | `content/songs/*.md` | Newest learned first; learning songs sorted last |
| `learnedYears` | Derived from songs | Set of years (strings) with learned songs, newest first |

### Filters

| Filter | Purpose |
|--------|---------|
| `dateDisplay` | Format JS date → "MMMM d, yyyy" |
| `yearMonth` | Format JS date → "MMM yyyy" |
| `year` | Format JS date → "yyyy" |
| `yearFromDate` | Extract year from YYYY-MM string |
| `limit(arr, n)` | Return first n items |
| `learnedSongs(songs)` | Filter to songs with `status: "learned"` |
| `learnedByYear(songs)` | Group learned songs by year → `[{year, count}]` |
| `htmlDateString` | Format JS date → "yyyy-MM-dd" for `<time>` |

### Template Engines
- Markdown: Nunjucks
- HTML: Nunjucks

### Directory Config
- Input: `.` (project root)
- Includes: `_includes/`
- Data: `_data/`
- Output: `_site/`

---

## Content Management (Decap CMS)

The parent (non-developer) updates content via the **Decap CMS admin UI** at `/admin/`. Login is by email and password via Netlify Identity — no GitHub account required.

| Content | CMS Collection | Underlying File(s) |
|---------|---------------|---------------------|
| Bio, fun facts, stats | Settings → General | `_data/config.json` |
| Instagram embed code | Settings → General | `_data/config.json` |
| Add / edit a song | Songs → (create/edit) | `content/songs/{slug}.md` |
| Add a milestone | Milestones → New entry | `content/milestones/YYYY-MM-DD-slug.md` |
| Upload photos | Media library (built-in) | `public/images/` |

> Direct GitHub file editing remains possible as a fallback for developers.

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
          - { label: "Start Date", name: "startDate", widget: "string", hint: "Format: YYYY-MM (e.g. 2025-10)" }
          - { label: "Practice Days Per Week", name: "practicePerWeek", widget: "number", value_type: "int", min: 1, max: 7 }
          - { label: "Bio", name: "bio", widget: "text" }
          - { label: "Instagram Handle", name: "instagramHandle", widget: "string", hint: "Without the @ symbol" }
          - { label: "Instagram URL", name: "instagramUrl", widget: "string" }
          - { label: "LightWidget Embed Code", name: "lightwidgetEmbedCode", widget: "text", required: false, hint: "Paste the full embed code from lightwidget.com" }
          - label: "Fun Facts"
            name: "funFacts"
            widget: "object"
            fields:
              - { label: "Favourite Song", name: "favoriteSong", widget: "string" }
              - { label: "Favourite Composer", name: "favoriteComposer", widget: "string" }
              - { label: "Practice Snack", name: "practiceSnack", widget: "string" }

  - name: "songs"
    label: "Songs"
    folder: "content/songs"
    create: true
    delete: true
    slug: "{{slug}}"
    fields:
      - { label: "Title", name: "title", widget: "string" }
      - { label: "Composer / Source", name: "composer", widget: "string" }
      - label: "Status"
        name: "status"
        widget: "select"
        options:
          - { label: "Learned ✓", value: "learned" }
          - { label: "Learning…", value: "learning" }
      - { label: "Date Learned", name: "dateLearned", widget: "string", required: false, hint: "Format: YYYY-MM — leave blank if still learning" }
      - { label: "Book", name: "book", widget: "string", required: false, hint: "Name of the book/method book this piece is from (e.g. Alfred's Premier Piano Course, Lesson 1B)" }
      - { label: "Page", name: "pageNumber", widget: "string", required: false, hint: "Page number(s) in the book (e.g. 24 or 24-25)" }
      - { label: "External Link", name: "externalLink", widget: "string", required: false, hint: "Optional link to YouTube, Instagram, etc." }
      - { label: "Link Label", name: "externalLinkLabel", widget: "string", required: false, hint: "Custom button label (e.g. Watch on YouTube). Auto-detected from URL if left blank." }

  - name: "milestones"
    label: "Milestones"
    folder: "content/milestones"
    create: true
    delete: true
    slug: "{{year}}-{{month}}-{{day}}-{{slug}}"
    fields:
      - { label: "Title", name: "title", widget: "string" }
      - { label: "Date", name: "date", widget: "datetime", date_format: "YYYY-MM-DD", time_format: false, format: "YYYY-MM-DD" }
      - { label: "Image", name: "image", widget: "image", required: false, hint: "Optional photo for this milestone" }
      - { label: "Image Alt Text", name: "imageAlt", widget: "string", required: false, hint: "Describe the photo for screen readers" }
      - { label: "External Link", name: "externalLink", widget: "string", required: false, hint: "Optional link to YouTube, Instagram, etc." }
      - { label: "Link Label", name: "externalLinkLabel", widget: "string", required: false, hint: "Custom button label (e.g. Watch on YouTube). Auto-detected from URL if left blank." }
      - { label: "Description", name: "body", widget: "markdown" }
```

### `admin/index.html`

Minimal loader that pulls Decap CMS from CDN:

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

---

## Client-Side Features

### Months-Playing Counter
- JavaScript in `base.njk` computes elapsed months from `config.startDate`
- Parses `YYYY-MM` format, calculates difference from current date
- Updates monthly without backend involvement

### Mobile Navigation
- Hamburger menu toggle for screens < 640px
- Icon swaps between open (hamburger) and close (X)
- `aria-controls` and `aria-expanded` for accessibility

### Netlify Identity Widget
- Login widget script included in base layout
- Handles email confirmation token redirects
- After CMS login, redirects to `/admin/`

---

## File Structure

```
/
├── admin/
│   ├── index.html              # Decap CMS UI entry point
│   └── config.yml              # CMS schema (collections, backend, media)
├── _data/
│   └── config.json             # Site configuration (name, dates, stats, social)
├── content/
│   ├── songs/                  # Individual song markdown files
│   │   ├── twinkle-twinkle-little-star.md
│   │   ├── happy-birthday.md
│   │   ├── ...
│   │   └── songs.11tydata.json # Sets permalink: false (no individual pages)
│   └── milestones/             # Individual milestone markdown files
│       ├── 2025-10-15-first-lesson.md
│       ├── ...
│       └── YYYY-MM-DD-slug.md
├── _includes/
│   ├── base.njk                # Base layout (head, nav, footer, scripts)
│   ├── song-card.njk           # Reusable song card component
│   ├── milestone-entry.njk     # Milestone entry component
│   └── stats-banner.njk        # Stats display component
├── pages/
│   ├── index.njk               # Home page
│   ├── about.njk               # About page
│   ├── songs.njk               # Songs listing (learning + year nav)
│   ├── songs-year.njk          # Year-based learned songs pages (/songs/{year}/)
│   ├── milestones.njk          # Milestones timeline
│   └── videos.njk              # Videos / Instagram feed
├── public/
│   ├── css/                    # Compiled Tailwind CSS (build output)
│   ├── images/                 # Media uploads
│   └── robots.txt              # Search engine directives
├── src/
│   └── css/
│       └── styles.css          # Tailwind CSS source (@tailwind directives + custom components)
├── .eleventy.js                # 11ty config (collections, filters, passthrough)
├── tailwind.config.js          # Custom theme (colors, fonts)
├── netlify.toml                # Netlify build settings & redirects
├── package.json                # Dependencies and scripts
├── PLAN.md                     # Implementation roadmap
└── REQUIREMENTS.md             # This file
```

---

## Build & Deployment

### Build Scripts (`package.json`)

```json
{
  "build:css": "tailwindcss -i ./src/css/styles.css -o ./public/css/styles.css",
  "build": "npm run build:css && npx @11ty/eleventy",
  "watch:css": "tailwindcss -i ./src/css/styles.css -o ./public/css/styles.css --watch",
  "prestart": "npm run build:css",
  "start": "npx @11ty/eleventy --serve"
}
```

### Dependencies

```json
{
  "devDependencies": {
    "@11ty/eleventy": "^3.0.0",
    "tailwindcss": "^3.4.0"
  }
}
```

### `netlify.toml`

```toml
[build]
  command = "npm run build"
  publish = "_site"

[build.environment]
  NODE_VERSION = "20"

[[redirects]]
  from = "/admin/*"
  to = "/admin/index.html"
  status = 200
```

### Deployment Flow
1. Push to GitHub (`main` branch)
2. Netlify detects push, runs `npm run build`
3. Compiled `_site/` published to Netlify CDN
4. Netlify Identity provides email/password login for CMS users
5. Git Gateway allows CMS to commit on behalf of the parent

### Netlify Setup Checklist
- Enable Netlify Identity (free tier)
- Invite parent via email → they set a password
- Enable Git Gateway under Identity → Services
- Custom domain: wire up later via Domain settings (no code changes needed)

---

## Out of Scope (v1)

- User authentication or login (beyond CMS admin access)
- Guestbook or comment system
- Video hosting (handled by Instagram)
- Password protection for public pages
- Multi-language support
- PWA / offline support
- Automated Instagram syncing
- Dark mode

---

## Stretch Goals (v2)

- Practice tracker: visual goal board Maya can interact with
- "Composer of the Month" spotlight section
- Printable certificate generator ("I learned a new song!")
- Dark mode toggle
