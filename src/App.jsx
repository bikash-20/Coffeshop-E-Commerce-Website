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

export default function App() {
  // Site-wide smooth scroll (no-op if prefers-reduced-motion is set).
  useLenis();

  return (
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
      <Footer />
    </ErrorBoundary>
  );
}
