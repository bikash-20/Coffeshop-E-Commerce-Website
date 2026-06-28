import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { moodLatteArt, moodSteamWood } from "../../assets/images.js";
import SectionHeading from "../ui/SectionHeading.jsx";

const REDUCED_MOTION =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function Story() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Each image gets its own parallax direction — left photo drifts
  // down-right, right photo drifts down-left, like the section is
  // passing through a tunnel of soft depth.
  const leftX = useTransform(scrollYProgress, [0, 1], [REDUCED_MOTION ? 0 : -50, 50]);
  const rightX = useTransform(scrollYProgress, [0, 1], [REDUCED_MOTION ? 0 : 50, -50]);
  const leftRotate = useTransform(scrollYProgress, [0, 1], [REDUCED_MOTION ? 0 : -2, 2]);
  const rightRotate = useTransform(scrollYProgress, [0, 1], [REDUCED_MOTION ? 0 : 2, -2]);

  return (
    <section id="story" ref={ref} className="relative overflow-hidden bg-cream-100 py-16 sm:py-20 md:py-28">
      {/* Decorative giant quote mark watermark — visible on dark phone screens */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2
                   font-display text-[18rem] leading-none text-coffee-900/[0.04] sm:text-[26rem]"
      >
        “
      </div>

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Our Story"
          title="A website should do more than inform — it should feel composed, elevated, and unforgettable."
          description="Through refined motion, elegant visuals, and a seamless layout, we create digital experiences that communicate quality the moment someone arrives. Every detail is designed to inspire confidence, reflect sophistication, and leave a lasting impression of the brand."
          align="left"
        />

        <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6">
          <motion.figure
            style={{ x: leftX, rotate: leftRotate }}
            initial={{ opacity: 0, x: -60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="group relative overflow-hidden rounded-2xl shadow-xl shadow-coffee-900/10"
          >
            <img
              src={moodLatteArt}
              alt="A latte with detailed leaf-pattern foam art, viewed from above"
              className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:aspect-auto sm:h-72 md:h-96"
              loading="lazy"
            />
            {/* Hover gold border */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-gold-500/0 transition-all duration-500 group-hover:ring-gold-500/40"
            />
          </motion.figure>

          <motion.figure
            style={{ x: rightX, rotate: rightRotate }}
            initial={{ opacity: 0, x: 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="group relative overflow-hidden rounded-2xl shadow-xl shadow-coffee-900/10"
          >
            <img
              src={moodSteamWood}
              alt="A steaming cup of coffee resting on a rustic wooden table surrounded by beans"
              className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:aspect-auto sm:h-72 md:h-96"
              loading="lazy"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-gold-500/0 transition-all duration-500 group-hover:ring-gold-500/40"
            />
          </motion.figure>
        </div>
      </div>
    </section>
  );
}
