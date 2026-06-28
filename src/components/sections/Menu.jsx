import { menuItems } from "../../data/menuItems.js";
import MenuCard from "../ui/MenuCard.jsx";
import SectionHeading from "../ui/SectionHeading.jsx";
import Reveal from "../ui/Reveal.jsx";

export default function Menu() {
  return (
    <section id="menu" className="bg-coffee-950 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="The Menu"
            title="Thoughtfully crafted drinks, made to be remembered."
            description="Every glass is built around one idea: a drink should feel as good as the website that sells it."
            light
          />
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item, i) => (
            <Reveal key={item.id} delay={(i % 3) * 0.1}>
              <MenuCard item={item} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
