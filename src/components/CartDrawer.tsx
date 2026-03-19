import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate(); 

  // الثابت ديال التوصيل/TVA اللي طلبتي
  const deliveryFee = 40;

  const handleWhatsAppOrder = () => {
    const phoneNumber = "212679697964";
    
    // هاد الجزء دبا كيصاوب رسالة احترافية فيها كاع التفاصيل
    const orderDetails = items.map((i, index) => {
      const title = isArabic ? (i.title_ar || i.title) : i.title;
      const color = isArabic ? i.selectedColor?.name_ar : i.selectedColor?.name_en;
      return `📦 *${index + 1}. ${title}*\n   🎨 ${isArabic ? 'اللون' : 'Couleur'}: ${color}\n   🔢 x${i.quantity}\n   💰 ${i.price * i.quantity} MAD`;
    }).join('\n\n');

    const msg = isArabic 
      ? `✨ *طلب جديد - Atelier Rabab*\n\n${orderDetails}\n\n━━━━━━━━━━━━━━\n🚚 *التوصيل:* ${deliveryFee} MAD\n⭐ *المجموع النهائي: ${total + deliveryFee} MAD*${isGift ? `\n\n🎁 *تغليف كهدية:* نعم\n💌 *الرسالة:* ${giftMsg}` : ''}\n\n⚠️ *ملاحظة:* يرجى تأكيد الاسم والمدينة لإتمام الشحن.`
      : `✨ *Nouvelle Commande - Atelier Rabab*\n\n${orderDetails}\n\n━━━━━━━━━━━━━━\n🚚 *Livraison:* ${deliveryFee} MAD\n⭐ *TOTAL FINAL: ${total + deliveryFee} MAD*${isGift ? `\n\n🎁 *Emballage Cadeau:* Oui\n💌 *Message:* ${giftMsg}` : ''}\n\n⚠️ *Note:* Veuillez confirmer votre Nom et Ville pour l'expédition.`;

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
            onClick={onClose} 
            className="fixed inset-0 bg-stone-900/40 backdrop-blur-[2px] z-[100]" 
          />

          <motion.div 
            initial={{ x: isArabic ? "-100%" : "100%" }}
            animate={{ x: 0 }}
            exit={{ x: isArabic ? "-100%" : "100%" }}
            transition={{ type: "spring", damping: 35, stiffness: 300 }}
            className={`fixed top-0 ${isArabic ? 'left-0' : 'right-0'} h-full w-full max-w-sm bg-[#fafaf9] z-[101] shadow-2xl flex flex-col`}
          >
            {/* Header - تصغير العناوين وحذف الـ Italic الزائد */}
            <div className="p-8 border-b border-stone-100 flex justify-between items-center bg-white">
              <div className="space-y-1">
                <h2 className="text-xl font-medium tracking-tight text-stone-900 uppercase">
                  {isArabic ? "حقيبة التسوق" : "Le Panier"}
                </h2>
                <p className="text-[9px] font-bold text-stone-400 uppercase tracking-[0.3em]">
                  {items.length} {isArabic ? "قِطَع" : "Articles"}
                </p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-stone-50 rounded-full transition-colors">
                <X className="w-4 h-4 text-stone-400" />
              </button>
            </div>

            {/* Product List - تصغير الصور والخطوط */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                  <ShoppingBag className="w-10 h-10 text-stone-200 stroke-[1px]" />
                  <p className="text-xs font-medium text-stone-400 uppercase tracking-widest">
                    {isArabic ? "حقيبتك فارغة" : "Votre panier est vide"}
                  </p>
                </div>
              ) : (
                <div className="space-y-8">
                  {items.map((item, index) => (
                    <motion.div key={`${item.id}-${item.selectedColor?.hex}`} className="flex gap-5 relative group">
                      {/* Image Frame - تصغير حجم الصورة */}
                      <div className="relative aspect-[3/4] w-20 rounded-xl overflow-hidden bg-stone-100 border border-stone-50">
                        <img src={item.image} className="w-full h-full object-cover" alt={item.title} />
                      </div>

                      <div className="flex-1 flex flex-col justify-center py-1">
                        <div className="space-y-1">
                          <h4 className="text-[11px] font-bold text-stone-800 uppercase tracking-wide">
                            {isArabic ? (item.title_ar || item.title) : item.title}
                          </h4>
                          <div className={`flex items-center gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.selectedColor?.hex }} />
                            <span className="text-[9px] font-medium text-stone-400 uppercase">
                              {isArabic ? item.selectedColor?.name_ar : item.selectedColor?.name_en}
                            </span>
                          </div>
                        </div>

                        <div className={`flex items-center justify-between mt-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                          <div className="flex items-center bg-white rounded-lg border border-stone-100 p-1">
                            <button onClick={() => updateQuantity(item.id, item.selectedColor?.hex || '', -1)} className="w-5 h-5 flex items-center justify-center text-stone-400"><Minus className="w-2.5 h-2.5"/></button>
                            <span className="px-3 text-[10px] font-bold">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, item.selectedColor?.hex || '', 1)} className="w-5 h-5 flex items-center justify-center text-stone-400"><Plus className="w-2.5 h-2.5"/></button>
                          </div>
                          <span className="text-xs font-bold text-stone-900">{item.price * item.quantity} MAD</span>
                        </div>
                      </div>

                      <button onClick={() => removeFromCart(item.id, item.selectedColor?.hex || '')} className="text-stone-300 hover:text-red-500 transition-colors">
                        <Trash2 className="w-3.5 h-3.5"/>
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer - تعديل الـ TVA والمجموع النهائي */}
            {items.length > 0 && (
              <div className="p-8 border-t border-stone-100 space-y-6 bg-white">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-medium text-stone-400 uppercase tracking-widest">
                    <span>{isArabic ? "المجموع" : "Sous-total"}</span>
                    <span>{total} MAD</span>
                  </div>
                  <div className="flex justify-between text-[10px] font-medium text-stone-400 uppercase tracking-widest">
                    <span>{isArabic ? "التوصيل" : "Livraison"}</span>
                    <span>{deliveryFee} MAD</span>
                  </div>
                  <div className="flex justify-between items-end pt-2">
                    <span className="text-[11px] font-bold text-stone-900 uppercase tracking-[0.2em]">{isArabic ? "المجموع النهائي" : "Total Final"}</span>
                    <span className="text-xl font-medium text-stone-900">{total + deliveryFee} MAD</span>
                  </div>
                </div>

                <Button 
                  onClick={handleWhatsAppOrder} 
                  className="w-full bg-stone-900 hover:bg-black text-white h-14 rounded-xl gap-3 font-bold text-[10px] uppercase tracking-[0.2em] transition-all"
                >
                  <MessageCircle className="w-4 h-4" /> 
                  {isArabic ? "تأكيد الطلب عبر واتساب" : "Commander via WhatsApp"}
                </Button>

                <p className="text-[8px] text-center text-stone-300 font-bold uppercase tracking-[0.2em]">
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
