import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { ArrowLeft, ShoppingBag, ShieldCheck, Truck, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// ... (Interfaces تبقى كما هي)

const ProductDetail = () => {
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
    if (!product || !selectedColor) return;
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
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-6 h-6 border-2 border-stone-900 border-t-transparent rounded-full" />
    </div>
  );

  if (!product) return <div className="text-center py-20 italic text-stone-400">Product not found</div>;

  const allMedia = [
    { type: 'image', url: product.image_url },
    ...(product.images_gallery?.map((url: string) => ({ type: 'image', url })) || []),
    ...(product.video_url ? [{ type: 'video', url: product.video_url }] : [])
  ];

  const title = isArabic && product.title_ar ? product.title_ar : product.title;

  return (
    <main className={`min-h-screen bg-white pb-20 ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-5xl mx-auto px-6 pt-24">
        
        {/* Back Button - Minimalist */}
        <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-stone-400 hover:text-stone-900 mb-6 transition-all text-xs font-bold uppercase tracking-widest">
          <ArrowLeft className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} /> 
          {isArabic ? "العودة" : "Back"}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Media Section - Rounded like an App */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-stone-50 border border-stone-100 shadow-sm">
              <Swiper 
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                modules={[Navigation, Pagination]} 
                pagination={{ clickable: true }}
                className="h-full w-full"
              >
                {allMedia.map((item, index) => (
                  <SwiperSlide key={index}>
                    {item.type === 'video' ? (
                      <video className="h-full w-full object-cover" autoPlay muted loop playsInline><source src={item.url} type="video/mp4" /></video>
                    ) : (
                      <img src={item.url} alt={title} className="w-full h-full object-cover" />
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>

            {/* Features Row - Cleaner & Smaller */}
            <div className="grid grid-cols-3 gap-3">
               {[{ icon: <ShieldCheck className="w-4 h-4" />, text: isArabic ? "أصلي" : "Genuine" },
                 { icon: <Truck className="w-4 h-4" />, text: isArabic ? "توصيل" : "Shipping" },
                 { icon: <Sparkles className="w-4 h-4" />, text: isArabic ? "يدوي" : "Handmade" }
               ].map((item, i) => (
                 <div key={i} className="flex items-center justify-center gap-2 py-3 bg-stone-50 rounded-2xl text-[9px] text-stone-500 font-bold uppercase tracking-tighter">
                   <div className="text-stone-900">{item.icon}</div>
                   {item.text}
                 </div>
               ))}
            </div>
          </div>

          {/* Info Section - App Typography */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-[0.2em]">
                {product.category}
              </p>
              <h1 className="text-2xl md:text-3xl font-bold text-stone-900 font-serif tracking-tight leading-tight">
                {title}
              </h1>
              <p className="text-xl font-medium text-stone-800 tracking-tight">
                {product.price} <span className="text-sm">DH</span>
              </p>
            </div>

            {/* Color Selection - App style circles */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-stone-100">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                    {isArabic ? "اللون المختــار" : "Selected Color"}
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
                      className={`w-8 h-8 rounded-full transition-all duration-300 relative ${
                        selectedColor?.hex === color.hex 
                        ? 'scale-110 shadow-md ring-2 ring-stone-900 ring-offset-2' 
                        : 'hover:scale-105 border border-stone-100 shadow-sm'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {selectedColor?.hex === color.hex && (
                        <motion.div layoutId="activeColor" className="absolute inset-0 rounded-full border border-white/30" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description - Clean Reading */}
            <div className="space-y-3">
               <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{isArabic ? "التفاصيل" : "Details"}</h4>
               <p className="text-sm text-stone-600 leading-relaxed font-light max-w-md">
                 {isArabic ? product.description_ar : product.description}
               </p>
            </div>

            {/* Call to Action - Fixed Bottom Style for Mobile */}
            <div className="pt-6">
              <Button 
                onClick={handleAddToCart}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white h-14 rounded-full gap-3 text-sm font-bold shadow-xl transition-all active:scale-[0.98]"
              >
                <ShoppingBag className="w-5 h-5" /> 
                {isArabic ? "إضافة إلى الحقيبة" : "Add to Bag"}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
