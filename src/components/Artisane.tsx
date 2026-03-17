import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Compass, Quote } from "lucide-react";
import { Link } from "react-router-dom";

export const Artisane = () => {
  const { t, isArabic } = useLanguage();

  return (
    <section id="artisane" className="py-20 md:py-32 px-4 md:px-6 bg-[#fafaf9] overflow-hidden">
      <div className="max-w-5xl mx-auto">

        {/* Section Header */}
        <div className="flex flex-col items-center mb-12 md:mb-20 space-y-4">
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            whileInView={{ opacity: 1, width: 48 }}
            viewport={{ once: true }}
            className="h-[1px] bg-amber-300"
          />
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl md:text-4xl font-serif text-stone-900 italic tracking-tight text-center"
          >
            {t("artisane.title")}
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-11 gap-10 md:gap-16 items-center">

          {/* Visual Side */}
          <motion.div
            initial={{ opacity: 0, x: isArabic ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="lg:col-span-5 relative group"
          >
            <div className="relative z-10 aspect-[4/5] md:aspect-[3/4] rounded-2xl md:rounded-[2.5rem] overflow-hidden shadow-xl">
              <img
                src="https://i.supaimg.com/23bbe892-53d3-41aa-b696-dcdb610fd822/ee2e3e2f-816a-4297-9850-e6ec0dc56604.jpg"
                alt="Rabab Atelier Artist"
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-transparent transition-colors duration-700" />
            </div>
            
            {/* Minimalist Decoration for Desktop only */}
            <div className={`absolute -inset-3 border border-amber-100/50 rounded-[2.8rem] -z-10 translate-x-3 translate-y-3 hidden lg:block`} />
          </motion.div>

          {/* Narrative Side */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-6 space-y-6 md:space-y-10 lg:pl-10 text-center lg:text-start"
          >
            <div className="relative inline-block lg:block">
              <Quote className={`absolute -top-4 ${isArabic ? '-right-6 rotate-0' : '-left-6 rotate-180'} w-8 h-8 text-stone-100 -z-10`} />
              <p className="text-lg md:text-xl font-serif text-stone-800 leading-relaxed italic opacity-95">
                {t("artisane.p1")}
              </p>
            </div>

            <div className={`flex flex-col ${isArabic ? 'lg:items-end' : 'lg:items-start'} items-center space-y-4`}>
              <div className="h-[1px] w-10 bg-amber-600/30" />
              <p className="text-sm md:text-base text-stone-500 font-light leading-relaxed max-w-md">
                {t("artisane.p2")}
              </p>
            </div>

            {/* Subtle Explorer CTA */}
            <div className="pt-4 flex justify-center lg:justify-start">
              <Link
                to="/expositions"
                className="inline-flex items-center gap-4 group"
              >
                <div className="relative shrink-0">
                  <div className="w-12 h-12 md:w-14 md:h-14 rounded-full border border-stone-200 flex items-center justify-center group-hover:border-amber-600 transition-all duration-500">
                    <Compass className="w-5 h-5 text-stone-400 group-hover:text-amber-700 group-hover:rotate-[360deg] transition-all duration-1000" />
                  </div>
                </div>

                <div className="flex flex-col items-start">
                  <span className="text-[9px] md:text-[10px] font-black tracking-[0.3em] uppercase text-stone-400 group-hover:text-stone-900 transition-colors">
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
