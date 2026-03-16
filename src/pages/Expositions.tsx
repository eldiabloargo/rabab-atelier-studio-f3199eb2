import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, MapPin, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const Expositions = () => {
  const { t, isArabic } = useLanguage();

  // مصفوفة المعارض باستعمال الـ Keys الموجودة في ملف الترجمة حصراً
  const expos = [
    {
      titleKey: "expo.agadir.title",
      descKey: "expo.agadir.desc",
      location: isArabic ? "أكادير، المغرب" : "Agadir, Maroc",
    },
    {
      titleKey: "expo.tantan.title",
      descKey: "expo.tantan.desc",
      location: isArabic ? "طانطان، المغرب" : "Tan-Tan, Maroc",
    },
    {
      titleKey: "expo.sahara.title",
      descKey: "expo.sahara.desc",
      location: isArabic ? "الصحراء، المغرب" : "Sahara, Maroc",
    },
  ];

  return (
    <main className="min-h-screen bg-[#fafaf9] selection:bg-stone-200">
      <div className="max-w-3xl mx-auto px-6 py-24">
        
        <Link
          to="/"
          className={`group inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 hover:text-stone-900 transition-all mb-20 ${isArabic ? 'flex-row-reverse' : ''}`}
        >
          <ArrowLeft className={`w-4 h-4 transition-transform group-hover:-translate-x-1 ${isArabic ? 'rotate-180 group-hover:translate-x-1' : ''}`} />
          {isArabic ? "الرئيسية" : "Accueil"}
        </Link>

        <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.1 }} className="space-y-24">
          
          <motion.div variants={fadeUp} className="space-y-6 text-center">
            <Sparkles className="w-5 h-5 text-stone-300 mx-auto" />
            <h1 className="text-4xl md:text-5xl font-serif italic text-stone-800 leading-tight">
              {t("expo.title")}
            </h1>
            <div className="w-12 h-[1px] bg-stone-200 mx-auto my-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">
              {t("expo.subtitle")}
            </p>
          </motion.div>

          <div className="grid gap-12">
            {expos.map((expo, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                className="group relative bg-white border border-stone-100 p-10 rounded-[2.5rem] hover:shadow-2xl hover:shadow-stone-200/50 transition-all duration-700"
              >
                <div className={`space-y-6 ${isArabic ? 'text-right' : 'text-left'}`}>
                  <div className={`flex items-center gap-3 text-amber-700/60 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <MapPin className="w-3 h-3" />
                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">{expo.location}</span>
                  </div>
                  
                  <h2 className="text-xl md:text-2xl font-serif text-stone-800 group-hover:text-amber-900 transition-colors duration-500">
                    {t(expo.titleKey)}
                  </h2>
                  
                  <p className="text-stone-500 font-sans text-sm leading-relaxed max-w-2xl transition-colors group-hover:text-stone-600">
                    {t(expo.descKey)}
                  </p>
                </div>

                {/* عنصر زخرفي خفيف */}
                <div className={`absolute bottom-8 ${isArabic ? 'left-8' : 'right-8'} opacity-10 group-hover:opacity-30 transition-opacity`}>
                  <Sparkles className="w-8 h-8 text-stone-300" />
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