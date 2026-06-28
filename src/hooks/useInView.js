import { useEffect, useRef, useState } from "react";

/**
 * useInView — fires once when the element first enters the viewport.
 *
 * Deliberately NOT using a scroll event listener (expensive, runs every
 * frame). IntersectionObserver is the low-overhead, browser-native way
 * to do "reveal on scroll" and matches the performance-budget mindset
 * from the production-grade frontend checklist we drafted earlier.
 */
export function useInView({ threshold = 0.2, rootMargin = "0px" } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Respect reduced-motion: just show content immediately, no reveal
    // animation gating at all.
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // fire once, then stop observing
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return { ref, inView };
}
