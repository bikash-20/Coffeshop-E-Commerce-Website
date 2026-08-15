import { motion } from "framer-motion";
import { menuCategories } from "../../data/menuItems.js";
import MenuCard from "../ui/MenuCard.jsx";
import SectionHeading from "../ui/SectionHeading.jsx";
import SectionFolio from "../ui/SectionFolio.jsx";
import Reveal from "../ui/Reveal.jsx";

// Menu cards use a per-category staggered reveal. Each category block
// watches for its heading to enter the viewport, then cascades its
// cards in with a small delay. This avoids the old problem where a
// tall grid left blank space on mobile — now only the visible
// category triggers its own cards.
export default function Menu() {
  return (
    <section id="menu" className="relative overflow-hidden bg-coffee-950 py-16 sm:py-20 md:py-28">
      <SectionFolio number="02" label="MENU" side="left" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="The Menu"
            title="Thoughtfully crafted drinks and made-to-order food."
            description="From signature coffees to crispy fuchka — every item is built around one idea: it should feel as good as the website that sells it."
            light
          />
        </Reveal>

        <div className="mt-10 space-y-14 sm:mt-12 sm:space-y-20">
          {menuCategories.map((cat) => (
            <CategoryBlock key={cat.id} category={cat} />
          ))}
        </div>
      </div>
    </section>
  );
}

const cardContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};
const cardItem = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

function CategoryBlock({ category }) {
  return (
    <div>
      <div className="mb-6 flex items-baseline gap-3 sm:mb-8">
        <h3 className="font-display text-2xl font-semibold text-cream-100 sm:text-3xl">
          {category.title}
        </h3>
        <span className="h-px flex-1 bg-gradient-to-r from-gold-500/40 via-gold-500/15 to-transparent" />
        <span className="text-[11px] font-medium uppercase tracking-widest text-cream-300/70">
          {category.items.length} {category.items.length === 1 ? "item" : "items"}
        </span>
      </div>
      {category.subtitle && (
        <p className="mb-6 max-w-2xl text-sm leading-relaxed text-cream-300/80 sm:mb-8 sm:text-base">
          {category.subtitle}
        </p>
      )}
      <motion.div
        variants={cardContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
      >
        {category.items.map((item) => (
          <motion.div key={item.id} variants={cardItem}>
            <MenuCard item={item} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}

