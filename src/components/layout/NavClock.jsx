import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const HOURS = { open: 7, close: 22 }; // 7am – 10pm local
const TZ = "Asia/Dhaka";

function pad(n) {
  return String(n).padStart(2, "0");
}

function getStatus(now = new Date()) {
  const hour = now.getHours();
  const min = now.getMinutes();
  const total = hour * 60 + min;
  const open = HOURS.open * 60;
  const close = HOURS.close * 60;
  return {
    isOpen: total >= open && total < close,
    closesAt: close,
  };
}

function formatTime(now) {
  return `${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

/**
 * Tiny live "Now brewing" status pill in the navbar — shows current
 * Dhaka time + open/closed state. Updates every 30s.
 */
export default function NavClock() {
  const [now, setNow] = useState(() => new Date());
  const [status, setStatus] = useState(() => getStatus());

  useEffect(() => {
    const tick = () => {
      const next = new Date();
      setNow(next);
      setStatus(getStatus(next));
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
      className="hidden items-center gap-2 rounded-full border border-gold-500/30
                 bg-coffee-900/40 px-3 py-1.5 text-[11px] font-medium text-cream-300
                 backdrop-blur-sm md:flex"
      data-cursor="hover"
      aria-label={`Current time in ${TZ}: ${formatTime(now)}`}
    >
      <motion.span
        aria-hidden="true"
        animate={status.isOpen ? { scale: [1, 1.4, 1], opacity: [1, 0.6, 1] } : {}}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        className={`h-1.5 w-1.5 rounded-full ${
          status.isOpen ? "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.7)]" : "bg-coffee-600"
        }`}
      />
      <span className="hidden xl:inline">{status.isOpen ? "Now brewing" : "Closed"}</span>
      <span className="font-mono text-cream-100">{formatTime(now)}</span>
    </motion.div>
  );
}