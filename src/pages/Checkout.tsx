import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBag, Truck, MapPin, Phone } from "lucide-react";

export const Checkout = () => {
  const { items, total, subtotal, shipping } = useCart();
  const { isArabic } = useLanguage();

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    // هنا غانجمعو الرسالة ونصيفطوها للواتساب
    const message = `طلب جديد من Atelier Rabab:\n` + 
      items.map(i => `- ${i.title} (${i.selectedColor.name_en}) x${i.quantity}`).join('\n') +
      `\n\nTotal: ${total} MAD`;
    
    window.open(`https://wa.me/212679697964?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <main className={`min-h-screen bg-[#fafaf9] pt-32 pb-20 ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto px-4 md:px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
        
        {/* معلومات التوصيل */}
        <div className="lg:col-span-7 space-y-10">
          <header className="space-y-4">
            <h1 className="text-4xl font-serif italic text-stone-900">
              {isArabic ? "إتمام الطلب" : "Finaliser la Commande"}
            </h1>
            <p className="text-stone-400 text-sm">{isArabic ? "يرجى إدخال معلومات التوصيل لنتمكن من إرسال قطعتك الفنية." : "Veuillez entrer vos coordonnées pour l'expédition."}</p>
          </header>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input placeholder={isArabic ? "الاسم الكامل" : "Nom Complet"} className="h-14 rounded-2xl border-stone-100 shadow-sm" />
              <Input placeholder={isArabic ? "رقم الهاتف" : "Téléphone"} className="h-14 rounded-2xl border-stone-100 shadow-sm" />
            </div>
            <Input placeholder={isArabic ? "العنوان (المدينة، الحي...)" : "Adresse d'expédition"} className="h-14 rounded-2xl border-stone-100 shadow-sm" />
            <Button onClick={handleConfirmOrder} className="w-full h-16 bg-stone-900 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-amber-900 transition-all duration-700">
              {isArabic ? "تأكيد الطلب عبر واتساب" : "Confirmer via WhatsApp"}
            </Button>
          </form>
        </div>

        {/* ملخص السلة */}
        <<div className="lg:col-span-5 order-1 lg:order-2">
    <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-stone-100 sticky top-24">
          <h2 className="text-xl font-serif mb-8">{isArabic ? "ملخص الحقيبة" : "Résumé du Panier"}</h2>
          <div className="space-y-6">
            {items.map((item) => (
              <div key={item.id + item.selectedColor.hex} className="flex gap-4 items-center">
                <img src={item.image} className="w-16 h-16 rounded-xl object-cover border border-stone-50" />
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-stone-800">{isArabic ? item.title_ar : item.title}</h4>
                  <p className="text-[10px] text-stone-400 uppercase tracking-tighter">{item.selectedColor.name_en} x {item.quantity}</p>
                </div>
                <span className="text-sm font-serif">{item.price * item.quantity} MAD</span>
              </div>
            ))}
            <div className="border-t border-stone-50 pt-6 space-y-3">
              <div className="flex justify-between text-xs text-stone-400">
                <span>{isArabic ? "المجموع الفرعي" : "Subtotal"}</span>
                <span>{subtotal} MAD</span>
              </div>
              <div className="flex justify-between text-xs text-stone-400">
                <span>{isArabic ? "التوصيل" : "Livraison"}</span>
                <span>{shipping === 0 ? (isArabic ? 'مجاني' : 'Gratuit') : `${shipping} MAD`}</span>
              </div>
              <div className="flex justify-between text-lg font-serif pt-2 text-stone-900 border-t border-stone-50">
                <span>Total</span>
                <span>{total} MAD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
