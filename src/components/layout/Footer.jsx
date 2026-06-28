import { Coffee, Mail } from "lucide-react";

/**
 * lucide-react v1.x dropped brand/logo icons (Instagram included) for
 * licensing reasons — so this is a small hand-drawn outline icon
 * instead of an import, kept local to this one usage.
 */
function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="border-t border-gold-500/10 bg-coffee-950 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 text-center sm:flex-row sm:justify-between sm:text-left">
        <div className="flex items-center gap-2">
          <Coffee className="h-5 w-5 text-gold-500" strokeWidth={1.75} />
          <span className="font-display text-base font-semibold text-cream-100">
            Luxing Conlecting
          </span>
        </div>

        <p className="text-xs text-cream-300/70">
          Concept site built as a design exploration — not a real café menu
          or business.
        </p>

        <div className="flex items-center gap-4">
          <a
            href="#"
            aria-label="Instagram"
            className="text-cream-300 transition-colors hover:text-gold-400"
          >
            <InstagramIcon className="h-5 w-5" />
          </a>
          <a
            href="mailto:hello@luxingconlecting.test"
            aria-label="Email"
            className="text-cream-300 transition-colors hover:text-gold-400"
          >
            <Mail className="h-5 w-5" strokeWidth={1.75} />
          </a>
        </div>
      </div>
    </footer>
  );
}
