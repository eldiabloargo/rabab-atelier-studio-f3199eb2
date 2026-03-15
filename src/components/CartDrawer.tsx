import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { X, Trash2, Plus, Minus, Gift, MessageCircle, ShoppingBag, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

export const CartDrawer = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { items, removeFromCart, updateQuantity, total } = useCart();
  const { isArabic } = useLanguage();
  const [isGift, setIsGift] = useState(false);
  const [giftMsg, setGiftMsg] = useState("");

  const handleWhatsAppOrder = () => {
    const phoneNumber = "212679697964";
    const orderDetails = items.map((i, index) => 
      `${index + 1}. *${isArabic ? (i.title_ar || i.title) : i.title}*\n` +
      `   🎨 ${isArabic ? 'اللون' : 'Couleur'}: ${isArabic ? i.selectedColor?.name_ar : i.selectedColor?.name_en}\n` +
      `   📦 ${isArabic ? 'الكمية' : 'Quantité'}: ${i.quantity}\n` +
      `   💰 ${isArabic ? 'الثمن' : 'Prix'}: ${i.price * i.quantity} MAD`
    ).join('\n\n');

    const msg = isArabic 
      ? `✨ *طلب جديد - Atelier Rabab*\n\n${orderDetails}\n\n━━━━━━━━━━━━━━\n⭐ *المجموع الإجمالي: ${total} MAD*${isGift ? `\n\n🎁 *رسالة الهدية:* \n${giftMsg}` : ''}\n\nشكراً لاختياركم Atelier Rabab ✨`
      : `✨ *Nouvelle Commande - Atelier Rabab*\n\n${orderDetails}\n\n━━━━━━━━━━━━━━\n⭐ *TOTAL: ${total} MAD*${isGift ? `\n\n🎁 *Message de Cadeau:* \n${giftMsg}` : ''}\n\nMerci d'avoir choisi Atelier Rabab ✨`;

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-md z-[100]" 
          />

          <motion.div 
            initial={{ x: isArabic ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: isArabic ? "-100%" : "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={`fixed top-0 ${isArabic ? 'left-0' : 'right-0'} h-full w-full max-w-md bg-white z-[101] shadow-[-20px_0_60px_rgba(0,0,0,0.1)] flex flex-col`}
          >
            {/* Header - More Elegant */}
            <div className="p-8 border-b border-stone-50 flex justify-between items-center bg-white">
              <div className="space-y-1">
                <h2 className="text-2xl font-serif italic text-stone-900 leading-none">
                  {isArabic ? "حقيبة التسوق" : "Le Panier"}
                </h2>
                <p className="text-[9px] font-black text-amber-700 uppercase tracking-[0.3em]">
                  {items.length} {isArabic ? "قطعة" : "Articles"}
                </p>
              </div>
              <button 
                onClick={onClose} 
                className="p-3 hover:bg-stone-50 rounded-full transition-all border border-stone-100 group"
              >
                <X className="w-4 h-4 text-stone-400 group-hover:rotate-90 transition-transform duration-300" />
              </button>
            </div>

            {/* Content with Stagger effect */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-stone-200" />
                  </div>
                  <p className="font-serif italic text-stone-400 text-lg">
                    {isArabic ? "حقيبتك تنتظر امتلاءها..." : "Votre panier attend d'être rempli..."}
                  </p>
                  <Button onClick={onClose} variant="outline" className="rounded-full border-stone-200 text-[10px] font-bold uppercase tracking-widest">
                    {isArabic ? "اكتشف المجموعات" : "Découvrir les collections"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-8">
                  {items.map((item, index) => (
                    <motion.div 
                      key={`${item.id}-${item.selectedColor?.hex}`} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-6 relative group"
                    >
                      <div className="relative aspect-[3/4] w-24 rounded-2xl overflow-hidden bg-stone-50 shadow-sm">
                        <img src={item.image} className="w-full h-full object-cover" alt={item.title} />
                      </div>

                      <div className="flex-1 flex flex-col justify-between py-1">
                        <div className="space-y-1">
                          <h4 className="font-serif text-lg text-stone-900 leading-tight italic">
                            {isArabic ? (item.title_ar || item.title) : item.title}
                          </h4>
                          
                          {/* Color Swatch Badge */}
                          <div className="flex items-center gap-2 pt-1">
                            <div className="w-2 h-2 rounded-full border border-stone-100" style={{ backgroundColor: item.selectedColor?.hex }} />
                            <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">
                              {isArabic ? item.selectedColor?.name_ar : item.selectedColor?.name_en}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center bg-stone-50 rounded-full px-2 py-1 border border-stone-100/50">
                            <button onClick={() => updateQuantity(item.id, item.selectedColor?.hex || '', -1)} className="p-1 hover:text-amber-700"><Minus className="w-3 h-3"/></button>
                            <span className="px-3 text-[11px] font-bold text-stone-700">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.selectedColor?.hex || '', 1)} className="p-1 hover:text-amber-700"><Plus className="w-3 h-3"/></button>
                          </div>
                          <span className="text-sm font-serif italic font-bold text-stone-900">{item.price * item.quantity} MAD</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.id, item.selectedColor?.hex || '')} 
                        className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-stone-300 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5"/>
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Gift Toggle - Luxury Style */}
              {items.length > 0 && (
                <div className="pt-6">
                  <button 
                    onClick={() => setIsGift(!isGift)} 
                    className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all duration-500 ${isGift ? 'bg-amber-50/50 border-amber-200' : 'bg-stone-50/50 border-stone-100'}`}
                  >
                    <div className="flex items-center gap-3">
                      <Gift className={`w-4 h-4 ${isGift ? 'text-amber-600' : 'text-stone-400'}`} />
                      <span className="text-[10px] font-black uppercase tracking-widest text-stone-600">
                        {isArabic ? "تغليف كهدية؟" : "Emballage Cadeau?"}
                      </span>
                    </div>
                    <ArrowRight className={`w-3 h-3 transition-transform ${isGift ? 'rotate-90 text-amber-600' : 'text-stone-300'}`} />
                  </button>
                  
                  <AnimatePresence>
                    {isGift && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <textarea 
                          className="w-full mt-3 p-5 bg-white border border-amber-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-amber-500/10 transition-all font-serif italic" 
                          placeholder={isArabic ? "رسالتك الخاصة هنا..." : "Votre message personnel..."}
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

            {/* Footer Checkout */}
            {items.length > 0 && (
              <div className="p-8 border-t border-stone-50 space-y-6 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.02)]">
                <div className="flex justify-between items-baseline px-1">
                  <span className="text-stone-400 uppercase text-[9px] font-black tracking-[0.3em]">{isArabic ? "المجموع" : "Total"}</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-serif text-stone-900">{total}</span>
                    <span className="text-[10px] font-bold text-stone-400">MAD</span>
                  </div>
                </div>

                <Button 
                  onClick={handleWhatsAppOrder} 
                  className="w-full bg-stone-900 hover:bg-amber-900 text-white h-16 rounded-2xl gap-4 font-bold text-xs uppercase tracking-[0.2em] shadow-2xl shadow-stone-200 transition-all active:scale-[0.98]"
                >
                  <MessageCircle className="w-5 h-5 fill-current" /> 
                  {isArabic ? "تأكيد الطلب" : "Confirmer la commande"}
                </Button>
                
                <p className="text-[9px] text-center text-stone-400 font-bold uppercase tracking-widest animate-pulse">
                  {isArabic ? "الدفع عند الاستلام" : "Paiement à la livraison"}
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
