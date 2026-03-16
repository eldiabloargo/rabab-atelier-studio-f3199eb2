import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.2 } },
};

const Expositions = () => {
  const { isArabic } = useLanguage();

  // البيانات محطوطة هنا مباشرة باش متبقاش الصفحة بيضاء
  const expos = [
    {
      title: isArabic ? "معرض أكادير الدولي" : "Exposition Internationale d'Agadir",
      desc: isArabic 
        ? "مشاركة متميزة عرضنا فيها أحدث إبداعاتنا في الديكور المنزلي التقليدي بلمسة عصرية."
        : "Une participation distinguée où nous avons présenté nos dernières créations en décoration artisanale.",
      location: isArabic ? "أكادير، المغرب" : "Agadir, Maroc",
    },
    {
      title: isArabic ? "موسم طانطان العالمي" : "Moussem de Tan-Tan",
      desc: isArabic 
        ? "حضور في قلب التراث الصحراوي المغربي، احتفاءً بالصناعة التقليدية الأصيلة."
        : "Une présence au cœur du patrimoine saharien, célébrant l'artisanat authentique du Maroc.",
      location: isArabic ? "طانطان، المغرب" : "Tan-Tan, Maroc",
    },
    {
      title: isArabic ? "لقاء الصحراء للابتكار" : "Rencontre Sahara Innovation",
      desc: isArabic 
        ? "تكريم خاص لمنتجاتنا كأفضل تصميم يجمع بين الأصالة والحداثة."
        : "Prix spécial pour nos produits alliant design moderne et savoir-faire ancestral.",
      location: isArabic ? "الصحراء، المغرب" : "Sahara, Maroc",
    },
  ];

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <Link
          to="/"
          className={`inline-flex items-center gap-2 text-sm text-stone-400 hover:text-amber-700 transition-colors mb-16 tracking-widest uppercase font-sans ${isArabic ? 'flex-row-reverse' : ''}`}
        >
          <ArrowLeft className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} />
          {isArabic ? "الرئيسية" : "Accueil"}
        </Link>

        <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-20">
          <motion.div variants={fadeUp} transition={{ duration: 1 }} className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-serif text-stone-800 italic">
              {isArabic ? "معارضنا" : "Expositions"}
            </h1>
            <p className="text-lg text-stone-400 font-sans">
              {isArabic ? "لحظات من الفخر والإبداع" : "Nos moments de fierté et de création"}
            </p>
          </motion.div>

          <div className="space-y-10">
            {expos.map((expo, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                transition={{ duration: 0.8 }}
                className="bg-white border border-stone-100 p-8 space-y-4 hover:shadow-2xl transition-all duration-500 rounded-[2.5rem]"
              >
                <div className={`flex items-start justify-between gap-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <div className={isArabic ? 'text-right' : 'text-left'}>
                    <h2 className="text-xl md:text-2xl font-serif text-stone-800 leading-snug">
                      {expo.title}
                    </h2>
                    <div className={`flex items-center gap-2 text-[10px] text-amber-600 font-sans tracking-[0.3em] uppercase mt-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                      <MapPin className="w-3 h-3" />
                      {expo.location}
                    </div>
                  </div>
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-stone-50 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-stone-200" />
                  </div>
                </div>
                <p className={`text-sm text-stone-500 font-sans leading-relaxed ${isArabic ? 'text-right' : 'text-left'}`}>
                  {expo.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </main>
  );
};

export default Expositions;
