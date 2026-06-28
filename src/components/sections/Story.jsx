import { moodLatteArt, moodSteamWood } from "../../assets/images.js";
import SectionHeading from "../ui/SectionHeading.jsx";
import Reveal from "../ui/Reveal.jsx";

export default function Story() {
  return (
    <section id="story" className="bg-cream-100 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Our Story"
            title="A website should feel like an experience — not just a page."
            description="Smooth scrolling, clean visuals, and a layout that instantly makes the brand feel more professional. The kind of online presence that helps people stop scrolling, trust your business, and remember your brand."
            align="left"
          />
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Reveal delay={0.1}>
            <figure className="overflow-hidden rounded-2xl shadow-xl shadow-coffee-900/10">
              <img
                src={moodLatteArt}
                alt="A latte with detailed leaf-pattern foam art, viewed from above"
                className="h-72 w-full object-cover sm:h-96"
                loading="lazy"
              />
            </figure>
          </Reveal>
          <Reveal delay={0.2}>
            <figure className="overflow-hidden rounded-2xl shadow-xl shadow-coffee-900/10">
              <img
                src={moodSteamWood}
                alt="A steaming cup of coffee resting on a rustic wooden table surrounded by beans"
                className="h-72 w-full object-cover sm:h-96"
                loading="lazy"
              />
            </figure>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
