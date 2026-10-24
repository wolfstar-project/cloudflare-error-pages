/**
 * The pages, and the three states of WolfStar.rocks' `ErrorPage.vue` they are
 * drawn from: not found (404), server error (5xx), and any other status.
 *
 * Class lists are the ones Nuxt UI resolves on the site, written out in full
 * so Tailwind finds them here. DaisyUI's `badge-<color>` classes are left out:
 * the site builds them from a template string Tailwind cannot see, so they are
 * never generated there and the badge border stays `--color-base-200`.
 */

const BADGE =
  "badge font-medium inline-flex items-center text-base badge-xl gap-1.5 ring ring-inset p-1 size-16 sm:size-20 rounded-full justify-center";

export const STATES = {
  notFound: {
    badge: `${BADGE} bg-primary/10 text-primary ring-primary/25`,
    icon: "ph:compass",
    retry: false,
  },
  serverError: {
    badge: `${BADGE} bg-error/10 text-error ring-error/25`,
    icon: "ph:warning-diamond",
    retry: true,
  },
  other: {
    badge: `${BADGE} bg-warning/10 text-warning ring-warning/25`,
    icon: "ph:warning-circle",
    retry: true,
  },
};

/**
 * `directory` is where the page is written, as `<directory>/index.html`. The
 * names are the ones this repository has always served its pages under.
 *
 * `status` is what the page shows before its script runs. A page with a
 * `statusClass` serves a whole class of codes ("5xx", "1xxx"), so its script
 * replaces the status with the code it is answering: the response's status,
 * or the code in Cloudflare's detail. Cloudflare sends its 1xxx errors with
 * another HTTP status, so for those only the detail can tell.
 *
 * `detail` is what Cloudflare fills in under the description, as the site's
 * error page calls that slot: `ray` for the Ray ID, or the error token a
 * Cloudflare error page type requires.
 */
export const PAGES = [
  {
    description: "errors.generic_description",
    detail: "ray",
    directory: "unauthorized",
    state: "other",
    status: "401",
    title: "errors.access_denied",
  },
  {
    description: "errors.generic_description",
    detail: "ray",
    directory: "direct_ip",
    state: "other",
    status: "421",
    title: "errors.generic_title",
  },
  {
    description: "errors.not_found_description",
    detail: null,
    directory: "not_found",
    state: "notFound",
    status: "404",
    title: "errors.not_found_title",
  },
  {
    description: "errors.generic_description",
    detail: "ray",
    directory: "forbidden",
    state: "other",
    status: "403",
    title: "errors.access_denied",
  },
  {
    description: "errors.too_many_requests_description",
    detail: "ray",
    directory: "too_many_requests",
    state: "other",
    status: "429",
    title: "errors.too_many_requests",
  },
  {
    description: "errors.generic_description",
    detail: "::CLOUDFLARE_ERROR_1000S_BOX::",
    directory: "cloudflare_errors",
    state: "other",
    status: "1xxx",
    statusClass: 1,
    title: "errors.generic_title",
  },
  {
    description: "errors.server_error",
    detail: "::CLOUDFLARE_ERROR_500S_BOX::",
    directory: "borked",
    state: "serverError",
    status: "5xx",
    statusClass: 5,
    title: "errors.server_error_title",
  },
  {
    description: "errors.server_error",
    detail: "ray",
    directory: "bad_gateway",
    state: "serverError",
    status: "502",
    title: "errors.server_error_title",
  },
  {
    description: "errors.server_error",
    detail: "ray",
    directory: "service_unavailable",
    state: "serverError",
    status: "503",
    title: "errors.server_error_title",
  },
];
