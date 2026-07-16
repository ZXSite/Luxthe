# LuxTHE


- Hugo Extended 0.164.0 or newer
- Simplified Chinese default example plus complete English UI
- Light/dark mode, local FlexSearch, archives, taxonomies, TOC, RSS and real 404 output
- No Node, Hugo Module or network access required during a build

## Install

As a Git submodule:

```bash
git submodule add https://github.com/ZXSite/LuxTHE.git themes/LuxTHE
```

Or copy this repository to `themes/LuxTHE`. Then set:

```toml
theme = "LuxTHE"
```

Copy `exampleSite/hugo.toml` as a starting point, or run the included example:

```bash
hugo server --source exampleSite --themesDir ../.. --theme LuxTHE
```

## Content

Create posts as Hugo leaf bundles:

```text
content/posts/my-post/
├── index.md
├── cover.webp
├── images/
│   └── 01.webp
└── files/
    └── guide.pdf
```

Use bundle-relative Markdown such as `![Diagram](images/01.webp)` and `[Download](files/guide.pdf)`. If front matter omits `image`, LuxTHE tries `cover.avif`, `cover.webp`, `cover.jpg`, `cover.jpeg`, then `cover.png`. `hugo new content posts/my-post/index.md` uses the included archetype.

## Search and languages

Create one translated search page per language with `layout = "search"` and `outputs = ["HTML", "JSON"]`; see `exampleSite/content/search`. Search indexes only `params.mainSections`, runs entirely in the browser from local assets, and supports arrows, Enter, Escape and Ctrl/Cmd+K.

The theme ships `zh-cn` and `en`. Configure both under `[languages]`, as demonstrated by the example site.

## Customize

Override any theme file from the same path in your site. Put additions in:

- `layouts/_partials/head/custom.html`
- `layouts/_partials/footer/custom.html`
- `layouts/_partials/extensions/comments.html`
- `layouts/_partials/extensions/analytics.html`
- `assets/scss/custom.scss`

Comments and analytics are disabled and empty by default. Enabling third-party code changes the zero-external-request guarantee and requires a matching Content Security Policy update.

LuxTHE supports separate SVG, PNG, Apple Touch Icon and web manifest paths through `params.faviconSVG`, `params.faviconPNG`, `params.appleTouchIcon`, and `params.webmanifest`. The older single `params.favicon` setting remains available as a fallback.

See [configuration](docs/configuration.md), [migration from LuxTHE](docs/migrating-from-luxrex.md), [Cloudflare Pages deployment](docs/cloudflare-pages.md), and the [中文说明](README.zh-CN.md).

## License

LuxTHE is licensed under the MIT License. See [LICENSE](LICENSE) for details.

This theme is derived from [Hugo Theme Stack](https://github.com/CaiJimmy/hugo-theme-stack) by Jimmy Cai, also MIT licensed.

Key differences from Stack include:
- Three-column CSS Grid layout
- Chinese-first typography and i18n
- Pill-style category navigation
- Inline contact buttons with dark mode toggle
- FlexSearch-based local search
- Optimized mobile hamburger menu
- Cloudflare Pages deployment support

