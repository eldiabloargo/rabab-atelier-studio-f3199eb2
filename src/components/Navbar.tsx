import { useState } from "react";
import { NavLink } from "./NavLink";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { ShoppingBag, Menu, X, Search } from "lucide-react";
import { CartDrawer } from "./CartDrawer"; 
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
  const { items } = useCart();
  const { isArabic } = useLanguage();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const itemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-b border-stone-50 z-[100] h-24">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-full flex items-center justify-between">
          
          {/* Left: Mobile Menu & Desktop Links */}
          <div className="flex items-center gap-8 flex-1">
            <button 
              className="lg:hidden p-2 text-stone-900" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <AnimatePresence mode="wait">
                {isMenuOpen ? <X key="x" /> : <Menu key="menu" />}
              </AnimatePresence>
            </button>

            <div className="hidden lg:flex items-center gap-10">
              <NavLink 
                to="/collection" 
                className={({ isActive }) => `text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${isActive ? 'text-amber-700' : 'text-stone-400 hover:text-stone-900'}`}
              >
                {isArabic ? "المجموعة" : "Collection"}
              </NavLink>
              <NavLink 
                to="/sur-mesure" 
                className={({ isActive }) => `text-[10px] font-bold uppercase tracking-[0.2em] transition-all ${isActive ? 'text-amber-700' : 'text-stone-400 hover:text-stone-900'}`}
              >
                {isArabic ? "طلب خاص" : "Custom"}
              </NavLink>
            </div>
          </div>

          {/* Center: Brand Identity (Future Logo Placeholder) */}
          <div className="flex justify-center items-center flex-1">
            <NavLink to="/" className="group flex flex-col items-center">
              <span className="text-2xl md:text-3xl font-serif font-bold tracking-tighter text-stone-900 group-hover:text-amber-700 transition-colors duration-500">
                Atelier <span className="text-amber-600">Rabab</span>
              </span>
              <div className="h-[1px] w-0 group-hover:w-full bg-amber-600 transition-all duration-700" />
            </NavLink>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center justify-end gap-6 flex-1">
            <button className="hidden md:block p-2 text-stone-400 hover:text-stone-900 transition-colors">
              <Search className="w-5 h-5" />
            </button>

            <button 
              onClick={() => setIsCartOpen(true)} 
              className="relative p-2.5 bg-stone-50 rounded-full group hover:bg-stone-900 transition-all duration-500"
            >
              <ShoppingBag className="w-5 h-5 text-stone-900 group-hover:text-white transition-colors" />
              <AnimatePresence>
                {itemsCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0, y: 5 }} 
                    animate={{ scale: 1, y: 0 }} 
                    exit={{ scale: 0, y: 5 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-amber-600 text-white text-[9px] font-black flex items-center justify-center rounded-full border-2 border-white shadow-sm"
                  >
                    {itemsCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-24 left-0 right-0 bg-white border-b border-stone-100 p-8 lg:hidden flex flex-col gap-6 shadow-2xl"
            >
              <NavLink to="/collection" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-stone-900 border-b border-stone-50 pb-4">
                {isArabic ? "تصفح المجموعة" : "Browse Collection"}
              </NavLink>
              <NavLink to="/sur-mesure" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-stone-900 border-b border-stone-50 pb-4">
                {isArabic ? "طلب خاص" : "Custom Order"}
              </NavLink>
              <NavLink to="/expositions" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-widest text-stone-900">
                {isArabic ? "المعارض" : "Expositions"}
              </NavLink>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};
