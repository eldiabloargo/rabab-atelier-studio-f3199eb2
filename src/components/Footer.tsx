import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

export const Footer = () => {
  const { t, toggleLang, isArabic } = useLanguage();

  return (
    <footer className="py-20 px-6 border-t border-border">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-4">
            <h4 className="text-xl font-serif text-gold-gradient">Rabab Atelier</h4>
            <p className="text-sm text-muted-foreground font-sans leading-relaxed">
              Tantan, Maroc
            </p>
            <a
              href="https://wa.me/212679697964"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground font-sans hover:text-gold transition-colors duration-300"
            >
              +212 679 697 964
            </a>
          </div>

          <div className="flex flex-col gap-3 text-sm tracking-widest uppercase text-muted-foreground font-sans">
            <Link to="/expositions" className="hover:text-gold transition-colors duration-500">
              {t("nav.expositions")}
            </Link>
            <a
              href="https://www.instagram.com/rabab.atelier?igsh=MTd5ZGZ6MnhzaGZoOA=="
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors duration-500"
            >
              Instagram
            </a>
            <a
              href="https://wa.me/212679697964"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold transition-colors duration-500"
            >
              WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground font-sans">
            {t("footer.rights")}
          </p>
          <button
            className="text-xs text-muted-foreground font-sans hover:text-gold transition-colors duration-500 tracking-wide"
            onClick={toggleLang}
          >
            {t("footer.langLabel")} {t("footer.langToggle")}
          </button>
        </div>
      </div>
    </footer>
  );
};
