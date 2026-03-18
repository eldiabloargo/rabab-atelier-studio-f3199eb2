import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { ArrowUpRight, Hammer, Sparkles } from "lucide-react";
import atelierImage from "@/assets/atelier.jpg";

export const Ateliers = () => {
  const { t, isArabic } = useLanguage();
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0.4, 0.6], [1, 1.03]);

  return (
    <section id="ateliers" className="py-32 px-6 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-[#fafaf9] -z-10" />

      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col items-center mb-16 text-center">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="w-10 h-10 flex items-center justify-center mb-4"
          >
            <Hammer className="w-4 h-4 text-amber-600/40" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-serif text-stone-900 italic tracking-tighter"
          >
            {t("ateliers.title")}
          </motion.h2>
        </header>

        <div className="relative">
          <motion.div
            style={{ scale }}
            className="relative aspect-[21/9] rounded-[2rem] overflow-hidden shadow-sm mb-6"
          >
            <img
              src={atelierImage}
              alt="Atelier Rabab"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* التعديل الجديد: التاغ تحت التصويرة بلون أصفر خفيف وصغير */}
          <div className={`flex items-center gap-2 mb-12 ${isArabic ? 'justify-start' : 'justify-end'}`}>
            <Sparkles className="w-3 h-3 text-amber-500/60" />
            <span className="text-[9px] font-medium uppercase tracking-[0.4em] text-amber-600/80">
              Atelier à Tan-Tan
            </span>
          </div>

          <div className="max-w-3xl mx-auto space-y-12 text-center">
            {/* النص بستايل أنيق وغير متعب للعين */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="space-y-6"
            >
              <p className="text-lg md:text-xl font-serif text-stone-700 leading-relaxed italic opacity-90">
                {t("ateliers.p1")}
              </p>
              <p className="text-sm text-stone-500 font-light leading-relaxed max-w-2xl mx-auto">
                {t("ateliers.p2")}
              </p>
            </motion.div>

            {/* الزر الفخم في الوسط ومرتبط بصفحة Infos */}
            <div className="flex justify-center pt-8">
              <Link
                to="/infos"
                className="group relative inline-flex items-center gap-6 px-12 py-5 bg-stone-900 text-white rounded-full overflow-hidden transition-all duration-700 hover:shadow-2xl hover:shadow-stone-200"
              >
                <span className="text-[10px] font-black uppercase tracking-[0.5em] relative z-10">
                  {t("ateliers.cta")}
                </span>
                <ArrowUpRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                
                {/* تأثير الإضاءة عند التحويم */}
                <div className="absolute inset-0 bg-gradient-to-r from-amber-800 to-stone-900 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
