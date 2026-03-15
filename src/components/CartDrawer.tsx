import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { X, Trash2, Plus, Minus, Gift, MessageCircle, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

export const CartDrawer = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { items, removeFromCart, updateQuantity, total } = useCart();
  const { isArabic } = useLanguage();
  const [isGift, setIsGift] = useState(false);
  const [giftMsg, setGiftMsg] = useState("");

  const handleWhatsAppOrder = () => {
    const orderDetails = items.map(i => 
      `- ${isArabic ? (i.title_ar || i.title) : i.title} (${isArabic ? (i.selectedColor?.name_ar || 'لون') : (i.selectedColor?.name_en || 'Color')}) x${i.quantity}`
    ).join('\n');

    const msg = isArabic 
      ? `طلب جديد من Atelier Rabab:\n${orderDetails}\nالمجموع: ${total} DH${isGift ? `\n🎁 هدية: ${giftMsg}` : ''}`
      : `New Order from Atelier Rabab:\n${orderDetails}\nTotal: ${total} DH${isGift ? `\n🎁 Gift: ${giftMsg}` : ''}`;
    
    window.open(`https://wa.me/212679697964?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay - Background Blur */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" 
          />
          
          {/* Drawer Panel */}
          <motion.div 
            initial={{ x: isArabic ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: isArabic ? "-100%" : "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed top-0 ${isArabic ? 'left-0' : 'right-0'} h-full w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col`}
          >
            {/* Header */}
            <div className="p-6 border-b flex justify-between items-center bg-stone-50/50">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-amber-600" />
                <h2 className="text-xl font-serif font-bold text-stone-900">
                  {isArabic ? "سلة المقتنيات" : "Your Cart"}
                </h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors border border-transparent hover:border-stone-100">
                <X className="w-5 h-5 text-stone-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-stone-400 gap-4">
                  <ShoppingBag className="w-12 h-12 opacity-20" />
                  <p className="italic">{isArabic ? "السلة فارغة حالياً" : "Your cart is empty"}</p>
                </div>
              ) : (
                items.map((item, index) => (
                  <div key={`${item.id}-${item.selectedColor?.hex || index}`} className="flex gap-4 border-b border-stone-50 pb-6 animate-in fade-in slide-in-from-bottom-2">
                    <img 
                      src={item.image || '/placeholder.svg'} 
                      alt={item.title}
                      className="w-20 h-24 object-cover rounded-xl shadow-sm border border-stone-100" 
                    />
                    <div className="flex-1">
                      <h4 className="font-bold text-stone-900">{isArabic ? (item.title_ar || item.title) : item.title}</h4>
                      <p className="text-[10px] text-stone-400 uppercase tracking-widest mt-1">
                        {isArabic ? (item.selectedColor?.name_ar || "لون") : (item.selectedColor?.name_en || "Color")}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border border-stone-200 rounded-lg overflow-hidden bg-stone-50">
                          <button onClick={() => updateQuantity(item.id, item.selectedColor?.hex || '', -1)} className="p-1.5 hover:bg-white text-stone-600"><Minus className="w-3 h-3"/></button>
                          <span className="px-3 text-xs font-bold text-stone-700">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.selectedColor?.hex || '', 1)} className="p-1.5 hover:bg-white text-stone-600"><Plus className="w-3 h-3"/></button>
                        </div>
                        <span className="font-bold text-amber-900">{item.price * item.quantity} DH</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id, item.selectedColor?.hex || '')} 
                      className="text-stone-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4"/>
                    </button>
                  </div>
                ))
              )}

              {/* Gift Section */}
              {items.length > 0 && (
                <div className="pt-4 px-2">
                  <button onClick={() => setIsGift(!isGift)} className="flex items-center gap-2 text-stone-600 group transition-colors">
                    <Gift className={`w-4 h-4 ${isGift ? 'text-amber-600' : 'group-hover:text-amber-600'}`} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{isArabic ? "هل هذه هدية؟" : "Is this a gift?"}</span>
                  </button>
                  <AnimatePresence>
                    {isGift && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <textarea 
                          className="w-full mt-3 p-4 bg-stone-50 border border-stone-100 rounded-2xl text-sm outline-none focus:ring-1 focus:ring-amber-500 transition-all font-sans" 
                          placeholder={isArabic ? "اكتب رسالتك هنا..." : "Write your gift message..."}
                          rows={3}
                          value={giftMsg} 
                          onChange={(e) => setGiftMsg(e.target.value)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-stone-100 space-y-4 bg-white">
                <div className="flex justify-between items-end px-1">
                  <span className="text-stone-400 uppercase text-[10px] font-bold tracking-[0.2em]">{isArabic ? "المجموع الإجمالي" : "Subtotal"}</span>
                  <span className="text-2xl font-bold text-stone-900">{total} DH</span>
                </div>
                <Button 
                  onClick={handleWhatsAppOrder} 
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white h-14 rounded-2xl gap-3 font-bold text-lg shadow-xl shadow-stone-200 transition-all active:scale-[0.98]"
                >
                  <MessageCircle className="w-5 h-5" /> 
                  {isArabic ? "إتمام الطلب" : "Checkout via WhatsApp"}
                </Button>
                <p className="text-[10px] text-center text-stone-400 italic">
                  {isArabic ? "سيتم توجيهك للواتساب لتأكيد الطلب" : "You will be redirected to WhatsApp"}
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
