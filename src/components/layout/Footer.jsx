import { motion } from "framer-motion";
import { Coffee, Mail } from "lucide-react";
import { InstagramIcon, WhatsAppIcon, PhoneIcon } from "../ui/icons.jsx";
import { CONTACT, whatsappLink, telLink } from "../../data/contact.js";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

export default function Footer() {
  return (
    <footer className="border-t border-gold-500/10 bg-coffee-950 py-8 sm:py-10">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 text-center sm:flex-row sm:justify-between sm:gap-4 sm:px-5 sm:text-left md:px-8"
      >
        <motion.div variants={item} className="flex items-center gap-2">
          <Coffee className="h-5 w-5 text-gold-500" strokeWidth={1.75} />
          <span className="font-display text-base font-semibold text-cream-100">
            Luxing Conlecting
          </span>
        </motion.div>

        <motion.div variants={item} className="flex flex-col items-center gap-1 text-xs text-cream-300/70 sm:items-start">
          <a
            href={`mailto:${CONTACT.email}`}
            className="break-all transition-colors hover:text-gold-400 sm:break-normal"
          >
            {CONTACT.email}
          </a>
          <a
            href={`tel:${telLink()}`}
            className="transition-colors hover:text-gold-400"
          >
            {CONTACT.mobileCountryCode} {CONTACT.mobile}
          </a>
        </motion.div>

        <motion.div variants={item} className="flex items-center gap-1 sm:gap-4">
          <a
            href={CONTACT.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="touch-target rounded-full text-cream-300 transition-all hover:-translate-y-0.5 hover:text-gold-400"
          >
            <InstagramIcon className="h-5 w-5" />
          </a>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="touch-target rounded-full text-cream-300 transition-all hover:-translate-y-0.5 hover:text-gold-400"
          >
            <WhatsAppIcon className="h-5 w-5" />
          </a>
          <a
            href={`tel:${telLink()}`}
            aria-label="Call"
            className="touch-target rounded-full text-cream-300 transition-all hover:-translate-y-0.5 hover:text-gold-400"
          >
            <PhoneIcon className="h-5 w-5" />
          </a>
          <a
            href={`mailto:${CONTACT.email}`}
            aria-label="Email"
            className="touch-target rounded-full text-cream-300 transition-all hover:-translate-y-0.5 hover:text-gold-400"
          >
            <Mail className="h-5 w-5" strokeWidth={1.75} />
          </a>
        </motion.div>
      </motion.div>
    </footer>
  );
}
