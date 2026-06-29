/**
 * Image helpers.
 *
 * Why this exists:
 *  - The user uploaded a lot of JPEGs to /public. Some are 600KB+ and
 *    most are 200-340KB. That's the biggest payload on the page.
 *  - The build step (scripts/build_images.py) is going to write
 *    sibling .webp copies for any .jpg/.jpeg over a size threshold.
 *    Browsers that support WebP get a ~30-40% smaller file.
 *  - We need a single place to ask for an image URL and get back the
 *    right one for the current browser — but we want zero JS work at
 *    runtime, so this is a build-time/static helper, not a runtime
 *    feature-detect.
 *
 * Usage:
 *    import { webp, base } from "../lib/image.js";
 *    <img src={webp("pizza-1.jpg")} ... />
 *
 * If the .webp hasn't been generated yet, this falls back to the
 * original .jpg — so the site still works, just slightly bigger.
 *
 * Vite's static-asset pipeline copies /public/* verbatim, so we
 * prefix with import.meta.env.BASE_URL to keep the GitHub Pages
 * subpath working.
 */

export const base = import.meta.env.BASE_URL;

/**
 * Convert a /public image filename to a WebP URL.
 * The build script is expected to write the .webp next to the .jpg
 * with the same basename. If the WebP is missing at request time the
 * browser will 404 on it; in that case the build script wasn't run.
 *
 * Examples:
 *   webp("pizza-1.jpg")     -> "/pizza-1.webp"
 *   webp("noodles1.jpg")    -> "/noodles1.webp"
 *   webp("hero.jpg")        -> "/hero.webp"
 *   webp("foo.png")         -> "/foo.webp"  (still tries webp)
 */
export function webp(filename) {
  return `${base}${filename.replace(/\.(jpe?g|png)$/i, ".webp")}`;
}

/**
 * Get the original (non-WebP) URL. Useful as a <picture> source
 * fallback, or for old browsers.
 */
export function original(filename) {
  return `${base}${filename}`;
}
