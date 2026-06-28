import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";

/**
 * Headline animation with two modes:
 *
 * 1. Default — word-by-word slide-up reveal (one-shot, fires on mount
 *    after the optional `delay`).
 *
 * 2. `scrub` — once the headline enters the viewport the surrounding
 *    consumer (typically Hero) has its own scroll progress 0→1;
 *    we map that progress through each word so the headline fills
 *    in gold as the user scrolls past it. To activate, set
 *    `scrub={scrollYProgress}` from the parent.
 *
 * Highlight word keeps the `highlightClassName` styling throughout,
 * but in scrub mode every other word also gets the shimmer-gold
 * gradient as its colour at the moment its scroll window fires —
 * producing the linear "wake" effect that's trending in reel edits.
 */
export default function AnimatedHeadline({
  text,
  highlightIndex,
  highlightClassName = "text-gold-400",
  scrubClassName = "shimmer-gold",
  className = "",
  delay = 0,
  scrub, // motion value 0..1 (only used if provided)
}) {
  const words = text.split(" ");
  const containerRef = useRef(null);

  // For each word, build a transform: opacity goes 0 → 1 over a
  // narrow range of scroll progress centered on its index. We do
  // this in JSX with useTransform hooks via a small wrapper so we
  // can interpolate per-word.
  const wordCount = words.length;

  // Parent reveal (one-shot mode)
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06, delayChildren: delay } },
  };
  const word = {
    hidden: { y: "110%", opacity: 0 },
    show: {
      y: "0%",
      opacity: 1,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };

  if (!scrub) {
    return (
      <motion.h1
        variants={container}
        initial="hidden"
        animate="show"
        className={className}
        aria-label={text}
      >
        {words.map((w, i) => (
          <WordReveal
            key={i}
            word={w}
            isHighlight={i === highlightIndex}
            highlightClassName={highlightClassName}
          />
        ))}
      </motion.h1>
    );
  }

  // Scrub mode — drives each word's color tint from scroll progress.
  // Build a transform for each word via useTransform.
  return (
    <h1 ref={containerRef} className={className} aria-label={text}>
      {words.map((w, i) => (
        <ScrubWord
          key={i}
          word={w}
          isHighlight={i === highlightIndex}
          scrollProgress={scrub}
          index={i}
          total={wordCount}
          highlightClassName={highlightClassName}
          scrubClassName={scrubClassName}
        />
      ))}
    </h1>
  );
}

function WordReveal({ word, isHighlight, highlightClassName }) {
  const wordV = {
    hidden: { y: "110%", opacity: 0 },
    show: {
      y: "0%",
      opacity: 1,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };
  return (
    <span
      aria-hidden="true"
      className="inline-block overflow-hidden pb-[0.1em] align-baseline"
      style={{ marginRight: "0.28em" }}
    >
      <motion.span variants={wordV} className="inline-block">
        {isHighlight ? (
          <span className={highlightClassName}>{word}</span>
        ) : (
          word
        )}
      </motion.span>
    </span>
  );
}

function ScrubWord({
  word,
  isHighlight,
  scrollProgress,
  index,
  total,
  highlightClassName,
  scrubClassName,
}) {
  // Each word's "moment" sits at (i / total). The transition spans
  // ±0.25 around that center so words briefly overlap into the next.
  const center = index / Math.max(total - 1, 1);
  const start = Math.max(center - 0.18, 0);
  const end = Math.min(center + 0.18, 1);
  // Default word: opacity/color goes 0→1 over the window and stays.
  // Color tints by transitioning from cream-100 to gold-400 via
  // a shimmer gold className once fully in view.
  const opacity = useTransform(scrollProgress, [start, end], [0.35, 1]);
  const inWindow = useTransform(scrollProgress, (v) =>
    v >= start && v <= end ? 1 : 0
  );

  return (
    <span
      aria-hidden="true"
      className="inline-block pb-[0.1em] align-baseline transition-colors duration-300"
      style={{ marginRight: "0.28em", opacity }}
    >
      {isHighlight ? (
        <span className={highlightClassName}>{word}</span>
      ) : (
        <ScrubWordInner
          word={word}
          inWindow={inWindow}
          scrubClassName={scrubClassName}
        />
      )}
    </span>
  );
}

function ScrubWordInner({ word, inWindow, scrubClassName }) {
  // Toggle the shimmer-gold class via opacity of an overlay span.
  // We avoid setState in a MotionValue callback; use opacity instead.
  return (
    <span className="relative inline">
      <span className="text-cream-100">{word}</span>
      <motion.span
        aria-hidden="true"
        style={{ opacity: inWindow }}
        className={`absolute inset-0 ${scrubClassName}`}
      >
        {word}
      </motion.span>
    </span>
  );
}