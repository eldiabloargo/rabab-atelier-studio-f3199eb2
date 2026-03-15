
import { useState } from "react";
import { NavLink } from "./NavLink"; // Using your NavLink component
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { ShoppingBag, Menu, X } from "lucide-react";
import { CartDrawer } from "./CartDrawer"; // The drawer we built
import { motion, AnimatePresence } from "framer-motion";

export const Navbar = () => {
  const { items } = useCart();
  const { isArabic } = useLanguage();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);

  // Calculate total items count
  const itemsCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-stone-100 z-[90] h-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between">
          
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-stone-600"
            onClick={() => setMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>

          {/* Logo - Atelier Rabab */}
          <NavLink to="/" className="text-2xl font-serif font-bold tracking-tighter text-stone-900">
            Atelier <span className="text-amber-600">Rabab</span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink 
              to="/" 
              className="text-sm font-medium text-stone-500 hover:text-amber-600 transition-colors"
              activeClassName="text-amber-600"
            >
              {isArabic ? "الرئيسية" : "Accueil"}
            </NavLink>
            <NavLink 
              to="/collection" 
              className="text-sm font-medium text-stone-500 hover:text-amber-600 transition-colors"
              activeClassName="text-amber-600"
            >
              {isArabic ? "المجموعة" : "Collection"}
            </NavLink>
          </div>

          {/* Cart Icon & Language */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 group transition-all"
            >
              <ShoppingBag className="w-6 h-6 text-stone-800 group-hover:text-amber-600 transition-colors" />
              
              {/* Badge for items count */}
              <AnimatePresence>
                {itemsCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute top-0 right-0 w-5 h-5 bg-amber-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white"
                  >
                    {itemsCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </nav>

      {/* The Sidebar Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Mobile Menu - Optional */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-0 w-full bg-white border-b border-stone-100 z-[80] p-6 flex flex-col gap-4 md:hidden"
          >
             <NavLink to="/" onClick={() => setMenuOpen(false)} className="text-lg font-medium border-b pb-2">{isArabic ? "الرئيسية" : "Accueil"}</NavLink>
             <NavLink to="/collection" onClick={() => setMenuOpen(false)} className="text-lg font-medium border-b pb-2">{isArabic ? "المجموعة" : "Collection"}</NavLink>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
