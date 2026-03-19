import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { ArrowLeft, ShoppingBag, Sparkles, Star, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isArabic, t } = useLanguage();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabase.from("products").select("*").eq("id", id).single();
      if (data) {
        setProduct(data);
        setActiveImage(data.image_url);
        if (data.colors?.length > 0) setSelectedColor(data.colors[0]);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafaf9]">
      <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return null;

  const currentTitle = isArabic && product.title_ar ? product.title_ar : product.title;
  const currentDesc = isArabic && product.description_ar ? product.description_ar : product.description;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      title_ar: product.title_ar,
      price: product.price,
      image: product.image_url,
      selectedColor: selectedColor,
      quantity: 1
    });
    toast({ 
      title: isArabic ? "أضيف للحقيبة" : "Ajouté au panier",
      className: "bg-white border-stone-100 rounded-xl"
    });
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Nav مصغرة وأنيقة */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-white/80 backdrop-blur-md border-b border-stone-50">
        <button 
          onClick={() => navigate(-1)} 
          className="group flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-stone-400 hover:text-stone-900 transition-all"
        >
          <ArrowLeft className="w-3 h-3" />
          {t("category.back")}
        </button>
        <span className="text-[9px] font-medium tracking-[0.3em] text-amber-800 uppercase">Pièce Artisanale</span>
      </nav>

      {/* تقليص الـ pt من 32 لـ 20 لربح المساحة */}
      <div className="max-w-6xl mx-auto pt-20 pb-16 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-start">

          {/* Media Section: Frame أصغر شوية */}
          <div className="lg:col-span-6 space-y-6">
            <motion.div 
              layoutId={`image-${product.id}`}
              className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-[#f8f8f7]"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  src={activeImage}
                  className="w-full h-full object-cover"
                  alt={currentTitle}
                />
              </AnimatePresence>
            </motion.div>

            {/* Gallery: أحجام أصغر */}
            <div className="flex gap-3">
              {[product.image_url, ...(product.images_gallery || [])].map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`w-16 h-20 rounded-lg overflow-hidden border transition-all 
                    ${activeImage === img ? 'border-amber-600' : 'border-transparent opacity-50'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="Gallery" />
                </button>
              ))}
            </div>
          </div>

          {/* Content Section: Editorial & Minimalist */}
          <div className="lg:col-span-6 space-y-8">
            <header className="space-y-4">
              <div className={`flex items-center gap-3 text-stone-300 ${isArabic ? 'flex-row-reverse' : ''}`}>
                 <span className="text-[8px] font-bold uppercase tracking-[0.4em]">Maroc</span>
                 <div className="h-[1px] w-8 bg-stone-100" />
              </div>

              {/* العنوان: حيدنا الـ italic ورديناه أنيق وبسيط */}
              <h1 className="text-3xl md:text-4xl font-serif text-stone-900 tracking-tight leading-tight">
                {currentTitle}
              </h1>

              <div className={`flex items-baseline gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <span className="text-2xl font-light text-stone-900 tracking-tighter">{product.price}</span>
                <span className="text-[10px] font-bold text-stone-300 uppercase tracking-widest">MAD</span>
              </div>
            </header>

            {/* Colors: أزرار أصغر وراقية */}
            {product.colors?.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-stone-50">
                <div className={`flex justify-between items-center ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-stone-400">Nuances</span>
                  <span className="text-[9px] font-medium text-amber-700">{selectedColor?.name}</span>
                </div>
                <div className="flex gap-3">
                  {product.colors.map((color: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border p-0.5 transition-all
                        ${selectedColor?.hex === color.hex ? 'border-amber-600 scale-110' : 'border-stone-100 opacity-60'}`}
                    >
                      <div className="w-full h-full rounded-full" style={{ backgroundColor: color.hex }} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description: خط رقيق ومقروء */}
            <div className="py-6 border-t border-stone-50">
              <p className={`text-stone-500 font-light leading-relaxed text-sm md:text-base ${isArabic ? 'text-right' : 'text-left'}`}>
                {currentDesc}
              </p>
            </div>

            {/* Buttons: لمسة عصرية بـ Border رقيق */}
            <div className="pt-6 space-y-6">
              <Button 
                onClick={handleAddToCart}
                className="w-full h-14 bg-stone-900 hover:bg-amber-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] transition-all"
              >
                <ShoppingBag size={14} className="mr-3 inline-block" />
                {isArabic ? "اقتناء الآن" : "Ajouter au Panier"}
              </Button>

              <div className="flex justify-between border-t border-stone-50 pt-6">
                <div className="flex items-center gap-3">
                  <Star size={12} className="text-stone-300" />
                  <span className="text-[8px] font-bold uppercase tracking-widest text-stone-400">Pièce Signée</span>
                </div>
                <div className="flex items-center gap-3">
                  <ShieldCheck size={12} className="text-stone-300" />
                  <span className="text-[8px] font-bold uppercase tracking-widest text-stone-400">Livraison Sécurisée</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
