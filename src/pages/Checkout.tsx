import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBag, Truck, ArrowLeft, MessageCircle, Sparkles, MapPin, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export const Checkout = () => {
  const { items, subtotal } = useCart(); // كنخدمو بـ subtotal من الـ Context
  const { isArabic } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // ثمن التوصيل الثابت
  const shippingFee = 40;

  // الحالة لتخزين معلومات الكليان
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: ""
  });

  const [loading, setLoading] = useState(false);

  // إخفاء الـ Navbar الأصلية (لأننا في صفحة أدمن-ستايل)
  useEffect(() => {
    const nav = document.querySelector('nav');
    const footer = document.querySelector('footer');
    if (nav) nav.style.display = 'none';
    if (footer) footer.style.display = 'none';
    return () => {
      if (nav) nav.style.display = '';
      if (footer) footer.style.display = '';
    };
  }, []);

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneNumber = "212679697964";
    
    // حساب المجموع النهائي هنا بدقة
    const finalTotal = subtotal + shippingFee;

    const orderDetails = items.map((i, index) => {
      const title = isArabic ? (i.title_ar || i.title) : i.title;
      const color = isArabic ? i.selectedColor?.name_ar : i.selectedColor?.name_en;
      return `📦 *${index + 1}. ${title}*\n   🎨 ${isArabic ? 'اللون' : 'Couleur'}: ${color}\n   🔢 x${i.quantity}\n   💰 ${i.price * i.quantity} MAD`;
    }).join('\n\n');

    const message = isArabic 
      ? `✨ *طلب جديد - Atelier Rabab*\n\n👤 *الزبون:* ${formData.fullName}\n📞 *الهاتف:* ${formData.phone}\n📍 *العنوان:* ${formData.address}\n\n━━━━━━━━━━━━━━\n${orderDetails}\n\n━━━━━━━━━━━━━━\n🚚 *التوصيل:* ${shippingFee} MAD\n⭐ *المجموع النهائي: ${finalTotal} MAD*\n\n🙏 يرجى تأكيد الطلب للبدء في التحضير.`
      : `✨ *Nouvelle Commande - Atelier Rabab*\n\n👤 *Client:* ${formData.fullName}\n📞 *Tél:* ${formData.phone}\n📍 *Adresse:* ${formData.address}\n\n━━━━━━━━━━━━━━\n${orderDetails}\n\n━━━━━━━━━━━━━━\n🚚 *Livraison:* ${shippingFee} MAD\n⭐ *TOTAL FINAL: ${finalTotal} MAD*\n\n🙏 Veuillez confirmer pour lancer la préparation.`;

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <main className={`min-h-screen bg-[#fafaf9] pt-24 md:pt-32 pb-20 ${isArabic ? 'text-right' : 'text-left' selection:bg-amber-50}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-5xl mx-auto px-4 md:px-8">

        {/* Back Button - تصغير وحذف الـ Italic */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400 hover:text-stone-900 transition-all group"
        >
          <ArrowLeft size={12} className={`transition-transform group-hover:scale-110 ${isArabic ? 'rotate-180' : ''}`} />
          {isArabic ? "العودة للحقيبة" : "Retour au panier"}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">

          {/* معلومات التوصيل - مع الرونق والتحريكات */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="lg:col-span-7 space-y-10 order-2 lg:order-1">
            <header className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-stone-100 rounded-full shadow-sm">
                <Truck size={10} className="text-amber-600/50" />
                <span className="text-[8px] font-black uppercase tracking-widest text-stone-500">Expédition Sécurisée</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-medium text-stone-900 tracking-tight leading-tight uppercase">
                {isArabic ? "إتمام الطلب" : "Finaliser la Commande"}
              </h1>
              <p className="text-stone-400 text-xs font-medium uppercase tracking-wide opacity-70">
                {isArabic ? "يرجى إدخال معلومات التوصيل" : "Veuillez entrer vos coordonnées pour l'expédition sécurisée."}
              </p>
            </header>

            <form onSubmit={handleConfirmOrder} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-stone-400 px-1">{isArabic ? "الاسم الكامل" : "Nom Complet"}</label>
                  <Input 
                    required 
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    className="h-12 rounded-xl border-stone-100 bg-white focus:ring-amber-500/10 focus:ring-4 focus:ring-offset-0 focus:border-stone-200 transition-all shadow-sm text-xs" 
                  />
                </div>
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 delay-75">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-stone-400 px-1">{isArabic ? "رقم الهاتف" : "Téléphone"}</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-300" />
                    <Input 
                      required 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="h-12 rounded-xl border-stone-100 bg-white shadow-sm text-xs pl-11" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1 delay-150">
                <label className="text-[9px] font-bold uppercase tracking-widest text-stone-400 px-1">{isArabic ? "العنوان والمدينة" : "Adresse et Ville"}</label>
                <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-300" />
                    <Input 
                      required 
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder={isArabic ? "المدينة، الحي..." : "Ville, Quartier, Rue, Numéro de maison..."} 
                      className="h-12 rounded-xl border-stone-100 bg-white shadow-sm text-xs pl-11" 
                    />
                </div>
              </div>

              <div className="pt-6">
                <Button type="submit" disabled={loading} className="w-full h-16 bg-stone-900 hover:bg-black text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] hover:shadow-xl hover:shadow-stone-200 transition-all shadow-xl shadow-stone-100/50 gap-3 group">
                   <MessageCircle size={16} className="transition-transform group-hover:scale-105" />
                   {isArabic ? "تأكيد الطلب عبر واتساب" : "Confirmer via WhatsApp"}
                </Button>
                <p className="text-[9px] text-center text-stone-300 font-bold uppercase tracking-[0.2em] mt-6 leading-relaxed">
                   {isArabic ? "سيفتح تطبيق واتساب تلقائياً لإرسال تفاصيل طلبك وحفظ معلومات التوصيل" : "Votre WhatsApp s'ouvrira pour envoyer vos détails"}
                </p>
              </div>
            </form>
          </motion.div>

          {/* ملخص السلة - ملخص أنيق وصغير و Sticky */}
          <div className="lg:col-span-5 order-1 lg:order-2">
            <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-xl shadow-stone-100/50 sticky top-24">
              <div className="flex items-center gap-2 mb-6 border-b border-stone-50 pb-4">
                 <Sparkles className="w-3.5 h-3.5 text-amber-600/30" />
                 <h2 className="text-xs font-bold uppercase tracking-widest text-stone-900">
                   {isArabic ? "ملخص الحقيبة" : "Résumé du Panier"}
                 </h2>
              </div>

              <div className="space-y-4 max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
                {items.map((item) => (
                  <motion.div key={item.id + item.selectedColor.hex} className="flex gap-4 items-center">
                    <div className="w-12 h-16 rounded-lg overflow-hidden bg-stone-50 flex-shrink-0 shadow-inner border border-stone-50">
                      <img src={item.image} className="w-full h-full object-cover" alt={item.title} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[10px] font-bold text-stone-800 uppercase truncate leading-tight">{isArabic ? item.title_ar : item.title}</h4>
                      <p className="text-[9px] text-stone-400 font-medium tracking-wide">
                        x{item.quantity} — {isArabic ? item.selectedColor.name_ar : item.selectedColor.name_en}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-stone-900 tabular-nums">{item.price * item.quantity} MAD</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-stone-50 space-y-2 px-1">
                <div className="flex justify-between text-[9px] uppercase font-medium text-stone-400 tracking-widest tabular-nums">
                  <span>{isArabic ? "المجموع الفرعي" : "Sous-total"}</span>
                  <span>{subtotal} MAD</span>
                </div>
                <div className="flex justify-between text-[9px] uppercase font-medium text-stone-400 tracking-widest tabular-nums">
                  <span>{isArabic ? "التوصيل الآمن" : "Expédition Sécurisée"}</span>
                  <span className="text-stone-900 font-bold">{shippingFee} MAD</span>
                </div>
                <div className="flex justify-between items-end pt-4 border-t border-stone-50 mt-3">
                  <span className="text-[11px] font-bold text-stone-900 uppercase tracking-widest">{isArabic ? "المجموع النهائي" : "Total Final"}</span>
                  <span className="text-xl font-medium text-stone-900 tabular-nums">{subtotal + shippingFee} MAD</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};
