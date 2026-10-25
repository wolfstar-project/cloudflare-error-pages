# WolfStar.rocks error pages

The error pages Cloudflare serves for WolfStar.rocks, built to match the site's own error page.

## Why WolfStar.rocks error pages

Some errors never reach WolfStar.rocks. When Cloudflare blocks a request, limits its rate, or cannot reach the
origin, it answers with a page of its own, in Cloudflare's design. A visitor who was on WolfStar.rocks a second
earlier lands somewhere that does not look like the site.

The site already has an error page, so these files copy it instead of designing another one. Pages written by
hand drift: an earlier version of this repository had its own layout and its own copy. Here the strings, theme
values, and markup come from WolfStar.rocks as it ships, and every page is a single file that Cloudflare can store
and serve while the origin is down.

## Features

- 🪞 **The site's own error page:** the layout, Nuxt UI classes, daisyUI themes, Geist font, and Phosphor icons
  come from WolfStar.rocks, so an error from Cloudflare looks like an error from the site.
- 🌗 **The visitor's theme and language:** a page applies the theme and language chosen on the site (light, dark,
  or midnight; English or Italian). Without a choice it follows the system theme and shows English.
- 🔢 **The real status code:** `borked` and `cloudflare_errors` each serve a whole Cloudflare error class and show the
  code of the current error, such as 522 or 1016.
- 📦 **One file per page:** about 115 KB each, with everything inline, so nothing loads from an origin that may be
  down.
- ✅ **Checked before upload:** the build fails when a page goes over Cloudflare's 1.5 MB limit, misses a required
  error token, loads an outside resource, or carries a referrer meta tag.

## Setup

Requirements: Node.js 24 or later, and pnpm.

From the repository root:

```bash
pnpm install
pnpm build
```

`pnpm build` writes each page to `<directory>/index.html` at the repository root and prints a line for each:

```text
✓ unauthorized/index.html         115.9 KB
✓ direct_ip/index.html            115.9 KB
✓ not_found/index.html            114.8 KB
✓ forbidden/index.html            115.9 KB
✓ challenge/index.html            115.8 KB
✓ too_many_requests/index.html    116.0 KB
✓ cloudflare_errors/index.html    115.9 KB
✓ borked/index.html               115.9 KB
✓ bad_gateway/index.html          116.0 KB
✓ service_unavailable/index.html  116.0 KB
```

A `✗` line names the Cloudflare check that failed, and the command exits with an error. `pnpm dev` rebuilds
whenever a file in `src/` or `scripts/` changes. The pages are committed, so a pull request shows how each one
changes.

To preview, run `pnpm preview` and open a directory such as `http://localhost:3000/not_found/`. Cloudflare fills
the error tokens only when it serves a page, so a local copy hides them, and `borked` and `cloudflare_errors`
show "5xx" and "1xxx" instead of a code.

## Pages and where they go

| Directory             | Cloudflare setting                                                                                            | Status code shown       | Cloudflare fills in                                         |
| --------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------- | ----------------------------------------------------------- |
| `unauthorized`        | A custom error rule for 401 responses                                                                         | 401                     | the Ray ID                                                  |
| `forbidden`           | Error Pages: "WAF block" and "IP/Country block"                                                               | 403                     | the Ray ID                                                  |
| `challenge`           | Error Pages: "Interactive challenge", "IP/Country challenge", and "Managed challenge / I'm Under Attack Mode" | 403                     | the challenge, through `::CAPTCHA_BOX::`                    |
| `not_found`           | A custom error rule for origin 404 responses                                                                  | 404                     | nothing                                                     |
| `direct_ip`           | A custom error rule for direct-IP traffic                                                                     | 421                     | the Ray ID                                                  |
| `too_many_requests`   | Error Pages: "Rate limiting block"                                                                            | 429                     | the Ray ID                                                  |
| `cloudflare_errors`   | Error Pages: "1000 class errors"                                                                              | the error's 1xxx code   | its error details, through `::CLOUDFLARE_ERROR_1000S_BOX::` |
| `borked`              | Error Pages: "500 class errors"                                                                               | the response's 5xx code | its error details, through `::CLOUDFLARE_ERROR_500S_BOX::`  |
| `bad_gateway`         | A custom error rule for origin 502 responses                                                                  | 502                     | the Ray ID                                                  |
| `service_unavailable` | A custom error rule for origin 503 responses                                                                  | 503                     | the Ray ID                                                  |

