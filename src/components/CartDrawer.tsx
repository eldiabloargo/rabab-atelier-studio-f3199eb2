

export const CartDrawer = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { items, removeFromCart, updateQuantity, subtotal } = useCart();
  const { isArabic } = useLanguage();
  const navigate = useNavigate(); 
  
  // ثمن التوصيل الثابت
  const shippingFee = 40;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-stone-900/40 backdrop-blur-[2px] z-[100]" />
          <motion.div 
            initial={{ x: isArabic ? "-100%" : "100%" }} animate={{ x: 0 }} exit={{ x: isArabic ? "-100%" : "100%" }}
            className={`fixed top-0 ${isArabic ? 'left-0' : 'right-0'} h-full w-full max-w-sm bg-[#fafaf9] z-[101] shadow-2xl flex flex-col`}
          >
            {/* Header - Minimalist */}
            <div className="p-8 border-b border-stone-100 flex justify-between items-center bg-white">
              <div className="space-y-1">
                <h2 className="text-xl font-medium tracking-tight text-stone-900 uppercase">{isArabic ? "حقيبة التسوق" : "Le Panier"}</h2>
                <p className="text-[9px] font-bold text-stone-400 uppercase tracking-[0.3em]">{items.length} {isArabic ? "قِطَع" : "Articles"}</p>
              </div>
              <button onClick={onClose}><X className="w-4 h-4 text-stone-400" /></button>
            </div>

            {/* List - Small Images */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              {items.map((item) => (
                <div key={`${item.id}-${item.selectedColor?.hex}`} className="flex gap-5 relative group">
                  <div className="relative aspect-[3/4] w-20 rounded-xl overflow-hidden bg-stone-100 border border-stone-50 flex-shrink-0">
                    <img src={item.image} className="w-full h-full object-cover" alt={item.title} />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <h4 className="text-[11px] font-bold text-stone-800 uppercase">{isArabic ? (item.title_ar || item.title) : item.title}</h4>
                    <span className="text-[9px] font-medium text-stone-400 uppercase">{isArabic ? item.selectedColor?.name_ar : item.selectedColor?.name_en}</span>
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center bg-white rounded-lg border border-stone-100 p-1">
                        <button onClick={() => updateQuantity(item.id, item.selectedColor?.hex || '', -1)} className="w-4 h-4 flex items-center justify-center"><Minus size={10}/></button>
                        <span className="px-3 text-[10px] font-bold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.selectedColor?.hex || '', 1)} className="w-4 h-4 flex items-center justify-center"><Plus size={10}/></button>
                      </div>
                      <span className="text-xs font-bold">{item.price * item.quantity} MAD</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer - Navigate only to Checkout */}
            <div className="p-8 border-t border-stone-100 space-y-4 bg-white">
              <div className="space-y-2 text-[10px] font-medium text-stone-400 uppercase tracking-widest">
                <div className="flex justify-between"><span>Subtotal</span><span>{subtotal} MAD</span></div>
                <div className="flex justify-between"><span>Livraison</span><span>{shippingFee} MAD</span></div>
                <div className="flex justify-between pt-2 border-t border-stone-50 text-stone-900 font-bold">
                  <span>Total</span><span>{subtotal + shippingFee} MAD</span>
                </div>
              </div>
              <Button onClick={() => { onClose(); navigate("/checkout"); }} className="w-full h-14 bg-stone-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.2em]">
                {isArabic ? "إتمام الطلب" : "Finaliser la Commande"}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
