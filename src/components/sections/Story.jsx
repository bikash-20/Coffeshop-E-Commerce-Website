import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import { moodLatteArt, moodSteamWood } from "../../assets/images.js";
import SectionHeading from "../ui/SectionHeading.jsx";
import SectionFolio from "../ui/SectionFolio.jsx";
import Divider from "../ui/Divider.jsx";

const REDUCED_MOTION =
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function Story() {
  const ref = useRef(null);
  const quoteRef = useRef(null);
  const quoteInView = useInView(quoteRef, { once: true, amount: 0.5 });

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
      {/* Decorative chapter number — magazine-style "01 — STORY" */}
      <SectionFolio number="01" label="STORY" side="right" />

      {/* Decorative giant quote mark watermark — animates in + tints gold at center */}
      <motion.div
        ref={quoteRef}
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.6, y: 60 }}
        animate={quoteInView ? { opacity: 1, scale: 1, y: 0 } : {}}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2
                   font-display text-[18rem] leading-none sm:text-[26rem]"
        style={{ color: quoteInView ? "rgba(212,175,122,0.18)" : "rgba(31,20,13,0.04)", transition: "color 1.6s ease" }}
      >
        “
      </motion.div>

      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Our Story"
          title="From our kitchen to your favorite corner of the city."
          description="We started with a simple idea: serve fresh, flavorful food that brings comfort and joy to every customer. From cheesy pizzas and creamy milkshakes to spicy noodles and classic street-style snacks, every item is made with care and quality ingredients. We blend taste, freshness, and a cozy dining experience to make every visit special. Whether you're craving a quick snack or a full meal, we're here to serve food that feels satisfying and memorable."
          align="left"
        />

        {/* Pull-quote uses Cormorant Garamond italic — a second serif
            voice for editorial flavor beyond Playfair Display. */}
        <blockquote className="mt-8 border-l-2 border-gold-500/60 pl-5 font-serif-italic text-2xl italic leading-snug text-coffee-800 sm:mt-10 sm:text-3xl md:text-4xl">
          The best cup of coffee is the one you remember a year later —
          <span className="text-coffee-600"> not the strongest, but the most honest.</span>
        </blockquote>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:mt-10 sm:grid-cols-2 sm:gap-6">

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
              width={1000}
              height={700}
              className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:aspect-auto sm:h-72 md:h-96"
              loading="lazy"
              decoding="async"
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
              width={1000}
              height={700}
              className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:aspect-auto sm:h-72 md:h-96"
              loading="lazy"
              decoding="async"
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
