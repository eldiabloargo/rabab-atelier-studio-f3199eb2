import { Hero } from "@/components/Hero";
import { Artisane } from "@/components/Artisane";
import { Ateliers } from "@/components/Ateliers";
import { Collection } from "@/components/Collection";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";

const Index = () => {
  return (
    <main className="bg-background min-h-screen">
      <Hero />
      <Artisane />
      <Ateliers />
      <Collection />
      <Footer />
      <BackToTop />
    </main>
  );
};

export default Index;
