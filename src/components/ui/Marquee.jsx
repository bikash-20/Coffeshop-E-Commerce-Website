/**
 * Marquee — an infinite horizontal scrolling strip. The trick is to
 * render the children list TWICE inside a single flex row, then animate
 * the row from `translateX(0)` to `translateX(-50%)`. Because the row
 * is exactly 2× the visible content width, the loop is seamless —
 * when the first copy scrolls off, the second is already in view
 * and snaps back to start invisibly.
 *
 * Pause-on-hover is handled by CSS (`.marquee-track:hover`) so JS
 * doesn't need to coordinate it.
 *
 * Items separated by the `·` dot in serif italic for that
 * fashion-magazine editorial feel.
 */
export default function Marquee({ items, className = "", reverse = false }) {
  const trackClass = reverse ? "marquee-track-reverse" : "marquee-track";
  return (
    <div
      className={`relative overflow-hidden border-y border-gold-500/15
                  bg-coffee-900/40 py-3 backdrop-blur-sm ${className}`}
      aria-label="Featured highlights"
    >
      {/* Fade edges — masks the seam where the second copy slides in */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12
                   bg-gradient-to-r from-coffee-900 to-transparent sm:w-24"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12
                   bg-gradient-to-l from-coffee-900 to-transparent sm:w-24"
        aria-hidden="true"
      />

      <div className={`${trackClass} flex w-max items-center gap-8 whitespace-nowrap will-change-transform sm:gap-12`}>
        {[...items, ...items].map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="font-display text-base font-medium uppercase tracking-[0.3em] text-cream-200/80 sm:text-lg"
          >
            <span className="text-gold-400">·</span>
            <span className="mx-4 sm:mx-6">{item}</span>
          </span>
        ))}
      </div>
    </div>
  );
}