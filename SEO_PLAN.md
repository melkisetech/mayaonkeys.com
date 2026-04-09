# SEO Improvement Plan — mayaonkeys.com

Site: Maya's Piano Journey (Eleventy v3 / Netlify)

---

## CRITICAL — Blocking Issues

These issues prevent the site from appearing in search engines at all.

### ✅ 1. Remove `noindex` directive
- **File:** `_includes/base.njk`
- **Issue:** `<meta name="robots" content="noindex, nofollow" />` was present on every page.
- **Done:** Tag removed. Commit `f53623b`.

### ✅ 2. Fix robots.txt
- **File:** `public/robots.txt`
- **Issue:** `Disallow: /` was blocking all crawlers.
- **Done:** Updated to `Allow: /` with sitemap reference. Commit `f53623b`.

### ✅ 3. Create sitemap.xml
- **File:** `pages/sitemap.njk` → outputs `/sitemap.xml`
- **Issue:** No sitemap existed.
- **Done:** Eleventy template generates sitemap with all 7 public URLs (5 static + dynamic year pages). Commit `f53623b`.
- **Next step:** Submit `https://www.mayaonkeys.com/sitemap.xml` to Google Search Console after deployment.

---

## HIGH — Metadata & Discoverability

### 4. Add per-page meta descriptions
- **File:** `_includes/base.njk`
- **Issue:** The `<meta name="description">` tag is the same generic text on every page: "Following Maya's piano learning adventure — songs, milestones, and musical moments."
- **Fix:** Support a `description` front matter variable in each page template; fall back to the site-wide description only when not provided.
  - Example per-page descriptions:
    - About: Bio-based description
    - Songs: "A list of all piano songs Maya has learned and is currently learning."
    - Milestones: "Key milestones in Maya's piano journey, from first lesson to repertoire growth."
    - Songs by year: "Piano songs Maya learned in {{ year }}."

### ✅ 5. Add Open Graph (og:) meta tags
- **File:** `_includes/base.njk`
- **Issue:** No Open Graph tags — links shared on social media show no preview image, title, or description.
- **Done:** Added `og:site_name`, `og:type`, `og:title`, `og:description`, `og:url`, and `og:image` to `<head>`. Defaults to `website` type and `/images/banner.jpg`; overridable per-page via `ogType`, `ogImage`, and `description` front matter.

### 6. Add Twitter Card meta tags
- **File:** `_includes/base.njk`
- **Issue:** No Twitter Card tags — X/Twitter shares show no preview.
- **Fix:** Add `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`.

### 7. Add canonical URL tags
- **File:** `_includes/base.njk`
- **Issue:** No `<link rel="canonical">` tag. This is especially important for paginated year pages (`/songs/2025/`, `/songs/2026/`) to prevent duplicate content issues.
- **Fix:** Add `<link rel="canonical" href="{{ page.url | absoluteUrl(metadata.url) }}" />` using the site's base URL from config/metadata.

### 8. Improve `<title>` tag content
- **File:** `_includes/base.njk:4`
- **Issue:** The title pattern `{{ title }} — Maya's Piano Journey` puts the page name first, which is good practice. However, the homepage title is currently just "Home — Maya's Piano Journey"; it should be the brand name or a keyword-rich phrase.
- **Fix:** For the homepage, use a distinctive title like "Maya's Piano Journey — A Young Pianist's Progress" instead of "Home — Maya's Piano Journey".

---

## HIGH — Structured Data (JSON-LD)

### 9. Add Organization / Person schema
- **File:** `_includes/base.njk`
- **Issue:** No structured data exists on the site. Search engines cannot understand what the site is about in a machine-readable way.
- **Fix:** Add a site-wide JSON-LD block with a `Person` schema describing Maya (name, description, social profiles).

### 10. Add Article / BlogPosting schema for milestones
- **File:** `_includes/milestone-entry.njk` (or the milestones page template)
- **Issue:** Milestone entries are blog-like posts with dates, titles, and rich content, but they lack structured data.
- **Fix:** Add `Article` (or `BlogPosting`) JSON-LD to each milestone entry, including `headline`, `datePublished`, `author`, and `image` when present.

### 11. Add BreadcrumbList schema for year-based song pages
- **File:** `pages/songs-year.njk`
- **Issue:** The paginated year pages (`/songs/2025/`) benefit from breadcrumb structured data for richer search result display.
- **Fix:** Add a `BreadcrumbList` JSON-LD block: Home > Songs > {{ year }}.

