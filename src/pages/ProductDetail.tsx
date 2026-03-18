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
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] }} 
        transition={{ duration: 2, repeat: Infinity }}
        className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center"
      >
        <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
      </motion.div>
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
      description: currentTitle,
      className: "bg-white border-stone-100 rounded-2xl shadow-xl"
    });
  };

  return (
    <main className="min-h-screen bg-white selection:bg-amber-50">
      {/* Dynamic Nav */}
      <nav className="fixed top-0 w-full z-50 px-6 py-6 flex justify-between items-center bg-white/50 backdrop-blur-xl border-b border-stone-50">
        <button 
          onClick={() => navigate(-1)} 
          className="group flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-stone-500 hover:text-stone-900 transition-all"
        >
          <ArrowLeft className={`w-4 h-4 transition-transform group-hover:-translate-x-1 ${isArabic ? 'rotate-180 group-hover:translate-x-1' : ''}`} />
          {t("category.back")}
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-serif italic text-amber-800 tracking-tighter">Edition Limitée</span>
        </div>
      </nav>

      <div className="max-w-[1440px] mx-auto pt-32 pb-24 px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-28">

          {/* Media Section: The Cinematic Frame */}
          <div className="lg:col-span-7 space-y-10">
            <motion.div 
              layoutId={`image-${product.id}`}
              className="relative aspect-[4/5] rounded-[3rem] overflow-hidden bg-[#f3f3f2] group cursor-zoom-in"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  src={activeImage}
                  className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                  alt={currentTitle}
                />
              </AnimatePresence>
              
              <div className="absolute top-8 right-8">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 text-white">
                   <Sparkles size={18} />
                </div>
              </div>
            </motion.div>

            {/* Gallery: Thumbnail Scroller */}
            <div className="flex gap-5 overflow-visible">
              {[product.image_url, ...(product.images_gallery || [])].map((img: string, i: number) => (
                <motion.button
                  key={i}
                  whileHover={{ y: -5 }}
                  onClick={() => setActiveImage(img)}
                  className={`relative w-24 h-32 rounded-2xl overflow-hidden flex-shrink-0 transition-all duration-500 border-2
                    ${activeImage === img ? 'border-amber-600 scale-105' : 'border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="Gallery thumbnail" />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Content Section: Editorial Style */}
          <div className="lg:col-span-5 flex flex-col pt-4">
            <div className="flex-1 space-y-12">
              <header className="space-y-6">
                <div className={`flex items-center gap-4 text-stone-400 ${isArabic ? 'flex-row-reverse' : ''}`}>
                   <span className="text-[9px] font-black uppercase tracking-[0.5em]">Meknès, Maroc</span>
                   <div className="h-[1px] w-12 bg-stone-100" />
                </div>

                <h1 className="text-5xl md:text-6xl font-serif text-stone-900 tracking-tighter italic leading-tight">
                  {currentTitle}
                </h1>

                <div className={`flex items-baseline gap-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
                  <span className="text-4xl font-light text-stone-900 tracking-tighter">{product.price}</span>
                  <span className="text-xs font-black text-stone-300 uppercase tracking-widest">MAD</span>
                </div>
              </header>

              {/* Artisan Colors */}
              {product.colors?.length > 0 && (
                <div className="space-y-6">
                  <div className={`flex justify-between items-center ${isArabic ? 'flex-row-reverse' : ''}`}>
                    <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 italic">Nuance de l'Art</span>
                    <span className="text-[10px] font-serif text-amber-700 tracking-widest">{selectedColor?.name}</span>
                  </div>
                  <div className="flex gap-5">
                    {product.colors.map((color: any, i: number) => (
                      <button
                        key={i}
                        onClick={() => setSelectedColor(color)}
                        className="relative w-12 h-12 rounded-full border border-stone-100 flex items-center justify-center p-1 transition-all group"
                      >
                        <div 
                          className="w-full h-full rounded-full shadow-inner"
                          style={{ backgroundColor: color.hex }}
                        />
                        {selectedColor?.hex === color.hex && (
                          <motion.div 
                            layoutId="color-ring"
                            className="absolute -inset-1 border-2 border-amber-600 rounded-full"
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Story/Description */}
              <div className="space-y-6 py-10 border-y border-stone-50">
                <p className={`text-stone-500 font-light leading-loose text-lg ${isArabic ? 'text-right' : 'text-left'}`}>
                  {currentDesc}
                </p>
              </div>
            </div>

            {/* Buying Controls */}
            <div className="mt-12 space-y-8">
              <Button 
                onClick={handleAddToCart}
                className="w-full h-20 bg-stone-900 hover:bg-amber-900 text-white rounded-[2rem] text-[11px] font-black uppercase tracking-[0.4em] transition-all duration-700 relative overflow-hidden group"
              >
                <div className="relative z-10 flex items-center gap-4">
                  <ShoppingBag size={18} />
                  <span>{isArabic ? "اقتناء الآن" : "Commander la Pièce"}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-amber-700 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Button>

              {/* Trust & Craft Indicators */}
              <div className="grid grid-cols-2 gap-8 border-t border-stone-50 pt-10">
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 group-hover:bg-amber-50 group-hover:text-amber-700 transition-colors">
                    <Star size={14} />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-stone-400 leading-tight">Pièce Unique<br/>Signée</span>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 group-hover:bg-amber-50 group-hover:text-amber-700 transition-colors">
                    <ShieldCheck size={14} />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-stone-400 leading-tight">Emballage<br/>Sécurisé</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};