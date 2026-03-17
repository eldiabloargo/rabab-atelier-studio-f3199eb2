import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Compass, Quote } from "lucide-react";
import { Link } from "react-router-dom";

export const Artisane = () => {
  const { t, isArabic } = useLanguage();

  return (
    <section id="artisane" className="py-20 md:py-32 px-4 md:px-6 bg-[#fafaf9] overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-11 gap-12 items-center">
          
          <motion.div initial={{ opacity: 0, x: isArabic ? 30 : -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-5 relative">
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-xl">
              <img src="https://i.supaimg.com/23bbe892-53d3-41aa-b696-dcdb610fd822/ee2e3e2f-816a-4297-9850-e6ec0dc56604.jpg" alt="Rabab" className="w-full h-full object-cover" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:col-span-6 space-y-8 text-center lg:text-start">
            <div className="relative inline-block lg:block">
              <Quote className={`absolute -top-4 ${isArabic ? '-right-6 rotate-0' : '-left-6 rotate-180'} w-8 h-8 text-stone-100 -z-10`} />
              <p className="text-lg md:text-xl font-serif text-stone-800 italic">{t("artisane.p1")}</p>
            </div>
            
            <p className="text-sm md:text-base text-stone-500 font-light leading-relaxed max-w-md mx-auto lg:mx-0">{t("artisane.p2")}</p>

            <div className="pt-4 flex justify-center lg:justify-start">
              <Link to="/expositions" className="inline-flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center group-hover:border-amber-600 transition-all">
                  <Compass className="w-5 h-5 text-stone-400 group-hover:text-amber-700 group-hover:rotate-[360deg] transition-all duration-1000" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[9px] font-black tracking-[0.3em] uppercase text-stone-400 group-hover:text-stone-900 transition-colors">
                    {t("artisane.explorer")}
                  </span>
                  <div className="h-[1px] w-0 bg-amber-600 group-hover:w-full transition-all duration-500" />
                </div>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