### 12. Add MusicComposition schema for songs
- **File:** `pages/songs.njk` or a song-card include
- **Issue:** Song data (title, composer, learned status) is available but not exposed to search engines as structured data.
- **Fix:** Consider adding `MusicComposition` schema for learned songs, including `name`, `composer`, and `dateCreated` (dateLearned).

---

## MEDIUM — Image Optimization

### 13. Add `width` and `height` attributes to all images
- **Files:** `_includes/milestone-entry.njk`, `pages/index.njk`
- **Issue:** Images lack explicit `width` and `height` attributes, causing Cumulative Layout Shift (CLS), which is a Core Web Vitals metric affecting SEO ranking.
- **Fix:** Specify `width` and `height` on all `<img>` tags.

### 14. Serve images in modern formats (WebP / AVIF)
- **Files:** `public/images/`
- **Issue:** Images are served as JPEG/PNG with no modern format alternatives, resulting in larger file sizes than necessary.
- **Fix:** Use the `@11ty/eleventy-img` plugin to automatically generate WebP/AVIF versions and `<picture>` elements with `srcset`.

### 15. Add responsive image `srcset`
- **Files:** Any template with `<img>` tags
- **Issue:** Images have no `srcset` or `sizes` attributes, so the same full-size image is downloaded on mobile and desktop.
- **Fix:** Generate multiple sizes and use `srcset` with appropriate `sizes` attribute.

### 16. Ensure every image has a meaningful alt text
- **Files:** `_includes/milestone-entry.njk:34`
- **Issue:** The fallback for `imageAlt` is the milestone title, which may not describe the image well.
- **Fix:** Encourage content authors to always fill in `imageAlt` in the CMS; the CMS field should be marked as required when an image is provided. Add a content guideline note in `admin/config.yml`.

---

## MEDIUM — Content & Internal Linking

### 17. Add descriptive `<meta name="description">` to CMS config
- **File:** `admin/config.yml`
- **Issue:** The Netlify CMS schema for milestones and songs does not include a `description` or `excerpt` field, making it impossible for content authors to add custom meta descriptions without code changes.
- **Fix:** Add optional `description` (or `excerpt`) fields to the CMS schemas for milestones and songs collections.

### 18. Add individual milestone pages
- **Issue:** Each milestone is rendered only as a section on the `/milestones/` page. There are no individual URLs (e.g., `/milestones/first-lesson/`). This limits SEO value — each milestone could rank independently.
- **Fix:** Use Eleventy's `tags` and pagination to generate a standalone page per milestone with full content, image, and schema markup.

### 19. Improve internal linking from Songs to related Milestones
- **Issue:** The Songs and Milestones sections are not linked to each other contextually. Cross-linking related content increases crawl depth and distributes page authority.
- **Fix:** When a milestone references a song (or vice versa), include a contextual link between them.

### 20. Add a "breadcrumb" navigation trail
- **File:** `pages/songs-year.njk`
- **Issue:** Year-based song pages have previous/next navigation but no breadcrumb trail (e.g., Home > Songs > 2025). Breadcrumbs improve navigation clarity and are shown in search results.
- **Fix:** Add a visible breadcrumb trail on year pages (and individual milestone pages if created).

---

## MEDIUM — Technical SEO

### 21. Add `<link rel="preload">` for critical assets
- **File:** `_includes/base.njk`
- **Issue:** The compiled CSS file and hero fonts are not preloaded, which can delay First Contentful Paint.
- **Fix:** Add `<link rel="preload" as="style" href="/css/styles.css">` and preload the primary font variant used above the fold.

### 22. Self-host fonts instead of loading from Google Fonts
- **File:** `_includes/base.njk:13`
- **Issue:** Google Fonts requires a DNS lookup and connection to `fonts.googleapis.com` on every page load, adding latency. Also, since GDPR, external font requests have privacy implications.
- **Fix:** Download Nunito and Inter font files, add them to `/public/fonts/`, and reference them with `@font-face` in the CSS.

### 23. Add `hreflang` if multi-language support is planned
- **Issue:** Not currently relevant, but worth noting: if the site is ever offered in multiple languages, `hreflang` tags will be needed.
- **Fix:** Defer until/if multi-language content is created.

### 24. Verify trailing slash consistency
- **Issue:** All page links use trailing slashes (`/songs/`, `/about/`). Netlify adds trailing slashes by default. Ensure that Netlify redirect rules enforce consistent trailing slash behavior to avoid duplicate content from both `/songs` and `/songs/` resolving.
- **Fix:** Add a `[[redirects]]` rule in `netlify.toml` or use `_redirects` to canonicalize trailing slashes.

