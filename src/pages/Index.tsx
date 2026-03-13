import { Hero } from "@/components/Hero";
import { Artisane } from "@/components/Artisane";
import { Ateliers } from "@/components/Ateliers";
import { Collection } from "@/components/Collection";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { motion } from "framer-motion"; // ضروري للأنيميشن

const Index = () => {
  return (
    <main className="bg-background min-h-screen">
      <Hero />
      
      {/* 1. السلعة دبا هي الأولى مورا الهيرو بأنيميشن خفيفة */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <Collection />
      </motion.div>

      {/* 2. باقي الأقسام */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <Artisane />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <Ateliers />
      </motion.div>

      <Footer />
      <BackToTop />
    </main>
  );
};

export default Index;
