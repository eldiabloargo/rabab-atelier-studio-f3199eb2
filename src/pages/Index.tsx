import { Hero } from "@/components/Hero";
import { ProductDetail } from "@/pages/ProductDetail";
import { CategoryPage} from "@/pages/CategoryPage";
import { Artisane } from "@/components/Artisane";
import { Footer } from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <Hero />
      <div className="space-y-16 md:space-y-24">
        <CategoryPage />
        <ProductDetail />
        <Artisane />
      </div>
      <Footer />
    </div>
  );
};

export default Index;
