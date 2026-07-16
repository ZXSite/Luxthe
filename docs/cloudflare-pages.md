# Cloudflare Pages Git deployment

This guide targets Cloudflare Pages connected directly to a Git repository. Commit the Hugo site with Luxthe at `themes/luxthe` (copied or as an initialized submodule).

## Build settings

Use these Pages settings:

```text
Production branch: main
Framework preset: Hugo
Build command: hugo --gc --minify --baseURL "$CF_PAGES_URL" --cacheDir "$PWD/.cache"
Build output directory: public
Root directory: /
```

Set the same environment variable for Production and Preview:

```text
HUGO_VERSION=0.164.0
```

The command uses Cloudflare's deployment URL, so branch previews get correct canonical and asset URLs. If production must advertise a custom-domain canonical URL, use a branch-aware wrapper or a fixed production `--baseURL` while retaining `$CF_PAGES_URL` for previews.

Keep `themes/luxthe` inside the Pages repository checkout. For a Git submodule, make sure the submodule URL is accessible to Cloudflare and the referenced commit is pushed.

## Caching and headers

Copy `exampleSite/static/_headers` to your site's `static/_headers`. Hugo publishes it as `public/_headers`. It gives HTML revalidation semantics, immutable one-year caching to fingerprinted CSS/JS/resource paths, and a basic security headers.

Cloudflare Pages applies `_headers` to static responses. The theme emits fingerprinted CSS and JavaScript with Subresource Integrity. Do not cache HTML as immutable: deployments must be able to replace navigation, canonical URLs and content immediately.

## External integrations

The default theme makes no third-party requests. If you override comments, analytics, embeds, fonts, scripts or styles, update the `Content-Security-Policy` directives in `_headers` for only the required origins. Commonly affected directives are `script-src`, `connect-src`, `frame-src`, `img-src`, and `style-src`. Do not add broad wildcards.

## 404 and previews

Hugo generates `public/404.html`; Pages serves it for unmatched static routes. Test both the production domain and a branch preview after deployment. Also verify the Chinese and English search pages: each must fetch its own relative `index.json`, including when the site is deployed below a path during local or non-Pages testing.

## Local parity check

Run the same optimized build before pushing:

```bash
hugo --gc --minify --baseURL "http://localhost:1313/" --cacheDir "$PWD/.cache"
```

Then serve `public` with any static server and confirm no request leaves the site origin. The repository test scripts additionally exercise root and subpath builds with Hugo warnings treated as errors.
