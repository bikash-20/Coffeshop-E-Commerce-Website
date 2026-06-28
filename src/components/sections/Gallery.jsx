import { motion } from "framer-motion";
import {
  moodDarkCloth,
  moodPour,
  moodStreetSunset,
  moodSpices,
  heroSplashSmall,
} from "../../assets/images.js";
import SectionHeading from "../ui/SectionHeading.jsx";
import Reveal from "../ui/Reveal.jsx";

const GALLERY = [
  { src: moodStreetSunset, alt: "A coffee cup steaming on a café table at golden-hour sunset", span: "sm:col-span-2 sm:row-span-2 md:col-span-2 md:row-span-2" },
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
    <section id="gallery" className="bg-cream-100 py-16 sm:py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
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
              className={`group relative h-full overflow-hidden rounded-2xl
                          shadow-lg shadow-coffee-900/10 ${img.span ?? ""}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-110 sm:aspect-auto sm:h-64 md:h-72"
              />
              {/* Hover overlay — gold tint + caption */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t
                           from-coffee-950/70 via-coffee-950/0 to-transparent
                           opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-4 bottom-4
                           translate-y-2 font-display text-sm font-medium text-cream-100
                           opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100"
              >
                View · {String(i + 1).padStart(2, "0")}
              </span>
            </motion.figure>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
