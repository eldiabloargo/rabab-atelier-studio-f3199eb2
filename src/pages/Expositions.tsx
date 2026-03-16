import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, MapPin, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const Expositions = () => {
  // استخراج الدالة t و isArabic مع حماية في حالة كان الـ Context غير متوفر
  const lang = useLanguage();
  const isArabic = lang?.isArabic || false;
  const t = lang?.t;

  // دالة مساعدة لجلب النص بأمان
  const getText = (key: string, fallback: string) => {
    if (t) {
      const translated = t(key);
      return translated !== key ? translated : fallback;
    }
    return fallback;
  };

  const expos = [
    {
      title: getText("expo.agadir.title", isArabic ? "معرض أكادير الدولي" : "Exposition d'Agadir"),
      desc: getText("expo.agadir.desc", isArabic ? "مشاركة متميزة عرضنا فيها أرقى لمسات الديكور المنزلي." : "Une immersion dans l'art de vivre marocain à travers nos créations."),
      location: isArabic ? "أكادير" : "Agadir",
      date: "2025"
    },
    {
      title: getText("expo.tantan.title", isArabic ? "موسم طانطان العالمي" : "Moussem de Tan-Tan"),
      desc: getText("expo.tantan.desc", isArabic ? "احتفاء بالتراث الأصيل وجمالية الصناعة التقليدية الصحراوية." : "Célébration de l'artisanat saharien et de notre héritage ancestral."),
      location: isArabic ? "طانطان" : "Tan-Tan",
      date: "2024"
    }
  ];

  return (
    <main className="min-h-screen bg-[#fafaf9] selection:bg-stone-200">
      <div className="max-w-4xl mx-auto px-6 py-24">
        
        {/* زر الرجوع بلمسة ناعمة */}
        <Link
          to="/"
          className={`group inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 hover:text-stone-900 transition-all mb-20 ${isArabic ? 'flex-row-reverse' : ''}`}
        >
          <ArrowLeft className={`w-4 h-4 transition-transform group-hover:-translate-x-1 ${isArabic ? 'rotate-180 group-hover:translate-x-1' : ''}`} />
          {isArabic ? "الرئيسية" : "Accueil"}
        </Link>

        <motion.div initial="hidden" animate="visible" transition={{ staggerChildren: 0.1 }} className="space-y-24">
          
          {/* Header بتصميم Minimalist */}
          <motion.div variants={fadeUp} className="space-y-6 text-center">
            <div className="flex justify-center mb-4">
              <Sparkles className="w-5 h-5 text-stone-300" />
            </div>
            <h1 className="text-5xl md:text-6xl font-serif italic text-stone-800 leading-tight">
              {getText("expo.title", isArabic ? "معارضنا" : "Expositions")}
            </h1>
            <div className="w-12 h-[1px] bg-stone-200 mx-auto my-6" />
            <p className="text-stone-400 font-sans tracking-wide max-w-lg mx-auto leading-relaxed">
              {getText("expo.subtitle", isArabic ? "سجل من الإبداع والتميز في كبرى المحافل" : "Récit de nos escales créatives à travers le Royaume")}
            </p>
          </motion.div>

          {/* القائمة بتصميم Luxury Cards */}
          <div className="grid gap-16">
            {expos.map((expo, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                className={`group relative grid md:grid-cols-[1fr_auto_2fr] gap-8 items-center ${isArabic ? 'md:text-right' : 'md:text-left'}`}
              >
                {/* التاريخ كخلفية خفيفة */}
                <div className={`hidden md:block text-4xl font-serif italic text-stone-100 transition-colors group-hover:text-stone-200 ${isArabic ? 'text-left' : 'text-right'}`}>
                  {expo.date}
                </div>

                {/* فاصل عمودي ناعم */}
                <div className="hidden md:block w-[1px] h-20 bg-stone-100 group-hover:bg-amber-200 transition-colors" />

                {/* محتوى المعرض */}
                <div className="space-y-4">
                  <div className={`flex items-center gap-3 text-amber-700/60 ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <MapPin className="w-3 h-3" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{expo.location}</span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-serif text-stone-800 group-hover:text-amber-900 transition-colors">
                    {expo.title}
                  </h2>
                  <p className="text-stone-500 font-sans text-sm leading-relaxed max-w-xl">
                    {expo.desc}
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
