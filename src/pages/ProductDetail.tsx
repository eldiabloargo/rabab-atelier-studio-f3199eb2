import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { ArrowLeft, ShoppingBag, Sparkles, ChevronRight, ChevronLeft } from "lucide-react";
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
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-t-2 border-stone-200 border-r-2 border-amber-600 rounded-full" 
      />
    </div>
  );

  if (!product) return null;

  const currentTitle = isArabic && product.title_ar ? product.title_ar : product.title;
  const currentDesc = isArabic && product.description_ar ? product.description_ar : product.description;
  const currentCategory = isArabic && product.category_ar ? product.category_ar : product.category;

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
      title: isArabic ? "تمت الإضافة بنجاح" : "Ajouté avec succès",
      description: currentTitle,
      className: "bg-white border-stone-100 font-serif"
    });
  };

  return (
    <main className="min-h-screen bg-[#fafaf9] selection:bg-amber-50">
      {/* Navigation Bar - Transparent & Elegant */}
      <nav className="fixed top-0 w-full z-50 px-6 py-8 flex justify-between items-center bg-gradient-to-b from-white/80 to-transparent backdrop-blur-[2px]">
        <button 
          onClick={() => navigate(-1)} 
          className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 hover:text-stone-900 transition-all"
        >
          <ArrowLeft className={`w-4 h-4 transition-transform group-hover:-translate-x-1 ${isArabic ? 'rotate-180 group-hover:translate-x-1' : ''}`} />
          {t("category.back")}
        </button>
        <div className="flex items-center gap-2">
          <Sparkles className="w-3 h-3 text-amber-600/40" />
          <span className="text-[9px] font-black uppercase tracking-[0.4em] text-stone-300 italic">Atelier Rabab Studio</span>
        </div>
      </nav>

      <div className="max-w-[1400px] mx-auto pt-32 pb-20 px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">

          {/* Left Column: Visuals (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-stone-100">
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  src={activeImage}
                  className="w-full h-full object-cover"
                  alt={currentTitle}
                />
              </AnimatePresence>
            </div>

            {/* Gallery Strip */}
            {product.images_gallery?.length > 0 && (
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide px-2">
                {[product.image_url, ...product.images_gallery].map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(img)}
                    className={`relative flex-shrink-0 w-24 aspect-square rounded-2xl overflow-hidden border-2 transition-all duration-500 ${
                      activeImage === img ? 'border-amber-600 shadow-lg scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Details (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-10">
            <header className="space-y-4">
              <div className={`flex items-center gap-3 text-amber-700/60 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <div className="h-[1px] w-6 bg-amber-200" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em]">
                  {currentCategory || t("nav.collection")}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-serif text-stone-800 tracking-tight leading-[1.1] italic">
                {currentTitle}
              </h1>

              <div className={`flex items-baseline gap-2 pt-2 ${isArabic ? 'flex-row-reverse' : ''}`}>
                <span className="text-3xl font-light text-stone-900 tracking-tighter">
                  {product.price || "---"}
                </span>
                <span className="text-[10px] font-black text-stone-400 tracking-widest uppercase">MAD</span>
              </div>
            </header>

            {/* Color Selection - Custom Radios */}
            {product.colors?.length > 0 && (
              <div className="space-y-5 py-6 border-y border-stone-100">
                <div className={`flex justify-between items-center ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">
                    {isArabic ? "تخصيص اللون" : "Personnaliser la couleur"}
                  </span>
                  <span className="text-[9px] font-serif italic text-amber-700">{selectedColor?.name}</span>
                </div>
                <div className="flex flex-wrap gap-4">
                  {product.colors.map((color: any, i: number) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(color)}
                      className="group relative flex items-center justify-center"
                    >
                      <div 
                        className={`w-10 h-10 rounded-full transition-all duration-500 shadow-inner ${
                          selectedColor?.hex === color.hex ? 'scale-110 shadow-md' : 'scale-90 group-hover:scale-100'
                        }`}
                        style={{ backgroundColor: color.hex }}
                      />
                      {selectedColor?.hex === color.hex && (
                        <motion.div 
                          layoutId="color-outline"
                          className="absolute -inset-1.5 border border-stone-300 rounded-full"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description - Editorial Style */}
            <div className="space-y-4">
               <p className="text-stone-500 font-sans text-[15px] leading-relaxed font-light italic opacity-90">
                {currentDesc}
              </p>
            </div>

            {/* Action Area */}
            <div className="pt-6 space-y-6">
              <Button 
                onClick={handleAddToCart}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white h-16 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-stone-200 transition-all duration-500 group"
              >
                <ShoppingBag className={`w-4 h-4 mr-3 transition-transform group-hover:scale-110 ${isArabic ? 'ml-3 mr-0' : ''}`} /> 
                {isArabic ? "إضافة إلى الحقيبة" : "Ajouter au Panier"}
              </Button>
              
              <div className="flex items-center justify-center gap-8 py-4 opacity-40">
                <div className="flex flex-col items-center gap-2">
                   <div className="w-[1px] h-4 bg-stone-300" />
                   <span className="text-[8px] font-black uppercase tracking-widest">Handcrafted</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                   <div className="w-[1px] h-4 bg-stone-300" />
                   <span className="text-[8px] font-black uppercase tracking-widest">Premium Plaster</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
