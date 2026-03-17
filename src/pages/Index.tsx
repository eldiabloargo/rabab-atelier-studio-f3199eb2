import { Hero } from "@/components/Hero";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { Categories } from "@/components/Categories";
import { Artisane } from "@/components/Artisane";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <Hero />
      <div className="space-y-16 md:space-y-24">
        <Categories />
        <FeaturedProducts />
        <Artisane />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
