import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Instagram, MessageCircle, Sparkles, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export const Footer = () => {
  const { t, toggleLang, isArabic } = useLanguage();

  return (
    <footer 
      className={`relative py-12 px-6 bg-white border-t border-stone-100 text-center`} 
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Brand Section - Centralized */}
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-2 text-amber-800/60">
            
            <span className="text-[8px] font-black uppercase tracking-[0.4em]">
              {isArabic ? "صناعة يدوية مغربية" : "Artisanat Marocain"}
            </span>
          </div>

          <h4 className="text-3xl md:text-4xl font-serif text-stone-900 tracking-tight uppercase leading-none">
            Atelier <span className="text-stone-300 font-light">Rabab</span>
          </h4>

          <div className="flex items-center justify-center gap-2 text-stone-400">
            <MapPin size={8} />
            <p className="text-[9px] font-bold uppercase tracking-[0.2em]">
              Tan-Tan — Morocco
            </p>
          </div>

          <p className="max-w-md mx-auto text-stone-500 text-[11px] leading-relaxed font-sans font-light tracking-wide">
            {isArabic 
              ? "دار إبداع متخصصة في صياغة التحف الفنية التي تمزج بين الأصالة المغربية والتصميم العصري."
              : "Maison de création dédiée à l'art de façonner des pièces d'exception, entre héritage marocain et épure contemporaine."}
          </p>
        </div>

        {/* Small Navigation Menu */}
        <nav className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3">
          {['collection', 'sur-mesure', 'expositions'].map((item) => (
            <Link 
              key={item}
              to={`/${item}`} 
              className="text-[9px] font-bold text-stone-400 hover:text-stone-900 uppercase tracking-[0.2em] transition-colors"
            >
              {t(`nav.${item}`)}
            </Link>
          ))}
          <button 
            onClick={toggleLang} 
            className="text-[9px] font-black text-amber-900 hover:underline tracking-widest transition-all"
          >
            {isArabic ? "FRANÇAIS" : "العربية"}
          </button>
        </nav>

        {/* Social Icons - Smaller & Centered */}
        <div className="flex justify-center gap-4">
          {[
            { icon: <Instagram size={14} />, url: "https://instagram.com/rabab.atelier" },
            { icon: <MessageCircle size={14} />, url: "https://wa.me/212679697964" }
          ].map((social, i) => (
            <motion.a
              key={i}
              whileHover={{ y: -2 }}
              href={social.url}
              target="_blank"
              className="w-10 h-10 rounded-full border border-stone-100 flex items-center justify-center text-stone-500 hover:bg-stone-900 hover:text-white transition-all duration-300 shadow-sm"
            >
              {social.icon}
            </motion.a>
          ))}
        </div>

        {/* Minimal Copyright */}
        <div className="pt-6 border-t border-stone-50 max-w-[200px] mx-auto space-y-1">
          <p className="text-[9px] text-stone-300 font-medium uppercase tracking-[0.2em]">
            © 2026 Rabab Atelier 
          </p>
          <p className="text-[7px] text-stone-200 uppercase tracking-[0.1em]">
            {isArabic ? "جميع الحقوق محفوظة للفن" : "All Rights Reserved to Art"}
          </p>
        </div>
      </div>
    </footer>
  );
};
