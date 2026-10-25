# cloudflare-error-pages

The error pages Cloudflare serves for WolfStar.rocks. A copy, not a design: every page is the site's own error
page, rendered from one template (`src/template.js`) per entry in `src/pages.js` into a single self-contained file.

## Read first

- [`VISION.md`](VISION.md): the product filter. Read before adding a page, an action, or a section.
- [`COPY.md`](COPY.md): the verbal filter. Read before touching any string a visitor sees.
- [`GLOSSARY.md`](GLOSSARY.md): what each concept is called. Read before naming anything.
- [`README.md`](README.md): which page goes into which Cloudflare setting, and the site quirks these pages copy.
- The visual filter is the site's own
  [DESIGN.md](https://github.com/wolfstar-project/wolfstar.rocks/blob/main/.claude/DESIGN.md). This repository has
  none of its own.

## Rules

- **Strings are copied, never written.** Take them from the site's `i18n/locales/{en-US,it-IT}` files into
  `src/messages.js`, under the site's keys and with the site's exact wording. A better sentence goes to the site
  first.
- **Classes are written out in full.** Tailwind scans only `src/template.js` and `src/pages.js`. A class built from
  a template string, such as `` `bg-${color}/10` ``, is never generated.
- **Copy what the site renders, not what its source intends.** The README lists four places where they differ.
  Do not fix them here; when the site fixes one, follow it.
- **Nothing loads from the network.** Fonts, icons, styles, and scripts are inlined at build time, because the
  origin may be down. The build fails on any outside resource.
- **Page scripts are plain ES5 inside a `try`.** They run before the first paint on any browser that hits an error.
- **The language comes from the site's choice, never the browser.** The site does not read the browser's language.
- `borked`, `cloudflare_errors`, and `challenge` must keep their Cloudflare error token exactly once. Cloudflare rejects them without it.

## Traps

- **`<directory>/index.html` is output.** The build rewrites every page. Edit `src/`, never a generated page, and
  commit the rebuilt pages with the change. Their directory names are the URLs Cloudflare fetches, so never rename one.
- **Cloudflare keeps the copy it fetched.** A new build changes nothing on Cloudflare until each page is fetched
  again: the three dots > **Fetch custom page again** for Error Pages, and a refetch for custom error assets.
- **Error tokens are filled only by Cloudflare.** Locally the page script removes them, and the class pages show
  "5xx" and "1xxx". That is not a bug.
- **`node --watch-path` does not run on Linux.** The dev script uses its own watcher for that reason.

## Consumers

- **Cloudflare, for wolfstar.rocks:** the zone or account Error Pages and custom error rules listed in the README.
- **Upstream, [wolfstar-project/wolfstar.rocks](https://github.com/wolfstar-project/wolfstar.rocks):** these pages
  copy its `app/components/ErrorPage.vue`, `app/layouts/default.vue`, `app/assets/css/main.css`, and the strings in its
  `errors.json` and `common.json` locale files. When one of those changes, update this repository to match.
