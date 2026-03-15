import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Cart = () => {
  const { items, removeFromCart, updateQuantity, total } = useCart();
  const { isArabic } = useLanguage();

  const handleWhatsAppOrder = () => {
    const phoneNumber = "2126XXXXXXXX"; // حط رقم الواتساب ديال Atelier Rabab هنا
    
    let message = isArabic 
      ? `*طلب جديد من Atelier Rabab*\n\n` 
      : `*Nouvelle Commande - Atelier Rabab*\n\n`;

    items.forEach((item, index) => {
      const title = isArabic ? item.title_ar : item.title;
      const color = isArabic ? item.selectedColor.name_ar : item.selectedColor.name_en;
      message += `${index + 1}. *${title}*\n`;
      message += `   - ${isArabic ? 'اللون' : 'Couleur'}: ${color} (${item.selectedColor.hex})\n`;
      message += `   - ${isArabic ? 'الكمية' : 'Quantité'}: ${item.quantity}\n`;
      message += `   - ${isArabic ? 'الثمن' : 'Prix'}: ${item.price} MAD\n\n`;
    });

    message += `---------------------------\n`;
    message += `*${isArabic ? 'المجموع الإجمالي' : 'TOTAL'}: ${total} MAD*`;

    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-8">
          <div className="w-24 h-24 bg-stone-50 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag className="w-10 h-10 text-stone-200" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-serif italic text-stone-900">{isArabic ? "سلتك فارغة" : "Votre panier est vide"}</h2>
            <p className="text-stone-400 text-sm">{isArabic ? "اكتشف مجموعتنا المميزة واملأ سلتك" : "Explorez nos collections et remplissez votre panier"}</p>
          </div>
          <Link to="/">
            <Button className="bg-stone-900 text-white rounded-full px-10 h-14 uppercase text-[10px] font-bold tracking-widest">
              {isArabic ? "ابدأ التسوق" : "Commencer l'achat"}
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <main className={`min-h-screen bg-[#fafaf9] pt-32 pb-20 ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-4xl mx-auto px-6">
        <header className="mb-16">
          <h1 className="text-4xl md:text-5xl font-serif tracking-tighter italic text-stone-900">
            {isArabic ? "حقيبة التسوق" : "Votre Panier"}
          </h1>
          <p className="text-amber-700 text-[10px] font-black uppercase tracking-[0.4em] mt-4">
            {items.length} {isArabic ? "منتجات مختارة" : "Articles Sélectionnés"}
          </p>
        </header>

        <div className="space-y-6">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div 
                key={`${item.id}-${item.selectedColor.hex}`}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="bg-white rounded-[2rem] p-4 md:p-6 shadow-sm border border-stone-100 flex gap-6 items-center"
              >
                {/* Image */}
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden bg-stone-50 shrink-0">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm md:text-base font-serif italic text-stone-900">
                      {isArabic ? item.title_ar : item.title}
                    </h3>
                    <button onClick={() => removeFromCart(item.id, item.selectedColor.hex)} className="text-stone-300 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Selected Color Badge */}
                  <div className="flex items-center gap-2 bg-stone-50 w-fit px-3 py-1 rounded-full border border-stone-100">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.selectedColor.hex }} />
                    <span className="text-[9px] font-bold text-stone-500 uppercase">
                      {isArabic ? item.selectedColor.name_ar : item.selectedColor.name_en}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center gap-4 bg-stone-50 rounded-full px-3 py-1 border border-stone-100">
                      <button onClick={() => updateQuantity(item.id, item.selectedColor.hex, -1)} className="p-1 hover:text-amber-700 transition-colors"><Minus className="w-3 h-3" /></button>
                      <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.selectedColor.hex, 1)} className="p-1 hover:text-amber-700 transition-colors"><Plus className="w-3 h-3" /></button>
                    </div>
                    <p className="text-sm font-bold text-stone-900">{item.price * item.quantity} MAD</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Total & Checkout */}
        <div className="mt-12 bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-stone-100 space-y-8">
          <div className="flex justify-between items-center border-b border-stone-100 pb-6">
            <span className="text-stone-400 font-serif italic">{isArabic ? "المجموع الإجمالي" : "Sous-total"}</span>
            <span className="text-2xl font-light text-stone-900">{total} MAD</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link to="/">
              <Button variant="ghost" className="w-full h-16 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-stone-400">
                {isArabic ? "مواصلة التسوق" : "Continuer les achats"}
              </Button>
            </Link>
            <Button 
              onClick={handleWhatsAppOrder}
              className="w-full h-16 bg-stone-900 hover:bg-green-700 text-white rounded-2xl gap-3 text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-stone-200 transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              {isArabic ? "إرسال الطلب عبر واتساب" : "Commander via WhatsApp"}
            </Button>
          </div>
          <p className="text-[9px] text-center text-stone-400 uppercase tracking-widest">
            {isArabic ? "تطبق رسوم التوصيل عند الاستلام" : "Frais de livraison appliqués à la réception"}
          </p>
        </div>
      </div>
    </main>
  );
};
