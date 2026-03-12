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
  const { t, isArabic } = useLanguage();

  const expos = [
    {
      title: t("expo.agadir.title"),
      desc: t("expo.agadir.desc"),
      location: "Agadir, Maroc",
    },
    {
      title: t("expo.tantan.title"),
      desc: t("expo.tantan.desc"),
      location: "Tan-Tan, Maroc",
    },
    {
      title: t("expo.sahara.title"),
      desc: t("expo.sahara.desc"),
      location: "Sahara, Maroc",
    },
  ];

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

        <motion.div initial="hidden" animate="visible" variants={stagger} className="space-y-20">
          <motion.div variants={fadeUp} transition={{ duration: 1 }} className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-serif text-gold-gradient">
              {t("expo.title")}
            </h1>
            <p className="text-lg text-muted-foreground font-sans">
              {t("expo.subtitle")}
            </p>
          </motion.div>

          <div className="space-y-10">
            {expos.map((expo, index) => (
              <motion.div
                key={index}
                variants={fadeUp}
                transition={{ duration: 0.8 }}
                className="luxury-card border border-border bg-card p-8 space-y-4 hover:shadow-xl transition-shadow duration-500"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-xl md:text-2xl font-serif text-foreground leading-snug">
                    {expo.title}
                  </h2>
                  <div className="flex-shrink-0 w-20 h-20 rounded-lg bg-accent flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-gold" />
                  </div>
                </div>
                <p className="text-sm text-muted-foreground font-sans leading-relaxed">
                  {expo.desc}
                </p>
                <div className="flex items-center gap-2 text-xs text-gold font-sans tracking-wider uppercase">
                  <MapPin className="w-3 h-3" />
                  {expo.location}
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
