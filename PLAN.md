# Implementation Plan — Maya's Piano Journey

Step-by-step build order for the `mayaonkeys.com` static site.
Each step has a corresponding GitHub issue.

## Tech Stack
- **SSG**: Eleventy (11ty) + Nunjucks
- **Styling**: Tailwind CSS
- **CMS**: Decap CMS (served at `/admin/`)
- **Deployment**: Netlify (free tier) + Netlify Identity + Git Gateway

---

## Steps

| # | Issue | Description |
|---|-------|-------------|
| 1 | [#4](https://github.com/melkisetech/mayaonkeys.com/issues/4) | Project setup — 11ty, Tailwind CSS, package.json |
| 2 | [#5](https://github.com/melkisetech/mayaonkeys.com/issues/5) | Data files — `_data/config.json` and `_data/songs.json` |
| 3 | [#6](https://github.com/melkisetech/mayaonkeys.com/issues/6) | Base layout — `base.njk`, navigation, global styles |
| 4 | [#7](https://github.com/melkisetech/mayaonkeys.com/issues/7) | Reusable partials — song-card, milestone-entry, stats-banner |
| 5 | [#8](https://github.com/melkisetech/mayaonkeys.com/issues/8) | Home page (`index.njk`) |
| 6 | [#9](https://github.com/melkisetech/mayaonkeys.com/issues/9) | About page (`about.njk`) |
| 7 | [#10](https://github.com/melkisetech/mayaonkeys.com/issues/10) | Songs page (`songs.njk`) |
| 8 | [#11](https://github.com/melkisetech/mayaonkeys.com/issues/11) | Milestones page (`milestones.njk`) |
| 9 | [#12](https://github.com/melkisetech/mayaonkeys.com/issues/12) | Videos page (`videos.njk`) |
| 10 | [#13](https://github.com/melkisetech/mayaonkeys.com/issues/13) | Sample milestone content files |
| 11 | [#14](https://github.com/melkisetech/mayaonkeys.com/issues/14) | Decap CMS setup — `admin/index.html` and `admin/config.yml` |
| 12 | [#15](https://github.com/melkisetech/mayaonkeys.com/issues/15) | Netlify configuration and deployment setup |
| 13 | [#16](https://github.com/melkisetech/mayaonkeys.com/issues/16) | Client-side months-playing counter |
| 14 | [#17](https://github.com/melkisetech/mayaonkeys.com/issues/17) | Accessibility, responsiveness, and privacy audit |

---

## Pagination — Steps (added after initial build)

Expected growth: ~1 song/week (hundreds over time), ~1 milestone/month.

### Strategy
- **Learned Songs**: year-based static pages at `/songs/{year}/` (one page per year)
- **Currently Learning**: stays on main `/songs/` page, no pagination needed (small, transient)
- **Milestones**: year groupings with anchors on a single `/milestones/` page (no URL split needed at current volume)

### Data Architecture Decision
Songs are migrated from `_data/songs.json` to individual markdown files under `content/songs/` — same pattern as milestones. Reasons:
- Unlocks 11ty native collections and year-based pagination
- Each song gets its own editor page in Decap CMS (vs. editing a raw JSON list)
- Consistent architecture across all content types

### Dependency Order
```
#30 Migrate songs to markdown
  ├── #31 Update 11ty config (songs collection + year filter)
  │     ├── #33 Year-based learned songs pages (/songs/{year}/)
  │     │     └── #34 Update main /songs/ page (currently learning + year nav)
  │     └── #35 Update homepage (use songs collection)
  └── #32 Update Decap CMS config (songs folder collection)

#36 Milestones year grouping  (independent)
```

### New Steps

| # | Issue | Description |
|---|-------|-------------|
| 15 | [#30](https://github.com/melkisetech/mayaonkeys.com/issues/30) | Migrate songs from `songs.json` to individual markdown files |
| 16 | [#31](https://github.com/melkisetech/mayaonkeys.com/issues/31) | Update 11ty config — songs collection and year-grouping filter |
| 17 | [#32](https://github.com/melkisetech/mayaonkeys.com/issues/32) | Update Decap CMS config — songs folder collection |
| 18 | [#33](https://github.com/melkisetech/mayaonkeys.com/issues/33) | Implement year-based static pages for learned songs |
| 19 | [#34](https://github.com/melkisetech/mayaonkeys.com/issues/34) | Update main `/songs/` page — currently learning + year navigation |
| 20 | [#35](https://github.com/melkisetech/mayaonkeys.com/issues/35) | Update homepage to use songs collection |
| 21 | [#36](https://github.com/melkisetech/mayaonkeys.com/issues/36) | Add year grouping to milestones page |

---

## Key Architectural Notes

- `songs.json` root is wrapped in an object `{ "songs": [...] }` — templates reference `songs.songs`
- ~~`songs.json`~~ **Superseded by steps 15–20**: songs now live as individual `.md` files in `content/songs/`; templates use `collections.songs`
- `startDate` in `config.json` uses `YYYY-MM` format; months-playing is computed client-side
- `admin/` folder must be added to 11ty passthrough copy so it appears in `_site/`
- No individual milestone detail pages — list-only view on `/milestones`
- No individual song detail pages — list/year-page view only
- No full name, school, or location anywhere on the site
