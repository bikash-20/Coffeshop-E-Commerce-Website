import { motion } from "framer-motion";

/**
 * Word-by-word reveal — the SplitType-style headline animation, but
 * built on Framer Motion so we don't pull in another dependency.
 * Splits the `text` prop into words (preserving the trailing period),
 * each wrapped in a motion.span with `overflow: hidden` on its parent
 * so the word slides up from below as it fades in. `highlightIndex`
 * wraps the matching word in a gold span so it gets the warmer tint.
 */
export default function AnimatedHeadline({
  text,
  highlightIndex,
  highlightClassName = "text-gold-400",
  className = "",
  delay = 0,
}) {
  const words = text.split(" ");

  // Parent: stagger children; child: fade + slide up.
  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.06, delayChildren: delay },
    },
  };
  const word = {
    hidden: { y: "110%", opacity: 0 },
    show: {
      y: "0%",
      opacity: 1,
      transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.h1
      variants={container}
      initial="hidden"
      animate="show"
      className={className}
      aria-label={text}
    >
      {words.map((w, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="inline-block overflow-hidden pb-[0.1em] align-baseline"
          style={{ marginRight: "0.28em" }}
        >
          <motion.span variants={word} className="inline-block">
            {i === highlightIndex ? (
              <span className={highlightClassName}>{w}</span>
            ) : (
              w
            )}
          </motion.span>
        </span>
      ))}
    </motion.h1>
  );
}