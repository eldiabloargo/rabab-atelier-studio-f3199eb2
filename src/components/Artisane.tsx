import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Compass, Quote } from "lucide-react";
import { Link } from "react-router-dom";

export const Artisane = () => {
  const { t, isArabic } = useLanguage();

  return (
    <section id="artisane" className="py-40 px-6 bg-[#fafaf9] overflow-hidden">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header with Decorative Element */}
        <div className="flex flex-col items-center mb-24 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="w-12 h-[1px] bg-amber-200"
          />
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-4xl md:text-6xl font-serif text-stone-900 italic tracking-tighter"
          >
            {t("artisane.title")}
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Visual Side with Artistic Frame */}
          <motion.div
            initial={{ opacity: 0, x: isArabic ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative group"
          >
            <div className="relative z-10 aspect-[3/4] rounded-[2rem] overflow-hidden shadow-2xl shadow-stone-200">
              <img
                src="https://i.supaimg.com/23bbe892-53d3-41aa-b696-dcdb610fd822/ee2e3e2f-816a-4297-9850-e6ec0dc56604.jpg"
                alt="Rabab Atelier Artist"
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-stone-900/5 group-hover:bg-transparent transition-colors duration-700" />
            </div>
            
            {/* Decorative "Floating" Frame */}
            <div className={`absolute -inset-4 border border-amber-100 rounded-[2.5rem] -z-10 translate-x-4 translate-y-4 hidden md:block opacity-50`} />
          </motion.div>

          {/* Narrative Side */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="lg:col-span-6 space-y-10 lg:pl-12"
          >
            <div className="relative">
              <Quote className="absolute -top-8 -left-8 w-12 h-12 text-stone-100 -z-10 rotate-180" />
              <p className="text-xl md:text-2xl font-serif text-stone-800 leading-relaxed italic opacity-90">
                {t("artisane.p1")}
              </p>
            </div>
            
            <div className="space-y-6">
              <div className="h-[1px] w-12 bg-amber-600/30" />
              <p className="text-base text-stone-500 font-light leading-loose max-w-md">
                {t("artisane.p2")}
              </p>
            </div>

            {/* Subtle Explorer CTA */}
            <motion.div
              whileHover={{ x: isArabic ? -10 : 10 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="pt-8"
            >
              <Link
                to="/expositions"
                className="inline-flex items-center gap-6 group"
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border border-stone-200 flex items-center justify-center group-hover:border-amber-600 transition-colors duration-500">
                    <Compass className="w-6 h-6 text-stone-400 group-hover:text-amber-700 group-hover:rotate-[360deg] transition-all duration-1000" />
                  </div>
                  <motion.div 
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute inset-0 bg-amber-400 rounded-full -z-10"
                  />
                </div>
                
                <div className="flex flex-col">
                  <span className="text-[10px] font-black tracking-[0.4em] uppercase text-stone-400 group-hover:text-stone-900 transition-colors">
                    {t("artisane.explorer")}
                  </span>
                  <div className="h-[1px] w-0 bg-amber-600 group-hover:w-full transition-all duration-500" />
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
