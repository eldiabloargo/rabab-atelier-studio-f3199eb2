import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Instagram, MessageCircle, Sparkles, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export const Footer = () => {
  const { t, toggleLang, isArabic } = useLanguage();

  return (
    <footer 
      className={`relative py-24 px-8 bg-white border-t border-stone-100 ${isArabic ? 'text-right' : 'text-left'}`} 
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 items-start">

          {/* Brand Identity Section */}
          <div className="md:col-span-5 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-amber-800/60">
                <Sparkles size={10} strokeWidth={3} />
                <span className="text-[9px] font-black uppercase tracking-[0.4em]">
                  {isArabic ? "صناعة يدوية مغربية" : "Artisanat Marocain"}
                </span>
              </div>

              <h4 className="text-4xl md:text-5xl font-serif text-stone-900 tracking-tight uppercase leading-none">
                Atelier <span className="text-stone-400 font-light">Rabab</span>
              </h4>

              <div className="flex items-center gap-3 text-stone-400">
                <MapPin size={10} />
                <p className="text-[10px] font-bold uppercase tracking-[0.3em]">
                  Tan-Tan — Morocco
                </p>
              </div>
            </div>
            
            <p className="max-w-sm text-stone-500 text-xs leading-relaxed font-sans font-light tracking-wide">
              {isArabic 
                ? "دار إبداع متخصصة في صياغة التحف الفنية التي تمزج بين الأصالة المغربية والتصميم العصري."
                : "Maison de création dédiée à l'art de façonner des pièces d'exception, entre héritage marocain et épure contemporaine."}
            </p>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-4 space-y-6">
            <h5 className="text-[10px] font-black text-stone-900 uppercase tracking-[0.4em] mb-8">
              {isArabic ? "القائمة" : "Menu"}
            </h5>
            <nav className="flex flex-col gap-4">
              {['collection', 'sur-mesure', 'expositions'].map((item) => (
                <Link 
                  key={item}
                  to={`/${item}`} 
                  className="text-[11px] font-medium text-stone-500 hover:text-stone-900 uppercase tracking-[0.2em] transition-colors w-fit"
                >
                  {t(`nav.${item}`)}
                </Link>
              ))}
              <button 
                onClick={toggleLang} 
                className="mt-4 w-fit px-6 py-2 rounded-full border border-stone-100 text-[10px] font-bold text-stone-600 hover:bg-stone-900 hover:text-white transition-all duration-500"
              >
                {isArabic ? "FRANÇAIS" : "العربية"}
              </button>
            </nav>
          </div>

          {/* Contact & Socials */}
          <div className="md:col-span-3 space-y-8 md:text-right rtl:md:text-left">
            <h5 className="text-[10px] font-black text-stone-900 uppercase tracking-[0.4em] mb-8">
              {isArabic ? "تواصل معنا" : "Contact"}
            </h5>
            <div className="flex gap-4 md:justify-end rtl:md:justify-start">
              {[
                { icon: <Instagram className="w-4 h-4" />, url: "https://instagram.com/rabab.atelier" },
                { icon: <MessageCircle className="w-4 h-4" />, url: "https://wa.me/212679697964" }
              ].map((social, i) => (
                <motion.a
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  href={social.url}
                  target="_blank"
                  className="w-12 h-12 rounded-full bg-[#fcfcfb] border border-stone-100 flex items-center justify-center text-stone-600 hover:bg-stone-900 hover:text-white transition-all duration-500 shadow-sm"
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
            
            <div className="pt-4 border-t border-stone-100 space-y-2">
              <p className="text-[10px] text-stone-400 font-medium uppercase tracking-[0.3em]">
                © 2026 Studio Rabab
              </p>
              <p className="text-[8px] text-stone-300 font-medium uppercase tracking-[0.1em]">
                {isArabic ? "جميع الحقوق محفوظة للفن" : "All Rights Reserved to Art"}
              </p>
            </div>
          </div>

        </div>

        {/* Cinematic Final Touch */}
        <div className="mt-32 pt-12 border-t border-stone-100/50">
           <div className="flex flex-col md:flex-row justify-between items-center gap-6 opacity-30">
             <span className="text-[8px] tracking-[1.2em] uppercase font-light text-stone-400">
               Atelier de Haute Création
             </span>
             <div className="h-[1px] flex-1 bg-stone-100 hidden md:block mx-12" />
             <span className="text-[8px] tracking-[0.5em] uppercase font-black text-amber-900">
               Handmade Morocco
             </span>
           </div>
        </div>
      </div>
    </footer>
  );
};
