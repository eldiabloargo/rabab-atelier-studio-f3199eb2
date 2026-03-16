import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Instagram, MessageCircle, Sparkles, MapPin } from "lucide-react";
import { motion } from "framer-motion";

export const Footer = () => {
  const { t, toggleLang, isArabic } = useLanguage();

  return (
    <footer 
      className={`relative py-20 px-6 bg-[#fafaf9] border-t border-stone-100 ${isArabic ? 'text-right' : 'text-left'}`} 
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      {/* Decorative top line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-[2px] bg-amber-200/40" />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-16">

          {/* Left Section: Brand & Legacy */}
          <div className="space-y-8 flex-1">
            <div className="space-y-3">
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="flex items-center gap-2 text-amber-700/60 mb-2"
              >
                <Sparkles size={12} />
                <span className="text-[8px] font-black uppercase tracking-[0.5em]">{isArabic ? "صنع في المغرب" : "Handcrafted in Morocco"}</span>
              </motion.div>
              
              <h4 className="text-3xl md:text-4xl font-serif text-stone-900 tracking-tighter italic leading-none">
                Atelier <span className="text-amber-700 font-light">Rabab</span>
              </h4>
              
              <div className="flex items-center gap-3 text-stone-400">
                <MapPin size={10} className="text-amber-600/40" />
                <p className="text-[9px] font-black uppercase tracking-[0.4em]">
                  Meknès — Morocco
                </p>
              </div>
            </div>

            {/* Navigation Pills */}
            <nav className="flex flex-wrap items-center gap-x-8 gap-y-4">
              {['collection', 'sur-mesure', 'expositions'].map((item) => (
                <Link 
                  key={item}
                  to={`/${item}`} 
                  className="text-[10px] font-black text-stone-400 hover:text-stone-900 uppercase tracking-[0.2em] transition-all relative group"
                >
                  {t(`nav.${item}`)}
                  <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-amber-600 transition-all group-hover:w-full" />
                </Link>
              ))}
              <button 
                onClick={toggleLang} 
                className="px-4 py-1.5 rounded-full border border-stone-200 text-[9px] font-black text-stone-500 hover:bg-stone-900 hover:text-white transition-all"
              >
                {isArabic ? "FRANÇAIS" : "العربية"}
              </button>
            </nav>
          </div>

          {/* Right Section: Social & Legal */}
          <div className="flex flex-col items-center md:items-end gap-10">
            <div className="flex gap-4">
              {[
                { icon: <Instagram className="w-4 h-4" />, url: "https://instagram.com/rabab.atelier", label: "Instagram" },
                { icon: <MessageCircle className="w-4 h-4" />, url: "https://wa.me/212679697964", label: "WhatsApp" }
              ].map((social, i) => (
                <motion.a
                  key={i}
                  whileHover={{ y: -5, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  href={social.url}
                  target="_blank"
                  className="w-14 h-14 rounded-full bg-white border border-stone-100 flex items-center justify-center text-stone-400 hover:border-stone-900 hover:text-stone-900 shadow-sm transition-all duration-500"
                  aria-label={social.label}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>

            <div className="space-y-4 text-center md:text-right">
              <div className="flex items-center justify-center md:justify-end gap-3 opacity-40 group hover:opacity-100 transition-opacity cursor-default">
                <span className="text-[9px] text-stone-500 font-bold uppercase tracking-[0.4em]">
                  © 2026 Atelier Rabab Studio
                </span>
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              </div>
              <p className="text-[8px] text-stone-300 font-medium uppercase tracking-[0.2em]">
                {isArabic ? "جميع الحقوق محفوظة للفن" : "All Rights Reserved to Art"}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom decorative bar */}
        <div className="mt-20 pt-8 border-t border-stone-100/50 flex justify-center">
           <motion.div 
             animate={{ opacity: [0.3, 0.6, 0.3] }} 
             transition={{ duration: 4, repeat: Infinity }}
             className="text-[8px] text-stone-300 tracking-[1em] uppercase font-light"
           >
             Maison de Création
           </motion.div>
        </div>
      </div>
    </footer>
  );
};