The directory names are the ones this repository has always served its pages under, so existing Cloudflare assets
keep their URLs.

Error Pages and custom error rules need a Pro plan or higher
([Cloudflare's custom errors](https://developers.cloudflare.com/rules/custom-errors/)). Error Pages do not replace
origin 500, 501, 503, or 505 responses; custom error rules can. Cloudflare sends 1000 class errors with another
HTTP status, so `cloudflare_errors` reads the 1xxx code from Cloudflare's details.

Use `challenge/index.html` for the challenge types that require `::CAPTCHA_BOX::`, not `forbidden/index.html`:
the latter is for blocks and has no challenge token. Cloudflare replaces the token with its challenge before
serving the page. The build requires it exactly once, and local previews hide the unfilled token. Non-interactive
challenges require `::IM_UNDER_ATTACK_BOX::` and still use Cloudflare's own page. See
[Cloudflare's required error tokens](https://developers.cloudflare.com/rules/custom-errors/reference/error-tokens/).

## Publish to Cloudflare

Cloudflare fetches each page once from a public URL, inlines its resources, and stores it. The URL can go offline
afterwards.

1. Run `pnpm build`, commit the pages, and publish the repository so each `<directory>/index.html` is reachable
   over HTTPS and returns `200 OK`.
2. For Error Pages on a zone, open **Error Pages**, select the three dots > **Edit** next to the error page type,
   select **Custom page**, enter the page's URL, and select **Confirm**. For the whole account, start from
   **Configurations** > **Error Pages**.
3. For a custom error rule, create a custom error asset from the page's URL (**Rules** > **Settings** > **Custom
   Error Assets**). Then, on the Rules **Overview** page, select **Create rule** > **Custom Error Rule**, match an
   expression such as `http.response.code eq 404`, choose **Custom error asset**, pick the asset, set the response
   code, and select **Deploy**.
4. After every change, rebuild and publish again. Then select the three dots > **Fetch custom page again** next to
   each error page type, and refetch each custom error asset.

## How the pages follow the site

- `src/messages.js` holds the site's en-US and it-IT strings under their i18n keys. [COPY.md](COPY.md) explains how
  to change them.
- `src/styles.css` rebuilds the part of the site's `app/assets/css/main.css` that the error page reads, with the
  site's Tailwind CSS (4.3.3) and daisyUI (5.7.16) versions.
- `src/template.js` holds the site's default layout and error page markup, with the classes Nuxt UI resolves there.
- `src/scripts/` reads the theme and language the visitor chose, from the same storage the site writes.

Where the site renders differently from its own source, these pages copy what visitors see:

1. The site's error page passes its status code classes as `ui.status`, but Nuxt UI 4.12 names that slot
   `statusCode`. The large gradient status code never renders: the site shows a small status line above the
   title, and so do these pages.
2. In the site's compiled CSS, daisyUI's built-in light theme outranks the light theme declared in `main.css`.
   Visitors see daisyUI's light values, so `src/styles.css` leaves the site's light theme block out.
3. The site builds daisyUI's `badge-<color>` classes from a template string that Tailwind cannot read, so they are
   never generated. These pages leave them out as well.
4. The header's scoped styles never reach the header element, so the header is 64 px tall and translucent, as
   Nuxt UI draws it.

When the site fixes one of these, change the matching part here. [VISION.md](VISION.md) explains why the site
leads.

## Formatting

```bash
pnpm format
pnpm format:check
```

The formatter skips the generated pages and `src/assets/`.

## Repository docs

- [VISION.md](VISION.md): what these pages may do and claim.
- [COPY.md](COPY.md): the words, and where they come from.
- [GLOSSARY.md](GLOSSARY.md): what each concept is called.
- [AGENTS.md](AGENTS.md): the rules a coding agent needs before it changes anything here.

## License

These error pages are licensed under the GPL-3.0 license. The full text is in the `LICENSE` file.
