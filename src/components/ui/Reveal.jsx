import { motion } from "framer-motion";
import { useInView } from "../../hooks/useInView.js";

/**
 * Wraps any children in a subtle fade-up reveal, triggered once on
 * scroll-into-view. `delay` lets sibling Reveals stagger naturally.
 */
export default function Reveal({ children, delay = 0, className = "" }) {
  const { ref, inView } = useInView({ threshold: 0.15 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
