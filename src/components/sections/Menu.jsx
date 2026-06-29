import { menuCategories } from "../../data/menuItems.js";
import MenuCard from "../ui/MenuCard.jsx";
import SectionHeading from "../ui/SectionHeading.jsx";
import SectionFolio from "../ui/SectionFolio.jsx";
import Reveal from "../ui/Reveal.jsx";

// The menu is now grouped into categories (Coffee & Drinks, Pizza,
// Pasta, Momo, Panipuri, Noodles, Fuchka). We render the first
// section heading once, then loop categories with a small inline
// heading per block. Cards render statically (no entry animation) —
// the previous whileInView-based stagger with amount:0.2 was
// unreliable on mobile: the grid is taller than the viewport, so
// by the time 20% of it was on-screen the user had already scrolled
// past the heading and seen a huge blank area below. Removing the
// animation makes the cards immediately visible (the right call for
// a menu that's supposed to be browsable, not a magazine reveal).
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
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {category.items.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}

