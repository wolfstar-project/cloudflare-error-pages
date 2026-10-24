/*
 * Runs in <head> before the first paint. The pages are served on the site's
 * own origin, so they can read the theme a visitor picked on WolfStar.rocks.
 * Like @nuxtjs/color-mode there, "system" resolves to light or dark here, so
 * the same theme selectors apply. Plain ES5 in a `try`, like the site's scripts.
 */
(function () {
  try {
    var root = document.documentElement;
    var settings = JSON.parse(localStorage.getItem("wolfstar-settings") || "null") || {};
    var preference = localStorage.getItem("wolfstar-theme") || settings.colorMode || "system";
    var media = window.matchMedia("(prefers-color-scheme: dark)");

    var apply = function () {
      var theme = preference;
      if (theme !== "light" && theme !== "dark" && theme !== "midnight") {
        theme = media.matches ? "dark" : "light";
      }
      root.setAttribute("data-theme", theme);
      root.classList.remove("light", "dark", "midnight");
      root.classList.add(theme);
      if (theme === "dark" && settings.colorMode === "dark" && settings.darkShade === "dark") {
        root.setAttribute("data-shade", "dark");
      } else {
        root.removeAttribute("data-shade");
      }
    };

    apply();
    if (media.addEventListener) {
      media.addEventListener("change", apply);
    }
  } catch (error) {}
})();
