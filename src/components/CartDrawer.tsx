limport { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { X, Trash2, Plus, Minus, Gift, MessageCircle, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

export const CartDrawer = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { items, removeFromCart, updateQuantity, subtotal } = useCart();
  const { isArabic } = useLanguage();
  const navigate = useNavigate(); 
  
  // ثمن التوصيل الثابت
  const shippingFee = 40;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* خلفية شفافة متحركة (Overlay) */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-[2px] z-[100]" 
          />

          {/* اللوحة الجانبية المتحركة */}
          <motion.div 
            initial={{ x: isArabic ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: isArabic ? "-100%" : "100%" }}
            transition={{ type: "spring", damping: 35, stiffness: 300 }}
            className={`fixed top-0 ${isArabic ? 'left-0' : 'right-0'} h-full w-full max-w-sm bg-[#fafaf9] z-[101] shadow-2xl flex flex-col selection:bg-amber-50`}
          >
            {/* Header - تصغير الخطوط وحذف الـ Italic القديم */}
            <div className="p-8 border-b border-stone-100 flex justify-between items-center bg-white">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-600/50" />
                  <h2 className="text-xl font-medium tracking-tight text-stone-900 uppercase">
                    {isArabic ? "حقيبة التسوق" : "Le Panier"}
                  </h2>
                </div>
                <p className="text-[9px] font-bold text-stone-400 uppercase tracking-[0.3em]">
                  {items.length} {isArabic ? "قِطَع مختارة" : "Articles Sélectionnés"}
                </p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-stone-50 rounded-full transition-colors">
                <X className="w-4 h-4 text-stone-400" />
              </button>
            </div>

            {/* قائمة المنتجات - مع الرونق والتحريكات سلسة */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-inner border border-stone-50">
                    <ShoppingBag className="w-8 h-8 text-stone-200 stroke-[1px]" />
                  </div>
                  <p className="text-xs font-medium text-stone-400 uppercase tracking-widest leading-relaxed">
                    {isArabic ? "حقيبتك فارغة، اكتشف مجموعتنا" : "Votre panier est vide, explorez nos collections"}
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {items.map((item, index) => (
                    <motion.div 
                      key={`${item.id}-${item.selectedColor?.hex}`} 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.08, duration: 0.5, ease: "easeOut" }}
                      className="flex gap-5 relative group"
                    >
                      {/* Image Frame - تصغير حجم الصورة */}
                      <div className="relative aspect-[3/4] w-20 rounded-xl overflow-hidden bg-stone-100 border border-stone-50 flex-shrink-0 shadow-sm">
                        <img src={item.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={item.title} />
                      </div>

                      <div className="flex-1 flex flex-col justify-center py-1">
                        <div className="space-y-1">
                          <h4 className="text-[11px] font-bold text-stone-800 uppercase tracking-wide leading-tight">
                            {isArabic ? (item.title_ar || item.title) : item.title}
                          </h4>
                          <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                            <div className="w-2 h-2 rounded-full shadow-inner border border-stone-100" style={{ backgroundColor: item.selectedColor?.hex }} />
                            <span className="text-[9px] font-medium text-stone-400 uppercase">
                              {isArabic ? item.selectedColor?.name_ar : item.selectedColor?.name_en}
                            </span>
                          </div>
                        </div>

                        {/* التحكم في الكمية والسعر */}
                        <div className={`flex items-center justify-between mt-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                          <div className="flex items-center bg-white rounded-lg border border-stone-100 p-1 shadow-inner">
                            <button onClick={() => updateQuantity(item.id, item.selectedColor?.hex || '', -1)} className="w-5 h-5 flex items-center justify-center text-stone-300 hover:text-stone-900"><Minus className="w-2.5 h-2.5"/></button>
                            <span className="px-3 text-[10px] font-bold text-stone-900">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.selectedColor?.hex || '', 1)} className="w-5 h-5 flex items-center justify-center text-stone-300 hover:text-stone-900"><Plus className="w-2.5 h-2.5"/></button>
                          </div>
                          <span className="text-xs font-bold text-stone-900">{item.price * item.quantity} MAD</span>
                        </div>
                      </div>

                      <button onClick={() => removeFromCart(item.id, item.selectedColor?.hex || '')} className="absolute -top-1.5 -right-1.5 opacity-0 group-hover:opacity-100 transition-all p-1.5 bg-white shadow-lg rounded-full text-stone-300 hover:text-red-500">
                        <Trash2 className="w-3.5 h-3.5"/>
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Sticky Footer - مع تصغير الخطوط وتعديل الـ TVA */}
            {items.length > 0 && (
              <div className="p-8 border-t border-stone-100 space-y-6 bg-white sticky bottom-0">
                <div className="space-y-2 text-[10px] font-medium text-stone-400 uppercase tracking-widest px-1">
                  <div className="flex justify-between">
                    <span>{isArabic ? "المجموع" : "Sous-total"}</span>
                    <span>{subtotal} MAD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isArabic ? "التوصيل" : "Livraison"}</span>
                    <span className="text-amber-800 font-bold">{shippingFee} MAD</span>
                  </div>
                  <div className="flex justify-between items-end pt-3 border-t border-stone-50">
                    <span className="text-[11px] font-bold text-stone-900 tracking-[0.2em]">{isArabic ? "المجموع النهائي" : "Total Final"}</span>
                    <span className="text-xl font-medium text-stone-900">{subtotal + shippingFee} MAD</span>
                  </div>
                </div>

                {/* الزر كيدي لـ Checkout باش يجمع المعلومات */}
                <Button 
                  onClick={() => { onClose(); navigate("/checkout"); }} 
                  className="w-full bg-stone-900 hover:bg-black text-white h-14 rounded-xl gap-3 font-bold text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-stone-200 transition-all active:scale-[0.98]"
                >
                  <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} transition={{ repeat: Infinity, duration: 1.5, repeatType: "reverse" }}>
                     <Sparkles className="w-4 h-4 text-amber-600/50" />
                  </motion.div>
                  {isArabic ? "تأكيد الطلب الآن" : "Commander Maintenant"}
                </Button>

                <p className="text-[8px] text-center text-stone-300 font-bold uppercase tracking-[0.2em]">
                  {isArabic ? "سيفتح الواتساب لإرسال تفاصيل طلبك بعد ملء معلومات التوصيل" : "Confirmez via WhatsApp après vos coordonnées"}
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
