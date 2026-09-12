# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal development blog (DevLog) built with Jekyll and hosted on GitHub Pages. The site uses the [Minimal Mistakes](https://mmistakes.github.io/minimal-mistakes/) theme and is written primarily in Korean (ko-KR locale). The blog focuses on backend development topics including Java, Spring, databases, OOP, and technical book reviews.

## Common Commands

```bash
# Install dependencies (must run after cloning or Gemfile changes)
bundle install

# Run local development server (http://localhost:4000)
bundle exec jekyll serve

# Clean build cache (useful when experiencing build issues)
bundle exec jekyll clean
```

## Deployment

Built and deployed by **GitHub Actions** (`.github/workflows/pages.yml`) on every push to `master` —
*not* by Pages' classic branch build. Pages' `build_type` is set to `workflow`.

- Runs `bundle exec jekyll build` with **`JEKYLL_ENV=production`**. That env var is mandatory: the classic
  build injected it automatically, and without it Utterances comments do not render
- Build status: https://github.com/hongmoSung/hongmoSung.github.io/actions
- This is why the stack is no longer pinned to the `github-pages` gem (Jekyll 3.10). `Gemfile` pins
  `jekyll ~> 4.4` directly, and **`Gemfile.lock` is committed** for reproducible CI builds

## Architecture

### Theme Configuration (Vendored Fork)
- This repo is a **fork of `mmistakes/minimal-mistakes`** (shared history; `upstream` remote). The theme
  (**4.28.1**) is vendored: `_includes/`, `_layouts/`, `_sass/`, `assets/`
- Jekyll resolves site-local files ahead of theme files, so `theme:` is deliberately left **empty** in `_config.yml`.
  Leaving it unset is not an option — it would fall back to a default theme and leak that theme's
  `assets/css/style.css` into the build
- `remote_theme` was removed: every file it supplied was already shadowed by the vendored copies, and it was
  bypassing the `exclude` list to publish the theme's unminified JS sources (`assets/js/vendor/`, `_main.js`)
- **Upgrading the theme**: because the fork shares history with upstream, use a path-scoped 3-way merge rather
  than hand-copying files:
  ```bash
  git fetch upstream --tags
  git diff <current-tag> <new-tag> -- _includes _layouts _sass assets _data/ui-text.yml > /tmp/theme.patch
  git apply -3 /tmp/theme.patch     # conflicts land as normal <<<<<<< markers
  ```
  Scope the diff to theme paths only — a full `git merge` would also drag in upstream's `docs/`, `test/`,
  `Rakefile`, `package.json` and `_config.yml`, all of which this fork intentionally does not carry.
  Locally customized theme files: `head.html`, `scripts.html`, `mermaid.html`, `head/custom.html`,
  `footer/custom.html`, `_custom.scss`, `_variables.scss`, `_utilities.scss`, `main.scss`,
  `vendor/breakpoint/_helpers.scss`
- Changes to `_config.yml` require restarting `jekyll serve`

### Sass
Dart Sass (`sass-embedded`) via `jekyll-sass-converter` 3.x. The vendored Susy/breakpoint libraries use
`/` division and `@import`, both deprecated in Dart Sass — upstream has the same problem, so `_config.yml`
sets `quiet_deps: true` and `silence_deprecations: ["import"]` to keep build logs readable. `sourcemap: never`
keeps `.map` files and SCSS source paths out of production.

### baseurl
`baseurl` must be `""`, not `"/"`. `jekyll-github-metadata` treats `"/"` as unset and overwrites it
(`site_github_munger.rb:81`), which silently breaks local production builds.

### Syntax Highlighting
- **Engine**: Rouge 4 (via kramdown). Tokens are emitted as **CSS classes** (`<span class="kd">`), *not* inline
  styles — there is no `inline_theme` in `_config.yml`, so all colors come from `_syntax.scss`
- **Colors**: `_sass/minimal-mistakes/_variables.scss` `$base0x` — code container background is
  `$base00: #f8f9fa`, plain text `$base05: #343a40`. These are local overrides; upstream 4.28.1 ships a dark
  palette here, so a theme upgrade must not clobber them
- Code blocks without a language get `language-plaintext` and are styled by the same rules

### Styling Customization
- **Custom styles**: `_sass/minimal-mistakes/_custom.scss` — site-specific overrides
- **Color variables**: `_sass/minimal-mistakes/_variables.scss` — base16 color scheme
- **CSS cache busting**: Automatic — `head.html` / `scripts.html` append `?v={{ site.time | date: '%s' }}`, which
  changes on every build. No manual step is needed.
  The `version` key in `_config.yml` is **inert**: its only use is a comment line in `assets/css/main.scss`.
  (Side effect: because the query string changes every deploy, CSS/JS are never cached across deploys.)

### Comment System
- Uses Utterances (GitHub Issues integration) — repo: `hongmoSung/hongmoSung.github.io`
- Comments only render when `jekyll.environment == 'production'` (not visible on local `serve`)

## Content Structure

### Blog Posts
Posts are in `_posts/` organized by subdirectory: `java/`, `spring/`, `database/`, `book/`, `oop/`, `inflearn/`, `k8s/`, `linux/`, `english/`, `logs/`, `event/`

### Post Naming & Front Matter
- Format: `YYYY-MM-DD-title.md`
- Required front matter:
```yaml
---
title: "Post Title"
categories:
  - category-name
tags:
  - tag1
toc: true  # Optional
---
```

### Text Highlighting
Two methods:
1. `==텍스트==` — auto-converted to `<mark>` via JavaScript
2. `<mark>텍스트</mark>` — direct HTML

### Mermaid Diagrams
Enabled via `mermaid: true` in `_config.yml`. Use standard Mermaid syntax in code blocks.

## Important Notes

- Korean is the primary content language
- Code examples must specify language after triple backticks for proper highlighting
- Permalink structure: `/:categories/:title/`
- Post defaults: `layout: single`, `comments: true`, `share: false`, `related: true`
- **Sitemap** is generated by `jekyll-sitemap`. Do not add a hand-written `sitemap.xml` to the repo root —
  the plugin skips generation when one already exists, and the manual version only covered `site.posts`
- **Front matter `date` overrides the filename date.** Keep them in sync
- Deployment is GitHub Pages' classic branch build, which ignores the `Gemfile` and uses its own server-side
  `github-pages` gem set. The `Gemfile` only shapes local development
- `CLAUDE.md` is in `_config.yml`'s `exclude` — without it, Jekyll publishes this file at `/CLAUDE/`
