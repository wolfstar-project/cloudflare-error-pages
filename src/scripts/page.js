/*
 * Runs once the page is parsed. The page reads correctly without it; this
 * script only brings it closer to the visitor:
 *
 * 1. Shows the language the visitor chose on WolfStar.rocks. The site does not
 *    read the browser's language, so this page does not either.
 * 2. Removes a Cloudflare detail whose token was never filled in, such as in a
 *    local preview, so a raw `::TOKEN::` never reaches a visitor.
 * 3. On a page that answers a whole class of codes, shows this response's code.
 */
(function () {
  var root = document.documentElement;
  var data = JSON.parse(document.getElementById("page-data").textContent);

  var storedLocale = function () {
    try {
      var settings = JSON.parse(localStorage.getItem("wolfstar-settings") || "null");
      if (settings && settings.selectedLocale) {
        return settings.selectedLocale;
      }
    } catch (error) {}
    var cookie = /(?:^|;\s*)wolfstar-locale=([^;]*)/.exec(document.cookie);
    return cookie ? decodeURIComponent(cookie[1]) : null;
  };

  var locale = storedLocale();
  if (!Object.prototype.hasOwnProperty.call(data.messages, locale)) {
    locale = data.defaultLocale;
  }
  var strings = data.messages[locale];
  root.setAttribute("lang", locale);

  var format = function (key) {
    return strings[key].replace("{year}", String(new Date().getFullYear()));
  };

  var i;
  var nodes = document.querySelectorAll("[data-i18n]");
  for (i = 0; i < nodes.length; i++) {
    nodes[i].textContent = format(nodes[i].getAttribute("data-i18n"));
  }
  nodes = document.querySelectorAll("[data-i18n-label]");
  for (i = 0; i < nodes.length; i++) {
    nodes[i].setAttribute("aria-label", format(nodes[i].getAttribute("data-i18n-label")));
  }

  nodes = document.querySelectorAll("[data-cloudflare]");
  for (i = 0; i < nodes.length; i++) {
    if (/::[A-Z0-9_]+::/.test(nodes[i].textContent)) {
      nodes[i].parentNode.removeChild(nodes[i]);
    }
  }

  var status = document.getElementById("error-status");
  var statusClass = status.getAttribute("data-status-class");
  if (statusClass) {
    // "5xx" takes a three-digit code, "1xxx" a four-digit one.
    var digits = status.textContent.length;
    var fits = function (value) {
      return String(value).length === digits && String(value).charAt(0) === statusClass;
    };
    var code = 0;
    try {
      var navigation = performance.getEntriesByType("navigation")[0];
      code = (navigation && navigation.responseStatus) || 0;
    } catch (error) {}
    var detail = document.getElementById("cloudflare-detail");
    if (!fits(code) && detail) {
      var pattern = statusClass + "\\d{" + (digits - 1) + "}";
      var match =
        new RegExp("cf-error-(" + pattern + ")\\b").exec(detail.innerHTML) ||
        new RegExp("\\b(" + pattern + ")\\b").exec(detail.textContent);
      code = match ? match[1] : 0;
    }
    if (fits(code)) {
      status.textContent = String(code);
    }
  }

  document.title =
    status.textContent +
    " · " +
    document.getElementById("error-page-title").textContent +
    " · WolfStar";
})();
