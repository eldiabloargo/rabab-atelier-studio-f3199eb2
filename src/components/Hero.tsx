import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Palette, Sparkles } from "lucide-react";

export const Hero = () => {
  const { t, isArabic } = useLanguage();
  const { scrollY } = useScroll();

  const y = useTransform(scrollY, [0, 500], [0, 800]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden bg-[#fafaf9]">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-100/20 blur-[100px] rounded-full pointer-events-none" />

      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center">
        <motion.div 
          style={{ y, opacity }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-md md:max-w-lg group" 
        >
          <div className="relative overflow-hidden transition-transform duration-1000 group-hover:scale-[1.01]">
            <img 
              src="https://i.supaimg.com/23bbe892-53d3-41aa-b696-dcdb610fd822/83b7d020-9045-4460-b6a0-330c267a7fe1.png" 
              className="object-contain w-full h-auto block drop-shadow-xl" 
              style={{
                maskImage: 'linear-gradient(to bottom, black 60%, transparent 95%)',
                WebkitMaskImage: 'linear-gradient(to bottom, black 60%, transparent 95%)',
              }}
              alt="Rabab Atelier Artwork"
            />
          </div>

          <motion.div 
            animate={{ opacity: [0.2, 0.4, 0.2], scale: [1, 1.2, 1] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-0 right-0 text-amber-500/30"
          >
            <Sparkles size={24} />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="mt-4 text-center space-y-4"
        >
          <div className="flex items-center justify-center gap-3 mb-1">
            <div className="h-[1px] w-6 bg-stone-200" />
            <span className="text-[9px] font-black tracking-[0.5em] text-stone-400 uppercase">L'Artisanat de Luxe</span>
            <div className="h-[1px] w-6 bg-stone-200" />
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif tracking-tighter leading-[0.95] text-stone-900 italic">
            {t("hero.title")}
          </h1>

          <p className="max-w-sm mx-auto text-stone-500 text-xs md:text-sm font-light tracking-wide leading-relaxed italic opacity-70">
            {t("hero.subtitle")}
          </p>
        </motion.div>
      </div>

      <motion.nav
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="mt-12 flex flex-wrap justify-center items-center gap-x-10 gap-y-4"
      >
        {["artisane", "ateliers", "collection"].map((item) => (
          <a 
            key={item}
            href={`#${item}`} 
            onClick={(e) => scrollToSection(e, item)}
            className="text-[11px] font-bold uppercase tracking-[0.3em] text-amber-700/80 hover:text-amber-900 transition-colors relative group py-1"
          >
            {t(`nav.${item}`)}
            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-amber-600/40 scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-right" />
          </a>
        ))}

        <Link 
          to="/sur-mesure" 
          className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-amber-200 bg-white text-[10px] font-bold uppercase tracking-[0.2em] text-amber-900 hover:bg-amber-900 hover:text-white transition-all duration-500 shadow-sm group"
        >
          <Palette className="w-3 h-3 transition-transform group-hover:rotate-12" />
          {isArabic ? "طلب خاص" : "Sur Mesure"}
        </Link>
      </motion.nav>

      <div className="absolute bottom-6 flex flex-col items-center opacity-20">
        <div className="w-[1px] h-8 bg-stone-400 animate
