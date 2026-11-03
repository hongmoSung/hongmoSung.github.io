# AGENTS.md

Shared project instructions for coding agents working in this repository.
This file is the source of truth; keep tool-specific entry points such as `CLAUDE.md` as short references to it.

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
- Pull requests targeting `master` run the same production build. Artifact upload and deployment run only
  on non-PR events on `master`; Pages/OIDC write permissions are scoped to the deploy job.
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
- **CSS/JS cache busting**: `_plugins/asset_versions.rb` runs after rendering and appends a SHA-256 content
  hash to local stylesheet/script URLs. It hashes compiled CSS, rendered Liquid JS, and static JS as they
  will be deployed. Unchanged assets retain their URLs across builds; no manual version bump is needed.

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
1. `==텍스트==` — auto-converted to `<mark>` via JavaScript using DOM text nodes, preserving literal HTML characters
2. `<mark>텍스트</mark>` — direct HTML

### Mermaid Diagrams
Write a ```` ```mermaid ```` fenced block; nothing else is needed. `_includes/mermaid.html` loads the library
only when the rendered page actually contains one (`content contains "language-mermaid"`), because
`mermaid.min.js` is **2.9MB** and the old `mermaid: true` site-wide flag was shipping it to all 120 pages when
only 21 have a diagram. `page.mermaid: true` still forces it on for a page that builds a diagram some other way.
Rouge has no mermaid lexer, so kramdown emits the block untouched as `<pre><code class="language-mermaid">`,
which is exactly what the include's script looks for.

### Search
`search: true` in `_config.yml` turns on the theme's bundled **lunr** index (`search_provider` is left blank,
and lunr is the default). The index is built at `assets/js/lunr/lunr-store.js` from post titles, excerpts and
front matter — set `search_full_content: true` to index body text too, at the cost of a much larger payload.
lunr has no Korean stemmer, so the theme loads `lunr-en.js` and matching is effectively substring-based.
Search runs on the `input` event, ignores terms without letters/numbers, and only applies edit-distance
matching to terms with at least three characters. Empty or symbol-only input returns zero results.
`lunr-en.js` is plain JavaScript without front matter or Liquid. The search input's `data-results-found`
attribute supplies the translated result label from `search/search_form.html`. The script uses native DOM
APIs and a private scope, and builds result text with `textContent` rather than parsing HTML strings.

### Custom Plugins
`_plugins/` works **only because the site builds on Actions** — the classic Pages build ignores it. Today it
holds two files:

- `asset_versions.rb` — a site `:post_render` hook that versions local CSS/JS references using hashes of
  the final asset contents. External URLs and references with existing query strings remain untouched.

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
- `AGENTS.md` and `CLAUDE.md` must remain in `_config.yml`'s `exclude` so agent instructions are not published to the blog.
- **Image paths in posts must be root-absolute** (`/assets/images/...`). Several older posts use raw
  `<img src="../../../assets/...">`, which only works because `normpath` clamps at the root; one post used
  `assets/...` with no `../` and 404'd on the live site for years (fixed in b79d57f9)
- `exclude` also hides three theme assets that were being published but never loaded:
  `assets/js/main.min.js.map` (204KB, and it lists the very JS sources `exclude` exists to hide),
  `assets/js/lunr/lunr.js` (the unminified copy — pages load `lunr.min.js`) and `assets/js/lunr/lunr-gr.js`
  (Greek stemmer; `lunr-search-scripts.html` picks `en` for any non-`gr` locale). They stay in the repo so the
  theme-upgrade diff keeps applying
- `_config.yml` carries only settings this site actually uses. The theme's full menu of comment providers,
  search providers and `pagination:` keys was removed in 739957d9 — take them from upstream's `_config.yml`
  if you ever need one
- **Keep the working tree LF.** Every blob in this repo is LF. If an editor rewrites a file as CRLF, two
  things go wrong: `git status` reports it modified even though nothing changed, and — worse —
  `excerpt_separator: "\n\n"` stops matching, so `page.excerpt` becomes the *entire post*. That silently turns
  every `<meta name="description">` into the whole article in local builds while CI (which checks out LF) is
  fine, so a local production build no longer reproduces the deployed site. `git checkout -- <file>` restores
  LF
