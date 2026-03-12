import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Compass } from "lucide-react";
import { Link } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export const Artisane = () => {
  const { t } = useLanguage();

  return (
    <section id="artisane" className="py-32 px-6 bg-accent">
      <div className="max-w-3xl mx-auto">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-3xl md:text-4xl font-serif text-gold-gradient mb-16 text-center"
        >
          {t("artisane.title")}
        </motion.h2>

        <div className="flex flex-col md:flex-row gap-12 items-center">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="md:w-1/2"
          >
            <img
              src="https://i.supaimg.com/23bbe892-53d3-41aa-b696-dcdb610fd822/ee2e3e2f-816a-4297-9850-e6ec0dc56604.jpg"
              alt="Rabab dans son atelier"
              className="w-full aspect-[3/4] object-cover luxury-card shadow-lg"
              loading="lazy"
            />
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="md:w-1/2 space-y-6"
          >
            <p className="text-base leading-relaxed text-muted-foreground font-sans">
              {t("artisane.p1")}
            </p>
            <p className="text-base leading-relaxed text-muted-foreground font-sans">
              {t("artisane.p2")}
            </p>
          </motion.div>
        </div>

        {/* Explorer CTA */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="mt-16 flex justify-center"
        >
          <Link
            to="/expositions"
            className="group flex flex-col items-center gap-3 text-muted-foreground hover:text-gold transition-colors duration-500"
          >
            <div className="w-14 h-14 rounded-full border-2 border-current flex items-center justify-center group-hover:border-gold group-hover:shadow-lg transition-all duration-500">
              <Compass className="w-6 h-6 group-hover:rotate-45 transition-transform duration-500" />
            </div>
            <span className="text-xs tracking-[0.3em] uppercase font-sans font-medium">
              {t("artisane.explorer")}
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
