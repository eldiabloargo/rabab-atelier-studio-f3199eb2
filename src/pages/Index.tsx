import { Hero } from "@/components/Hero";
import { Collection } from "@/components/Collection";
import { Artisane } from "@/components/Artisane";
import { Footer } from "@/components/Footer";
import { Atelier} from "@/components/Atelier";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="min-h-screen bg-[#fafaf9]"
    >
      <Hero />
      <div className="space-y-16 md:space-y-32">
        <Collection /> 
        <Artisane />
      </div>
      <Footer />
    </motion.div>
  );
};

export default Index;
