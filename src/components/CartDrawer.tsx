// ... (نفس الـ Imports)

export const CartDrawer = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { items, subtotal } = useCart(); // استعملنا subtotal باش نحسبو الصافي
  const { isArabic } = useLanguage();
  const navigate = useNavigate();
  const shippingFee = 40;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay & Side Panel (نفس الديزاين اللي عجبك) */}
          <motion.div className="..." /> 
          <motion.div className="fixed top-0 right-0 h-full w-full max-w-sm bg-[#fafaf9] z-[101] flex flex-col shadow-2xl">
            
            {/* Header (تصغير الخطوط وحذف الـ italic) */}
            <div className="p-8 border-b border-stone-100 flex justify-between items-center bg-white">
              <h2 className="text-xl font-medium tracking-tight text-stone-900 uppercase">
                {isArabic ? "حقيبة التسوق" : "Le Panier"}
              </h2>
              <button onClick={onClose}><X className="w-4 h-4 text-stone-400" /></button>
            </div>

            {/* Product List (نفس الـ Mapping اللي عندك) */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {/* ... (كود عرض المنتجات) */}
            </div>

            {/* Footer - الزر كيدي لـ Checkout */}
            {items.length > 0 && (
              <div className="p-8 border-t border-stone-100 space-y-6 bg-white">
                <div className="space-y-2 text-[10px] font-medium text-stone-400 uppercase tracking-widest">
                  <div className="flex justify-between">
                    <span>{isArabic ? "المجموع" : "Sous-total"}</span>
                    <span>{subtotal} MAD</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isArabic ? "التوصيل" : "Livraison"}</span>
                    <span>{shippingFee} MAD</span>
                  </div>
                  <div className="flex justify-between items-end pt-2 border-t border-stone-50">
                    <span className="text-[11px] font-bold text-stone-900">{isArabic ? "المجموع النهائي" : "Total Final"}</span>
                    <span className="text-xl font-medium text-stone-900">{subtotal + shippingFee} MAD</span>
                  </div>
                </div>

                <Button 
                  onClick={() => { onClose(); navigate("/checkout"); }} 
                  className="w-full bg-stone-900 hover:bg-black text-white h-14 rounded-xl font-bold text-[10px] uppercase tracking-[0.2em]"
                >
                  {isArabic ? "إتمام الطلب" : "Passer à la caisse"}
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
