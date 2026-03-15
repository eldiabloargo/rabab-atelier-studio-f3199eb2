import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";
import { Instagram, MessageCircle, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const Footer = () => {
  const { t, toggleLang, isArabic } = useLanguage();

  return (
    <footer 
      className={`py-12 px-6 bg-white border-t border-stone-50 ${isArabic ? 'text-right' : 'text-left'}`} 
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
        
        {/* Left: Minimal Brand */}
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <div className="space-y-1 text-center md:text-left rtl:md:text-right">
            <h4 className="text-xl font-serif text-stone-900 tracking-tighter italic">
              Atelier <span className="text-amber-700">Rabab</span>
            </h4>
            <div className="flex items-center justify-center md:justify-start gap-2 opacity-50">
              <span className="w-4 h-[1px] bg-stone-300" />
              <p className="text-[8px] text-stone-500 font-black uppercase tracking-[0.4em]">
                Tan-Tan
              </p>
            </div>
          </div>

          {/* Quick Links - Floating Style */}
          <nav className="flex items-center gap-8 text-[9px] font-black text-stone-400 uppercase tracking-[0.2em]">
            <Link to="/sur-mesure" className="hover:text-stone-900 transition-colors">
              {isArabic ? "طلب خاص" : "Custom"}
            </Link>
            <button onClick={toggleLang} className="hover:text-amber-700 transition-colors">
              {isArabic ? "FR" : "AR"}
            </button>
          </nav>
        </div>

        {/* Right: Signature & Social */}
        <div className="flex flex-col items-center md:items-end gap-6">
          <div className="flex gap-3">
            {[
              { icon: <Instagram className="w-4 h-4" />, url: "https://instagram.com/rabab.atelier" },
              { icon: <MessageCircle className="w-4 h-4" />, url: "https://wa.me/212679697964" }
            ].map((social, i) => (
              <motion.a
                key={i}
                whileHover={{ y: -3 }}
                href={social.url}
                target="_blank"
                className="w-10 h-10 rounded-full border border-stone-100 flex items-center justify-center text-stone-400 hover:border-stone-900 hover:text-stone-900 transition-all duration-500"
              >
                {social.icon}
              </motion.a>
            ))}
          </div>
          
          <div className="flex items-center gap-3 opacity-30 group hover:opacity-100 transition-opacity">
            <p className="text-[8px] text-stone-400 font-bold uppercase tracking-[0.5em]">
              © 2026 Studio
            </p>
            <Sparkles className="w-3 h-3 text-amber-600 animate-pulse" />
          </div>
        </div>

      </div>
    </footer>
  );
};
