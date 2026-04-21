import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import ServicesTeaser from "./components/ServicesTeaser";
import TeamTeaser from "./components/TeamTeaser";
import Community from "./components/Community";
import Gallery from "./components/Gallery";
import Locations from "./components/Locations";
import BookingCTA from "./components/BookingCTA";
import BehindTheGlowTeaser from "./components/BehindTheGlowTeaser";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import PromoBanner from "./components/PromoBanner";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <ServicesTeaser />
        <TeamTeaser />
        <Community />
        <Gallery />
        <Locations />
        <BookingCTA />
        <BehindTheGlowTeaser />
        <Contact />
      </main>
      <Footer />
      <PromoBanner />
    </>
  );
}
