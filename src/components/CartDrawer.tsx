import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { X, Trash2, Plus, Minus, Gift, MessageCircle, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
export const CartDrawer = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { items, removeFromCart, updateQuantity, subtotal, shipping, total } = useCart();
  const { isArabic } = useLanguage();
   const navigate = useNavigate();


  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-stone-900/40 backdrop-blur-[2px] z-[100]" />
          <motion.div initial={{ x: isArabic ? "-100%" : "100%" }} animate={{ x: 0 }} exit={{ x: isArabic ? "-100%" : "100%" }} transition={{ type: "spring", damping: 35 }} className={`fixed top-0 ${isArabic ? 'left-0' : 'right-0'} h-full w-full max-w-sm bg-[#fafaf9] z-[101] shadow-2xl flex flex-col`}>
            
            <div className="p-8 border-b border-stone-100 flex justify-between items-center bg-white">
              <h2 className="text-xl font-medium tracking-tight text-stone-900 uppercase">{isArabic ? "حقيبة التسوق" : "Le Panier"}</h2>
              <button onClick={onClose} className="p-2 hover:bg-stone-50 rounded-full transition-colors"><X className="w-4 h-4 text-stone-400" /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {items.map((item) => (
                <div key={`${item.id}-${item.selectedColor?.hex}`} className="flex gap-5 relative group">
                  <div className="relative aspect-[3/4] w-20 rounded-xl overflow-hidden bg-stone-100 border border-stone-50"><img src={item.image} className="w-full h-full object-cover" alt={item.title} /></div>
                  <div className="flex-1 flex flex-col justify-center py-1">
                    <h4 className="text-[11px] font-bold text-stone-800 uppercase">{isArabic ? (item.title_ar || item.title) : item.title}</h4>
                    <span className="text-[9px] font-medium text-stone-400 uppercase">{isArabic ? item.selectedColor?.name_ar : item.selectedColor?.name_en}</span>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center bg-white rounded-lg border border-stone-100 p-1">
                        <button onClick={() => updateQuantity(item.id, item.selectedColor?.hex || '', -1)} className="w-5 h-5 flex items-center justify-center"><Minus className="w-2.5 h-2.5"/></button>
                        <span className="px-3 text-[10px] font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.selectedColor?.hex || '', 1)} className="w-5 h-5 flex items-center justify-center"><Plus className="w-2.5 h-2.5"/></button>
                      </div>
                      <span className="text-xs font-bold text-stone-900">{item.price * item.quantity} MAD</span>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.id, item.selectedColor?.hex || '')} className="text-stone-300 hover:text-red-500"><Trash2 className="w-3.5 h-3.5"/></button>
                </div>
              ))}
            </div>

            {items.length > 0 && (
              <div className="p-8 border-t border-stone-100 space-y-6 bg-white">
                <div className="space-y-2 text-[10px] font-medium text-stone-400 uppercase tracking-widest">
                  <div className="flex justify-between"><span>Subtotal</span><span>{subtotal} MAD</span></div>
                  <div className="flex justify-between"><span>Livraison</span><span>{shipping} MAD</span></div>
                  <div className="flex justify-between items-end pt-2 border-t border-stone-50 text-stone-900 font-bold">
                    <span className="text-[11px] tracking-[0.2em]">Total Final</span><span className="text-xl">{total} MAD</span>
                  </div>
                </div>
                <Button onClick={() => { onClose(); navigate("/checkout"); }} className="w-full bg-stone-900 hover:bg-black text-white h-14 rounded-xl gap-3 font-bold text-[10px] uppercase tracking-[0.2em]">
                   {isArabic ? "إتمام الطلب" : "Passer à la caisse"} <ArrowRight size={14} className={isArabic ? 'rotate-180' : ''} />
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
