

export const Checkout = () => {
  const { items, subtotal } = useCart();
  const { isArabic } = useLanguage();
  const navigate = useNavigate();
  const shippingFee = 40;
  
  const [formData, setFormData] = useState({ fullName: "", phone: "", address: "" });

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTotal = subtotal + shippingFee;
    
    const orderDetails = items.map((i) => 
      `- ${isArabic ? i.title_ar : i.title} (${isArabic ? i.selectedColor?.name_ar : i.selectedColor?.name_en}) x${i.quantity}`
    ).join('\n');

    const message = `✨ *طلب جديد - Atelier Rabab*\n\n` +
      `👤 *الزبون:* ${formData.fullName}\n` +
      `📞 *الهاتف:* ${formData.phone}\n` +
      `📍 *العنوان:* ${formData.address}\n\n` +
      `━━━━━━━━━━━━━━\n${orderDetails}\n━━━━━━━━━━━━━━\n` +
      `🚚 *التوصيل:* ${shippingFee} MAD\n` +
      `⭐ *المجموع:* ${finalTotal} MAD`;

    window.open(`https://wa.me/212679697964?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-[#fafaf9] pt-24 pb-20 px-4 md:px-8" dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Form Section */}
        <div className="lg:col-span-7 space-y-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[9px] font-bold uppercase text-stone-400"><ArrowLeft size={12}/> {isArabic ? "العودة" : "Retour"}</button>
          <h1 className="text-2xl font-medium uppercase tracking-tight">{isArabic ? "معلومات التوصيل" : "Expédition"}</h1>
          
          <form onSubmit={handleConfirmOrder} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Nom Complet" required value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="h-12 rounded-xl text-xs" />
              <Input placeholder="Téléphone" required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="h-12 rounded-xl text-xs" />
            </div>
            <Input placeholder="Ville, Adresse..." required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="h-12 rounded-xl text-xs" />
            <Button type="submit" className="w-full h-14 bg-stone-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] gap-3">
              <MessageCircle size={16}/> {isArabic ? "إرسال الطلب عبر واتساب" : "Confirmer via WhatsApp"}
            </Button>
          </form>
        </div>

        {/* Summary Section - Elegant & Small */}
        <div className="lg:col-span-5">
          <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm sticky top-24">
            <h2 className="text-xs font-bold uppercase mb-6 tracking-widest">{isArabic ? "ملخص الحقيبة" : "Résumé"}</h2>
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.id + item.selectedColor.hex} className="flex gap-4 items-center">
                  <img src={item.image} className="w-10 h-14 object-cover rounded-lg" />
                  <div className="flex-1"><h4 className="text-[10px] font-bold uppercase">{isArabic ? item.title_ar : item.title}</h4><p className="text-[9px] text-stone-400">x{item.quantity}</p></div>
                  <span className="text-[10px] font-bold">{item.price * item.quantity} MAD</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-4 space-y-2 text-[10px] uppercase font-medium text-stone-400">
              <div className="flex justify-between"><span>Sous-total</span><span>{subtotal} MAD</span></div>
              <div className="flex justify-between"><span>Livraison</span><span>{shippingFee} MAD</span></div>
              <div className="flex justify-between pt-3 border-t text-stone-900 font-bold text-sm uppercase">
                <span>Total</span><span>{subtotal + shippingFee} MAD</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
