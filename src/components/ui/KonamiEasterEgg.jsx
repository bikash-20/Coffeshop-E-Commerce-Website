import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * KonamiEasterEgg — when the user types the classic ↑↑↓↓←→←→BA
 * sequence on the keyboard, a gold + caramel confetti burst plays.
 * Pure DOM (positioned absolutely), zero dependencies, fixed-cost.
 *
 * Listens at the window level so the user doesn't have to focus a
 * specific element first.
 */

const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const COLORS = ["#d4af7a", "#e2c697", "#c8956b", "#faf6f0", "#b8924f"];

function spawnConfetti() {
  const count = 80;
  const root = document.createElement("div");
  root.style.cssText =
    "position:fixed;inset:0;pointer-events:none;z-index:300;overflow:hidden;";
  document.body.appendChild(root);

  for (let i = 0; i < count; i++) {
    const piece = document.createElement("span");
    const x = Math.random() * 100;
    const drift = (Math.random() - 0.5) * 400;
    const size = 6 + Math.random() * 8;
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const dur = 1800 + Math.random() * 1200;
    piece.style.cssText = `
      position:absolute;
      top:-12px;
      left:${x}vw;
      width:${size}px;
      height:${size * 1.5}px;
      background:${color};
      border-radius:2px;
      opacity:0.95;
      transform:translate3d(0,0,0) rotate(0deg);
      transition:transform ${dur}ms cubic-bezier(0.22,1,0.36,1), opacity ${dur}ms ease;
      will-change:transform, opacity;
    `;
    root.appendChild(piece);
    // Force reflow then animate
    void piece.offsetWidth;
    piece.style.transform = `translate3d(${drift}px, 110vh, 0) rotate(${
      (Math.random() - 0.5) * 1080
    }deg)`;
    piece.style.opacity = "0";
  }
  setTimeout(() => root.remove(), 3500);
}

export default function KonamiEasterEgg() {
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    let buffer = [];
    function onKey(e) {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      buffer.push(k);
      // Cap the buffer to avoid memory growth
      if (buffer.length > SEQUENCE.length) buffer = buffer.slice(-SEQUENCE.length);
      const matched = buffer.every((k, i) => k === SEQUENCE[i]);
      setProgress(matched ? SEQUENCE.length : buffer.length);
      if (matched) {
        spawnConfetti();
        setToast(true);
        setTimeout(() => setToast(false), 2200);
        buffer = [];
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 60, opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 280 }}
          className="pointer-events-none fixed bottom-24 left-1/2 z-[250] -translate-x-1/2
                     rounded-full border border-gold-500/40 bg-coffee-950/90 px-5 py-3
                     text-center text-sm font-medium text-gold-300 shadow-2xl backdrop-blur"
        >
          ✦ you found the secret — Noirpixel appreciates the curiosity
        </motion.div>
      )}
    </AnimatePresence>
  );
}