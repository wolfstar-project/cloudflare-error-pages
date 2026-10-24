/**
 * One error page: WolfStar.rocks' default layout (header, main, footer) around
 * its `ErrorPage.vue`, with the classes Nuxt UI resolves there written out.
 * Everything a page needs is inlined, because Cloudflare stores the page and
 * serves it when the origin may be unreachable.
 */

const ESCAPES = { '"': "&quot;", "&": "&amp;", "'": "&#39;", "<": "&lt;", ">": "&gt;" };

function escapeHtml(value) {
  return String(value).replace(/["&'<>]/g, (character) => ESCAPES[character]);
}

/** `<script type="application/json">` content, safe against a closing tag. */
function inlineJson(value) {
  return JSON.stringify(value).replaceAll("<", "\\u003c");
}

const SKIP_LINK =
  "sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-content focus:shadow-lg focus:outline focus:outline-2 focus:outline-transparent";

const CONTAINER = "w-full max-w-(--ui-container) sm:px-6 lg:px-8 container mx-auto px-4";

const BUTTON_BASE =
  "rounded-md font-medium inline-flex items-center disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:opacity-75 transition-colors btn px-3 py-2 text-sm gap-2 btn-lg justify-center sm:min-w-45";

const BUTTON_PRIMARY = `${BUTTON_BASE} btn-primary text-inverted bg-primary hover:bg-primary/75 active:bg-primary/75 disabled:bg-primary aria-disabled:bg-primary outline-primary/25 focus-visible:outline-3 btn-glow`;

const BUTTON_OUTLINE = `${BUTTON_BASE} btn-neutral btn-outline ring ring-inset ring-accented text-default bg-default hover:bg-elevated active:bg-elevated disabled:bg-default aria-disabled:bg-default outline-inverted/25 focus-visible:outline-3 focus-visible:ring-inverted disabled:btn-disabled aria-disabled:btn-disabled`;

const BUTTON_SOCIAL =
  "font-medium inline-flex items-center disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:opacity-75 btn btn-neutral text-xs gap-1.5 btn-sm btn-square btn-ghost rounded-[6px] border-transparent text-default outline-inverted/25 focus-visible:outline-3 hover:disabled:bg-transparent dark:hover:disabled:bg-transparent hover:aria-disabled:bg-transparent dark:hover:aria-disabled:bg-transparent p-1.5 disabled:btn-disabled aria-disabled:btn-disabled hover:bg-base-content/10 active:bg-base-content/15 active:scale-[0.97] transition-[background-color,color,transform] duration-150";

/** The site's detail badge: `UBadge` neutral, subtle, md, in a monospace face. */
const DETAIL_BADGE =
  "badge font-medium inline-flex items-center text-xs px-2 gap-1 rounded-md badge-md ring ring-inset ring-accented text-default bg-elevated mt-6 max-w-full h-auto whitespace-normal py-1.5 font-mono";

/** The same look for Cloudflare's box, which brings block markup a badge cannot hold. */
const DETAIL_BOX =
  "cf-detail mt-6 w-full max-w-xl rounded-md ring ring-inset ring-accented bg-elevated text-default px-3 py-2 text-xs font-mono text-start";

const SOCIAL_LINKS = [
  { href: "https://repo.wolfstar.rocks", icon: "simple-icons:github", label: "footer.github_aria" },
  {
    href: "https://join.wolfstar.rocks",
    icon: "simple-icons:discord",
    label: "footer.discord_aria",
  },
  { href: "https://x.com/wolfstarapp", icon: "simple-icons:x", label: "footer.x_aria" },
];

/**
 * @param {object} options
 * @param {import("./pages.js").PAGES[number]} options.page
 * @param {(typeof import("./pages.js").STATES)[keyof typeof import("./pages.js").STATES]} options.state
 * @param {(key: string) => string} options.t The default locale's strings, filled in.
 * @param {(name: string, className: string) => string} options.icon Inline SVG for an Iconify name.
 * @param {(className: string) => string} options.logo The WolfStar wordmark as inline SVG.
 * @param {{ css: string, favicons: { href: string, sizes: string }[], pageData: object, scripts: { page: string, theme: string } }} options.assets
 */
export function renderPage({ assets, icon, logo, page, state, t }) {
  const label = (key) => `aria-label="${escapeHtml(t(key))}" data-i18n-label="${key}"`;
  const text = (key, tag = "span", attributes = "") =>
    `<${tag}${attributes ? ` ${attributes}` : ""} data-i18n="${key}">${escapeHtml(t(key))}</${tag}>`;

  const statusAttributes = page.statusClass ? ` data-status-class="${page.statusClass}"` : "";

  const rayId = `<span class="${DETAIL_BADGE}" data-cloudflare><span class="truncate whitespace-normal break-all">Ray ID: ::RAY_ID::</span></span>`;
  const boxed = page.detail && page.detail !== "ray";

  const home = (className) =>
    `<a href="/" class="${className}">${icon("ph:house-fill", "shrink-0 size-5")}${text("errors.back_to_home", "span", 'class="truncate"')}</a>`;
  const links = state.retry
    ? `<a href="" class="${BUTTON_PRIMARY}">${icon("ph:arrow-counter-clockwise-bold", "shrink-0 size-5")}${text("common.retry", "span", 'class="truncate"')}</a>${home(BUTTON_OUTLINE)}`
    : home(BUTTON_PRIMARY);

  const social = SOCIAL_LINKS.map(
    (link) =>
      `<a href="${link.href}" target="_blank" rel="noopener noreferrer" class="${BUTTON_SOCIAL}" ${label(link.label)}>${icon(link.icon, "shrink-0 size-4")}</a>`,
  ).join("");

  return `<!DOCTYPE html>
<html lang="${assets.pageData.defaultLocale}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${escapeHtml(`${page.status} · ${t(page.title)} · WolfStar`)}</title>
<meta name="description" content="${escapeHtml(t(page.description))}">
${assets.favicons.map((favicon) => `<link rel="icon" sizes="${favicon.sizes}" href="${favicon.href}">`).join("\n")}
<script>${assets.scripts.theme}</script>
<style>${assets.css}</style>
</head>
<body>
<div class="app-layout">
<a href="#maincontent" class="${SKIP_LINK}" data-i18n="a11y.skip_to_content">${escapeHtml(t("a11y.skip_to_content"))}</a>
<header class="bg-default/75 backdrop-blur-sm border-b border-default h-(--ui-header-height) sticky top-0 z-50" ${label("header.site_header")}>
<div class="${CONTAINER} flex items-center justify-between gap-3 h-full">
<div class="lg:flex-1 flex items-center gap-1.5">
<a href="/" class="flex items-center gap-2.5" ${label("header.home")}>${logo("h-20 w-45")}</a>
</div>
</div>
</header>
<main id="maincontent" tabindex="-1" class="min-h-[calc(100vh-var(--ui-header-height))] mx-4 flex grow flex-col items-center sm:mx-auto sm:w-5/6 lg:max-w-5xl xl:max-w-7xl focus:outline-none" ${label("a11y.main_content")}>
<section class="flex flex-col items-center justify-center text-center min-h-[calc(100dvh-5rem)] px-4 py-16" aria-labelledby="error-page-title">
<div class="mb-6 flex items-center justify-center">
<span class="${state.badge}" aria-hidden="true">${icon(state.icon, "shrink-0 size-8 sm:size-10")}</span>
</div>
<p class="text-base font-semibold text-primary"><span class="sr-only">${text("common.error")}&nbsp;</span><span id="error-status"${statusAttributes}>${escapeHtml(page.status)}</span></p>
<h1 id="error-page-title" class="mt-4 text-3xl font-bold text-highlighted text-balance sm:text-4xl" data-i18n="${page.title}">${escapeHtml(t(page.title))}</h1>
<p class="mt-4 max-w-xl text-lg text-pretty text-muted">${text(page.description, "span", 'class="block"')}${page.detail === "ray" ? rayId : ""}</p>
${boxed ? `<div id="cloudflare-detail" class="${DETAIL_BOX}" data-cloudflare>${page.detail}</div>` : ""}
<div class="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">${links}</div>
</section>
</main>
<footer class="p-2 bg-base-200" ${label("footer.site_footer")}>
<div class="${CONTAINER} py-8 lg:py-4 lg:flex lg:items-center lg:justify-between lg:gap-x-3">
<div class="lg:flex-1 flex items-center justify-center lg:justify-end gap-x-1.5 lg:order-3">
<nav class="flex items-center gap-1" ${label("footer.social_links")}>${social}</nav>
</div>
<div class="flex items-center justify-center lg:justify-start lg:flex-1 gap-x-1.5 mt-3 lg:mt-0 lg:order-1">
${text("footer.copyright", "p", 'class="text-sm text-base-content/80"')}
</div>
</div>
</footer>
</div>
<script type="application/json" id="page-data">${inlineJson(assets.pageData)}</script>
<script>${assets.scripts.page}</script>
</body>
</html>
`;
}
