import { Hero } from "@/components/Hero";
import { Artisane } from "@/components/Artisane";
import { Ateliers } from "@/components/Ateliers";
import { Collection } from "@/components/Collection"; 
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <main className="bg-white min-h-screen overflow-x-hidden"> 
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Collection Slider - Exclusive Experience */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
        className="relative z-10" // باش يبقى السلايدر ديما فوق الخلفية
      >
        <Collection />
      </motion.section>

      {/* 3. Artisane Story - مع فواصل مساحية أرقى */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, margin: "-50px" }}
        className="py-10" // زدنا شوية المساحة بين السلايدر والقصة
      >
        <Artisane />
      </motion.section>

      {/* 4. Workshops / Ateliers */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, margin: "-50px" }}
        className="pb-24"
      >
        <Ateliers />
      </motion.section>

      <Footer />
      <BackToTop />
    </main>
  );
};

export default Index;
