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

## Key Architectural Notes

- `songs.json` root is wrapped in an object `{ "songs": [...] }` — templates reference `songs.songs`
- `startDate` in `config.json` uses `YYYY-MM` format; months-playing is computed client-side
- `admin/` folder must be added to 11ty passthrough copy so it appears in `_site/`
- No individual milestone detail pages — list-only view on `/milestones`
- No full name, school, or location anywhere on the site
