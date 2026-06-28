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
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
        <a href="#top" className="flex items-center gap-2">
          <Coffee className="h-6 w-6 text-gold-500" strokeWidth={1.75} />
          <span className="font-display text-lg font-semibold tracking-wide text-cream-100">
            Luxing Conlecting
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
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

        <div className="hidden md:block">
          <Button as="a" href="#menu" variant="solid">
            Order Online
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="text-cream-100 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile menu panel */}
      {open && (
        <div className="border-t border-gold-500/10 bg-coffee-950 px-5 py-6 md:hidden">
          <ul className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block text-base font-medium text-cream-200 hover:text-gold-400"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <Button as="a" href="#menu" variant="solid" className="mt-6 w-full" onClick={() => setOpen(false)}>
            Order Online
          </Button>
        </div>
      )}
    </header>
  );
}
