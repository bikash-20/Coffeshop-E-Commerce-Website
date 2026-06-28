import { motion } from "framer-motion";
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

const GALLERY = [
  {
    src: moodStreetSunset,
    alt: "A coffee cup steaming on a café table at golden-hour sunset",
    span: "sm:col-span-2 sm:row-span-2 md:col-span-2 md:row-span-2",
  },
  { src: moodPour, alt: "Coffee being poured into a glass cup, swirling against the cream" },
  { src: moodDarkCloth, alt: "A steaming espresso cup styled against a dark moody backdrop" },
  { src: moodSpices, alt: "A steaming cup of coffee plated with cinnamon sticks and star anise" },
  { src: heroSplashSmall, alt: "A smaller splash of coffee captured mid-motion above the cup" },
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

export default function Gallery() {
  return (
    <section id="gallery" className="relative overflow-hidden bg-cream-100 py-16 sm:py-20 md:py-28">
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
          viewport={{ once: true, amount: 0.2 }}
          className="mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:grid-cols-2 md:grid-cols-3"
        >
          {GALLERY.map((img, i) => (
            <motion.figure
              key={img.src.slice(-12)}
              variants={tile}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              data-cursor="view"
              className={`group relative h-full overflow-hidden rounded-2xl
                          shadow-lg shadow-coffee-900/10 ${img.span ?? ""}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
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
              <motion.div
                aria-hidden="true"
                initial={false}
                className="absolute bottom-4 left-4 flex h-12 w-12 translate-y-3
                           items-center justify-center rounded-full border border-gold-400/60
                           bg-coffee-950/60 text-sm font-bold text-gold-300
                           opacity-0 backdrop-blur-md transition-all duration-500
                           group-hover:translate-y-0 group-hover:opacity-100
                           sm:h-14 sm:w-14 sm:text-base"
              >
                {String(i + 1).padStart(2, "0")}
              </motion.div>

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
                <span>Mood · {String(i + 1).padStart(2, "0")}</span>
              </span>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
