import { useState } from "react";
import { Menu, X, Coffee } from "lucide-react";
import Button from "../ui/Button.jsx";

const NAV_LINKS = [
  { label: "Story", href: "#story" },
  { label: "Menu", href: "#menu" },
  { label: "Gallery", href: "#gallery" },
  { label: "Visit Us", href: "#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-gold-500/10 bg-coffee-950/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 md:px-8">
        <a href="#top" className="flex min-w-0 items-center gap-2">
          <Coffee className="h-5 w-5 shrink-0 text-gold-500 sm:h-6 sm:w-6" strokeWidth={1.75} />
          <span className="truncate font-display text-base font-semibold tracking-wide text-cream-100 sm:text-lg">
            Luxing Conlecting
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-6 lg:flex lg:gap-8">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="text-sm font-medium text-cream-300 transition-colors hover:text-gold-400"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden lg:block">
          <Button as="a" href="#menu" variant="solid">
            Order Online
          </Button>
        </div>

        {/* Mobile / tablet toggle */}
        <button
          className="touch-target rounded-md text-cream-100 md:hidden lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile / tablet menu panel */}
      {open && (
        <div className="border-t border-gold-500/10 bg-coffee-950 px-5 py-6 md:block lg:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-2 py-2 text-base font-medium text-cream-200 transition-colors hover:bg-coffee-900 hover:text-gold-400"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <Button
            as="a"
            href="#menu"
            variant="solid"
            className="mt-4 w-full"
            onClick={() => setOpen(false)}
          >
            Order Online
          </Button>
        </div>
      )}
    </header>
  );
}
