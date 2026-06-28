import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { heroSplashLarge } from "../../assets/images.js";
import Button from "../ui/Button.jsx";
import Reveal from "../ui/Reveal.jsx";

const REDUCED_MOTION =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative flex min-h-screen items-center overflow-hidden bg-coffee-950 pt-24"
    >
      {/* Ambient gold ribbon glow — decorative gradient, not an image */}
      <div
        className="pointer-events-none absolute -right-32 top-1/4 h-[480px] w-[480px] rounded-full
                   bg-gradient-to-br from-gold-500/20 via-caramel-500/10 to-transparent blur-3xl"
        aria-hidden="true"
      />

      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-5 sm:px-8 md:grid-cols-2">
        {/* Left: copy */}
        <motion.div style={{ y: textY }} className="flex flex-col gap-6">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-500">
              Noirpixel Coffee Concept
            </span>
          </Reveal>

          <Reveal delay={0.1}>
            <h1 className="font-display text-4xl font-bold leading-[1.1] text-cream-100 sm:text-5xl md:text-6xl">
              A coffee website that feels{" "}
              <span className="text-gold-400">warm</span> before you even visit
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="max-w-md text-base text-cream-300 sm:text-lg">
              Steam moves. Milk flows in. Sugar dissolves. Because cafés
              don't just sell coffee — they sell a feeling.
            </p>
          </Reveal>

          <Reveal delay={0.3}>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button as="a" href="#menu" variant="solid">
                View the Menu
              </Button>
              <Button as="a" href="#story" variant="ghost">
                Our Story
              </Button>
            </div>
          </Reveal>
        </motion.div>

        {/* Right: parallax splash photo */}
        <Reveal delay={0.15} className="relative">
          <motion.div
            style={{ y: imageY, scale: imageScale }}
            className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-[2rem]
                       shadow-2xl shadow-black/50 ring-1 ring-gold-500/20"
          >
            <img
              src={heroSplashLarge}
              alt="Coffee splashing dramatically out of a cup, surrounded by scattered coffee beans"
              className="h-full w-full object-cover"
            />
          </motion.div>

          {/* Ambient floating beans around the frame */}
          <FloatingBean className="left-2 top-6" delay={0} size={16} />
          <FloatingBean className="right-4 top-16" delay={0.6} size={12} />
          <FloatingBean className="bottom-10 left-10" delay={1.1} size={14} />
          <FloatingBean className="bottom-4 right-8" delay={1.6} size={10} />
        </Reveal>
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.2em] text-gold-500/70"
        animate={REDUCED_MOTION ? {} : { y: [0, 6, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        Scroll to discover
      </motion.div>
    </section>
  );
}
