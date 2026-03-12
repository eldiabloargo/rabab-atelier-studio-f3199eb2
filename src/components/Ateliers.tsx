import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import atelierImage from "@/assets/atelier.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export const Ateliers = () => {
  const { t } = useLanguage();

  return (
    <section id="ateliers" className="py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-3xl md:text-4xl font-serif text-gold-gradient mb-16 text-center"
        >
          {t("ateliers.title")}
        </motion.h2>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="mb-12"
        >
          <img
            src={atelierImage}
            alt="Atelier créatif de sculpture"
            className="w-full aspect-video object-cover luxury-card shadow-lg"
            loading="lazy"
          />
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
          className="space-y-6 max-w-2xl mx-auto"
        >
          <p className="text-base leading-relaxed text-muted-foreground font-sans">
            {t("ateliers.p1")}
          </p>
          <p className="text-base leading-relaxed text-muted-foreground font-sans">
            {t("ateliers.p2")}
          </p>
          <Link
            to="/infos"
            className="inline-block text-sm tracking-widest uppercase text-muted-foreground font-sans mt-8 hover:text-gold transition-colors duration-500"
          >
            {t("ateliers.cta")}
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
