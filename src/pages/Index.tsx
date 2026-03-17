import { Hero } from "@/components/Hero";
import { ProductDetail } from "@/components/ProductDetail";
import { CategoryPage} from "@/components/CategoryPage";
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
