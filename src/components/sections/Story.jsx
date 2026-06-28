import { moodLatteArt, moodSteamWood } from "../../assets/images.js";
import SectionHeading from "../ui/SectionHeading.jsx";
import Reveal from "../ui/Reveal.jsx";

export default function Story() {
  return (
    <section id="story" className="bg-cream-100 py-16 sm:py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Our Story"
            title="A website should do more than inform — it should feel composed, elevated, and unforgettable."
            description="Through refined motion, elegant visuals, and a seamless layout, we create digital experiences that communicate quality the moment someone arrives. Every detail is designed to inspire confidence, reflect sophistication, and leave a lasting impression of the brand."
            align="left"
          />
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6">
          <Reveal delay={0.1}>
            <figure className="overflow-hidden rounded-2xl shadow-xl shadow-coffee-900/10">
              <img
                src={moodLatteArt}
                alt="A latte with detailed leaf-pattern foam art, viewed from above"
                className="aspect-[4/3] w-full object-cover sm:aspect-auto sm:h-72 md:h-96"
                loading="lazy"
              />
            </figure>
          </Reveal>
          <Reveal delay={0.2}>
            <figure className="overflow-hidden rounded-2xl shadow-xl shadow-coffee-900/10">
              <img
                src={moodSteamWood}
                alt="A steaming cup of coffee resting on a rustic wooden table surrounded by beans"
                className="aspect-[4/3] w-full object-cover sm:aspect-auto sm:h-72 md:h-96"
                loading="lazy"
              />
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
