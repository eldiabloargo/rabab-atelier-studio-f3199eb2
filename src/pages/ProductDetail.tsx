import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { ArrowLeft, ShoppingBag, ShieldCheck, Truck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

// Swiper Styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isArabic } = useLanguage();
  const { addToCart } = useCart();
  const swiperRef = useRef<SwiperType | null>(null);

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<any>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabase.from("products").select("*").eq("id", id).single();
      if (data) {
        setProduct(data);
        if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0]);
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  const handleColorSelect = (color: any) => {
    setSelectedColor(color);
    if (color.image_index !== undefined && swiperRef.current) {
      swiperRef.current.slideTo(color.image_index);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      id: product.id,
      title: product.title,
      title_ar: product.title_ar,
      price: product.price,
      image: product.image_url,
      selectedColor: selectedColor,
      quantity: 1
    });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }} 
        className="w-8 h-8 border-2 border-stone-200 border-t-amber-600 rounded-full" 
      />
    </div>
  );

  if (!product) return <div className="text-center py-40 font-serif italic text-stone-400">Product not found</div>;

  const allMedia = [
    { type: 'image', url: product.image_url },
    ...(product.images_gallery?.map((url: string) => ({ type: 'image', url })) || []),
    ...(product.video_url ? [{ type: 'video', url: product.video_url }] : [])
  ];

  const title = isArabic && product.title_ar ? product.title_ar : product.title;

  return (
    <main className={`min-h-screen bg-white pb-32 ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto px-6 pt-32">
        
        {/* Navigation */}
        <button 
          onClick={() => navigate(-1)} 
          className="group inline-flex items-center gap-3 text-stone-400 hover:text-stone-900 mb-12 transition-all"
        >
          <div className="p-2 rounded-full border border-stone-100 group-hover:bg-stone-50">
            <ArrowLeft className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{isArabic ? "العودة" : "Back"}</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          
          {/* Visuals - The Big Arch/Circle Feel */}
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="relative aspect-[4/5] rounded-[3.5rem] overflow-hidden bg-stone-50 shadow-[0_30px_60px_rgba(0,0,0,0.04)] border border-stone-100"
            >
              <Swiper 
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                modules={[Navigation, Pagination]} 
                pagination={{ clickable: true }}
                className="h-full w-full"
              >
                {allMedia.map((item, index) => (
                  <SwiperSlide key={index}>
                    {item.type === 'video' ? (
                      <video className="h-full w-full object-cover" autoPlay muted loop playsInline>
                        <source src={item.url} type="video/mp4" />
                      </video>
                    ) : (
                      <img src={item.url} alt={title} className="w-full h-full object-cover" />
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>

            {/* Micro-Features */}
            <div className="grid grid-cols-3 gap-4">
               {[{ icon: <ShieldCheck className="w-4 h-4" />, text: isArabic ? "أصلي" : "Original" },
                 { icon: <Truck className="w-4 h-4" />, text: isArabic ? "توصيل" : "Livraison" },
                 { icon: <Sparkles className="w-4 h-4" />, text: isArabic ? "يدوي" : "Handmade" }
               ].map((item, i) => (
                 <div key={i} className="flex flex-col items-center gap-3 py-6 bg-stone-50/50 rounded-[2rem] text-[9px] text-stone-500 font-bold uppercase tracking-widest border border-stone-100/50">
                   <div className="text-amber-700">{item.icon}</div>
                   {item.text}
                 </div>
               ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="lg:sticky lg:top-32 space-y-12">
            <div className="space-y-4">
              <motion.span 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="inline-block px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 text-[9px] font-bold uppercase tracking-widest"
              >
                {product.category}
              </motion.span>
              <h1 className="text-4xl md:text-5xl font-serif text-stone-900 tracking-tighter leading-[1.1]">
                {title}
              </h1>
              <p className="text-2xl font-light text-stone-800">
                {product.price} <span className="text-xs font-bold uppercase ml-1">DH</span>
              </p>
            </div>

            {/* Colors */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-stone-100 pb-4">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                    {isArabic ? "الألوان" : "Couleurs"}
                  </span>
                  <span className="text-[11px] font-bold text-stone-900 uppercase">
                    {selectedColor ? (isArabic ? selectedColor.name_ar : selectedColor.name_en) : ""}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4">
                  {product.colors.map((color: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleColorSelect(color)}
                      className={`w-10 h-10 rounded-full transition-all duration-500 relative flex items-center justify-center ${
                        selectedColor?.hex === color.hex 
                        ? 'ring-2 ring-stone-900 ring-offset-4 scale-110' 
                        : 'hover:scale-105 border border-stone-100'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {selectedColor?.hex === color.hex && (
                        <motion.div layoutId="colorDot" className="w-1.5 h-1.5 bg-white rounded-full shadow-sm" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Info Tabs / Description */}
            <div className="space-y-6">
               <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.3em]">{isArabic ? "الوصف" : "Description"}</h4>
               <p className="text-base text-stone-600 leading-relaxed font-light font-serif italic">
                 {isArabic ? product.description_ar : product.description}
               </p>
            </div>

            {/* Fixed-Action on Mobile, Standard on Desktop */}
            <div className="pt-8">
              <Button 
                onClick={handleAddToCart}
                className="w-full bg-stone-900 hover:bg-amber-900 text-white h-16 rounded-full gap-4 text-xs font-bold uppercase tracking-widest shadow-2xl shadow-stone-200 transition-all active:scale-[0.98]"
              >
                <ShoppingBag className="w-5 h-5" /> 
                {isArabic ? "إضافة للسلة" : "Ajouter au panier"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
