import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { ShoppingBag, Menu, X, Home, Globe, Sparkles } from "lucide-react";
import { CartDrawer } from "./CartDrawer"; 
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

export const Navbar = () => {
  const { items } = useCart();
  const { isArabic, toggleLang, t } = useLanguage();
  const location = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  // تحكم ذكي في حجم اللوغو بناءً على السكرول
  const logoScale = useTransform(scrollY, [0, 100], [1, 0.85]);

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  const itemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[100] p-4 md:p-8 pointer-events-none">
        <motion.nav 
          initial={false}
          animate={{
            width: isScrolled ? "auto" : "100%",
            maxWidth: isScrolled ? "600px" : "1400px",
            paddingLeft: isScrolled ? "1.5rem" : "2rem",
            paddingRight: isScrolled ? "1.5rem" : "2rem",
            y: isScrolled ? 0 : 0,
            borderRadius: isScrolled ? "100px" : "28px",
            backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.85)" : "rgba(255, 255, 255, 1)",
          }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
          className="mx-auto h-16 md:h-22 flex items-center pointer-events-auto border border-stone-100/60 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative overflow-visible"
        >
          <div className="w-full flex items-center justify-between gap-4 md:gap-8">

            {/* Left Section: Menu & Lang */}
            <div className="flex-1 flex items-center gap-6">
              <button 
                className="group p-2 text-stone-900 hover:text-amber-700 transition-all relative" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <motion.div animate={{ rotate: isMenuOpen ? 90 : 0 }}>
                  {isMenuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
                </motion.div>
              </button>

              <button 
                onClick={toggleLang}
                className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 hover:text-amber-800 transition-all group"
              >
                <Globe size={13} className="group-hover:rotate-12 transition-transform" />
                {isArabic ? "FR" : "العربية"}
              </button>
            </div>

            {/* Center Section: Cinematic Brand */}
            <motion.div style={{ scale: logoScale }} className="shrink-0">
              <NavLink to="/" className="flex flex-col items-center group">
                <div className="flex items-center gap-1">
                  <span className="block font-serif text-2xl md:text-3xl tracking-tighter text-stone-900">
                    Rabab <span className="text-amber-600 italic font-light">Atelier</span>
                  </span>
                </div>
                <AnimatePresence>
                  {!isScrolled && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }} 
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="flex items-center gap-2"
                    >
                      <div className="h-[1px] w-4 bg-amber-200" />
                      <span className="text-[8px] font-black uppercase tracking-[0.5em] text-stone-400">Maroc</span>
                      <div className="h-[1px] w-4 bg-amber-200" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </NavLink>
            </motion.div>

            {/* Right Section: Actions */}
            <div className="flex-1 flex items-center justify-end gap-2 md:gap-5">
              <NavLink to="/category/all" className="hidden lg:block text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 hover:text-stone-900 transition-colors">
                {t("nav.collection")}
              </NavLink>

              <div className="w-[1px] h-4 bg-stone-100 hidden md:block" />

              <button 
                onClick={() => setIsCartOpen(true)} 
                className="relative p-2 group"
              >
                <ShoppingBag size={20} strokeWidth={1.2} className="text-stone-900 group-hover:text-amber-700 transition-colors" />
                <AnimatePresence>
                  {itemsCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-amber-600 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-lg shadow-amber-900/20"
                    >
                      {itemsCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>

          {/* Mobile Menu - Premium Dropdown */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute top-[110%] left-0 right-0 bg-white/95 backdrop-blur-2xl rounded-[2.5rem] p-10 shadow-[0_30px_70px_rgba(0,0,0,0.1)] border border-stone-100 flex flex-col items-center gap-8 pointer-events-auto"
              >
                <div className="flex flex-col items-center gap-8 w-full">
                  <NavLink to="/" className="text-xs font-black uppercase tracking-[0.4em] text-stone-800 flex items-center gap-3">
                    <Home size={14} className="text-amber-600/50" />
                    {isArabic ? "الرئيسية" : "Accueil"}
                  </NavLink>
                  <div className="w-8 h-[1px] bg-stone-100" />
                  <NavLink to="/category/all" className="text-xs font-black uppercase tracking-[0.4em] text-stone-400 hover:text-stone-800 transition-colors">
                    {t("nav.collection")}
                  </NavLink>
                  <NavLink to="/expositions" className="text-xs font-black uppercase tracking-[0.4em] text-stone-400 hover:text-stone-800 transition-colors">
                    {t("nav.expositions")}
                  </NavLink>
                  
                  {/* Mobile Lang Toggle */}
                  <button 
                    onClick={toggleLang}
                    className="mt-4 px-6 py-3 rounded-full border border-stone-100 text-[10px] font-black tracking-widest text-stone-400 flex items-center gap-3"
                  >
                    <Globe size={12} />
                    {isArabic ? "SWITCH TO FRENCH" : "التغيير إلى العربية"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
