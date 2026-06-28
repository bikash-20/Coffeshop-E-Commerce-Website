import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { heroSplashLarge } from "../../assets/images.js";
import Button from "../ui/Button.jsx";
import Reveal from "../ui/Reveal.jsx";
import AnimatedHeadline from "../ui/AnimatedHeadline.jsx";
import SteamBackground from "../ui/SteamBackground.jsx";
import Marquee from "../ui/Marquee.jsx";
import Magnetic from "../ui/Magnetic.jsx";

const REDUCED_MOTION =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const HEADLINE =
  "A coffee website that feels warm before you even visit";
// Index of the word to tint gold — matches the previous inline span.
const HIGHLIGHT_INDEX = 6; // "warm"

const HIGHLIGHT_TAGS = [
  "Fresh Brews",
  "Hand Crafted",
  "Since 2024",
  "Noirpixel",
  "Premium Beans",
  "Made in BD",
  "Vibes Only",
];

/** Small ambient "floating bean" decoration — purely CSS/motion, no extra image asset. */
function FloatingBean({ className = "", delay = 0, size = 14 }) {
  return (
    <motion.span
      className={`absolute rounded-full bg-gradient-to-br from-coffee-700 to-coffee-900 shadow-md shadow-black/40 ${className}`}
      style={{ width: size, height: size * 1.4, borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%" }}
      animate={
        REDUCED_MOTION
          ? {}
          : { y: [0, -16, 0], rotate: [0, 12, 0] }
      }
      transition={{ duration: 4 + delay, repeat: Infinity, ease: "easeInOut", delay }}
      aria-hidden="true"
    />
  );
}

export default function Hero() {
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Scroll-based parallax: the splash photo drifts and scales gently as
  // the user scrolls past the hero — the "steam moves, beans float"
  // brief, implemented as a real scroll-tied transform rather than a
  // fixed-duration animation.
  const imageY = useTransform(scrollYProgress, [0, 1], [0, REDUCED_MOTION ? 0 : 120]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1, REDUCED_MOTION ? 1 : 1.08]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, REDUCED_MOTION ? 0 : -40]);

  // Fade the whole hero out as the user scrolls past it — gives a
  // cinematic "rise through the steam" exit rather than a hard cut.
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85, 1], [1, 1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  return (
    <>
    <motion.section
      id="top"
      ref={sectionRef}
      style={{ opacity: heroOpacity, y: heroY }}
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-coffee-950 pt-24 pb-16 sm:pt-28 sm:pb-20 md:pt-24"
    >
      {/* Animated steam layer — sits behind everything */}
      <SteamBackground density={14} />

      {/* Ambient gold ribbon glow — decorative gradient, not an image */}
      <div
        className="pointer-events-none absolute -right-32 top-1/4 h-[480px] w-[480px] rounded-full
                   bg-gradient-to-br from-gold-500/20 via-caramel-500/10 to-transparent blur-3xl"
        aria-hidden="true"
      />
      {/* Secondary counter-glow — left side, creates depth */}
      <div
        className="pointer-events-none absolute -left-40 bottom-1/4 h-[400px] w-[400px] rounded-full
                   bg-gradient-to-tr from-caramel-500/15 to-transparent blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-5 sm:px-8 md:grid-cols-2 md:gap-12">
        {/* Left: copy */}
        <motion.div style={{ y: textY }} className="flex flex-col gap-5 sm:gap-6">
          <Reveal>
            <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-500 sm:text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-400 shadow-[0_0_10px_rgba(212,175,122,0.9)]" />
              Noirpixel Coffee Concept
            </span>
          </Reveal>

          <AnimatedHeadline
            text={HEADLINE}
            highlightIndex={HIGHLIGHT_INDEX}
            delay={0.1}
            className="fluid-hero font-display font-bold text-cream-100"
            // Override the default gold tint with the shimmer-gold text
            // gradient — the "warm" word reads as glowing/lit, not flat.
            highlightClassName="shimmer-gold"
          />

          <Reveal delay={0.4}>
            <p className="fluid-body max-w-md text-cream-300">
              Steam moves. Milk flows in. Sugar dissolves. Because cafés
              don't just sell coffee — they sell a feeling.
            </p>
          </Reveal>

          <Reveal delay={0.5}>
            <div className="flex flex-col gap-3 pt-2 xs:flex-row xs:flex-wrap xs:items-center xs:gap-4">
              <Magnetic>
                <motion.div whileTap={{ scale: 0.97 }}>
                  <Button as="a" href="#menu" variant="solid" className="w-full xs:w-auto">
                    View the Menu
                  </Button>
                </motion.div>
              </Magnetic>
              <Magnetic>
                <motion.div whileTap={{ scale: 0.97 }}>
                  <Button as="a" href="#story" variant="ghost" className="w-full xs:w-auto">
                    Our Story
                  </Button>
                </motion.div>
              </Magnetic>
            </div>
          </Reveal>
        </motion.div>

        {/* Right: parallax splash photo with rotating rings */}
        <Reveal delay={0.15} className="relative order-first md:order-none">
          {/* Slow-rotating outer ring — gold dashed border */}
          <div
            aria-hidden="true"
            className="spin-slow absolute inset-0 -m-6 rounded-full border border-dashed border-gold-500/30 sm:-m-10"
          />
          {/* Counter-rotating inner ring — thinner, lighter */}
          <div
            aria-hidden="true"
            className="spin-reverse absolute inset-0 -m-3 rounded-full border border-gold-400/20 sm:-m-5"
          />

          <motion.div
            style={{ y: imageY, scale: imageScale }}
            className="relative mx-auto aspect-square w-full max-w-[18rem] overflow-hidden rounded-[2rem]
                       shadow-2xl shadow-black/50 ring-1 ring-gold-500/30
                       sm:max-w-md"
          >
            <img
              src={heroSplashLarge}
              alt="Coffee splashing dramatically out of a cup, surrounded by scattered coffee beans"
              className="h-full w-full object-cover"
            />
            {/* Top-down warm gradient over the image — adds depth and
                makes the gold accents pop against it. */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-tr
                         from-coffee-950/40 via-transparent to-gold-500/15 mix-blend-overlay"
            />
          </motion.div>

          {/* Ambient floating beans — fewer on mobile so they don't crowd the splash */}
          <FloatingBean className="left-2 top-6 hidden sm:block" delay={0} size={16} />
          <FloatingBean className="right-4 top-16 hidden sm:block" delay={0.6} size={12} />
          <FloatingBean className="bottom-10 left-10" delay={1.1} size={14} />
          <FloatingBean className="bottom-4 right-8 hidden sm:block" delay={1.6} size={10} />
        </Reveal>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-[0.2em] text-gold-500/70 sm:bottom-8 sm:text-xs"
        animate={REDUCED_MOTION ? {} : { y: [0, 6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        Scroll to discover
      </motion.div>
    </motion.section>

    {/* Marquee strip — sits flush against the hero's bottom edge */}
    <Marquee items={HIGHLIGHT_TAGS} />
    </>
  );
}
