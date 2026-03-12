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
        
<div className="relative w-full max-w-lg mx-auto flex justify-center">
 
  <div className="relative overflow-hidden rounded-xl shadow-sm">
    <img 
      src="https://i.supaimg.com/23bbe892-53d3-41aa-b696-dcdb610fd822/83b7d020-9045-4460-b6a0-330c267a7fe1.png" 
      className="object-contain w-full h-auto block" 
      style={{
       
        maskImage: 'linear-gradient(to bottom, black 95%, transparent 100%), linear-gradient(to right, transparent, black 2%, black 98%, transparent)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 95%, transparent 100%), linear-gradient(to right, transparent, black 2%, black 98%, transparent)',
      }}
      alt="Rabab Atelier 3D Artwork"
    />
    
   
    <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-background to-transparent opacity-40 pointer-events-none" />
  </div>
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
