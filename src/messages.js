/**
 * Every string the pages show, copied verbatim from WolfStar.rocks
 * (`i18n/locales/{en-US,it-IT}/{common,errors}.json`). Keys keep the site's
 * paths so a string can be found and compared there. Change a string on the
 * site first, then copy it here: COPY.md explains why.
 *
 * `{name}` is filled at build time. `{year}` is filled at build time and again
 * in the browser, because Cloudflare keeps a page until it is fetched again.
 */
export const DEFAULT_LOCALE = "en-US";

export const messages = {
  "en-US": {
    "a11y.main_content": "Main content",
    "a11y.skip_to_content": "Skip to main content",
    "common.error": "Error",
    "common.retry": "Try Again",
    "errors.access_denied": "Access Denied",
    "errors.back_to_home": "Back to home",
    "errors.generic_description":
      "Something didn't go as planned. You can try again or head back home.",
    "errors.generic_title": "Unexpected error",
    "errors.not_found_description":
      "The page you are looking for doesn't exist or may have been moved. Check the link or head back home.",
    "errors.not_found_title": "Page not found",
    "errors.server_error_title": "Server Error",
    "errors.server_error": "Something went wrong on our end. Please try again later.",
    "errors.too_many_requests_description":
      "You've made too many requests. Please wait a moment before trying again.",
    "errors.too_many_requests": "Too Many Requests",
    "footer.copyright": "WolfStar Project — Copyright © {year}. All rights reserved.",
    "footer.discord_aria": "Join the WolfStar Discord - opens in new tab",
    "footer.github_aria": "Visit WolfStar on GitHub - opens in new tab",
    "footer.site_footer": "Site footer",
    "footer.social_links": "Social links",
    "footer.x_aria": "Follow WolfStar on X - opens in new tab",
    "header.home": "{name} home",
    "header.site_header": "Site header",
  },
  "it-IT": {
    "a11y.main_content": "Contenuto principale",
    "a11y.skip_to_content": "Vai al contenuto principale",
    "common.error": "Errore",
    "common.retry": "Riprova",
    "errors.access_denied": "Accesso negato",
    "errors.back_to_home": "Torna alla home",
    "errors.generic_description":
      "Qualcosa non è andato come previsto. Puoi riprovare o tornare alla home.",
    "errors.generic_title": "Errore imprevisto",
    "errors.not_found_description":
      "La pagina che stai cercando non esiste o potrebbe essere stata spostata. Controlla il link o torna alla home.",
    "errors.not_found_title": "Pagina non trovata",
    "errors.server_error_title": "Errore del server",
    "errors.server_error": "Qualcosa è andato storto dal nostro lato. Riprova più tardi.",
    "errors.too_many_requests_description":
      "Hai effettuato troppe richieste. Attendi un momento e riprova.",
    "errors.too_many_requests": "Troppe richieste",
    "footer.copyright": "WolfStar Project — Copyright © {year}. Tutti i diritti riservati.",
    "footer.discord_aria": "Unisciti al Discord di WolfStar - si apre in una nuova scheda",
    "footer.github_aria": "Visita WolfStar su GitHub - si apre in una nuova scheda",
    "footer.site_footer": "Piè di pagina del sito",
    "footer.social_links": "Link social",
    "footer.x_aria": "Segui WolfStar su X - si apre in una nuova scheda",
    "header.home": "Home di {name}",
    "header.site_header": "Intestazione del sito",
  },
};
