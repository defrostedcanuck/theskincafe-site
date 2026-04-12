import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Team from "./components/Team";
import Testimonials from "./components/Testimonials";
import Gallery from "./components/Gallery";
import Locations from "./components/Locations";
import BookingCTA from "./components/BookingCTA";
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
        <Services />
        <Team />
        <Testimonials />
        <Gallery />
        <Locations />
        <BookingCTA />
        <Contact />
      </main>
      <Footer />
      <PromoBanner />
    </>
  );
}
