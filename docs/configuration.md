# Luxthe configuration

Luxthe requires Hugo Extended 0.164.0+. The root `hugo.toml` contains safe defaults; a site's values override them.

The theme-level `hugo.toml` is intentional. Hugo loads a theme as a component and merges the project configuration first, followed by theme defaults. `config/_default` is an alternative way to split configuration, not a requirement for a standalone theme. Luxthe deliberately has no `module.toml`, `go.mod`, module import, or network-fetched build dependency.

## Core site settings

```toml
theme = "luxthe"
defaultContentLanguage = "zh-cn"
hasCJKLanguage = true

[params]
mainSections = ["posts"]
```

`mainSections` controls the homepage list and each language's JSON search index. Configure `pagination.pagerSize`, permalinks, taxonomies, menu entries and date formats normally through Hugo.

## Theme parameters

| Key | Default | Purpose |
| --- | --- | --- |
| `params.rssFullContent` | `true` | Put full article content in RSS. |
| `params.favicon` | empty | Legacy single favicon path. Used only when structured icon paths are empty. |
| `params.faviconSVG` | empty | SVG favicon path. |
| `params.faviconPNG` | empty | PNG favicon path. |
| `params.appleTouchIcon` | empty | Apple Touch Icon path. |
| `params.webmanifest` | empty | Web app manifest path. |
| `params.footer.since` | `2026` | First copyright year. |
| `params.footer.customText` | empty | Trusted custom footer HTML. |
| `params.dateFormat.published` | `2006-01-02` | Hugo date layout. |
| `params.dateFormat.lastUpdated` | `2006-01-02` | Last-update layout. |
| `params.sidebar.compact` | `false` | Compact site identity. |
| `params.sidebar.avatar` | empty | Global-resource or URL-like avatar reference. |
| `params.sidebar.emoji` | empty | Optional avatar badge. |
| `params.sidebar.subtitle` | empty | Site description; may be language-specific. |
| `params.sidebar.introduction` | empty | Desktop-only escaped plain-text site introduction; may be language-specific. |
| `params.article.headingAnchor` | `false` | Show heading anchors. |
| `params.article.toc` | `true` | Enable table of contents. |
| `params.article.readingTime` | `true` | Show reading time. |
| `params.article.list.showTags` | `false` | Show tags on list cards. |
| `params.article.license.enabled` | `false` | Show an article license notice. |
| `params.article.license.default` | CC BY-NC-SA text | Default notice text. |
| `params.colorScheme.toggle` | `true` | Show the light/dark switch. |
| `params.colorScheme.default` | `auto` | `light`, `dark`, or `auto`. |
| `params.imageProcessing.autoOrient` | `false` | Apply EXIF orientation during processing. |
| `params.imageProcessing.content.enabled` | `true` | Generate responsive content images. |
| `params.imageProcessing.content.widths` | `480,800,1200,1600` | Content `srcset` candidates; never upscaled. |
| `params.imageProcessing.thumbnail.enabled` | `true` | Generate responsive covers. |
| `params.imageProcessing.thumbnail.widths` | `360,720,1080` | Cover `srcset` candidates; never upscaled. |
| `params.comments.enabled` | `false` | Render the empty comment extension hook. |
| `params.analytics.enabled` | `false` | Render the empty analytics extension hook. |

`params.widgets.homepage` and `params.widgets.page` are arrays. Included widget types are `search`, `categories`, `tag-cloud`, `archives`, and `toc`. Example:

```toml
[params.widgets]
homepage = [
  { type = "search" },
  { type = "categories", params = { limit = 10 } },
  { type = "tag-cloud", params = { limit = 10 } },
  { type = "archives", params = { limit = 5 } }
]
page = [
  { type = "categories", params = { limit = 10 } },
  { type = "tag-cloud", params = { limit = 10 } },
  { type = "toc" }
]
```

On desktop main-section article pages, local search is pinned before this configurable array and duplicate `search` entries are ignored. The search field remains the target of `Ctrl+K` on Windows/Linux and `Command+K` on macOS.

Hugo merges project configuration before theme defaults. When a site defines `params.widgets.homepage` or `params.widgets.page`, that array replaces the theme array rather than extending it. LuxTHE-based sites should remove their old page array or follow [the migration guide](migrating-from-luxrex.md).

## Leaf bundles and images

Put each post in `content/posts/<slug>/index.md`. Keep its cover beside the Markdown, article images under `images/`, and downloads under `files/`. Raster page resources receive responsive variants. SVG and GIF resources pass through unchanged.

The first homepage cover is eager/high-priority; later cards and article images are lazy. Set `image = "cover.webp"`, or omit it to use automatic cover discovery.

## Search

Create translated search pages with `layout = "search"` and HTML/JSON outputs. FlexSearch 0.7.31 is included under `assets/js/vendor`; no remote request is made. Each language receives a separate relative-URL index containing title, limited plain text, categories and tags. Hugo's Unicode-aware `strings.Truncate` limits excerpts to 1200 characters, not 1200 UTF-8 bytes.

## Favicons

Place favicon files in the site's `static` directory and configure their paths without a leading domain:

```toml
[params]
faviconSVG = "favicon.svg"
faviconPNG = "favicon.png"
appleTouchIcon = "apple-touch-icon.png"
webmanifest = "site.webmanifest"
```

Luxthe generates subpath-safe URLs for these files. Local files under the site's or theme's `assets` directory are also resolved through Hugo resources. When any structured icon setting is present, it takes precedence over the legacy `params.favicon` value.

## Overrides and integrations

Site files override theme files at the same path. Use `assets/scss/custom.scss` for CSS and the `head/custom.html` or `footer/custom.html` partials for additional markup. To add comments or analytics, override the matching `extensions/*.html` partial and enable its parameter. Audit privacy, consent and CSP requirements yourself; Luxthe deliberately ships no provider adapters.
