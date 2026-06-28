import { motion } from "framer-motion";
import { menuItems } from "../../data/menuItems.js";
import MenuCard from "../ui/MenuCard.jsx";
import SectionHeading from "../ui/SectionHeading.jsx";
import SectionFolio from "../ui/SectionFolio.jsx";
import Reveal from "../ui/Reveal.jsx";

// Container + item variants for the staggered grid reveal.
// Reveal handles the heading copy; this nested stagger handles the
// individual cards so they cascade in left-to-right / top-to-bottom.
const grid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};
const card = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

export default function Menu() {
  return (
    <section id="menu" className="relative overflow-hidden bg-coffee-950 py-16 sm:py-20 md:py-28">
      <SectionFolio number="02" label="MENU" side="left" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="The Menu"
            title="Thoughtfully crafted drinks, made to be remembered."
            description="Every glass is built around one idea: a drink should feel as good as the website that sells it."
            light
          />
        </Reveal>

        <motion.div
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-3"
        >
          {menuItems.map((item) => (
            <motion.div
              key={item.id}
              variants={card}
              // `layout` makes the card reflow smoothly if the grid
              // changes (e.g. a future filter toggle) instead of jumping.
              layout
            >
              <MenuCard item={item} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
