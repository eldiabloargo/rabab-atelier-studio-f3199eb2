import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.2 } },
};

export const Infos = () => {
  const { t, isArabic } = useLanguage();

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
    <main className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors mb-16 tracking-widest uppercase font-sans"
        >
          <ArrowLeft className="w-4 h-4" />
          {isArabic ? "الرئيسية" : "Accueil"}
        </Link>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="space-y-20"
        >
          <motion.div variants={fadeUp} transition={{ duration: 1 }} className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-serif text-gold-gradient">
              {t("infos.title")}
            </h1>
            <p className="text-lg text-muted-foreground font-sans">
              {t("infos.subtitle")}
            </p>
          </motion.div>

          <div className="space-y-16">
            {steps.map((step) => (
              <motion.div
                key={step.num}
                variants={fadeUp}
                transition={{ duration: 0.8 }}
                className="flex gap-8 items-start"
              >
                <span className="text-5xl font-serif text-gold/30 flex-shrink-0 leading-none">
                  {step.num}
                </span>
                <div className="space-y-3">
                  <h2 className="text-2xl font-serif text-foreground">{step.title}</h2>
                  <p className="text-base leading-relaxed text-muted-foreground font-sans">
                    {step.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUp} transition={{ duration: 0.8 }} className="text-center pt-10 border-t border-border">
            <h3 className="text-2xl font-serif text-foreground mb-6">{t("infos.contact")}</h3>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gold text-white font-sans text-sm tracking-widest uppercase rounded-lg hover:bg-gold-dark transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              {t("infos.whatsapp")}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
};

export default Infos;
