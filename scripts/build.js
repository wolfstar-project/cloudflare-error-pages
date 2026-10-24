/**
 * Builds one self-contained HTML file per page, written as
 * `<directory>/index.html` at the repository root where the pages are served
 * from, then checks each against what Cloudflare accepts. A failed check fails
 * the build.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/postcss";
import { getIconData, iconToHTML, iconToSVG } from "@iconify/utils";
import postcss from "postcss";
import { DEFAULT_LOCALE, messages } from "../src/messages.js";
import { PAGES, STATES } from "../src/pages.js";
import { renderPage } from "../src/template.js";

/** Cloudflare refuses a custom error page over 1.5 MB. */
const MAX_PAGE_BYTES = 1_500_000;

const root = new URL("../", import.meta.url);
const fromRoot = (path) => new URL(path, root);

async function buildCss() {
  const path = fileURLToPath(fromRoot("src/styles.css"));
  const result = await postcss([tailwindcss({ optimize: { minify: true } })]).process(
    await readFile(path, "utf8"),
    { from: path },
  );
  return result.css;
}

/**
 * Geist, as the site loads it: weights 400 to 700. The variable latin subset
 * covers English and Italian and keeps every page small.
 */
async function buildFontFace() {
  const css = await readFile(
    new URL(import.meta.resolve("@fontsource-variable/geist/index.css")),
    "utf8",
  );
  const unicodeRange = /unicode-range:\s*([^;]+);/.exec(
    css.split("/* geist-latin-wght-normal */")[1] ?? "",
  )?.[1];
  if (!unicodeRange) {
    throw new Error("Could not read the latin unicode-range from @fontsource-variable/geist.");
  }
  const woff2 = await readFile(
    new URL(import.meta.resolve("@fontsource-variable/geist/files/geist-latin-wght-normal.woff2")),
  );
  return `@font-face{font-family:"Geist";font-style:normal;font-display:swap;font-weight:400 700;src:url(data:font/woff2;base64,${woff2.toString("base64")}) format("woff2");unicode-range:${unicodeRange}}`;
}

async function loadIcons() {
  const sets = {};
  for (const prefix of ["ph", "simple-icons"]) {
    const path = new URL(import.meta.resolve(`@iconify-json/${prefix}/icons.json`));
    sets[prefix] = JSON.parse(await readFile(path, "utf8"));
  }
  return (name, className) => {
    const [prefix, iconName] = name.split(":");
    const data = getIconData(sets[prefix], iconName);
    if (!data) {
      throw new Error(`Unknown icon ${name}`);
    }
    const { attributes, body } = iconToSVG(data);
    return iconToHTML(body, {
      "aria-hidden": "true",
      class: className,
      fill: "currentColor",
      focusable: "false",
      viewBox: attributes.viewBox,
    });
  };
}

async function loadLogo() {
  const svg = (await readFile(fromRoot("src/assets/logo-mark.svg"), "utf8"))
    .replace(/\s+(width|height)="\d+"/g, "")
    .replace(/\s+/g, " ")
    .replace(/ ?(\/?>) ?/g, "$1")
    .trim();
  return (className) => svg.replace("<svg", `<svg class="${className}"`);
}

async function loadFavicons() {
  return Promise.all(
    ["32x32", "16x16"].map(async (sizes) => {
      const icon = await readFile(fromRoot(`src/assets/favicon-${sizes}.png`));
      return { href: `data:image/x-icon;base64,${icon.toString("base64")}`, sizes };
    }),
  );
}

/** Drops comments and indentation. Cloudflare minifies the stored page again. */
async function loadScript(name) {
  const source = await readFile(fromRoot(`src/scripts/${name}.js`), "utf8");
  return source
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .join("\n");
}

function translator(locale, year) {
  return (key) => {
    const value = messages[locale][key];
    if (value === undefined) {
      throw new Error(`Missing string ${key} for ${locale}`);
    }
    return value.replace("{name}", "WolfStar").replace("{year}", String(year));
  };
}

/** The strings a page swaps in when the visitor chose another language. */
function pageMessages(html) {
  const keys = new Set(
    [...html.matchAll(/data-i18n(?:-label)?="([^"]+)"/g)].map((match) => match[1]),
  );
  return Object.fromEntries(
    Object.keys(messages).map((locale) => [
      locale,
      Object.fromEntries(
        [...keys].sort().map((key) => {
          const value = messages[locale][key];
          if (value === undefined) {
            throw new Error(`Missing string ${key} for ${locale}`);
          }
          return [key, value.replace("{name}", "WolfStar")];
        }),
      ),
    ]),
  );
}

function check(page, html) {
  const problems = [];
  const bytes = Buffer.byteLength(html);
  if (bytes > MAX_PAGE_BYTES) {
    problems.push(`is ${bytes} bytes, over Cloudflare's ${MAX_PAGE_BYTES}`);
  }
  if (!html.includes("<head>") || !html.includes("</head>")) {
    problems.push("needs <head> and </head>, which Cloudflare requires");
  }
  if (/<meta[^>]+name="referrer"/i.test(html)) {
    problems.push("has a referrer meta tag, which breaks Cloudflare challenges");
  }
  // `url(#id)` and its encoded `url(%23id)` point inside an inlined SVG.
  if (
    /<(?:script|img|link|iframe)[^>]+(?:src|href)="(?:https?:)?\/\//i.test(html) ||
    /url\(\s*(?!["']?(?:data:|#|%23))/i.test(html)
  ) {
    problems.push("loads an external resource; inline it instead");
  }
  if (/\{(?:name|year)\}/.test(html.split('<script type="application/json"')[0])) {
    problems.push("shows an unfilled {placeholder}");
  }
  if (page.detail && page.detail !== "ray" && html.split(page.detail).length !== 2) {
    problems.push(`must contain ${page.detail} exactly once`);
  }
  return { bytes, problems };
}

const year = new Date().getFullYear();
const [css, fontFace, icon, logo, favicons, theme, script] = await Promise.all([
  buildCss(),
  buildFontFace(),
  loadIcons(),
  loadLogo(),
  loadFavicons(),
  loadScript("theme"),
  loadScript("page"),
]);

let failed = false;
for (const page of PAGES) {
  const render = (pageData) =>
    renderPage({
      assets: { css: fontFace + css, favicons, pageData, scripts: { page: script, theme } },
      icon,
      logo,
      page,
      state: STATES[page.state],
      t: translator(DEFAULT_LOCALE, year),
    });
  const html = render({
    defaultLocale: DEFAULT_LOCALE,
    messages: pageMessages(render({ defaultLocale: DEFAULT_LOCALE, messages: {} })),
  });

  const { bytes, problems } = check(page, html);
  const file = `${page.directory}/index.html`;
  await mkdir(fromRoot(`${page.directory}/`), { recursive: true });
  await writeFile(fromRoot(file), html);
  console.log(
    `${problems.length ? "✗" : "✓"} ${file.padEnd(30)} ${(bytes / 1024).toFixed(1).padStart(6)} KB`,
  );
  for (const problem of problems) {
    console.error(`  ${file} ${problem}`);
  }
  failed ||= problems.length > 0;
}

if (failed) {
  process.exitCode = 1;
}
