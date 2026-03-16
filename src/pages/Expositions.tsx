import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, MapPin, Sparkles, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

const Expositions = () => {
  const { t, isArabic } = useLanguage();

  const expos = [
    { title: "expo.agadir.title", desc: "expo.agadir.desc", loc: isArabic ? "أكادير" : "Agadir" },
    { title: "expo.tantan.title", desc: "expo.tantan.desc", loc: isArabic ? "طانطان" : "Tan-Tan" },
    { title: "expo.sahara.title", desc: "expo.sahara.desc", loc: isArabic ? "الصحراء" : "Sahara" }
  ];

  return (
    <main className="min-h-screen bg-[#fafaf9] selection:bg-amber-50">
      <div className="max-w-4xl mx-auto px-6 py-24">
        
        {/* Navigation - Minimalist & Elegant */}
        <Link 
          to="/" 
          className={`group inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 hover:text-stone-900 transition-all mb-24 ${isArabic ? 'flex-row-reverse' : ''}`}
        >
          <ArrowLeft className={`w-3.5 h-3.5 transition-transform group-hover:-translate-x-1 ${isArabic ? 'rotate-180 group-hover:translate-x-1' : ''}`} />
          {isArabic ? "الرئيسية" : "Accueil"}
        </Link>

        <motion.div 
          initial="hidden" 
          animate="visible" 
          className="space-y-32"
        >
          {/* Section Header */}
          <motion.div variants={fadeUp} className="text-center space-y-6">
            <div className="inline-flex items-center justify-center p-3 rounded-full bg-white border border-stone-100 mb-2">
              <Sparkles className="w-4 h-4 text-amber-600/50" />
            </div>
            <h1 className="text-5xl md:text-6xl font-serif italic text-stone-800 leading-[1.1] tracking-tight">
              {t("expo.title")}
            </h1>
            <div className="w-16 h-[1px] bg-amber-200/60 mx-auto my-8" />
            <p className="text-[11px] font-black uppercase tracking-[0.5em] text-stone-400">
              {t("expo.subtitle")}
            </p>
          </motion.div>

          {/* Expositions Grid */}
          <div className="grid gap-20">
            {expos.map((expo, index) => (
              <motion.div 
                key={index} 
                variants={fadeUp} 
                className="group relative"
              >
                {/* Decorative Line for Timeline Feel */}
                <div className={`absolute top-0 bottom-0 w-[1px] bg-stone-100 hidden md:block ${isArabic ? '-right-10' : '-left-10'}`} />
                
                <div className={`grid md:grid-cols-[1fr_2fr] gap-8 items-start ${isArabic ? 'md:text-right' : 'md:text-left'}`}>
                  
                  {/* Location Tag */}
                  <div className={`flex items-center gap-3 pt-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <div className="w-8 h-8 rounded-full border border-stone-100 flex items-center justify-center bg-white group-hover:border-amber-200 transition-colors duration-500">
                      <Globe className="w-3 h-3 text-stone-300 group-hover:text-amber-600 transition-colors" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700/70">
                      {expo.loc}
                    </span>
                  </div>

                  {/* Content Card */}
                  <div className="space-y-6">
                    <h2 className="text-2xl md:text-3xl font-serif text-stone-800 group-hover:text-amber-900 transition-colors duration-500 leading-snug">
                      {t(expo.title)}
                    </h2>
                    <div className="relative">
                      <p className="text-stone-500 font-sans text-sm leading-[1.8] max-w-2xl">
                        {t(expo.desc)}
                      </p>
                      {/* Subtle Glow on hover */}
                      <div className="absolute -inset-4 bg-amber-50/0 group-hover:bg-amber-50/30 -z-10 rounded-[2rem] transition-all duration-700" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default Expositions;
