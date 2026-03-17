import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Sparkles, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export const Expositions = () => {
  const { t, isArabic } = useLanguage();

  const expos = [
    { title: "expo.agadir.title", desc: "expo.agadir.desc", loc: isArabic ? "أكادير" : "Agadir" },
    { title: "expo.tantan.title", desc: "expo.tantan.desc", loc: isArabic ? "طانطان" : "Tan-Tan" },
    { title: "expo.sahara.title", desc: "expo.sahara.desc", loc: isArabic ? "الصحراء" : "Sahara" }
  ];

  return (
    <main className={`min-h-screen bg-[#fafaf9] pt-24 pb-16 ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto px-6">
        <Link to="/" className="group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 hover:text-stone-900 transition-all mb-12">
          <ArrowLeft className={`w-3.5 h-3.5 ${isArabic ? 'rotate-180' : ''}`} />
          {isArabic ? "الرئيسية" : "Accueil"}
        </Link>

        <motion.div initial="hidden" animate="visible" className="space-y-16">
          <motion.div variants={fadeUp} className="text-center space-y-4">
            <h1 className="text-3xl md:text-5xl font-serif italic text-stone-900">{t("expo.title")}</h1>
            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">{t("expo.subtitle")}</p>
          </motion.div>

          <div className="relative space-y-12">
            <div className={`absolute top-0 bottom-0 w-[1px] bg-stone-100 hidden md:block ${isArabic ? 'right-4' : 'left-4'}`} />
            {expos.map((expo, index) => (
              <motion.div key={index} variants={fadeUp} className="group relative md:pl-12 md:rtl:pr-12 md:rtl:pl-0">
                <div className={`absolute top-2 w-2 h-2 rounded-full bg-stone-200 border border-white hidden md:block ${isArabic ? 'right-[13px]' : 'left-[13px]'} group-hover:bg-amber-500 transition-colors`} />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Globe className="w-3 h-3 text-amber-600/50" />
                    <span className="text-[10px] font-bold uppercase text-amber-700/70">{expo.loc}</span>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm md:shadow-none md:bg-transparent md:p-0">
                    <h2 className="text-xl font-serif text-stone-800">{t(expo.title)}</h2>
                    <p className="text-stone-500 text-sm leading-relaxed max-w-2xl">{t(expo.desc)}</p>
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