---

## LOW — Social & Brand Presence

### ✅ 25. Add a favicon
- **File:** `_includes/base.njk`, `public/favicon-16x16.png`, `public/favicon-32x32.png`
- **Issue:** No favicon was defined in the `<head>`.
- **Done:** Added 16×16 and 32×32 grand-piano PNG favicons to `/public/` and referenced them in `<head>`.

### 26. Add `<meta name="author">` tag
- **File:** `_includes/base.njk`
- **Issue:** No author meta tag is present.
- **Fix:** Add `<meta name="author" content="Maya">` (or the parent author if this is a parent-managed site).

### 27. Verify social profile links are crawlable
- **File:** `_data/config.json` (Instagram, YouTube, TikTok links)
- **Issue:** External social links use `rel="noopener noreferrer"` which is correct for security, but ensure they don't also include `nofollow` unnecessarily on links that could benefit from being followed (e.g., the site's own social pages).
- **Fix:** Review all social links; for the site's own social profiles, `rel="noopener noreferrer"` without `nofollow` is appropriate.

---

## LOW — Analytics & Monitoring

### 28. Set up Google Search Console
- **Issue:** Without Search Console, there is no visibility into how (or whether) Google indexes the site, what queries bring traffic, or if crawl errors exist.
- **Fix:** After removing the `noindex` and fixing `robots.txt`, verify the site in Google Search Console and submit the sitemap.

### 29. Add privacy-friendly analytics
- **Issue:** No analytics tool is present — there is no way to measure organic traffic or the impact of SEO changes.
- **Fix:** Consider a lightweight, privacy-first analytics solution (e.g., Plausible, Fathom, or Netlify Analytics) that does not require a cookie consent banner.

---

## Progress Tracker

| # | Area | Priority | Effort | Status |
|---|------|----------|--------|--------|
| 1 | Remove `noindex` meta tag | Critical | Trivial | ✅ Done |
| 2 | Fix robots.txt | Critical | Trivial | ✅ Done |
| 3 | Create sitemap.xml | Critical | Low | ✅ Done |
| 4 | Per-page meta descriptions | High | Low | ⬜ Todo |
| 5 | Open Graph tags | High | Low | ✅ Done |
| 4 | Per-page meta descriptions | High | Low | ✅ Done |
| 5 | Open Graph tags | High | Low | ⬜ Todo |
| 6 | Twitter Card tags | High | Low | ✅ Done |
| 7 | Canonical URL tags | High | Low | ⬜ Todo |
| 8 | Improve homepage `<title>` | High | Trivial | ⬜ Todo |
| 9 | Person/Organization JSON-LD | High | Medium | ⬜ Todo |
| 10 | Article schema for milestones | High | Medium | ⬜ Todo |
| 11 | BreadcrumbList schema | High | Low | ⬜ Todo |
| 12 | MusicComposition schema | Medium | Medium | ⬜ Todo |
| 13 | Image width/height attributes | Medium | Low | ⬜ Todo |
| 14 | Modern image formats (WebP) | Medium | Medium | ⬜ Todo |
| 15 | Responsive images (`srcset`) | Medium | Medium | ⬜ Todo |
| 16 | Enforce meaningful alt text | Medium | Low | ⬜ Todo |
| 17 | Description field in CMS | Medium | Low | ⬜ Todo |
| 18 | Individual milestone pages | Medium | High | ⬜ Todo |
| 19 | Cross-link songs & milestones | Medium | Medium | ⬜ Todo |
| 20 | Visible breadcrumb trail | Medium | Low | ⬜ Todo |
| 21 | Preload critical assets | Medium | Low | ⬜ Todo |
| 22 | Self-host fonts | Medium | Medium | ⬜ Todo |
| 23 | `hreflang` (future) | Low | Defer | ⬜ Todo |
| 24 | Trailing slash consistency | Low | Low | ⬜ Todo |
| 25 | Favicon | Low | Low | ✅ Done |
| 26 | Author meta tag | Low | Trivial | ⬜ Todo |
| 27 | Review social link `rel` attrs | Low | Trivial | ⬜ Todo |
| 28 | Google Search Console | Low | Low | ⬜ Todo |
| 29 | Privacy-friendly analytics | Low | Low | ⬜ Todo |
