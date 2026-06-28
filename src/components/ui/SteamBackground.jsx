import { useMemo } from "react";

/**
 * SteamBackground — pure-CSS animated steam layer that drifts upward
 * and fades. Pure decoration; uses `pointer-events: none` so it never
 * blocks interaction.
 *
 * Why CSS over a canvas/RAF loop:
 *   - GPU-accelerated `transform` + `opacity` only (no layout thrash)
 *   - Each wisp is a fixed-positioned div with its own randomized
 *     delay/duration/drift via CSS variables, so the cloud feels
 *     non-repeating without us shipping a physics engine.
 *   - Respects `prefers-reduced-motion` via the global rule in
 *     index.css that collapses all animation durations.
 *
 * `density` (1..3) controls how many wisps render. Default 12 is
 * plenty for a hero without thrashing low-end phones.
 */
export default function SteamBackground({ density = 12, className = "" }) {
  // Pre-compute randomized wisp configs once per `density` change so
  // re-renders don't reshuffle the animation phases (which would look
  // like the steam "glitched" every parent re-render).
  const wisps = useMemo(
    () =>
      Array.from({ length: density }, (_, i) => ({
        id: i,
        // Horizontal start position (left: % of container)
        left: `${(i / density) * 100 + Math.random() * 4}%`,
        // Width/height in px
        size: 60 + Math.random() * 80,
        // Total cycle length in seconds — varies so the cloud doesn't
        // pulse in unison.
        duration: 7 + Math.random() * 6,
        // Animation start offset so the wisps don't all spawn at t=0
        delay: -Math.random() * 12,
        // Drift direction in px — wisps lean slightly left or right
        // as they rise, like real steam in still air.
        drift: (Math.random() - 0.5) * 80,
        // Peak opacity — taller wisps fade out more
        opacity: 0.18 + Math.random() * 0.25,
      })),
    [density]
  );

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {wisps.map((w) => (
        <span
          key={w.id}
          className="absolute bottom-0 rounded-full bg-gradient-to-t
                     from-cream-100/0 via-cream-100/60 to-cream-100/0
                     blur-2xl"
          style={{
            left: w.left,
            width: `${w.size}px`,
            height: `${w.size * 1.6}px`,
            opacity: 0,
            ["--steam-drift"]: `${w.drift}px`,
            ["--steam-opacity"]: w.opacity,
            animation: `steam-rise ${w.duration}s ease-out ${w.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}