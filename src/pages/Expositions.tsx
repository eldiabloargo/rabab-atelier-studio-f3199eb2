import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Sparkles, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const Expositions = () => {
  const { t, isArabic } = useLanguage();

  const expos = [
    { title: "expo.agadir.title", desc: "expo.agadir.desc", loc: isArabic ? "أكادير" : "Agadir" },
    { title: "expo.tantan.title", desc: "expo.tantan.desc", loc: isArabic ? "طانطان" : "Tan-Tan" },
    { title: "expo.sahara.title", desc: "expo.sahara.desc", loc: isArabic ? "الصحراء" : "Sahara" }
  ];

  return (
    <main className={`min-h-screen bg-[#fafaf9] selection:bg-amber-50 ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto px-6 pt-24 pb-16">

        {/* Navigation */}
        <Link 
          to="/" 
          className="group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 hover:text-stone-900 transition-all mb-12"
        >
          <ArrowLeft className={`w-3.5 h-3.5 ${isArabic ? 'rotate-180' : ''}`} />
          {isArabic ? "الرئيسية" : "Accueil"}
        </Link>

        <motion.div 
          initial="hidden" 
          animate="visible" 
          className="space-y-16 md:space-y-24"
        >
          {/* Header */}
          <motion.div variants={fadeUp} className="text-center space-y-4">
            <div className="inline-flex items-center justify-center p-2 rounded-full bg-amber-50/50 mb-2">
              <Sparkles className="w-4 h-4 text-amber-600/40" />
            </div>
            <h1 className="text-3xl md:text-5xl font-serif italic text-stone-900 tracking-tight">
              {t("expo.title")}
            </h1>
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">
              {t("expo.subtitle")}
            </p>
            <div className="w-12 h-[1px] bg-amber-200/60 mx-auto pt-4" />
          </motion.div>

          {/* Timeline Expositions */}
          <div className="relative space-y-12 md:space-y-16">
            {/* Vertical Line Connector */}
            <div className={`absolute top-0 bottom-0 w-[1px] bg-stone-100 hidden md:block ${isArabic ? 'right-4' : 'left-4'}`} />

            {expos.map((expo, index) => (
              <motion.div 
                key={index} 
                variants={fadeUp} 
                className="group relative md:pl-12 md:rtl:pr-12 md:rtl:pl-0"
              >
                {/* Timeline Dot */}
                <div className={`absolute top-2 w-2 h-2 rounded-full bg-stone-200 border border-white hidden md:block ${isArabic ? 'right-[13px]' : 'left-[13px]'} group-hover:bg-amber-500 transition-colors duration-500`} />

                <div className="space-y-4">
                  {/* Location & Icon */}
                  <div className="flex items-center gap-2">
                    <Globe className="w-3 h-3 text-amber-600/50" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700/70">
                      {expo.loc}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="bg-white md:bg-transparent p-6 md:p-0 rounded-2xl md:rounded-none border border-stone-100 md:border-none shadow-sm md:shadow-none space-y-3 transition-all">
                    <h2 className="text-xl md:text-2xl font-serif text-stone-800 group-hover:text-amber-900 transition-colors duration-500">
                      {t(expo.title)}
                    </h2>
                    <p className="text-stone-500 font-light text-sm leading-relaxed max-w-2xl">
                      {t(expo.desc)}
                    </p>
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
