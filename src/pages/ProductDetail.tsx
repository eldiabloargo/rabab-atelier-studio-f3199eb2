import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isArabic } = useLanguage();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<any>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabase.from("products").select("*").eq("id", id).single();
      if (data) {
        setProduct(data);
        if (data.colors?.length > 0) setSelectedColor(data.colors[0]);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="w-6 h-6 border-t-2 border-stone-900 rounded-full animate-spin" /></div>;
  if (!product) return null;

  // المنطق الصارم للغة: كل لغة كتاخد الخانة ديالها
  const currentTitle = isArabic ? product.title_ar : product.title;
  const currentDesc = isArabic ? product.description_ar : product.description;
  const currentCategory = isArabic ? product.category_ar : product.category;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,       // الاسم الأصلي (للأدمن)
      title_ar: product.title_ar, // الاسم العربي
      price: product.price,
      image: product.image_url,
      selectedColor: selectedColor,
      quantity: 1
    });
    toast({ title: isArabic ? "تمت الإضافة" : "Ajouté au panier" });
  };

  return (
    <main className={`min-h-screen bg-white ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Navigation خفيفة */}
      <div className="p-6 flex justify-between items-center fixed top-0 w-full z-50 bg-white/50 backdrop-blur-sm">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-stone-100 rounded-full transition-colors">
          <ArrowLeft className={`w-4 h-4 text-stone-600 ${isArabic ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <div className="max-w-4xl mx-auto pt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-6">
          
          {/* صور مصغرة ومتناسقة */}
          <div className="space-y-4">
            <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-stone-50 border border-stone-100">
              <img src={product.image_url} className="w-full h-full object-cover" alt={currentTitle} />
            </div>
            {/* Gallery صغيرة */}
            <div className="grid grid-cols-4 gap-2">
              {product.images_gallery?.map((img: string, i: number) => (
                <div key={i} className="aspect-square rounded-lg overflow-hidden border border-stone-50">
                  <img src={img} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* تفاصيل المنتج بخطوط رقيقة مريحة */}
          <div className="flex flex-col justify-center space-y-6 py-4">
            <div className="space-y-2">
              <span className="text-[10px] font-medium text-amber-700 uppercase tracking-widest">
                {currentCategory}
              </span>
              <h1 className="text-xl md:text-2xl font-serif text-stone-900 tracking-tight leading-snug">
                {currentTitle}
              </h1>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-lg font-light text-stone-900">{product.price}</span>
                <span className="text-[9px] font-bold text-stone-400">MAD</span>
              </div>
            </div>

            {/* اختيار اللون - صغار وأنيقين */}
            {product.colors?.length > 0 && (
              <div className="space-y-3">
                <span className="text-[10px] text-stone-400 uppercase tracking-tight italic">
                  {isArabic ? "اختر اللون" : "Couleur"}
                </span>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor?.hex === color.hex ? 'border-stone-900 scale-110' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* الوصف - خط مريح للقراءة */}
            <div className="pt-4 border-t border-stone-50">
              <p className="text-sm text-stone-500 leading-relaxed font-light max-w-sm">
                {currentDesc}
              </p>
            </div>

            {/* Button - فخم ولكن غير ضخم */}
            <div className="pt-4">
              <Button 
                onClick={handleAddToCart}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white h-12 rounded-xl text-[10px] font-bold uppercase tracking-widest shadow-none transition-all"
              >
                <ShoppingBag className="w-3.5 h-3.5 mr-2 rtl:ml-2" /> 
                {isArabic ? "إضافة للحقيبة" : "Ajouter au Panier"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
