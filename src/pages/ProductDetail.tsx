import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { ArrowLeft, ShoppingBag, Star, ShieldCheck } from "lucide-react";
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
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setProduct(data);
        setActiveImage(data.image_url);
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0]);
        }
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
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
      title: isArabic ? "تمت الإضافة للحقيبة" : "Ajouté au panier",
      className: "bg-white border-stone-100 rounded-xl font-serif italic"
    });
  };

  return (
    <main className="min-h-screen bg-white">
      {/* Nav: ثابتة وأنيقة */}
      <nav className="fixed top-0 w-full z-50 px-4 py-3 flex justify-between items-center bg-white/90 backdrop-blur-md border-b border-stone-50">
        <button 
          onClick={() => navigate(-1)} 
          className="group flex items-center gap-2 text-[8px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 transition-all"
        >
          <ArrowLeft className={`w-3 h-3 ${isArabic ? 'rotate-180' : ''}`} />
          {t("category.back")}
        </button>
        <span className="text-[8px] font-bold tracking-[0.3em] text-amber-800 uppercase">Atelier Rabab</span>
      </nav>

     

   
<div className="max-w-5xl mx-auto pt-20 md:pt-28 pb-12 px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">

          {/* Media Section */}
          <div className="space-y-4">
            <motion.div 
              layoutId={`image-${product.id}`}
              className="relative aspect-[4/5] md:aspect-[3/4] rounded-xl overflow-hidden bg-[#fbfbfb]"
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

            {/* Gallery Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
              {[product.image_url, ...(product.images_gallery || [])].map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`w-14 h-18 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all 
                    ${activeImage === img ? 'border-amber-600' : 'border-transparent opacity-40'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="Gallery" />
                </button>
              ))}
            </div>
          </div>

          
          <div className="flex flex-col h-full justify-center">
            <header className="space-y-3">
              <div className={`flex items-center gap-2 text-stone-300 ${isArabic ? 'flex-row-reverse' : ''}`}>
                 <span className="text-[7px] font-bold uppercase tracking-[0.4em]">{product.category || 'Collection'}</span>
                 <div className="h-[1px] w-6 bg-stone-100" />
              </div>

              <h1 className="text-2xl md:text-3xl font-serif text-stone-900 tracking-tight">
                {currentTitle}
              </h1>

              <div className={`flex items-baseline gap-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <span className="text-xl font-light text-stone-900 tracking-tighter">{product.price} MAD</span>
              </div>
            </header>

            
            {product.colors?.length > 0 && (
              <div className="mt-6 pt-6 border-t border-stone-50 space-y-3">
                <div className={`flex justify-between items-center ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <span className="text-[8px] font-bold uppercase tracking-widest text-stone-400">Sélection de Couleur</span>
                  <span className="text-[9px] font-medium text-amber-700">
                    {isArabic ? (selectedColor?.name_ar || selectedColor?.name) : (selectedColor?.name_en || selectedColor?.name)}
                  </span>
                </div>
                <div className="flex gap-2">
                  {product.colors.map((color: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(color)}
                      className={`w-7 h-7 rounded-full border p-0.5 transition-all
                        ${selectedColor?.hex === color.hex ? 'border-amber-600' : 'border-stone-100 opacity-70'}`}
                    >
                      <div className="w-full h-full rounded-full" style={{ backgroundColor: color.hex }} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            
            <div className="mt-6 py-6 border-t border-stone-50">
              <p className={`text-stone-500 font-light leading-relaxed text-sm ${isArabic ? 'text-right' : 'text-left'}`}>
                {currentDesc}
              </p>
            </div>

            
            <div className="mt-auto pt-6 space-y-6">
              <Button 
                onClick={handleAddToCart}
                className="w-full h-12 bg-stone-900 hover:bg-amber-900 text-white rounded-lg text-[9px] font-bold uppercase tracking-[0.2em] transition-all"
              >
                <ShoppingBag size={14} className={`${isArabic ? 'ml-2' : 'mr-2'}`} />
                {isArabic ? "أضف للحقيبة" : "Ajouter au Panier"}
              </Button>

              <div className="flex justify-between items-center opacity-60">
                <div className="flex items-center gap-2">
                  <Star size={10} />
                  <span className="text-[7px] font-bold uppercase tracking-widest text-stone-500">Authentique</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={10} />
                  <span className="text-[7px] font-bold uppercase tracking-widest text-stone-500">Sécurisé</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}; 
