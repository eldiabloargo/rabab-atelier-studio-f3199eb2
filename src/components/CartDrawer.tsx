import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { X, Trash2, Plus, Minus, Gift, MessageCircle } from "lucide-react";
import { useState } from "react";

export const CartDrawer = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { items, removeFromCart, updateQuantity, total } = useCart();
  const { isArabic } = useLanguage();
  const [isGift, setIsGift] = useState(false);
  const [giftMsg, setGiftMsg] = useState("");

  const handleWhatsAppOrder = () => {
    const orderDetails = items.map(i => 
      `- ${isArabic ? i.title_ar : i.title} (${isArabic ? i.selectedColor.name_ar : i.selectedColor.name_en}) x${i.quantity}`
    ).join('\n');

    const msg = isArabic 
      ? `طلب جديد:\n${orderDetails}\nالمجموع: ${total} DH${isGift ? `\n🎁 هدية: ${giftMsg}` : ''}`
      : `New Order:\n${orderDetails}\nTotal: ${total} DH${isGift ? `\n🎁 Gift: ${giftMsg}` : ''}`;
    
    window.open(`https://wa.me/212679697964?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100]" />
          <motion.div 
            initial={{ x: isArabic ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: isArabic ? "-100%" : "100%" }}
            className={`fixed top-0 ${isArabic ? 'left-0' : 'right-0'} h-full w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col`}
          >
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-serif font-bold">{isArabic ? "سلة المقتنيات" : "Your Cart"}</h2>
              <button onClick={onClose} className="p-2 hover:bg-stone-100 rounded-full"><X /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.map(item => (
                <div key={`${item.id}-${item.selectedColor.hex}`} className="flex gap-4 border-b border-stone-50 pb-4">
                  <img src={item.image} className="w-20 h-24 object-cover rounded-xl" />
                  <div className="flex-1">
                    <h4 className="font-bold">{isArabic ? item.title_ar : item.title}</h4>
                    <p className="text-xs text-stone-400 uppercase">{isArabic ? item.selectedColor.name_ar : item.selectedColor.name_en}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="flex items-center border rounded-lg">
                        <button onClick={() => updateQuantity(item.id, item.selectedColor.hex, -1)} className="p-1"><Minus className="w-3 h-3"/></button>
                        <span className="px-2 text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.selectedColor.hex, 1)} className="p-1"><Plus className="w-3 h-3"/></button>
                      </div>
                      <span className="font-bold">{item.price * item.quantity} DH</span>
                    </div>
                  </div>
                  <button onClick={() => removeFromCart(item.id, item.selectedColor.hex)} className="text-stone-300 hover:text-red-500"><Trash2 className="w-4 h-4"/></button>
                </div>
              ))}

              {items.length > 0 && (
                <div className="pt-4">
                  <button onClick={() => setIsGift(!isGift)} className="flex items-center gap-2 text-stone-600 mb-2">
                    <Gift className={`w-4 h-4 ${isGift ? 'text-amber-600' : ''}`} />
                    <span className="text-sm font-bold uppercase tracking-tighter">{isArabic ? "هذه الطلبية هدية؟" : "Is this a gift?"}</span>
                  </button>
                  {isGift && (
                    <textarea 
                      className="w-full p-3 bg-stone-50 border rounded-xl text-sm outline-none focus:ring-1 focus:ring-amber-500" 
                      placeholder={isArabic ? "رسالة الهدية..." : "Gift message..."}
                      value={giftMsg} onChange={(e) => setGiftMsg(e.target.value)}
                    />
                  )}
                </div>
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-stone-400 uppercase text-xs tracking-widest">{isArabic ? "المجموع" : "Total"}</span>
                  <span className="text-2xl font-bold">{total} DH</span>
                </div>
                <Button onClick={handleWhatsAppOrder} className="w-full bg-stone-900 text-white h-14 rounded-xl gap-2 font-bold">
                  <MessageCircle className="w-5 h-5" /> {isArabic ? "تأكيد الطلب" : "Confirm via WhatsApp"}
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
