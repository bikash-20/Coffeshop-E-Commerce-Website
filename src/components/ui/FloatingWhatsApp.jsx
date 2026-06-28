import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { WhatsAppIcon } from "./icons.jsx";
import { whatsappLink } from "../../data/contact.js";

/**
 * FloatingWhatsApp — a sticky bottom-right WhatsApp CTA bubble that
 * fades in once the user has scrolled past the hero and pulses gently
 * to draw the eye without being annoying.
 *
 * The pulse uses two concentric rings with staggered scale/opacity
 * loops — a classic "active" UI pattern (Telegram, Intercom, etc).
 */
export default function FloatingWhatsApp() {
  const [visible, setVisible] = useState(false);
  const { scrollY } = useScroll();

  // Show after ~80% of the first viewport height (~640px on mobile).
  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 640);
  });

  return (
    <motion.a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      initial={{ opacity: 0, scale: 0.6, y: 24 }}
      animate={
        visible
          ? { opacity: 1, scale: 1, y: 0 }
          : { opacity: 0, scale: 0.6, y: 24 }
      }
      transition={{ type: "spring", damping: 20, stiffness: 220 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className="fixed bottom-5 right-4 z-50 sm:bottom-7 sm:right-7"
    >
      {/* Two pulsing rings (background) */}
      <span
        aria-hidden="true"
        className="absolute inset-0 animate-[whatsapp-ping_2.4s_cubic-bezier(0,0,0.2,1)_infinite] rounded-full bg-[#25D366]/40"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 animate-[whatsapp-ping_2.4s_cubic-bezier(0,0,0.2,1)_infinite_1.2s] rounded-full bg-[#25D366]/30"
      />

      {/* Solid button */}
      <span
        className="relative flex h-14 w-14 items-center justify-center rounded-full
                   bg-[#25D366] text-white shadow-[0_8px_24px_rgba(37,211,102,0.45)]
                   ring-2 ring-white/10 transition-shadow hover:shadow-[0_12px_30px_rgba(37,211,102,0.6)]"
      >
        <WhatsAppIcon className="h-7 w-7" />
      </span>
    </motion.a>
  );
}