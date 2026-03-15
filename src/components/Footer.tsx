import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Instagram, MessageCircle, MapPin, Phone, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const Footer = () => {
  const { t, toggleLang, isArabic } = useLanguage();

  return (
    <footer 
      className={`py-24 px-6 border-t border-stone-100 bg-white ${isArabic ? 'text-right' : 'text-left'}`} 
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-20 items-start">

          {/* Brand Identity */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h4 className="text-3xl font-serif text-stone-900 tracking-tighter">
                Atelier <span className="text-amber-600">Rabab</span>
              </h4>
              <p className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.3em] leading-relaxed max-w-[200px]">
                {isArabic ? "فن الصناعة التقليدية المغربية بلمسة عصرية" : "Modern Moroccan Craftsmanship"}
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-stone-500 group">
                <div className="p-2 rounded-full bg-stone-50 group-hover:bg-amber-50 transition-colors">
                  <MapPin className="w-3.5 h-3.5 text-amber-600/60" />
                </div>
                <span className="text-[11px] font-bold tracking-widest uppercase">Tantan, Maroc</span>
              </div>
              <a 
                href="https://wa.me/212679697964" 
                className="flex items-center gap-4 text-stone-500 hover:text-stone-900 transition-all group"
              >
                <div className="p-2 rounded-full bg-stone-50 group-hover:bg-amber-600 transition-colors">
                  <Phone className="w-3.5 h-3.5 text-amber-600/60 group-hover:text-white" />
                </div>
                <span className="text-[11px] font-bold tracking-[0.15em]">+212 679 697 964</span>
              </a>
            </div>
          </div>

          {/* Navigation - Minimalist List */}
          <div className="flex flex-col gap-5 text-[11px] font-bold text-stone-400 uppercase tracking-[0.2em]">
            <span className="text-stone-900 mb-2 flex items-center gap-2">
              <div className="w-4 h-[1px] bg-amber-600" />
              {isArabic ? "اكتشف" : "Explore"}
            </span>
            <Link to="/expositions" className="hover:text-stone-900 transition-colors duration-300 w-fit">
              {t("nav.expositions")}
            </Link>
            <Link to="/sur-mesure" className="hover:text-stone-900 transition-colors duration-300 w-fit">
              {isArabic ? "طلب خاص" : "Custom Order"}
            </Link>
            <button
              onClick={toggleLang}
              className="text-left rtl:text-right hover:text-amber-600 transition-colors duration-300 uppercase w-fit"
            >
              {t("footer.langToggle")}
            </button>
          </div>

          {/* Social Presence - Luxury Floating Style */}
          <div className={`space-y-8 ${isArabic ? 'lg:items-start' : 'lg:items-end'} flex flex-col`}>
            <span className="text-[11px] font-bold text-stone-900 uppercase tracking-[0.2em]">
              {isArabic ? "تابعنا" : "Follow the Story"}
            </span>
            <div className="flex gap-4">
              <motion.a 
                whileHover={{ y: -5 }}
                href="https://www.instagram.com/rabab.atelier" 
                target="_blank" 
                className="w-14 h-14 bg-stone-50 rounded-full flex items-center justify-center text-stone-400 hover:bg-stone-900 hover:text-white transition-all duration-500 shadow-sm"
              >
                <Instagram className="w-5 h-5" />
              </motion.a>
              <motion.a 
                whileHover={{ y: -5 }}
                href="https://wa.me/212679697964" 
                target="_blank" 
                className="w-14 h-14 bg-stone-50 rounded-full flex items-center justify-center text-stone-400 hover:bg-stone-900 hover:text-white transition-all duration-500 shadow-sm"
              >
                <MessageCircle className="w-5 h-5" />
              </motion.a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-24 pt-12 border-t border-stone-50 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] text-stone-300 font-bold uppercase tracking-[0.4em]">
            {t("footer.rights")}
          </p>
          <div className="flex items-center gap-4 opacity-40 group hover:opacity-100 transition-opacity">
             <Sparkles className="w-3 h-3 text-amber-600" />
             <span className="text-[9px] text-stone-400 font-bold uppercase tracking-widest">Atelier Rabab Studio 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
