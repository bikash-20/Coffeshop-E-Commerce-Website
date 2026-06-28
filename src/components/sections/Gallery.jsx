import {
  moodDarkCloth,
  moodPour,
  moodStreetSunset,
  moodSpices,
  heroSplashSmall,
} from "../../assets/images.js";
import SectionHeading from "../ui/SectionHeading.jsx";
import Reveal from "../ui/Reveal.jsx";

const GALLERY = [
  { src: moodStreetSunset, alt: "A coffee cup steaming on a café table at golden-hour sunset", span: "sm:col-span-2" },
  { src: moodPour, alt: "Coffee being poured into a glass cup, swirling against the cream" },
  { src: moodDarkCloth, alt: "A steaming espresso cup styled against a dark moody backdrop" },
  { src: moodSpices, alt: "A steaming cup of coffee plated with cinnamon sticks and star anise" },
  { src: heroSplashSmall, alt: "A smaller splash of coffee captured mid-motion above the cup" },
];

export default function Gallery() {
  return (
    <section id="gallery" className="bg-cream-100 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Mood Board"
            title="Because cafés don't just sell coffee — they sell a feeling."
            description="A small collection of the warmth, steam, and texture this concept is built around."
          />
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {GALLERY.map((img, i) => (
            <Reveal key={img.src.slice(-12)} delay={i * 0.08} className={img.span ?? ""}>
              <figure className="h-full overflow-hidden rounded-2xl shadow-lg shadow-coffee-900/10">
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="h-64 w-full object-cover transition-transform duration-500 hover:scale-105 sm:h-72"
                />
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
