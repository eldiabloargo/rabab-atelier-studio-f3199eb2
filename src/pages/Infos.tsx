import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export const Infos = () => {
  const { t, isArabic } = useLanguage();

  useEffect(() => {
    const navbar = document.querySelector('nav');
    if (navbar) {
      navbar.style.display = 'none';
    }
    return () => {
      if (navbar) {
        navbar.style.display = 'flex';
      }
    };
  }, []);

  const steps = [
    { title: t("infos.step1.title"), desc: t("infos.step1.desc"), num: "01" },
    { title: t("infos.step2.title"), desc: t("infos.step2.desc"), num: "02" },
    { title: t("infos.step3.title"), desc: t("infos.step3.desc"), num: "03" },
  ];

  const whatsappMsg = isArabic
    ? "السلام عليكم، بغيت نعرف أكثر على الأتيلييه ديالكم من فضلكم."
    : "Bonjour, j'aimerais en savoir plus sur votre atelier et vos créations.";
  const whatsappUrl = `https://wa.me/212679697964?text=${encodeURIComponent(whatsappMsg)}`;

  return (
    <main className="h-screen w-full bg-[#fafaf9] overflow-hidden flex flex-col justify-center">
      <div className="max-w-4xl mx-auto px-8 w-full">
        {/* نقصت الفراغ تحت زر العودة من mb-8 لـ mb-4 */}
        <Link
          to="/"
          className={`inline-flex items-center gap-2 text-[10px] text-stone-400 hover:text-stone-900 transition-colors mb-4 tracking-[0.3em] uppercase font-sans ${isArabic ? 'flex-row-reverse' : ''}`}
        >
          <ArrowLeft className={`w-3 h-3 ${isArabic ? 'rotate-180' : ''}`} />
          {isArabic ? "الرئيسية" : "Accueil"}
        </Link>

        {/* نقصت الفراغ بين الأقسام من space-y-12 لـ space-y-8 */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="space-y-8"
        >
          <motion.div variants={fadeUp} className="text-center space-y-1">
            <h1 className="text-3xl md:text-5xl font-serif text-stone-900 tracking-tighter font-medium">
              {t("infos.title")}
            </h1>
            <p className="text-sm text-stone-500 font-sans tracking-wide">
              {t("infos.subtitle")}
            </p>
          </motion.div>

          {/* نقصت الفراغات بين الخطوات */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {steps.map((step) => (
              <motion.div
                key={step.num}
                variants={fadeUp}
                className="space-y-3 text-center md:text-left rtl:md:text-right"
              >
                <span className="text-3xl font-serif text-amber-600/20 block leading-none">
                  {step.num}
                </span>
                <div className="space-y-1">
                  <h2 className="text-lg font-serif text-stone-800 font-medium">{step.title}</h2>
                  <p className="text-xs leading-relaxed text-stone-500 font-sans font-light">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* نقصت الفراغ فوق زر الواتساب من pt-8 لـ pt-6 */}
          <motion.div variants={fadeUp} className="text-center pt-6 border-t border-stone-100">
            <h3 className="text-sm font-serif text-stone-400 mb-4 italic tracking-tight">{t("infos.contact")}</h3>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-4 px-10 py-4 bg-stone-900 text-white font-sans text-[10px] tracking-[0.4em] uppercase rounded-full hover:bg-amber-900 transition-all duration-700 shadow-lg shadow-stone-200"
            >
              <MessageCircle className="w-4 h-4 transition-transform group-hover:scale-110" />
              {t("infos.whatsapp")}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
};

export default Infos;
