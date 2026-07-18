# Migrating a LuxTHE-based site to LuxTHE v3.6.8

LuxTHE v3.6.8 uses its own semantic Grid shell. A Hugo project still overrides files supplied by a theme, so copied LuxTHE layouts, assets, and configuration must be removed or intentionally rewritten before the first v3.6.8 deployment.

## 1. Install LuxTHE as a theme

Extract the release so the theme metadata is located at `themes/LuxTHE/theme.toml`, then enable it in the site's Hugo configuration:

```toml
theme = "LuxTHE"
```

Do not leave the archive under a different directory name while configuring `theme = "LuxTHE"`.

## 2. Remove the LuxTHE module import

Delete the LuxTHE import from `config/_default/module.toml`. If `go.mod` and `go.sum` exist only to download LuxTHE, remove both files. LuxTHE builds without Hugo Modules and does not fetch a theme over the network.

If the site uses other Hugo Modules, keep its module files and remove only the LuxTHE import.

## 3. Remove copied LuxTHE layouts

Files under the site's root `layouts/` override `themes/LuxTHE/layouts/`. Delete copied LuxTHE templates unless they are deliberate LuxTHE v3.6.8 overrides. In particular, old `baseof.html`, sidebar partials, and search partials prevent the new semantic shell from rendering.

## 4. Remove physical sidebar CSS

Review the site's `assets/scss/custom.scss` and remove LuxTHE-era rules containing:

```scss
flex-direction: row-reverse;
.left-sidebar
.right-sidebar
.main-container.flex.on-phone--column
```

LuxTHE v3.6.8 uses `widget-sidebar | main | site-sidebar` at desktop widths. The new shell does not use physical left/right names, negative column order, or `row-reverse`.

## 5. Update `widgets.page`

A site's arrays replace the theme arrays. Remove the old `widgets.page = [{ type = "toc" }]` assignment to inherit the v3.6.8 defaults, or configure the discovery widgets explicitly:

```toml
[params.widgets]
page = [
  { type = "categories", params = { limit = 10 } },
  { type = "tag-cloud", params = { limit = 10 } },
  { type = "toc" }
]
```

Search is rendered only when the corresponding widgets array contains `{ type = "search" }` and a translated search page with JSON output exists. Duplicate search entries are automatically removed.

## 6. Add the local search page

Copy the appropriate files from `exampleSite/content/zh-cn/search.md` into `content/zh-cn/search.md` and `exampleSite/content/en/search.md` into `content/en/search.md`. Each enabled language needs a page with HTML and JSON outputs:

```toml
+++
title = "搜索"
layout = "search"
outputs = ["HTML", "JSON"]
+++
```

Without a valid local search page, LuxTHE intentionally omits the search input, mobile search link, index request, and search scripts.

## 7. Clear generated resources and deploy

Remove the site's generated `resources/`, `public/`, and `.cache/` directories before the first migration build. Do not delete source assets or content. Build with the pinned extended version:

```bash
hugo --gc --minify
```

For Cloudflare Pages, use `HUGO_VERSION=0.164.0` and the build command documented in [cloudflare-pages.md](cloudflare-pages.md).

## Expected desktop result

```text
widget-sidebar | main | site-sidebar
search          | post | avatar and site identity
categories      |      | primary navigation
tags            |      | introduction and contacts
TOC             |      | language and color scheme
```
