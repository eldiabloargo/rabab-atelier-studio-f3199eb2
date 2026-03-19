Import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBag, Truck, MapPin, Phone, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Checkout = () => {
  const { items, total, subtotal, shipping } = useCart();
  const { isArabic } = useLanguage();
  const navigate = useNavigate();

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const message = `طلب جديد من Atelier Rabab:\n` + 
      items.map(i => `- ${i.title} (${i.selectedColor.name_en}) x${i.quantity}`).join('\n') +
      `\n\nالمجموع: ${total} MAD`;

    window.open(`https://wa.me/212679697964?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <main className={`min-h-screen bg-[#fafaf9] pt-24 md:pt-32 pb-20 ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto px-4 md:px-8">

        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-all"
        >
          <ArrowLeft size={14} className={isArabic ? 'rotate-180' : ''} />
          {isArabic ? "العودة" : "Retour"}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">

          {/* ملخص السلة - كيطلع هو الأول فالموبايل بفضل order-1 */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-stone-100 shadow-sm sticky top-24">
              <h2 className="text-xl font-serif italic mb-8 border-b border-stone-50 pb-4">
                {isArabic ? "ملخص الحقيبة" : "Résumé du Panier"}
              </h2>

              <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2 scrollbar-hide">
                {items.map((item) => (
                  <div key={item.id + item.selectedColor.hex} className="flex gap-4 items-center">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-stone-50 flex-shrink-0">
                      <img src={item.image} className="w-full h-full object-cover" alt={item.title} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-stone-800 truncate">{isArabic ? item.title_ar : item.title}</h4>
                      <p className="text-[10px] text-stone-400 uppercase tracking-tighter">
                        {isArabic ? item.selectedColor.name_ar : item.selectedColor.name_en} — x{item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-serif font-medium">{item.price * item.quantity} MAD</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-stone-100 space-y-3">
                <div className="flex justify-between text-[11px] uppercase tracking-widest text-stone-400">
                  <span>{isArabic ? "المجموع الفرعي" : "Subtotal"}</span>
                  <span>{subtotal} MAD</span>
                </div>
                <div className="flex justify-between text-[11px] uppercase tracking-widest text-stone-400">
                  <span>{isArabic ? "التوصيل" : "Livraison"}</span>
                  <span className="text-amber-700 font-bold">{shipping === 0 ? (isArabic ? 'مجاني' : 'Gratuit') : `${shipping} MAD`}</span>
                </div>
                <div className="flex justify-between text-xl font-serif pt-4 text-stone-900 border-t border-stone-50">
                  <span>Total</span>
                  <span className="text-amber-800">{total} MAD</span>
                </div>
              </div>
            </div>
          </div>

          {/* معلومات التوصيل - كتهبط هي التانية فالموبايل order-2 */}
          <div className="lg:col-span-7 space-y-10 order-2 lg:order-1">
            <header className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-stone-100 rounded-full shadow-sm">
                <Truck size={12} className="text-amber-600" />
                <span className="text-[9px] font-black uppercase tracking-widest text-stone-500">Expédition Sécurisée</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-serif italic text-stone-900 tracking-tight leading-tight">
                {isArabic ? "إتمام الطلب" : "Finaliser la Commande"}
              </h1>
              <p className="text-stone-400 text-sm font-light max-w-md">
                {isArabic ? "يرجى إدخال معلومات التوصيل لنتمكن من إرسال قطعتك الفنية." : "Veuillez entrer vos coordonnées pour l'expédition."}
              </p>
            </header>

            <form onSubmit={handleConfirmOrder} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 px-1">{isArabic ? "الاسم الكامل" : "Nom Complet"}</label>
                  <Input required className="h-14 rounded-2xl border-stone-100 bg-white focus:ring-amber-500/20 shadow-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 px-1">{isArabic ? "رقم الهاتف" : "Téléphone"}</label>
                  <Input required type="tel" className="h-14 rounded-2xl border-stone-100 bg-white shadow-sm" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 px-1">{isArabic ? "العنوان" : "Adresse"}</label>
                <Input required placeholder={isArabic ? "المدينة، الحي، رقم المنزل..." : "Ville, Quartier..."} className="h-14 rounded-2xl border-stone-100 bg-white shadow-sm" />
              </div>

              <div className="pt-6">
                <Button type="submit" className="w-full h-18 py-8 bg-stone-900 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] hover:bg-amber-900 transition-all duration-700 shadow-2xl shadow-stone-200 group">
                  <div className="flex items-center gap-4">
                     <ShoppingBag size={18} className="group-hover:scale-110 transition-transform" />
                     {isArabic ? "تأكيد الطلب عبر واتساب" : "Confirmer via WhatsApp"}
                  </div>
                </Button>
                <p className="text-center mt-6 text-[9px] text-stone-300 font-medium uppercase tracking-[0.2em]">
                  {isArabic ? "سيفتح الواتساب لإرسال تفاصيل طلبك تلقائياً" : "WhatsApp s'ouvrira pour envoyer vos détails"}
                </p>
              </div>
            </form>
          </div>

        </div>
      </div>
    </main>
  );
};