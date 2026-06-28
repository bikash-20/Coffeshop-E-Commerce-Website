import { useEffect } from "react";
import Lenis from "lenis";

/**
 * useLenis — installs a single Lenis smooth-scroll instance on mount
 * and cleans it up on unmount. Wired into the global requestAnimationFrame
 * loop so it actually animates every frame.
 *
 * Why this approach instead of importing the singleton helper from
 * `lenis/react`:
 *   - keeps the API surface in one place (this file)
 *   - we still gate the animation loop on `prefers-reduced-motion`
 *     so accessibility users get native instant scroll instead of
 *     the smooth-scroll interpolation.
 *
 * `lenis/react` exports `useLenis()` for components that need to read
 * the scroll value; if you ever need that, import it from there
 * directly — this hook is the *installer*, not the consumer.
 */
export function useLenis() {
  useEffect(() => {
    const prefersReduced =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) return; // respect the OS-level opt-out

    const lenis = new Lenis({
      // Tuned for "warm, premium" feel rather than hard inertial spin
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);
}