export const Footer = () => {
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Instagram, MessageCircle, MapPin, Phone } from "lucide-react";

export const Footer = () => {
  const { t, toggleLang, isArabic } = useLanguage();

  return (
    <footer className={`py-24 px-6 border-t border-stone-100 bg-white ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 items-start">
          
          {/* Brand Info */}
          <div className="space-y-6">
            <h4 className="text-2xl font-serif font-bold text-stone-900 tracking-tighter">
              Atelier <span className="text-amber-600">Rabab</span>
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-stone-400 group">
                <MapPin className="w-4 h-4 text-amber-600/50" />
                <span className="text-[12px] font-medium tracking-wide uppercase">Tantan, Maroc</span>
              </div>
              <a 
                href="https://wa.me/212679697964" 
                className="flex items-center gap-3 text-stone-400 hover:text-stone-900 transition-colors group"
              >
                <Phone className="w-4 h-4 text-amber-600/50" />
                <span className="text-[12px] font-bold tracking-widest">+212 679 697 964</span>
              </a>
            </div>
          </div>

          {/* Quick Links - Center on Desktop */}
          <div className="flex flex-col gap-4 text-[10px] font-bold text-stone-400 uppercase tracking-[0.25em]">
            <span className="text-stone-900 mb-2 opacity-20">{isArabic ? "القائمة" : "Menu"}</span>
            <Link to="/expositions" className="hover:text-amber-600 transition-colors duration-300">
              {t("nav.expositions")}
            </Link>
            <Link to="/sur-mesure" className="hover:text-amber-600 transition-colors duration-300">
              {isArabic ? "طلب خاص" : "Custom Order"}
            </Link>
            <button
              onClick={toggleLang}
              className="text-left rtl:text-right hover:text-amber-600 transition-colors duration-300 uppercase"
            >
              {t("footer.langLabel")} {t("footer.langToggle")}
            </button>
          </div>

          {/* Social Presence */}
          <div className={`space-y-6 ${isArabic ? 'lg:text-left' : 'lg:text-right'}`}>
            <span className="text-[10px] font-bold text-stone-900 uppercase tracking-[0.25em] block opacity-20">
              {isArabic ? "تواصلوا معنا" : "Connect"}
            </span>
            <div className={`flex gap-6 ${isArabic ? 'lg:justify-end' : 'lg:justify-end'}`}>
              <a 
                href="https://www.instagram.com/rabab.atelier" 
                target="_blank" 
                className="p-3 bg-stone-50 rounded-full hover:bg-stone-900 hover:text-white transition-all duration-500"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://wa.me/212679697964" 
                target="_blank" 
                className="p-3 bg-stone-50 rounded-full hover:bg-stone-900 hover:text-white transition-all duration-500"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Rights */}
        <div className="mt-20 pt-10 border-t border-stone-50 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-[9px] text-stone-300 font-bold uppercase tracking-[0.3em]">
            {t("footer.rights")}
          </p>
          <div className="flex items-center gap-4">
             <div className="h-[1px] w-8 bg-stone-100" />
             <span className="text-[9px] text-stone-200 font-light italic">Artisanat de Luxe</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
