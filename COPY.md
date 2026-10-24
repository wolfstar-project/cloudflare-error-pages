---
scope: every string the error pages show, including the page title, the meta description, and accessible names
owns: the words. VISION.md owns what may be claimed, GLOSSARY.md owns what a concept is called, and WolfStar.rocks' COPY.md owns the voice these strings come from
---

# Copy

These pages speak with WolfStar.rocks' voice because they reuse its strings. The source of truth is the site's
[COPY.md](https://github.com/wolfstar-project/wolfstar.rocks/blob/main/COPY.md) and its en-US and it-IT locale
files. `src/messages.js` holds exact copies under the site's keys. Change a string on the site first, then copy it
here. A string that exists only in this repository is a bug.

## Canonical assets

These exact strings. Do not paraphrase them per page. Which page uses which key is in `src/pages.js`.

| Asset                  | String                                                                                              | Where it goes                                 |
| ---------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| Names                  | `WolfStar`, `WolfStar.rocks`, `WolfStar Project`. Never Wolfstar, wolfStar, Wolf Star               | everywhere                                    |
| Home action            | Back to home · Torna alla home (`errors.back_to_home`)                                              | every page                                    |
| Retry action           | Try Again · Riprova (`common.retry`)                                                                | every page but 404                            |
| Generic description    | Something didn't go as planned. You can try again or head back home. (`errors.generic_description`) | forbidden, unauthorized, cloudflare_errors    |
| Server error title     | Server Error · Errore del server (`errors.server_error_title`)                                      | borked, bad_gateway, service_unavailable      |
| Server error text      | Something went wrong on our end. Please try again later. (`errors.server_error`)                    | borked, bad_gateway, service_unavailable      |
| Page title             | `{code} · {title} · WolfStar`, as the site formats it                                               | the `<title>` of every page                   |
| Copyright              | WolfStar Project — Copyright © {year}. All rights reserved. (`footer.copyright`)                    | every footer                                  |
| Repository description | The error pages Cloudflare serves for WolfStar.rocks, built to match the site's own error page.     | `package.json` description, `README.md` intro |

## Register by context

| Context           | Register                                          | Example                                                                                                |
| ----------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Error title       | A short noun phrase                               | "Page not found"                                                                                       |
| Error description | Calm: what happened, then what the visitor can do | "The page you are looking for doesn't exist or may have been moved. Check the link or head back home." |
| Buttons           | A verb and where it leads                         | "Back to home"                                                                                         |
| Accessible names  | Name the destination, and say it opens a new tab  | "Join the WolfStar Discord - opens in new tab"                                                         |
| Detail            | Cloudflare's own words, untranslated              | "Ray ID: ::RAY_ID::"                                                                                   |

## Copy principles

1. **Borrowed, never written.** Every sentence comes from the site. A description written for this repository fails,
   even when it reads better. Propose it on the site instead.
2. **Calm.** No apology, no alarm, no exclamation marks. "Oops! Page not found" fails. "Page not found" passes.
3. **Only what is known.** A static page cannot know the cause of an error or when it ends. "Our engineers are
   already working on it" fails.
4. **The visitor's language, not the browser's.** A page shows the language the visitor chose on the site, as the
   site does. Picking a language from the browser's settings fails.

## Banned language

Words that `GLOSSARY.md` lists as `Never` for a term are banned too. The site's ban list applies in full.

| Never                                                    | Use instead                    | Why                                                                             |
| -------------------------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------- |
| Oops, Whoops, Uh oh, "We're so sorry"                    | what happened, then what to do | The site bans apologetic theatre. The voice stays calm                          |
| exclamation marks                                        | a full stop                    | A moderation tool does not shout at the person using it                         |
| "We're working on it", "We're aware", a time to recovery | nothing                        | A static page cannot know it, so nobody can check it (`VISION.md`, principle 4) |
| "Bad Gateway", "Service Unavailable" as a page title     | "Server Error"                 | The site gives every 5xx status one title. The status code says which           |
| "Back", "Indietro" for the browser's history             | "Back to home"                 | History can lead back to the same error. The site sends visitors home           |

## Open questions

Wording calls this file does not settle. Each one is settled on the site first, then copied here.

1. **Title casing.** The site writes "Server Error", "Access Denied" and "Try Again" in title case, and "Page not
   found" and "Unexpected error" in sentence case. Its COPY.md does not settle it, so these pages copy both as
   shipped.
2. **The 403 description.** The 403 page uses `errors.generic_description`, as the site's error page does for a 403. `errors.access_denied_description` is more specific in English, but its Italian text says "questi server",
   which belongs to the dashboard. Fix that string on the site, then decide whether the 403 page switches to it.
3. **"Try Again" has no object.** The site's button rule asks for a verb and an object, and "Try Again" ships on
   its error page anyway. Decide on the site whether the error page keeps that exception.
