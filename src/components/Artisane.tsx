import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Compass, Quote, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export const Artisane = () => {
  const { t, isArabic } = useLanguage();

  return (
   
    <section id="artisane" className="py-16 md:py-24 px-4 md:px-6 bg-[#fafaf9] overflow-hidden relative">

      <div className="absolute top-0 left-0 w-64 h-64 bg-amber-50/50 blur-[100px] rounded-full -z-10" />

      <div className="max-w-5xl mx-auto">
        
       
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center mb-16 text-center"
        >
                   <div className="flex items-center gap-3 mb-2">
            < size={12} className="text-amber-600/40" />
            <span className="text-[10px] font-black tracking-[0.6em] text-stone-400 uppercase">About</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif italic text-stone-900 tracking-tighter capitalize">
             L'Artisane
          </h2>
          <div className="h-[1px] w-12 bg-amber-200 mt-4" />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-11 gap-12 items-center">

          
          <motion.div 
            initial={{ opacity: 0, x: isArabic ? 30 : -30 }} 
            whileInView={{ opacity: 1, x: 0 }} 
            viewport={{ once: true }} 
            className="lg:col-span-5 relative group"
          >
            <div className="relative z-10 aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl transition-transform duration-700 group-hover:scale-[1.02]">
              <img 
                src="https://i.supaimg.com/23bbe892-53d3-41aa-b696-dcdb610fd822/ee2e3e2f-816a-4297-9850-e6ec0dc56604.jpg" 
                alt="Rabab" 
                className="w-full h-full object-cover" 
              />
            </div>
           
            <div className={`absolute -bottom-4 ${isArabic ? '-left-4' : '-right-4'} w-full h-full border border-amber-200/50 rounded-[2rem] -z-10`} />
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }} 
            className="lg:col-span-6 space-y-8 text-center lg:text-start"
          >
            <div className="relative inline-block lg:block">
             
              <Quote className={`absolute -top-6 ${isArabic ? '-right-8' : '-left-8 rotate-180'} w-10 h-10 text-amber-100/40 -z-10`} />
              <p className="text-lg md:text-2xl font-serif text-stone-800 italic leading-snug">
                {t("artisane.p1")}
              </p>
            </div>

            <p className="text-sm md:text-base text-stone-500 font-light leading-relaxed max-w-md mx-auto lg:mx-0 opacity-80">
              {t("artisane.p2")}
            </p>

            <div className="pt-4 flex justify-center lg:justify-start">
              <Link to="/expositions" className="inline-flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center group-hover:border-amber-600 group-hover:bg-amber-50/30 transition-all duration-500">
                  <Compass className="w-5 h-5 text-stone-400 group-hover:text-amber-800 group-hover:rotate-[360deg] transition-all duration-1000" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-[9px] font-black tracking-[0.4em] uppercase text-stone-400 group-hover:text-stone-900 transition-colors">
                    {t("artisane.explorer")}
                  </span>
                  
                  <div className="h-[1px] w-0 bg-amber-600 group-hover:w-full transition-all duration-500 origin-right" />
                </div>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
