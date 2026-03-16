import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { ArrowLeft, ShoppingBag, ShieldCheck, Truck, Sparkles, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, EffectFade } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { toast } from "@/hooks/use-toast";

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

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
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setProduct(data);
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0]);
        }
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
      title_ar: product.title_ar || product.title,
      price: product.price,
      image: product.image_url,
      selectedColor: selectedColor,
      quantity: 1
    });
    toast({ 
      title: isArabic ? "تمت الإضافة" : "Ajouté",
      description: isArabic ? "المنتج الآن في حقيبتك" : "L'article est dans votre panier"
    });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} 
        className="w-8 h-8 border-t-2 border-amber-600 rounded-full" />
    </div>
  );

  if (!product) return <div className="text-center py-40 font-serif italic text-stone-400">Article introuvable</div>;

  const allMedia = [
    { type: 'image', url: product.image_url },
    ...(Array.isArray(product.images_gallery) ? product.images_gallery.map((url: string) => ({ type: 'image', url })) : []),
    ...(product.video_url ? [{ type: 'video', url: product.video_url }] : [])
  ];

  const title = isArabic ? (product.title_ar || product.title) : (product.title || product.title_ar);
  const description = isArabic ? (product.description_ar || product.description) : (product.description || product.description_ar);

  return (
    <main className={`min-h-screen bg-white pb-20 ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Top Navigation Bar - Sticky & Minimal */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-stone-50">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-stone-50 rounded-full transition-colors">
          <ArrowLeft className={`w-5 h-5 text-stone-900 ${isArabic ? 'rotate-180' : ''}`} />
        </button>
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">Atelier Rabab</span>
        <div className="w-9" /> {/* Spacer */}
      </nav>

      <div className="max-w-6xl mx-auto px-6 pt-24 md:pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Visual Section */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-stone-50 shadow-sm border border-stone-100"
            >
              <Swiper 
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                modules={[Navigation, Pagination, EffectFade]} 
                effect="fade"
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

            {/* Badges - Smaller & More Elegant */}
            <div className="grid grid-cols-3 gap-3">
               {[
                 { icon: <ShieldCheck className="w-3.5 h-3.5" />, text: isArabic ? "أصلي" : "Authentique" },
                 { icon: <Truck className="w-3.5 h-3.5" />, text: isArabic ? "توصيل" : "Livraison" },
                 { icon: <Sparkles className="w-3.5 h-3.5" />, text: isArabic ? "صنع يدوي" : "Artisanal" }
               ].map((item, i) => (
                 <div key={i} className="flex flex-col items-center gap-2 py-4 bg-stone-50/50 rounded-2xl border border-stone-100/30">
                   <div className="text-amber-700/70">{item.icon}</div>
                   <span className="text-[7px] font-black uppercase tracking-widest text-stone-400">{item.text}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* Product Details Section */}
          <div className="space-y-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-black text-amber-700 uppercase tracking-[0.3em] bg-amber-50 px-3 py-1 rounded-full">
                  {product.category}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-serif text-stone-900 tracking-tighter leading-tight italic">
                {title}
              </h1>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-light text-stone-900">{product.price}</span>
                <span className="text-[10px] font-bold text-stone-400">MAD</span>
              </div>
            </div>

            {/* Color Selection - Minimalist */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Couleurs</span>
                  <span className="text-[10px] font-bold text-stone-900 italic">
                    {selectedColor ? (isArabic ? selectedColor.name_ar : selectedColor.name_en) : ""}
                  </span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleColorSelect(color)}
                      className={`w-10 h-10 rounded-full transition-all duration-300 relative flex items-center justify-center ${
                        selectedColor?.hex === color.hex 
                        ? 'ring-2 ring-stone-900 ring-offset-2' 
                        : 'border border-stone-100 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="space-y-3 pt-4 border-t border-stone-50">
               <h4 className="text-[9px] font-black text-stone-300 uppercase tracking-widest italic">Description</h4>
               <p className="text-base text-stone-600 leading-relaxed font-serif font-light">
                 {description}
               </p>
            </div>

            {/* Action Button - Floating Feel */}
            <div className="pt-6">
              <Button 
                onClick={handleAddToCart}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white h-16 rounded-2xl gap-3 text-[10px] font-bold uppercase tracking-[0.3em] shadow-xl shadow-stone-100 transition-all active:scale-[0.98]"
              >
                <ShoppingBag className="w-4 h-4" /> 
                {isArabic ? "إضافة إلى الحقيبة" : "Ajouter au Panier"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
