import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { ArrowUpRight, Hammer, Sparkles } from "lucide-react";
import atelierImage from "@/assets/atelier.jpg";

export const Ateliers = () => {
  const { t, isArabic } = useLanguage();
  const { scrollYProgress } = useScroll();
  
  // تأثير بارالاكس خفيف للصورة لإعطاء عمق للمكان
  const scale = useTransform(scrollYProgress, [0.4, 0.6], [1, 1.05]);

  return (
    <section id="ateliers" className="py-40 px-6 bg-white relative overflow-hidden">
      
      {/* عناصر خلفية تذكيرية بمادة الجبس/الفن */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#fafaf9] -z-10" />

      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col items-center mb-24 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center mb-6"
          >
            <Hammer className="w-4 h-4 text-amber-700 opacity-60" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-6xl font-serif text-stone-900 italic tracking-tighter"
          >
            {t("ateliers.title")}
          </motion.h2>
        </header>

        <div className="relative">
          {/* Main Workshop Image with Parallax */}
          <motion.div
            style={{ scale }}
            className="relative aspect-[21/9] rounded-[3rem] overflow-hidden shadow-2xl shadow-stone-200/50 mb-16"
          >
            <img
              src={atelierImage}
              alt="Atelier créatif Rabab Atelier"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {/* Soft Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent opacity-60" />
            
            {/* Information Tag */}
            <div className={`absolute bottom-8 ${isArabic ? 'left-8' : 'right-8'} flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20`}>
              <Sparkles className="w-3 h-3 text-white/80" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white">Atelier a Tantan</span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="space-y-6"
            >
              <p className="text-xl font-serif text-stone-800 leading-relaxed italic border-l-2 border-amber-200 pl-8 rtl:border-r-2 rtl:border-l-0 rtl:pr-8">
                {t("ateliers.p1")}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.4 }}
              className="space-y-10"
            >
              <p className="text-base text-stone-500 font-light leading-loose">
                {t("ateliers.p2")}
              </p>

              <Link
                to="/infos"
                className="group inline-flex items-center gap-4 bg-stone-900 text-white px-8 py-5 rounded-[2rem] shadow-xl shadow-stone-200 hover:bg-amber-900 transition-all duration-700 overflow-hidden relative"
              >
                <span className="text-[10px] font-black uppercase tracking-[0.3em] relative z-10">
                  {t("ateliers.cta")}
                </span>
                <ArrowUpRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                
                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
