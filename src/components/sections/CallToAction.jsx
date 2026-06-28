import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useRef } from "react";
import Button from "../ui/Button.jsx";
import Reveal from "../ui/Reveal.jsx";
import SectionFolio from "../ui/SectionFolio.jsx";
import Magnetic from "../ui/Magnetic.jsx";
import { InstagramIcon, WhatsAppIcon, PhoneIcon } from "../ui/icons.jsx";
import { CONTACT, whatsappLink, telLink } from "../../data/contact.js";

const CONTACT_BUTTONS = [
  { key: "email", label: "Email Us", href: `mailto:${CONTACT.email}`, variant: "solid" },
  { key: "whatsapp", label: "WhatsApp", href: whatsappLink(), variant: "ghost", external: true },
  { key: "call", label: CONTACT.mobile, href: `tel:${telLink()}`, variant: "ghost" },
];

const buttonContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } },
};
const buttonItem = {
  hidden: { opacity: 0, y: 22, scale: 0.94 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const waveContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};
const waveChar = {
  hidden: { y: "100%", opacity: 0 },
  show: {
    y: "0%",
    opacity: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

function WaveLabel({ text }) {
  return (
    <motion.span
      variants={waveContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.8 }}
      aria-label={text}
      className="inline-flex overflow-hidden"
    >
      {text.split("").map((c, i) => (
        <span key={i} aria-hidden="true" className="inline-block overflow-hidden">
          <motion.span variants={waveChar} className="inline-block">
            {c === " " ? "\u00A0" : c}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}

/* ------------------------------------------------------------------
   Counter-up — animates 0 → target when the strip enters the viewport.
   Handles decimal values (rating) and integer values; renders the
   suffix after the number is done counting.
------------------------------------------------------------------- */
function Counter({ to, duration = 1.6, suffix = "", decimals = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) =>
    decimals ? v.toFixed(decimals) : Math.floor(v).toString()
  );

  useEffect(() => {
    if (inView) {
      const controls = animate(mv, to, {
        duration,
        ease: [0.22, 1, 0.36, 1],
      });
      return () => controls.stop();
    }
  }, [inView, mv, to, duration]);

  return (
    <span ref={ref} className="inline-flex items-baseline">
      <motion.span>{rounded}</motion.span>
      <span>{suffix}</span>
    </span>
  );
}

const STATS = [
  { value: 120, suffix: "+", label: "Drinks served" },
  { value: 4.9, suffix: "★", label: "Avg. rating", decimals: 1 },
  { value: 3, suffix: "", label: "Locations" },
  { value: 2, suffix: "k+", label: "Happy guests" },
];

export default function CallToAction() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-coffee-900 py-16 sm:py-20 md:py-28"
    >
      <SectionFolio number="04" label="CONTACT" side="right" />

      {/* Ambient gold radial — pulses subtly behind the heading */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full
                   bg-gradient-to-br from-gold-500/25 via-caramel-500/10 to-transparent blur-3xl"
        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto max-w-3xl px-5 text-center sm:px-8">
        <span className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold-500 sm:text-xs">
          <WaveLabel text="GET IN TOUCH" />
        </span>

        <Reveal delay={0.1}>
          <h2 className="fluid-h2 mt-4 font-display font-semibold leading-tight text-cream-100">
            Want a website concept like this for your café or restaurant?
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="fluid-body mx-auto mt-4 max-w-md text-cream-300">
            Drop us a message on any channel below and we'll send back a free
            concept idea — no obligation, just a starting point.
          </p>
        </Reveal>

        {/* Stats strip — counts up on viewport-enter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mx-auto my-10 grid max-w-2xl grid-cols-2 gap-x-6 gap-y-5 sm:my-12 sm:grid-cols-4"
        >
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-display text-3xl font-bold leading-none text-cream-100 sm:text-4xl">
                <Counter to={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} />
              </div>
              <div className="mt-1 text-[10px] font-medium uppercase tracking-[0.2em] text-cream-300/70 sm:text-xs">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          variants={buttonContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
        >
          {CONTACT_BUTTONS.map((btn) => (
            <motion.div
              key={btn.key}
              variants={buttonItem}
            >
              <Magnetic strength={6}>
                <motion.div whileTap={{ scale: 0.95 }} className="w-full sm:w-auto">
                  <Button
                    as="a"
                    href={btn.href}
                    variant={btn.variant}
                    className="w-full justify-center sm:w-auto"
                    {...(btn.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    {btn.key === "whatsapp" && <WhatsAppIcon className="h-4 w-4" />}
                    {btn.key === "call" && <PhoneIcon className="h-4 w-4" />}
                    {btn.label}
                  </Button>
                </motion.div>
              </Magnetic>
            </motion.div>
          ))}
        </motion.div>

        <Reveal delay={0.5}>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 text-cream-300 sm:mt-10 sm:flex-row sm:gap-5">
            <a
              href={CONTACT.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              data-cursor="hover"
              className="touch-target rounded-full transition-all hover:-translate-y-0.5 hover:text-gold-400"
            >
              <InstagramIcon className="h-6 w-6" />
            </a>
            <span
              className="hidden h-4 w-px bg-gold-500/30 sm:block"
              aria-hidden="true"
            />
            <a
              href={`mailto:${CONTACT.email}`}
              data-cursor="hover"
              className="break-all text-sm font-medium transition-colors hover:text-gold-400 sm:break-normal"
            >
              {CONTACT.email}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
