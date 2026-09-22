# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## What this is

Personal blog (`sfalloudiene.github.io`) built on the [Jekyll TeXt theme](https://github.com/kitian616/jekyll-TeXt-theme).
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
This is a stock TeXt theme mechanism (`_layouts/page.html`, `_article_header_type == 'overlay'`), not custom code — it already renders full-bleed on its own, outside the normal content container. Put source images (compressed, e.g. via `ffmpeg -i in.jpg -vf scale=2000:-1 -q:v 4 out.jpg`) in `assets/images/`.

The homepage's own hero (index.html `hero:` front matter) is separate custom code (`_layouts/articles.html` + `.hero--image`/`.hero--full-bleed` in `_sass/custom.scss`) — it reuses the theme's `.hero` component but isn't the built-in article overlay mechanism.

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
