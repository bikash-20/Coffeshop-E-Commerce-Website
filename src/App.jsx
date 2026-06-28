import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import Hero from "./components/sections/Hero.jsx";
import Story from "./components/sections/Story.jsx";
import Menu from "./components/sections/Menu.jsx";
import Gallery from "./components/sections/Gallery.jsx";
import CallToAction from "./components/sections/CallToAction.jsx";
import ErrorBoundary from "./components/ErrorBoundary.jsx";

export default function App() {
  return (
    <ErrorBoundary>
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
