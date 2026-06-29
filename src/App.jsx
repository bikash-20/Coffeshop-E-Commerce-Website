import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import Hero from "./components/sections/Hero.jsx";
import Story from "./components/sections/Story.jsx";
import Menu from "./components/sections/Menu.jsx";
import Gallery from "./components/sections/Gallery.jsx";
import CallToAction from "./components/sections/CallToAction.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import { useLenis } from "./hooks/useLenis.jsx";
import ScrollProgress from "./components/ui/ScrollProgress.jsx";
import CursorFollower from "./components/ui/CursorFollower.jsx";
import FloatingWhatsApp from "./components/ui/FloatingWhatsApp.jsx";
import Marquee from "./components/ui/Marquee.jsx";
import IntroVeil from "./components/ui/IntroVeil.jsx";
import KonamiEasterEgg from "./components/ui/KonamiEasterEgg.jsx";
import CartDrawer from "./components/layout/CartDrawer.jsx";
import { CartProvider } from "./context/CartContext.jsx";

const BOTTOM_TICKER = [
  "Open 7am — 10pm",
  "Walk-ins welcome",
  "Free WiFi",
  "Brunch Saturdays",
  "Live acoustic Fridays",
  "Reserve via WhatsApp",
  "Made in BD",
];

export default function App() {
  // Site-wide smooth scroll (no-op if prefers-reduced-motion is set).
  useLenis();

  return (
    <CartProvider>
      <ErrorBoundary>
      {/* Top scroll-progress bar — gold shimmer line that fills as
          the user scrolls through the page. */}
      <ScrollProgress />

      {/* Custom cursor — gold ring + dot that scales over interactive
          elements. Hidden on touch devices via media query inside. */}
      <CursorFollower />

      {/* Persistent floating WhatsApp CTA — appears once the user has
          scrolled past the hero, gently pulses. */}
      <FloatingWhatsApp />

      <Navbar />

      <main>
        <Hero />
        <Story />
        <Menu />
        <Gallery />
        <CallToAction />
      </main>

      {/* Reverse-direction newsroom ticker — flips direction and slow
          speed for the second-pass rhythm just above the footer. */}
      <Marquee items={BOTTOM_TICKER} reverse />

      <Footer />
    </ErrorBoundary>

    {/* Page-load intro veil — gold gradient that wipes up.
        Mounted outside ErrorBoundary so a crashed subtree still
        releases the veil correctly. */}
    <IntroVeil />

    {/* Konami easter egg — ↑↑↓↓←→←→BA → confetti burst. */}
    <KonamiEasterEgg />

    {/* Cart drawer — slide-in side panel for reviewing items and
        checking out. Mounted outside ErrorBoundary so a crashed
        section can't permanently lock the user out of their cart. */}
    <CartDrawer />
    </CartProvider>
  );
}
