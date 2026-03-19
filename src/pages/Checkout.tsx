import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBag, Truck, ArrowLeft, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
export const Checkout = () => {
  const { items, total, subtotal, shipping } = useCart();
  const { isArabic } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fullName: "", phone: "", address: "" });

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneNumber = "212679697964";

    const orderDetails = items.map((i, index) => {
      const title = isArabic ? (i.title_ar || i.title) : i.title;
      const color = isArabic ? i.selectedColor?.name_ar : i.selectedColor?.name_en;
      return `📦 *${index + 1}. ${title}*\n   🎨 ${isArabic ? 'اللون' : 'Couleur'}: ${color}\n   🔢 x${i.quantity}\n   💰 ${i.price * i.quantity} MAD`;
    }).join('\n\n');

    const message = isArabic 
      ? `✨ *طلب جديد - Atelier Rabab*\n\n👤 *الزبون:* ${formData.fullName}\n📞 *الهاتف:* ${formData.phone}\n📍 *العنوان:* ${formData.address}\n\n━━━━━━━━━━━━━━\n${orderDetails}\n\n━━━━━━━━━━━━━━\n🚚 *التوصيل:* ${shipping} MAD\n⭐ *المجموع النهائي: ${total} MAD*`
      : `✨ *Nouvelle Commande - Atelier Rabab*\n\n👤 *Client:* ${formData.fullName}\n📞 *Tél:* ${formData.phone}\n📍 *Adresse:* ${formData.address}\n\n━━━━━━━━━━━━━━\n${orderDetails}\n\n━━━━━━━━━━━━━━\n🚚 *Livraison:* ${shipping} MAD\n⭐ *TOTAL FINAL: ${total} MAD*`;

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <main className={`min-h-screen bg-[#fafaf9] pt-24 pb-20 px-4 md:px-8`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400 hover:text-stone-900 transition-all">
          <ArrowLeft size={12} className={isArabic ? 'rotate-180' : ''} /> {isArabic ? "العودة" : "Retour"}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-7 space-y-10">
            <header className="space-y-4">
               <h1 className="text-2xl md:text-3xl font-medium text-stone-900 tracking-tight uppercase">{isArabic ? "إتمام الطلب" : "Finaliser"}</h1>
               <p className="text-stone-400 text-xs font-medium uppercase tracking-wide opacity-70">{isArabic ? "يرجى إدخال معلومات التوصيل" : "Coordonnées d'expédition"}</p>
            </header>

            <form onSubmit={handleConfirmOrder} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input required placeholder={isArabic ? "الاسم الكامل" : "Nom Complet"} value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="h-12 rounded-xl text-xs" />
                <Input required placeholder={isArabic ? "رقم الهاتف" : "Téléphone"} type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="h-12 rounded-xl text-xs" />
              </div>
              <Input required placeholder={isArabic ? "العنوان والمدينة" : "Adresse et Ville"} value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="h-12 rounded-xl text-xs" />
              <Button type="submit" className="w-full h-16 bg-stone-900 rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-black transition-all shadow-xl gap-3">
                 <MessageCircle size={16} /> {isArabic ? "تأكيد الطلب عبر واتساب" : "Confirmer via WhatsApp"}
              </Button>
            </form>
          </div>

          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-stone-100 shadow-sm sticky top-24">
            <h2 className="text-xs font-bold uppercase tracking-widest mb-6">{isArabic ? "ملخص الحقيبة" : "Résumé"}</h2>
            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto custom-scrollbar">
              {items.map((item) => (
                <div key={item.id + item.selectedColor.hex} className="flex gap-4 items-center">
                  <img src={item.image} className="w-12 h-16 rounded-lg object-cover" alt="" />
                  <div className="flex-1 min-w-0"><h4 className="text-[10px] font-bold text-stone-800 uppercase truncate">{isArabic ? item.title_ar : item.title}</h4><p className="text-[9px] text-stone-400">x{item.quantity} — {isArabic ? item.selectedColor.name_ar : item.selectedColor.name_en}</p></div>
                  <span className="text-[10px] font-bold">{item.price * item.quantity} MAD</span>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-stone-50 space-y-2 text-[9px] uppercase font-medium text-stone-400">
              <div className="flex justify-between"><span>Sous-total</span><span>{subtotal} MAD</span></div>
              <div className="flex justify-between"><span>Livraison</span><span>{shipping} MAD</span></div>
              <div className="flex justify-between items-end pt-4 border-t text-stone-900 font-bold">
                <span className="text-[11px] tracking-widest">Total</span><span className="text-xl">{total} MAD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
