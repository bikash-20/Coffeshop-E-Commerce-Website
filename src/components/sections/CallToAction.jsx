import { motion } from "framer-motion";
import Button from "../ui/Button.jsx";
import Reveal from "../ui/Reveal.jsx";
import { InstagramIcon, WhatsAppIcon, PhoneIcon } from "../ui/icons.jsx";
import { CONTACT, whatsappLink, telLink } from "../../data/contact.js";

const CONTACT_BUTTONS = [
  {
    key: "email",
    label: "Email Us",
    href: `mailto:${CONTACT.email}`,
    variant: "solid",
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    href: whatsappLink(),
    variant: "ghost",
    external: true,
  },
  {
    key: "call",
    label: CONTACT.mobile,
    href: `tel:${telLink()}`,
    variant: "ghost",
  },
];

// Container-stagger for the three primary contact buttons so they
// reveal in sequence instead of all popping in together.
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

// Letter-by-letter wave for the eyebrow label — the "tick" effect
// that you see on Notion / Linear marketing pages.
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

export default function CallToAction() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-coffee-900 py-16 sm:py-20 md:py-28"
    >
      {/* Ambient gold radial — pulses subtly behind the heading */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full
                   bg-gradient-to-br from-gold-500/25 via-caramel-500/10 to-transparent blur-3xl"
        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div
        className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold-500/60 to-transparent"
        aria-hidden="true"
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

        <motion.div
          variants={buttonContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4"
        >
          {CONTACT_BUTTONS.map((btn) => (
            <motion.div
              key={btn.key}
              variants={buttonItem}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
            >
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
