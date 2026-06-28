import { motion } from "framer-motion";

/**
 * AnimatedSectionHeading — letter-by-letter reveal of a section title.
 * Built on Framer Motion so we don't ship SplitType as a dependency.
 *
 * Why letter-level (not word-level): section titles like
 * "A website should do more than inform" are short enough that letter
 * stagger reads as "editorial / premium fashion magazine" rather than
 * the heavier "cinematic word-by-word" we use in the Hero.
 *
 * The reveal splits on whitespace, preserves the original spacing with
 * a literal " " (no margin) so kerning and line wrapping stay natural.
 */
export default function AnimatedSectionHeading({
  title,
  className = "",
  delay = 0,
  stagger = 0.018,
}) {
  // Split into characters but keep words as units by tokenizing on
  // whitespace. Each character then fades+slides up in sequence.
  const tokens = title.split(/(\s+)/); // keeps separators

  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: stagger, delayChildren: delay },
    },
  };
  const char = {
    hidden: { y: "105%", opacity: 0 },
    show: {
      y: "0%",
      opacity: 1,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <motion.h2
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
      className={className}
      aria-label={title}
    >
      {tokens.map((token, ti) =>
        /\s+/.test(token) ? (
          <span key={`s-${ti}`} aria-hidden="true">
            {" "}
          </span>
        ) : (
          <span
            key={`w-${ti}`}
            aria-hidden="true"
            className="inline-block overflow-hidden pb-[0.05em] align-baseline"
          >
            <motion.span variants={char} className="inline-block">
              {token}
            </motion.span>
          </span>
        )
      )}
    </motion.h2>
  );
}