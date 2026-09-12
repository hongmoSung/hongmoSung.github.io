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
- `.github/dependabot.yml` watches both `github-actions` and `bundler` monthly, so the action pins and
  `Gemfile.lock` do not silently rot again
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
  `vendor/breakpoint/_helpers.scss`, `_data/ui-text.yml` (the `ko` block's `search_label` /
  `search_label_text` are filled in locally — upstream ships them blank, which falls back to English)
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

### Search
`search: true` in `_config.yml` turns on the theme's bundled **lunr** index (`search_provider` is left blank,
and lunr is the default). The index is built at `assets/js/lunr/lunr-store.js` from post titles, excerpts and
front matter — set `search_full_content: true` to index body text too, at the cost of a much larger payload.
lunr has no Korean stemmer, so the theme loads `lunr-en.js` and matching is effectively substring-based.

### Custom Plugins
`_plugins/` works **only because the site builds on Actions** — the classic Pages build ignores it. Today it
holds one file:

- `lazy_images.rb` — a `:post_convert` hook that adds `loading="lazy" decoding="async"` to `<img>` in the
  document body. Jekyll 4.4's `renderer.rb` re-reads `document.content` immediately after this hook, which is
  what makes the edit survive into the layout. It is scoped to `output_ext == ".html"` on purpose: the theme's
  `assets/js/lunr/lunr-*.js` carry front matter, so Jekyll treats them as pages, and they build an `<img>` tag
  inside a string literal — without the guard the hook rewrites that JavaScript. The sidebar avatar comes from
  the layout rather than the body, so it correctly stays eager.

### 404 Page
`_pages/404.md` renders to `/404.html`, which GitHub Pages serves for any unmatched path. It carries
`sitemap: false` so `jekyll-sitemap` skips it. Without this file visitors get GitHub's unstyled
"Page not found" page instead of the site.

## Important Notes

- Korean is the primary content language
- Code examples must specify language after triple backticks for proper highlighting
- Permalink structure: `/:categories/:title/`
- Post defaults: `layout: single`, `comments: true`, `share: false`, `related: true`
- **Sitemap** is generated by `jekyll-sitemap`. Do not add a hand-written `sitemap.xml` to the repo root —
  the plugin skips generation when one already exists, and the manual version only covered `site.posts`
- **Front matter `date` overrides the filename date.** Keep them in sync, and zero-pad the filename
  (`2022-07-24-`, not `2022-7-24-`) — an unpadded filename is only rescued by the front matter `date`,
  so deleting that line would make the post silently disappear
- `jekyll-gist` was removed (no post used `{% gist %}`); it was the only thing pulling in `octokit 4.x`,
  which emitted a `faraday-retry` warning on every build. Re-add the gem if you ever need the tag
- `CLAUDE.md` is in `_config.yml`'s `exclude` — without it, Jekyll publishes this file at `/CLAUDE/`
- **Image paths in posts must be root-absolute** (`/assets/images/...`). Several older posts use raw
  `<img src="../../../assets/...">`, which only works because `normpath` clamps at the root; one post used
  `assets/...` with no `../` and 404'd on the live site for years (fixed in b79d57f9)
- `_config.yml` carries only settings this site actually uses. The theme's full menu of comment providers,
  search providers and `pagination:` keys was removed in 739957d9 — take them from upstream's `_config.yml`
  if you ever need one
- The repo is cloned with `core.autocrlf = input`, so **git stores LF** no matter what the working tree holds.
  Several working-tree files are CRLF; that difference never reaches a commit, but it does break naive
  `split("\r\n")` scripting against a file with mixed endings
