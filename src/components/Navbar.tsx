import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { ShoppingBag, Menu, X } from "lucide-react";
import { CartDrawer } from "./CartDrawer"; 
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

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
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  const itemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <motion.nav 
        initial={false}
        animate={{
          height: isScrolled ? "70px" : "90px",
          backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.85)" : "rgba(255, 255, 255, 0)",
          backdropFilter: isScrolled ? "blur(12px)" : "blur(0px)",
          borderBottomColor: isScrolled ? "rgba(0,0,0,0.05)" : "rgba(0,0,0,0)",
        }}
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 border-b flex items-center`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 w-full flex items-center justify-between">
          
          {/* Left: Menu Icon (Compact) */}
          <div className="flex-1 flex items-center">
            <button 
              className="p-2 text-stone-900 hover:opacity-50 transition-opacity" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
            </button>
          </div>

          {/* Center: Brand Identity - أصغر وأكثر أناقة */}
          <div className="flex justify-center items-center shrink-0">
            <NavLink to="/" className="text-center group">
              <span className={`block font-serif tracking-tighter transition-all duration-500 ${isScrolled ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'}`}>
                Rabab <span className="text-amber-600 italic">Atelier</span>
              </span>
              {!isScrolled && (
                <motion.span 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="text-[7px] uppercase tracking-[0.5em] text-stone-400 block -mt-1"
                >
                  Maroc
                </motion.span>
              )}
            </NavLink>
          </div>

          {/* Right: Cart Action */}
          <div className="flex-1 flex items-center justify-end gap-4">
            <button 
              onClick={() => setIsCartOpen(true)} 
              className="relative p-2 flex items-center gap-2 group"
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

        {/* Mobile Menu Overlay - Clean & Minimal */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute top-full left-4 right-4 mt-2 bg-white/95 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl border border-stone-100 lg:w-[400px] lg:left-auto"
            >
              <div className={`flex flex-col gap-8 ${isArabic ? 'text-right' : 'text-left'}`}>
                {[
                  { to: "/collection", label: isArabic ? "المجموعة الكاملة" : "La Collection" },
                  { to: "/sur-mesure", label: isArabic ? "طلب خاص" : "Sur Mesure" },
                  { to: "/expositions", label: isArabic ? "المعارض" : "Expositions" }
                ].map((link) => (
                  <NavLink 
                    key={link.to} 
                    to={link.to} 
                    onClick={() => setIsMenuOpen(false)}
                    className="text-xs font-bold uppercase tracking-[0.3em] text-stone-400 hover:text-stone-900 transition-colors"
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
