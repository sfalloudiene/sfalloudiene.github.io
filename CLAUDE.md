# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## What this is

Personal portfolio + blog (**fallou.dev**, custom domain — hosted on GitHub Pages at `sfalloudiene.github.io`/`sfalloudiene/sfalloudiene.github.io`, repo name unchanged) built on the [Jekyll TeXt theme](https://github.com/kitian616/jekyll-TeXt-theme).
The theme source was vendored directly into this repo (not used as a remote_theme/gem dependency) so it can be freely customized. Theme-dev-only tooling (npm lint/build scripts, Docker, Travis CI, the theme's own docs/test sites, gemspec/gem-release flow) was stripped out — this repo only contains what's needed to write posts and run the site.

`upstream` remote still points to the original theme repo, in case future theme updates are worth pulling in manually.

## Commands

```bash
bundle install
bundle exec jekyll serve   # http://127.0.0.1:4000, auto-regenerates on file changes
bundle exec jekyll build   # outputs to _site/
```

On Windows, Ruby is installed via `winget install RubyInstallerTeam.RubyWithDevKit.3.3`. New shells need PATH refreshed:
```powershell
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
```

**Publishing**: push to `main` on `origin` (github.com/sfalloudiene/sfalloudiene.github.io) — GitHub Pages builds and serves it automatically from the repo root, no CI workflow needed (all plugins in `_config.yml` are on GitHub Pages' supported list).

## Writing posts

New post: `_posts/YYYY-MM-DD-title.md` with front matter (`layout: article`, `title`, etc.) — see existing posts or theme docs for available front-matter options (TOC, license, sharing, comments are all per-post toggleable, defaults set in `_config.yml`).

**Full-width cover image** (like mincong.io): add to a post's front matter to get a full-bleed photo header with the title/tags/date overlaid on it —
```yaml
cover: /assets/images/your-image.jpg
article_header:
  type: overlay
  theme: dark   # dark = white text (for photo backgrounds); light = dark text (plain background, theme default)
  background_image:
    src: /assets/images/your-image.jpg
```
This is a stock TeXt theme mechanism (`_layouts/page.html`, `_article_header_type == 'overlay'`), not custom code — it already renders full-bleed on its own, outside the normal content container. Put source images (compressed, e.g. via `ffmpeg -i in.jpg -vf scale=2000:-1 -q:v 4 out.jpg`) in `assets/images/`. A dark scrim (`.article__header--overlay .overlay::before` in `_sass/custom.scss`) keeps the white title readable regardless of how bright the photo is — no need to darken the source image itself.

**`cover`/`image`/`background_image.src` also accept a plain external URL** (e.g. a direct Unsplash CDN link like `https://images.unsplash.com/photo-xxx?w=2000&q=80&auto=format&fit=crop`) instead of a local `assets/images/...` path — no need to download and commit the file. Every place these fields are read (`_layouts/page.html`'s overlay header, `_includes/article-list.html`, the homepage's "Derniers articles" cards in `index.html`) goes through `snippets/get-nav-url.html`, which passes `http(s)://` URLs through unchanged instead of prefixing `baseurl`. Trade-off: the image then depends on that external host staying up, and you lose control over compression (tune it via Unsplash's own `w=`/`q=` URL params instead of ffmpeg).

**SEO / social preview image**: also set `image: /assets/images/your-image.jpg` (same path as `cover`) so `jekyll-seo-tag` picks it up for the Open Graph / Twitter Card preview when the post is shared. `cover` and `image` are two separate front-matter keys read by two different things (theme header vs. SEO plugin) — keep them in sync.

**Page title / SEO**: `{% seo %}` in `_includes/head.html` (jekyll-seo-tag) generates `<title>`, meta description, Open Graph, Twitter Card, canonical link, JSON-LD — it only reads a plain `page.title` string. Pages that use the theme's multi-locale `titles:` hash (about.md, archive.html, blog/index.html, 404.html) need a **separate plain `title:`** front-matter key too, or their browser tab title silently falls back to the generic site title. Keep both in sync when adding a new special page.

## Site structure

- **`/` (index.html)** — portfolio homepage: photo, tagline, bio, experience/education timeline (custom HTML, `layout: page`, `show_title: false`). Not a blog listing.
- **`/blog/` (blog/index.html)** — the paginated post list (what used to be at `/`), `layout: home` → `articles` → paginator. **Must stay named `index.html` inside a `blog/` directory** — the legacy `jekyll-paginate` gem only paginates a page literally named `index.html`, and only if `paginate_path` (in `_config.yml`) shares its directory. Renaming either one breaks pagination silently (the page renders with zero posts, no error).
- **`site.paths.home`** is overridden to `/blog/` in `_config.yml` (used by `paginator.html`'s "back to page 1" link) — `site.paths.root` stays `/` (site logo/title still links to the portfolio).
- The old homepage hero mechanism (`page.hero` in `_layouts/articles.html`, `.hero--image`/`.hero--full-bleed` in `_sass/custom.scss`) still exists and still works, but is unused now that `/blog/` has no hero front matter — it was built for the pre-portfolio homepage and is kept in case a hero banner is wanted on `/blog/` again.
- Portfolio-specific styles (`.portfolio-hero*`, `.timeline*`) live in `_sass/custom.scss`.

## Custom domain

Site is served at **fallou.dev** via a `CNAME` file at the repo root (committing it is equivalent to setting the custom domain in repo Settings → Pages). DNS is 4 A records at the registrar pointing `fallou.dev` to GitHub Pages' IPs (185.199.108/109/110/111.153) — that part isn't in this repo and isn't controllable from here.

## Newsletter (Buttondown)

The subscribe form on posts and `/blog/` (`.newsletter-subscribe` in `_includes/article/footer/subscribe.html` and `blog/index.html`) posts to Buttondown's hosted subscribe endpoint directly — no code involved.

Buttondown's built-in "RSS-to-email" auto-send is a paid feature (Basic plan, $9/mo), so instead `.github/workflows/newsletter.yml` replicates it for free: on every push to `main` that adds a file under `_posts/`, it diffs the push range, and for each newly-added post calls the Buttondown API to email subscribers with the title and a link to the post. Sending is two calls (per Buttondown's documented email state machine, `docs.buttondown.com/api-reference/emails`): `POST /v1/emails` creates a draft (the API doesn't accept `status: about_to_send` at creation time), then `PATCH /v1/emails/{id}` with `{"status": "about_to_send"}` moves it into the state that Buttondown sends automatically.

Requires a `BUTTONDOWN_API_KEY` repo secret (Settings → Secrets and variables → Actions), generated from the Buttondown dashboard (Settings → API). Without it, the workflow no-ops with a warning instead of failing the build.

## Project Architecture

### Skin System
6 built-in skins (`default`, `dark`, `forest`, `ocean`, `chocolate`, `orange`) + 5 highlight themes. A skin is a SCSS file at `_sass/skins/_<name>.scss` that defines CSS custom properties (colors, fonts, borders). Selected via `text_skin` in `_config.yml`. The main entry point `assets/css/main.scss` dynamically `@import`s the active skin.

### Layout Inheritance
Layouts in `_layouts/` form a chain: `none` ← `base` ← `page` ← `article` / `home` / `landing` / `articles` / `archive` / `404`. `base.html` is the root — it sets up the HTML shell, analytics, head, and core JS utilities. Page-level layouts extend it and add content wrappers.

### Include System
`_includes/` is organized by concern:
- **article/** — header, footer, info, list components
- **aside/** — sidebar content (TOC, affix)
- **scripts/** — vanilla JS (no framework): lib/ (third-party), utils/, components/ (search, lightbox, sidebar)
- **head/**, **footer/**, **sidebar/** — structural includes
- **comments-providers/**, **analytics-providers/**, **search-providers/**, **sharing-providers/**, **pageview-providers/** — pluggable third-party integrations

### JavaScript Architecture
Vanilla JS (no build step, no framework). Scripts are included directly via Liquid `{%- include scripts/...js -%}` in `base.html`. No bundler — all JS is served raw from `_includes/scripts/`.

### SCSS Organization
`_sass/` is structured as:
- **skins/** — color/font themes (each skin is a standalone variable file)
- **common/** — shared variables, functions, classes, reset, print styles, reusable components (button, card, modal, gallery, etc.)
- **components/** — page-level component styles (header, footer, search, lightbox, etc.)
- **layout/** — page layout styles (base, page, article, home, archive, etc.)
- **additional/** — optional utility styles (alerts, tags, photo frames)
- **animate/** — keyframe animations (fade-in variants)
- **custom.scss** — user overrides placeholder

### Content & Data
- `_data/` — YAML files for authors, licenses, locale (i18n), navigation, and theme variables
- `_posts/` — blog posts

### Known Windows quirk
`_sass/common/_variables.scss` uses legacy `/` division (Sass deprecation warnings on build, harmless). A prior attempt to migrate to `math.div()` broke GitHub Pages' older Sass processor, so it was reverted — leave it as `/` unless GitHub Pages' Sass version is confirmed upgraded.
