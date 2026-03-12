import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import heroImage from "@/assets/hero-sculpture.jpg";

export const Hero = () => {
  const { t } = useLanguage();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative w-full max-w-3xl mx-auto"
      >
        
<div className="relative animate-float animate-soft-glow">
  <img 
    src="/path-to-your-image.png" 
    className="mask-art-edges object-contain w-full h-auto" 
    alt="Rabab Atelier 3D"
  />
  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
</div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
          className="mt-12 text-center"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif tracking-tight leading-tight text-gold-gradient">
            {t("hero.title")}
          </h1>
          <p className="mt-4 text-lg md:text-xl font-sans text-muted-foreground tracking-wide">
            {t("hero.subtitle")}
          </p>
        </motion.div>
      </motion.div>

      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="mt-16 flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm tracking-widest uppercase text-muted-foreground font-sans"
      >
        <a href="#artisane" className="hover:text-gold transition-colors duration-500">
          {t("nav.artisane")}
        </a>
        <a href="#ateliers" className="hover:text-gold transition-colors duration-500">
          {t("nav.ateliers")}
        </a>
        <a href="#collection" className="hover:text-gold transition-colors duration-500">
          {t("nav.collection")}
        </a>
      </motion.nav>
    </section>
  );
};
