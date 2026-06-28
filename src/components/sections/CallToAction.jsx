import Button from "../ui/Button.jsx";
import Reveal from "../ui/Reveal.jsx";

export default function CallToAction() {
  return (
    <section id="contact" className="relative overflow-hidden bg-coffee-900 py-20 sm:py-28">
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold-500/60 to-transparent"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
        <Reveal>
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gold-500">
            Visit Us
          </span>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight text-cream-100 sm:text-4xl">
            Want a website concept like this for your café or restaurant?
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-4 max-w-md text-cream-300">
            Drop us a message and we'll send back a free concept idea — no
            obligation, just a starting point.
          </p>
        </Reveal>
        <Reveal delay={0.3}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button as="a" href="#menu" variant="solid">
              Order Online
            </Button>
            <Button as="a" href="mailto:hello@luxingconlecting.test" variant="ghost">
              Get in Touch
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
