import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext"; // Importing the Brain
import { ArrowLeft, ShoppingBag, ShieldCheck, Truck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface ColorOption {
  name_en: string;
  name_ar: string;
  hex: string;
  image_index?: number;
}

interface Product {
  id: string;
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  price: number;
  image_url: string;
  images_gallery: string[];
  video_url?: string;
  category: string;
  colors?: ColorOption[]; 
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isArabic } = useLanguage();
  const { addToCart } = useCart(); // Cart logic
  const swiperRef = useRef<SwiperType | null>(null);
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);

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

  const handleColorSelect = (color: ColorOption) => {
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

    // Optional: Add a success notification or open the cart drawer here
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafaf9]">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full" />
    </div>
  );

  if (!product) return <div className="text-center py-20 font-sans italic text-stone-400">Product not found</div>;

  const allMedia = [
    { type: 'image', url: product.image_url },
    ...(product.images_gallery?.map((url: string) => ({ type: 'image', url })) || []),
    ...(product.video_url ? [{ type: 'video', url: product.video_url }] : [])
  ];

  const title = isArabic && product.title_ar ? product.title_ar : product.title;

  return (
    <main className={`min-h-screen bg-[#fafaf9] pb-20 font-sans ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24">
        
        <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-stone-400 hover:text-stone-900 mb-8 transition-all font-medium">
          <ArrowLeft className={`w-5 h-5 transition-transform ${isArabic ? 'rotate-180 group-hover:translate-x-1' : 'group-hover:-translate-x-1'}`} /> 
          {isArabic ? "رجوع" : "Back"}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          <div className="lg:col-span-7 space-y-6">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="relative aspect-square rounded-[2rem] overflow-hidden shadow-xl bg-white border border-stone-100">
              <Swiper 
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                modules={[Navigation, Pagination, Autoplay]} 
                navigation 
                pagination={{ clickable: true }} 
                className="h-full w-full group"
              >
                {allMedia.map((item, index) => (
                  <SwiperSlide key={index}>
                    {item.type === 'video' ? (
                      <video controls className="h-full w-full object-contain bg-black"><source src={item.url} type="video/mp4" /></video>
                    ) : (
                      <img src={item.url} alt={title} className="w-full h-full object-cover" />
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>

            <div className="grid grid-cols-3 gap-4">
               {[{ icon: <ShieldCheck className="w-5 h-5" />, text: isArabic ? "جودة مضمونة" : "Quality" },
                 { icon: <Truck className="w-5 h-5" />, text: isArabic ? "توصيل آمن" : "Delivery" },
                 { icon: <Sparkles className="w-5 h-5" />, text: isArabic ? "صنع يدوي" : "Handmade" }
               ].map((item, i) => (
                 <div key={i} className="flex flex-col items-center p-4 bg-white rounded-2xl border border-stone-50 text-[10px] text-stone-400 font-bold uppercase tracking-wider gap-2">
                   <div className="text-amber-600">{item.icon}</div>
                   {item.text}
                 </div>
               ))}
            </div>
          </div>

          <motion.div initial={{ opacity: 0, x: isArabic ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-5">
            <div className="sticky top-28 space-y-10">
              <div className="space-y-4">
                <span className="text-amber-700 text-[10px] font-bold tracking-[0.3em] uppercase opacity-70">
                  {product.category}
                </span>
                <h1 className="text-4xl font-bold text-stone-900 font-serif leading-tight">{title}</h1>
                <p className="text-3xl font-light text-stone-900">{product.price} DH</p>
              </div>

              {product.colors && product.colors.length > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-end border-b border-stone-100 pb-2">
                    <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">
                      {isArabic ? "اختر اللون" : "Select Color"}
                    </h3>
                    <span className="text-xs font-medium text-stone-800 uppercase">
                      {selectedColor ? (isArabic ? selectedColor.name_ar : selectedColor.name_en) : ""}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color, index) => (
                      <button
                        key={index}
                        onClick={() => handleColorSelect(color)}
                        className={`w-7 h-7 rounded-full transition-all duration-300 ${
                          selectedColor?.hex === color.hex 
                          ? 'ring-2 ring-stone-900 ring-offset-2 scale-110' 
                          : 'hover:scale-110 border border-stone-200'
                        }`}
                        style={{ backgroundColor: color.hex }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 space-y-4">
                <Button 
                  onClick={handleAddToCart}
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white h-16 rounded-2xl gap-3 text-lg font-bold shadow-lg transition-all active:scale-[0.98]"
                >
                  <ShoppingBag className="w-6 h-6" /> 
                  {isArabic ? "إضافة إلى السلة" : "Add to Cart"}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
