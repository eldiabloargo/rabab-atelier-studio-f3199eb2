import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { ShoppingBag, Menu, X, Home } from "lucide-react";
import { CartDrawer } from "./CartDrawer"; 
import { motion, AnimatePresence, useScroll } from "framer-motion";

export const Navbar = () => {
  const { items } = useCart();
  const { isArabic } = useLanguage();
  const location = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 60);
    });
  }, [scrollY]);

  const itemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[100] p-4 md:p-6 pointer-events-none">
        <motion.nav 
          initial={false}
          animate={{
            width: isScrolled ? "100%" : "95%",
            maxWidth: isScrolled ? "100%" : "1200px",
            y: isScrolled ? -15 : 0,
            borderRadius: isScrolled ? "0px" : "24px",
            backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.95)" : "white",
            boxShadow: isScrolled ? "0 4px 20px rgba(0,0,0,0.05)" : "0 10px 40px rgba(0,0,0,0.08)",
          }}
          className="mx-auto h-16 md:h-20 flex items-center bg-white pointer-events-auto transition-all duration-500 border border-stone-100/50 backdrop-blur-md relative"
        >
          <div className="w-full px-6 flex items-center justify-between">
            
            {/* Left: Menu & Home */}
            <div className="flex-1 flex items-center gap-4">
              <button 
                className="p-2 text-stone-900 hover:text-amber-700 transition-colors" 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              
              <NavLink to="/" className="hidden md:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors">
                <Home size={14} />
                {isArabic ? "الرئيسية" : "Accueil"}
              </NavLink>
            </div>

            {/* Center: Brand Identity (الشكل القديم اللي بغيتي) */}
            <div className="flex justify-center items-center shrink-0">
              <NavLink to="/" className="text-center group flex flex-col items-center">
                <span className={`block font-serif tracking-tighter transition-all duration-500 text-stone-900 ${isScrolled ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'}`}>
                  Rabab <span className="text-amber-600 italic">Atelier</span>
                </span>
                {!isScrolled && (
                  <motion.span 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }}
                    className="text-[7px] uppercase tracking-[0.5em] text-stone-400 block -mt-1"
                  >
                    Maroc
                  </motion.span>
                )}
              </NavLink>
            </div>

            {/* Right: Cart Action */}
            <div className="flex-1 flex items-center justify-end">
              <button 
                onClick={() => setIsCartOpen(true)} 
                className="relative flex items-center gap-2 group p-2"
              >
                <ShoppingBag size={18} strokeWidth={1.5} className="text-stone-900 group-hover:text-amber-700 transition-colors" />
                {itemsCount > 0 && (
                  <span className="text-[10px] font-bold text-stone-900">
                    ({itemsCount})
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu Overlay - مصحح بالكامل */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                className="absolute top-[110%] left-0 right-0 bg-white/98 backdrop-blur-2xl rounded-[2rem] p-8 shadow-2xl border border-stone-100 flex flex-col gap-6 pointer-events-auto"
              >
                <div className={`flex flex-col gap-6 ${isArabic ? 'text-right' : 'text-left'}`}>
                  <NavLink to="/" className="text-xs font-bold uppercase tracking-widest text-stone-900 flex items-center gap-3">
                    <Home size={16} className="text-amber-600" />
                    {isArabic ? "الرئيسية" : "Accueil"}
                  </NavLink>
                  <NavLink to="/category/all" className={({ isActive }) => `text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${isActive ? 'text-amber-700' : 'text-stone-400 hover:text-stone-900'}`}>
                    {isArabic ? "المجموعة" : "La Collection"}
                  </NavLink>
                  <NavLink to="/sur-mesure" className="text-xs font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-colors">
                    {isArabic ? "طلب خاص" : "Sur Mesure"}
                  </NavLink>
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
