import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Palette, Sparkles } from "lucide-react";

export const Hero = () => {
  const { t, isArabic } = useLanguage();
  const { scrollY } = useScroll();

 
  const y = useTransform(scrollY, [0, 800], [0, 150]);
  const opacity = useTransform(scrollY, [400, 800], [1, 0]);

  return (
    <section className="relative min-h-[110vh] flex flex-col items-center justify-center px-6 overflow-hidden bg-[#fafaf9]">

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-100/30 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center">
        
        
        <motion.div 
          style={{ y, opacity }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-xl group"
        >
          <div className="relative overflow-hidden rounded-[2rem] transition-transform duration-1000 group-hover:scale-[1.02]">
            <img 
              src="https://i.supaimg.com/23bbe892-53d3-41aa-b696-dcdb610fd822/83b7d020-9045-4460-b6a0-330c267a7fe1.png" 
              className="object-contain w-full h-auto block drop-shadow-2xl" 
              style={{
                maskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 90%, transparent 100%)',
              }}
              alt="Rabab Atelier Artwork"
            />
          </div>

          <motion.div 
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.1, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -top-4 -right-4 text-amber-500/40"
          >
            <Sparkles size={32} />
          </motion.div>
        </motion.div>

        
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
          className="mt-16 text-center space-y-6"
        >
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="h-[1px] w-8 bg-stone-200" />
            <span className="text-[10px] font-black tracking-[0.6em] text-stone-400 uppercase">Est. 2026</span>
            <div className="h-[1px] w-8 bg-stone-200" />
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif tracking-tighter leading-[0.9] text-stone-900 italic">
            {t("hero.title")}
          </h1>

          <p className="max-w-md mx-auto text-stone-500 text-sm md:text-base font-light tracking-[0.1em] leading-relaxed italic opacity-80">
            {t("hero.subtitle")}
          </p>
        </motion.div>
      </div>

      {/* Luxury Minimal Nav */}
      <motion.nav
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="mt-24 flex flex-wrap justify-center items-center gap-x-12 gap-y-6"
      >
        {["artisane", "ateliers", "collection"].map((item) => (
          <a 
            key={item}
            href={`#${item}`} 
            className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 hover:text-amber-800 transition-all duration-500 relative group"
          >
            {t(`nav.${item}`)}
            <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-amber-600 transition-all duration-500 group-hover:w-full" />
          </a>
        ))}

        <Link 
          to="/sur-mesure" 
          className="flex items-center gap-3 px-6 py-3 rounded-full border border-amber-100 bg-amber-50/30 text-[10px] font-black uppercase tracking-[0.3em] text-amber-900 hover:bg-amber-900 hover:text-white transition-all duration-700 group shadow-sm"
        >
          <Palette className="w-3.5 h-3.5 transition-transform group-hover:rotate-12" />
          {isArabic ? "طلب خاص" : "Sur Mesure"}
        </Link>
      </motion.nav>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-10 flex flex-col items-center gap-2 opacity-20"
      >
        <div className="w-[1px] h-12 bg-stone-900" />
      </motion.div>
    </section>
  );
};
