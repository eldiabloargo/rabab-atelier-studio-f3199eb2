// ... (Imports)

export const Checkout = () => {
  const { items, subtotal } = useCart(); // كنخدمو بـ subtotal من الـ Context
  const { isArabic } = useLanguage();
  const navigate = useNavigate();
  const shippingFee = 40;
  const [formData, setFormData] = useState({ fullName: "", phone: "", address: "" });

  const handleConfirmOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneNumber = "212679697964";
    
    // حساب المجموع النهائي هنا باش ما يوقعش غلط
    const finalTotal = subtotal + shippingFee;

    const orderDetails = items.map((i, index) => {
      const title = isArabic ? (i.title_ar || i.title) : i.title;
      const color = isArabic ? i.selectedColor?.name_ar : i.selectedColor?.name_en;
      return `📦 *${index + 1}. ${title}*\n   🎨 ${isArabic ? 'اللون' : 'Couleur'}: ${color}\n   🔢 x${i.quantity}\n   💰 ${i.price * i.quantity} MAD`;
    }).join('\n\n');

    const message = isArabic 
      ? `✨ *طلب جديد - Atelier Rabab*\n\n👤 *الزبون:* ${formData.fullName}\n📞 *الهاتف:* ${formData.phone}\n📍 *العنوان:* ${formData.address}\n\n━━━━━━━━━━━━━━\n${orderDetails}\n\n━━━━━━━━━━━━━━\n🚚 *التوصيل:* ${shippingFee} MAD\n⭐ *المجموع النهائي: ${finalTotal} MAD*\n\n🙏 يرجى التأكيد.`
      : `✨ *Nouvelle Commande - Atelier Rabab*\n\n👤 *Client:* ${formData.fullName}\n📞 *Tél:* ${formData.phone}\n📍 *Adresse:* ${formData.address}\n\n━━━━━━━━━━━━━━\n${orderDetails}\n\n━━━━━━━━━━━━━━\n🚚 *Livraison:* ${shippingFee} MAD\n⭐ *TOTAL FINAL: ${finalTotal} MAD*\n\n🙏 Veuillez confirmer.`;

    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <main className="...">
      {/* ... (نفس الـ Structure اللي عطيناك قبل) */}
      {/* تأكد أن المجموع كيتعرض بـ {subtotal + shippingFee} */}
      <div className="flex justify-between items-end pt-4 border-t border-stone-50">
        <span className="text-[11px] font-bold text-stone-900 uppercase">Total</span>
        <span className="text-xl font-medium text-stone-900">{subtotal + shippingFee} MAD</span>
      </div>
      {/* ... */}
    </main>
  );
};
