import { Hero } from "@/components/Hero";
import { Artisane } from "@/components/Artisane";
import { Ateliers } from "@/components/Ateliers";
import { Collection } from "@/components/Collection"; // تأكد أن ملف Collection فيه export const Collection
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <main className="bg-white min-h-screen"> {/* رديتها bg-white باش تناسق مع الـ App Feel الجيد */}
      <Hero />

      {/* 1. Collection - New Arrivals */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <Collection />
      </motion.section>

      {/* 2. Artisane Story */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <Artisane />
      </motion.section>

      {/* 3. Workshops / Ateliers */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
      >
        <Ateliers />
      </motion.section>

      <Footer />
      <BackToTop />
    </main>
  );
};

export default Index;
