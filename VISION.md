---
scope: the error pages Cloudflare serves for WolfStar.rocks, and the build that makes them
owns: what these pages may do and claim. WolfStar.rocks' own VISION.md owns the product. COPY.md owns the words, GLOSSARY.md owns the names
---

# Vision

What these pages are for, and what they refuse to become. The product rules live in
[WolfStar.rocks' VISION.md](https://github.com/wolfstar-project/wolfstar.rocks/blob/main/VISION.md). This file
narrows them for the moments when Cloudflare answers instead of the site. It exists to reject ideas. A section
that cannot reject anything real is wallpaper, so cut it.

---

## Mission

**The site's own error page, even when the site cannot answer.** Cloudflare answers for WolfStar.rocks when it
blocks a request, limits its rate, or cannot reach the origin. In those moments the visitor still sees
WolfStar.rocks: the same error page, the same words in the language they chose, the same theme, and the same
ways back.

**What it is.** A build that copies the site's error page into single files that Cloudflare stores and serves.

**What it is not.** A status page, a second design for the site, or a place to say anything the site does not say.

---

## Who it is for

**Primary: a visitor who meets an error Cloudflare serves.** They want to know what happened, in calm words, and
what they can do next: try again, go home, or ask in the support server.

**Secondary: the maintainer who publishes the pages.** They want one command that builds pages Cloudflare
accepts, and a clear map of which page goes into which Cloudflare setting.

**Who it is not for.** Anyone looking for uptime, incident updates, or a time to recovery. A static page cannot
know them.

---

## Principles

### 1. The site is the source

Every string, class, icon, and theme value comes from WolfStar.rocks as it ships. A change starts on the site and
is then copied here. Where the site renders differently from its own source code, these pages match what visitors
see, and the README records the difference.

**Test:** can every visible string, class, and color on a page be traced to the shipped site? If not, fail.

### 2. One question, the site's way out

Each page answers one question: what happened to this request. It offers only the actions the site's error page
offers: "Back to home" for a missing page, "Try Again" and "Back to home" for everything else.

**Test:** does the page add an action, a link, or a section the site's error page does not have? If yes, fail.

### 3. Works when nothing else does

A page is one file. Fonts, icons, styles, and scripts are inline, because the origin may be the thing that is
down. Without JavaScript the page still reads correctly, in English and in the visitor's system theme.

**Test:** does a page request anything over the network, or read wrong with JavaScript off? If yes, fail.

### 4. Say only what Cloudflare reports

A page shows what is known about the request it answers: the status code, the Ray ID, and Cloudflare's own
details. It never guesses a cause, promises a fix, or says that someone is already working on it.

**Test:** can a reviewer point to where each fact on the page comes from? If not, fail.

### 5. Calm and accessible

The site's rules hold here too: a skip link, a keyboard path to every action, reduced motion, readable themes, and
a voice that stays calm in errors. The words come from `COPY.md`.

**Test:** can a visitor reach every action by keyboard alone, with reduced motion on? If not, fail.

---

## Anti-scope

1. **Not a status page.** No uptime figures, incident text, or countdowns.
2. **No tracking.** No analytics, pixels, or third-party scripts on a page that exists because something failed.
3. **No promotion.** No invite buttons, donation prompts, or announcements. The site's error page has none.
4. **No second design.** No styles, components, or words the site does not have.

---

## How this filter gets used

- **Changes:** a pull request that changes a page names the site change it copies, or the principle it serves.
- **Review:** hold the change against each principle and record PASS or FAIL. Citing one principle never waives
  another.
- **Disagreement:** when this file and the code conflict, this file wins. Change the code, or change this file on
  purpose.

## When to update this doc

Edit freely. The commitments: at most five principles, each able to reject a real change, and WolfStar.rocks'
VISION.md stays the parent. A principle that contradicts the parent is wrong here, not there.
