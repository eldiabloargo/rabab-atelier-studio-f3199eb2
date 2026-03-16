import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { X, Trash2, Plus, Minus, Gift, MessageCircle, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

export const CartDrawer = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { items, removeFromCart, updateQuantity, total } = useCart();
  const { isArabic, t } = useLanguage();
  const [isGift, setIsGift] = useState(false);
  const [giftMsg, setGiftMsg] = useState("");

  const handleWhatsAppOrder = () => {
    const phoneNumber = "212679697964";
    const orderDetails = items.map((i, index) => {
      const title = isArabic ? (i.title_ar || i.title) : i.title;
      const color = isArabic ? i.selectedColor?.name_ar : i.selectedColor?.name_en;
      return `📦 *${index + 1}. ${title}*\n   🎨 ${isArabic ? 'اللون' : 'Couleur'}: ${color}\n   🔢 ${isArabic ? 'الكمية' : 'Quantité'}: ${i.quantity}\n   💰 ${i.price * i.quantity} MAD`;
    }).join('\n\n');

    const msg = isArabic 
      ? `✨ *طلب جديد من Atelier Rabab*\n\n${orderDetails}\n\n━━━━━━━━━━━━━━\n⭐ *المجموع: ${total} MAD*${isGift ? `\n\n🎁 *تغليف كهدية:* نعم\n💌 *الرسالة:* ${giftMsg}` : ''}\n\n🙏 شكراً لثقتكم في فننا.`
      : `✨ *Nouvelle Commande - Atelier Rabab*\n\n${orderDetails}\n\n━━━━━━━━━━━━━━\n⭐ *TOTAL: ${total} MAD*${isGift ? `\n\n🎁 *Emballage Cadeau:* Oui\n💌 *Message:* ${giftMsg}` : ''}\n\n🙏 Merci d'apprécier notre art.`;

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-[100]" 
          />

          <motion.div 
            initial={{ x: isArabic ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: isArabic ? "-100%" : "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 280 }}
            className={`fixed top-0 ${isArabic ? 'left-0' : 'right-0'} h-full w-full max-w-md bg-[#fafaf9] z-[101] shadow-[-25px_0_80px_rgba(0,0,0,0.15)] flex flex-col selection:bg-amber-50`}
          >
            {/* Header - Editorial Style */}
            <div className="p-10 border-b border-stone-100 flex justify-between items-center bg-white/80 backdrop-blur-md">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600/50" />
                  <h2 className="text-3xl font-serif italic text-stone-800">
                    {isArabic ? "حقيبة التسوق" : "Le Panier"}
                  </h2>
                </div>
                <p className="text-[10px] font-black text-amber-800 uppercase tracking-[0.4em]">
                  {items.length} {isArabic ? "تحف مختارة" : "Pièces Sélectionnées"}
                </p>
              </div>
              <button 
                onClick={onClose} 
                className="group w-12 h-12 flex items-center justify-center rounded-full border border-stone-100 bg-white hover:border-stone-900 transition-all duration-500"
              >
                <X className="w-4 h-4 text-stone-400 group-hover:text-stone-900 group-hover:rotate-90 transition-all duration-500" />
              </button>
            </div>

            {/* Product List */}
            <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-8">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-inner border border-stone-50">
                    <ShoppingBag className="w-8 h-8 text-stone-200 stroke-[1px]" />
                  </div>
                  <div className="space-y-3">
                    <p className="font-serif italic text-stone-500 text-xl">
                      {isArabic ? "حقيبتك فارغة حالياً" : "Votre panier est vide"}
                    </p>
                    <p className="text-[10px] text-stone-400 uppercase tracking-widest leading-relaxed">
                      {isArabic ? "استكشف مجموعتنا وابدأ قصتك مع الفن" : "Explorez nos collections et commencez votre histoire"}
                    </p>
                  </div>
                  <Button onClick={onClose} variant="outline" className="rounded-full px-10 h-14 border-stone-200 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-stone-900 hover:text-white transition-all">
                    {isArabic ? "اكتشف المجموعة" : "Découvrir"}
                  </Button>
                </div>
              ) : (
                <div className="space-y-10">
                  {items.map((item, index) => (
                    <motion.div 
                      key={`${item.id}-${item.selectedColor?.hex}`} 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-8 relative group"
                    >
                      {/* Image Frame */}
                      <div className="relative aspect-[3/4] w-28 rounded-3xl overflow-hidden bg-white shadow-xl shadow-stone-200/50 border border-stone-100 flex-shrink-0">
                        <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={item.title} />
                      </div>

                      <div className="flex-1 flex flex-col justify-between py-2">
                        <div className="space-y-2">
                          <h4 className="font-serif text-xl text-stone-800 leading-tight italic">
                            {isArabic ? (item.title_ar || item.title) : item.title}
                          </h4>

                          <div className={`flex items-center gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                            <div className="w-3 h-3 rounded-full shadow-inner border border-stone-200" style={{ backgroundColor: item.selectedColor?.hex }} />
                            <span className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">
                              {isArabic ? item.selectedColor?.name_ar : item.selectedColor?.name_en}
                            </span>
                          </div>
                        </div>

                        <div className={`flex items-center justify-between mt-4 ${isArabic ? 'flex-row-reverse' : ''}`}>
                          {/* Stepper Luxury */}
                          <div className="flex items-center bg-white rounded-full px-3 py-1.5 border border-stone-100 shadow-sm">
                            <button onClick={() => updateQuantity(item.id, item.selectedColor?.hex || '', -1)} className="w-6 h-6 flex items-center justify-center hover:text-amber-700 transition-colors"><Minus className="w-3 h-3"/></button>
                            <span className="px-4 text-[12px] font-black text-stone-800">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.selectedColor?.hex || '', 1)} className="w-6 h-6 flex items-center justify-center hover:text-amber-700 transition-colors"><Plus className="w-3 h-3"/></button>
                          </div>
                          <span className="text-lg font-serif italic text-stone-900">{item.price * item.quantity} MAD</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => removeFromCart(item.id, item.selectedColor?.hex || '')} 
                        className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-all p-2.5 bg-white shadow-xl rounded-full text-stone-300 hover:text-red-500 hover:scale-110"
                      >
                        <Trash2 className="w-3.5 h-3.5"/>
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Gift Service Section */}
              {items.length > 0 && (
                <div className="pt-10 border-t border-stone-100">
                  <button 
                    onClick={() => setIsGift(!isGift)} 
                    className={`w-full flex items-center justify-between p-6 rounded-[2.5rem] border transition-all duration-700 ${isGift ? 'bg-amber-50/40 border-amber-200 shadow-lg shadow-amber-900/5' : 'bg-white border-stone-100 hover:border-stone-200'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isGift ? 'bg-amber-600 text-white' : 'bg-stone-50 text-stone-400'}`}>
                        <Gift className="w-4 h-4" />
                      </div>
                      <div className="text-left rtl:text-right">
                        <span className="block text-[10px] font-black uppercase tracking-widest text-stone-700">
                          {isArabic ? "خدمة التغليف" : "Service de Cadeau"}
                        </span>
                        <span className="text-[9px] text-stone-400">{isArabic ? "اجعلها ذكرى لا تنسى" : "Rendez-le inoubliable"}</span>
                      </div>
                    </div>
                    <ArrowRight className={`w-4 h-4 transition-transform duration-500 ${isGift ? 'rotate-90 text-amber-600' : 'text-stone-300'}`} />
                  </button>

                  <AnimatePresence>
                    {isGift && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0, y: -10 }} 
                        animate={{ height: 'auto', opacity: 1, y: 0 }} 
                        exit={{ height: 0, opacity: 0, y: -10 }} 
                        className="overflow-hidden"
                      >
                        <textarea 
                          className="w-full mt-4 p-6 bg-white border border-amber-100 rounded-[2rem] text-sm outline-none focus:ring-4 focus:ring-amber-500/5 transition-all font-serif italic text-stone-600 shadow-inner" 
                          placeholder={isArabic ? "اكتب رسالتك القلبية هنا..." : "Votre message personnel ici..."}
                          rows={4}
                          value={giftMsg} 
                          onChange={(e) => setGiftMsg(e.target.value)}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Sticky Footer */}
            {items.length > 0 && (
              <div className="p-10 border-t border-stone-100 space-y-8 bg-white/90 backdrop-blur-md">
                <div className="flex justify-between items-end px-2">
                  <div className="space-y-1">
                    <span className="text-stone-300 uppercase text-[9px] font-black tracking-[0.4em]">{isArabic ? "المبلغ الإجمالي" : "Sous-total"}</span>
                    <p className="text-[10px] text-stone-400 italic font-serif">{isArabic ? "شامل لضريبة الفن" : "TVA artistique incluse"}</p>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-serif text-stone-800 leading-none">{total}</span>
                    <span className="text-[11px] font-black text-amber-800 uppercase">MAD</span>
                  </div>
                </div>

                <Button 
                  onClick={handleWhatsAppOrder} 
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white h-20 rounded-[2.5rem] gap-5 font-black text-[11px] uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(0,0,0,0.15)] transition-all active:scale-[0.98] group overflow-hidden relative"
                >
                  <motion.div 
                    className="absolute inset-0 bg-amber-600 opacity-0 group-hover:opacity-10 transition-opacity"
                    whileHover={{ scale: 1.5 }}
                  />
                  <MessageCircle className="w-5 h-5 fill-current transition-transform group-hover:rotate-12" /> 
                  {isArabic ? "إرسال الطلب عبر واتساب" : "Commander via WhatsApp"}
                </Button>

                <div className="flex items-center justify-center gap-3">
                   <div className="h-[1px] w-8 bg-stone-100" />
                   <p className="text-[9px] text-stone-300 font-black uppercase tracking-[0.3em]">
                     {isArabic ? "الدفع عند الاستلام" : "Paiement à la livraison"}
                   </p>
                   <div className="h-[1px] w-8 bg-stone-100" />
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
