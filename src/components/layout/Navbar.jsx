import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Coffee, Menu, X, ShoppingBag } from "lucide-react";
import Button from "../ui/Button.jsx";
import NavClock from "./NavClock.jsx";
import { useCart } from "../../context/CartContext.jsx";

const NAV_LINKS = [
  { label: "Story", href: "#story", id: "story" },
  { label: "Menu", href: "#menu", id: "menu" },
  { label: "Gallery", href: "#gallery", id: "gallery" },
  { label: "Visit Us", href: "#contact", id: "contact" },
];

function useActiveSection(sectionIds) {
  const [active, setActive] = useState(null);
  useEffect(() => {
    const observers = [];
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActive(id);
        },
        { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, [sectionIds]);
  return active;
}

function NavLink({ link, active, onClick }) {
  const isActive = active === link.id;
  return (
    <li>
      <a
        href={link.href}
        onClick={onClick}
        data-cursor="hover"
        className="relative inline-block py-2 text-sm font-medium text-cream-300 transition-colors hover:text-gold-400"
      >
        <span className={isActive ? "text-gold-400" : ""}>{link.label}</span>
        {/* Animated gold underline — scales from left on hover and
            stays full when the link's section is active. */}
        <motion.span
          aria-hidden="true"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: isActive ? 1 : 0 }}
          whileHover={{ scaleX: 1 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{ transformOrigin: "left" }}
          className="absolute bottom-1 left-0 h-px w-full bg-gold-400"
        />
      </a>
    </li>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { count, toggleCart } = useCart();
  const active = useActiveSection(["story", "menu", "gallery", "contact"]);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-gold-500/10 bg-coffee-950/80 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 md:px-8">
        <a href="#top" data-cursor="hover" className="flex min-w-0 items-center gap-2">
          <Coffee className="h-5 w-5 shrink-0 text-gold-500 sm:h-6 sm:w-6" strokeWidth={1.75} />
          <span className="truncate font-display text-base font-semibold tracking-wide text-cream-100 sm:text-lg">
            Luxing Conlecting
          </span>
        </a>

        {/* Live "now brewing" status — little editorial extra */}
        <NavClock />

        {/* Desktop links */}
        <ul className="hidden items-center gap-6 lg:flex lg:gap-8">
          {NAV_LINKS.map((link) => (
            <NavLink key={link.href} link={link} active={active} />
          ))}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
            {/* Cart pill — only renders when there's something in it.
                Clicking it opens the CartDrawer so the user can review
                quantities, remove lines, and proceed to checkout. */}
            <AnimatePresence>
              {count > 0 && (
                <motion.button
                  type="button"
                  key={count}
                  onClick={toggleCart}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 380, damping: 18 }}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.94 }}
                  aria-label={`Open cart with ${count} item${count === 1 ? "" : "s"}`}
                  data-cursor="hover"
                  className="touch-target relative flex items-center gap-1.5 rounded-full border border-gold-500/40 bg-coffee-900/80 px-3 py-1.5 text-xs font-semibold text-gold-300 transition-colors hover:border-gold-500/70 hover:bg-coffee-900"
                >
                  <ShoppingBag className="h-4 w-4" />
                  <motion.span
                    key={count}
                    initial={{ y: -6, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.18 }}
                  >
                    {count}
                  </motion.span>
                </motion.button>
              )}
            </AnimatePresence>
            <Button as="a" href="#menu" variant="solid">Order Online</Button>
        </div>

        <button
          className="touch-target rounded-md text-cream-100 md:hidden lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          data-cursor="hover"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile / tablet menu */}
      {open && (
        <div className="border-t border-gold-500/10 bg-coffee-950 px-5 py-6 md:block lg:hidden">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  data-cursor="hover"
                  className={`block rounded-md px-2 py-2 text-base font-medium transition-colors hover:bg-coffee-900 hover:text-gold-400 ${
                    active === link.id ? "text-gold-400" : "text-cream-200"
                  }`}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          {count > 0 && (
            <button
              type="button"
              onClick={() => { setOpen(false); toggleCart(); }}
              data-cursor="hover"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full border border-gold-500/40 bg-coffee-900 px-5 py-2.5 text-sm font-semibold text-gold-300 transition-colors hover:bg-coffee-800"
            >
              <ShoppingBag className="h-4 w-4" />
              View cart ({count})
            </button>
          )}
          <Button as="a" href="#menu" variant="solid" className="mt-4 w-full" onClick={() => setOpen(false)}>
            Order Online
          </Button>
        </div>
      )}
    </header>
  );
}
