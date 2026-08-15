import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  moodDarkCloth,
  moodPour,
  moodStreetSunset,
  moodSpices,
  heroSplashSmall,
} from "../../assets/images.js";
import SectionHeading from "../ui/SectionHeading.jsx";
import SectionFolio from "../ui/SectionFolio.jsx";
import Reveal from "../ui/Reveal.jsx";

const REDUCED_MOTION =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Each tile gets a unique parallax config: direction (up/down),
// rotation, and scale drift — so the grid feels like a living
// magazine spread rather than a flat grid of photos.
const GALLERY = [
  {
    src: moodStreetSunset,
    alt: "A coffee cup steaming on a café table at golden-hour sunset",
    span: "sm:col-span-2 sm:row-span-2 md:col-span-2 md:row-span-2",
    // Hero tile — drifts up slowly, scales up slightly
    parallax: { y: [-30, 30], rotate: [-1.5, 1.5], scale: [0.97, 1.03] },
  },
  {
    src: moodPour,
    alt: "Coffee being poured into a glass cup, swirling against the cream",
    parallax: { y: [20, -20], rotate: [1, -1], scale: [1.02, 0.98] },
  },
  {
    src: moodDarkCloth,
    alt: "A steaming espresso cup styled against a dark moody backdrop",
    parallax: { y: [-15, 25], rotate: [-0.5, 1.5], scale: [0.99, 1.02] },
  },
  {
    src: moodSpices,
    alt: "A steaming cup of coffee plated with cinnamon sticks and star anise",
    parallax: { y: [15, -25], rotate: [1, -0.5], scale: [1.01, 0.99] },
  },
  {
    src: heroSplashSmall,
    alt: "A smaller splash of coffee captured mid-motion above the cup",
    parallax: { y: [-20, 20], rotate: [-1, 1], scale: [0.98, 1.01] },
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const tile = {
  hidden: { opacity: 0, scale: 0.92, y: 30 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * ParallaxTile — wraps a gallery figure with scroll-tied transforms.
 * Each tile gets its own parallax direction and rotation so the
 * grid feels dimensional as the user scrolls through.
 */
function ParallaxTile({ img, index }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const p = img.parallax;
  const y = useTransform(scrollYProgress, [0, 1], REDUCED_MOTION ? [0, 0] : p.y);
  const rotate = useTransform(scrollYProgress, [0, 1], REDUCED_MOTION ? [0, 0] : p.rotate);
  const scale = useTransform(scrollYProgress, [0, 1], REDUCED_MOTION ? [1, 1] : p.scale);
  // Image inner parallax — the image inside the frame moves opposite
  // to the frame itself, creating a subtle "window" depth effect
  const imgY = useTransform(scrollYProgress, [0, 1], REDUCED_MOTION ? [0, 0] : [-8, 8]);

  return (
    <motion.figure
      ref={ref}
      variants={tile}
      style={{ y, rotate, scale }}
      whileHover={{ scale: 1.03, rotate: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      data-cursor="view"
      className={`group relative h-full overflow-hidden rounded-2xl
                  shadow-lg shadow-coffee-900/10 will-change-transform ${img.span ?? ""}`}
    >
      <motion.img
        src={img.src}
        alt={img.alt}
        width={1000}
        height={img.span ? 1000 : 700}
        loading="lazy"
        decoding="async"
        style={{ y: imgY, scale: 1.1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-110 sm:aspect-auto sm:h-64 md:h-72"
      />

      {/* Hover gradient — slides up from bottom-right */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-tl
                   from-coffee-950/85 via-coffee-950/30 to-transparent
                   opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />

      {/* Circular counter — slides in from bottom-left */}
      <div
        aria-hidden="true"
        className="absolute bottom-4 left-4 flex h-12 w-12 translate-y-3
                   items-center justify-center rounded-full border border-gold-400/60
                   bg-coffee-950/60 text-sm font-bold text-gold-300
                   opacity-0 backdrop-blur-md transition-all duration-500
                   group-hover:translate-y-0 group-hover:opacity-100
                   sm:h-14 sm:w-14 sm:text-base"
      >
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Caption — slides in from bottom-right opposite the counter */}
      <span
        aria-hidden="true"
        className="absolute bottom-7 right-5 translate-y-3 text-right font-display
                   text-base font-medium text-cream-100 opacity-0 transition-all
                   duration-500 delay-100 group-hover:translate-y-0 group-hover:opacity-100
                   sm:bottom-8 sm:text-lg"
      >
        <span className="block text-[10px] uppercase tracking-[0.3em] text-gold-400 sm:text-xs">
          View
        </span>
        <span>Mood · {String(index + 1).padStart(2, "0")}</span>
      </span>
    </motion.figure>
  );
}

export default function Gallery() {
  // Section-level scroll progress for the overall fade effect
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const sectionOpacity = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0.6, 1, 1, 0.6]);

  return (
    <motion.section
      id="gallery"
      ref={sectionRef}
      style={{ opacity: sectionOpacity }}
      className="relative overflow-hidden bg-cream-100 py-16 sm:py-20 md:py-28"
    >
      <SectionFolio number="03" label="MOOD" side="left" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Mood Board"
            title="Because cafés don't just sell coffee — they sell a feeling."
            description="A small collection of the warmth, steam, and texture this concept is built around."
          />
        </Reveal>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 md:grid-cols-3"
        >
          {GALLERY.map((img, i) => (
            <ParallaxTile key={img.src.slice(-12)} img={img} index={i} />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}
