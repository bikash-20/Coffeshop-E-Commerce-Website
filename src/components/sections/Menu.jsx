import { menuItems } from "../../data/menuItems.js";
import MenuCard from "../ui/MenuCard.jsx";
import SectionHeading from "../ui/SectionHeading.jsx";
import SectionFolio from "../ui/SectionFolio.jsx";
import Reveal from "../ui/Reveal.jsx";

// Cards render statically (no entry animation) — the previous
// whileInView-based stagger with amount:0.2 was unreliable on mobile:
// the grid is taller than the viewport, so by the time 20% of it was
// on-screen the user had already scrolled past the heading and seen
// a huge blank area below. Removing the animation makes the cards
// immediately visible (the right call for a menu that's supposed to
// be browsable, not a magazine reveal).
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

        <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {menuItems.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
