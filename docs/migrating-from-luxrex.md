# Migrating a LuxTHE-based site to Luxthe v2

Luxthe v2 uses its own semantic Grid shell. A Hugo project still overrides files supplied by a theme, so copied LuxTHE layouts, assets, and configuration must be removed or intentionally rewritten before the first v2 deployment.

## 1. Install Luxthe as a theme

Extract the release so the theme metadata is located at `themes/LuxTHE/theme.toml`, then enable it in the site's Hugo configuration:

```toml
theme = "LuxTHE"
```

Do not leave the archive as `themes/LuxTHE-v2` while configuring `theme = "LuxTHE"`.

## 2. Remove the LuxTHE module import

Delete the LuxTHE import from `config/_default/module.toml`. If `go.mod` and `go.sum` exist only to download LuxTHE, remove both files. Luxthe builds without Hugo Modules and does not fetch a theme over the network.

If the site uses other Hugo Modules, keep its module files and remove only the LuxTHE import.

## 3. Remove copied LuxTHE layouts

Files under the site's root `layouts/` override `themes/LuxTHE/layouts/`. Delete copied LuxTHE templates unless they are deliberate Luxthe v2 overrides. In particular, old `baseof.html`, sidebar partials, and search partials prevent the new semantic shell from rendering.

## 4. Remove physical sidebar CSS

Review the site's `assets/scss/custom.scss` and remove LuxTHE-era rules containing:

```scss
flex-direction: row-reverse;
.left-sidebar
.right-sidebar
.main-container.flex.on-phone--column
```

Luxthe v2 uses `widget-sidebar | main | site-sidebar` at desktop widths. The new shell does not use physical left/right names, negative column order, or `row-reverse`.

## 5. Update `widgets.page`

A site's arrays replace the theme arrays. Remove the old `widgets.page = [{ type = "toc" }]` assignment to inherit the v2 defaults, or configure the discovery widgets explicitly:

```toml
[params.widgets]
page = [
  { type = "categories", params = { limit = 10 } },
  { type = "tag-cloud", params = { limit = 10 } },
  { type = "toc" }
]
```

Article search is pinned above this configurable array in v2 and is automatically deduplicated if an older configuration still contains `{ type = "search" }`.

## 6. Add the local search page

Copy the appropriate files from `exampleSite/content/search/` into the site's `content/search/` directory. Each enabled language needs a page with HTML and JSON outputs:

```toml
+++
title = "搜索"
layout = "search"
outputs = ["HTML", "JSON"]
+++
```

Without a valid local search page, Luxthe intentionally omits the search input, mobile search link, index request, and search scripts.

## 7. Clear generated resources and deploy

Remove the site's generated `resources/`, `public/`, and `.cache/` directories before the first v2 build. Do not delete source assets or content. Build with the pinned extended version:

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
