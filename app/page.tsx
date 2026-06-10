import Footer from "@/components/sections/Footer";
import Section1Hero from "@/components/sections/Section1Hero";
import Section2Concept from "@/components/sections/Section2Concept";
import Section3Architecture from "@/components/sections/Section3Architecture";
import Section4Residences from "@/components/sections/Section4Residences";
import Section5Interiors from "@/components/sections/Section5Interiors";
import Section6Location from "@/components/sections/Section6Location";
import Section7Amenities from "@/components/sections/Section7Amenities";
import Section8Investment from "@/components/sections/Section8Investment";
import Section9Developer from "@/components/sections/Section9Developer";
import Section10Contact from "@/components/sections/Section10Contact";

export default function Home() {
  return (
    <main>
      <Section1Hero />
      <Section2Concept />
      <Section3Architecture />
      <Section4Residences />
      <Section5Interiors />
      <Section6Location />
      <Section7Amenities />
      <Section8Investment />
      <Section9Developer />
      <Section10Contact />
      <Footer />
    </main>
  );
}
