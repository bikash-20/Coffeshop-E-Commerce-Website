import { motion } from "framer-motion";

/**
 * A horizontal rule with a tiny gold diamond at its center —
 * editorial-style section divider used in place of bare gradient
 * lines. Animates the inner diamond in once on scroll-into-view.
 *
 * @param {"dark"|"light"} tone
 *   tone="dark"  — for cream backgrounds (default)
 *   tone="light" — for coffee/dark backgrounds
 */
export default function Divider({ tone = "dark", className = "" }) {
  const lineColor =
    tone === "light"
      ? "from-transparent via-gold-500/30 to-transparent"
      : "from-transparent via-coffee-900/20 to-transparent";
  const diamondColor = tone === "light" ? "bg-gold-500" : "bg-gold-600";

  return (
    <div
      role="separator"
      aria-hidden="true"
      className={`relative my-10 flex w-full items-center justify-center sm:my-12 ${className}`}
    >
      <div className={`h-px w-full bg-gradient-to-r ${lineColor}`} />
      <motion.span
        initial={{ scale: 0, rotate: 45 }}
        whileInView={{ scale: 1, rotate: 45 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`absolute h-2 w-2 ${diamondColor} shadow-[0_0_10px_rgba(212,175,122,0.6)]`}
      />
    </div>
  );
}