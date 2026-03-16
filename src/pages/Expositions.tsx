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

  const expos = [
    { title: "expo.agadir.title", desc: "expo.agadir.desc", loc: isArabic ? "أكادير" : "Agadir" },
    { title: "expo.tantan.title", desc: "expo.tantan.desc", loc: isArabic ? "طانطان" : "Tan-Tan" },
    { title: "expo.sahara.title", desc: "expo.sahara.desc", loc: isArabic ? "الصحراء" : "Sahara" }
  ];

  return (
    <main className="min-h-screen bg-[#fafaf9]">
      <div className="max-w-3xl mx-auto px-6 py-20">
        
        <Link to="/" className={`group inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 hover:text-stone-900 transition-all mb-16 ${isArabic ? 'flex-row-reverse' : ''}`}>
          <ArrowLeft className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} />
          {isArabic ? "الرئيسية" : "Accueil"}
        </Link>

        <motion.div initial="hidden" animate="visible" className="space-y-24">
          <motion.div variants={fadeUp} className="text-center space-y-4">
            <Sparkles className="w-5 h-5 text-stone-300 mx-auto" />
            <h1 className="text-4xl md:text-5xl font-serif italic text-stone-800 leading-tight">
              {t("expo.title")}
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">
              {t("expo.subtitle")}
            </p>
          </motion.div>

          <div className="grid gap-10">
            {expos.map((expo, index) => (
              <motion.div key={index} variants={fadeUp} className="group bg-white border border-stone-100 p-10 rounded-[2.5rem] hover:shadow-2xl transition-all duration-500">
                <div className={`space-y-4 ${isArabic ? 'text-right' : 'text-left'}`}>
                  <div className={`flex items-center gap-2 text-amber-700/60 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <MapPin className="w-3 h-3" />
                    <span className="text-[9px] font-black uppercase tracking-widest">{expo.loc}</span>
                  </div>
                  <h2 className="text-2xl font-serif text-stone-800 group-hover:text-amber-900 transition-colors">
                    {t(expo.title)}
                  </h2>
                  <p className="text-stone-500 font-sans text-sm leading-relaxed">
                    {t(expo.desc)}
                  </p>
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
