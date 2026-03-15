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

// Swiper Styles
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
        // اختيار أول لون أوتوماتيكياً من المصفوفة الجديدة
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
    // إذا كان اللون مرتبط بصورة معينة في السلايدر
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
    // تنبيه بسيط عند الإضافة
    toast({ title: isArabic ? "تمت الإضافة" : "Ajouté au panier" });
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <motion.div 
        animate={{ rotate: 360 }} 
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }} 
        className="w-10 h-10 border-2 border-stone-100 border-t-amber-600 rounded-full" 
      />
    </div>
  );

  if (!product) return <div className="text-center py-40 font-serif italic text-stone-400">Article introuvable</div>;

  // تجميع كل الميديا (الصورة الأساسية + الغاليري + الفيديو)
  const allMedia = [
    { type: 'image', url: product.image_url },
    ...(Array.isArray(product.images_gallery) ? product.images_gallery.map((url: string) => ({ type: 'image', url })) : []),
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
          <div className="p-2 rounded-full border border-stone-100 group-hover:bg-stone-50 group-hover:border-stone-900 transition-all">
            <ArrowLeft className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{isArabic ? "العودة" : "Retour"}</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">

          {/* Visuals - Premium Slider */}
          <div className="space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="relative aspect-[4/5] rounded-[2.5rem] md:rounded-[4rem] overflow-hidden bg-stone-50 shadow-2xl border border-stone-100"
            >
              <Swiper 
                onSwiper={(swiper) => (swiperRef.current = swiper)}
                modules={[Navigation, Pagination, EffectFade]} 
                effect="fade"
                pagination={{ clickable: true, dynamicBullets: true }}
                className="h-full w-full"
              >
                {allMedia.map((item, index) => (
                  <SwiperSlide key={index}>
                    {item.type === 'video' ? (
                      <div className="relative h-full w-full">
                        <video className="h-full w-full object-cover" autoPlay muted loop playsInline>
                          <source src={item.url} type="video/mp4" />
                        </video>
                        <div className="absolute top-6 right-6 p-3 bg-white/20 backdrop-blur-md rounded-full">
                           <PlayCircle className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    ) : (
                      <img src={item.url} alt={title} className="w-full h-full object-cover" />
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>

            {/* Quality Badges */}
            <div className="grid grid-cols-3 gap-4">
               {[{ icon: <ShieldCheck className="w-4 h-4" />, text: isArabic ? "أصلي" : "Authentique" },
                 { icon: <Truck className="w-4 h-4" />, text: isArabic ? "توصيل" : "Livraison" },
                 { icon: <Sparkles className="w-4 h-4" />, text: isArabic ? "صنع يدوي" : "Fait Main" }
               ].map((item, i) => (
                 <div key={i} className="flex flex-col items-center justify-center gap-3 py-6 bg-stone-50/30 rounded-[2rem] border border-stone-100/50">
                   <div className="text-amber-700">{item.icon}</div>
                   <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-stone-400">{item.text}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* Product Content */}
          <div className="lg:sticky lg:top-32 space-y-12">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-[1px] w-8 bg-amber-600" />
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-[0.4em]">
                  {product.category}
                </span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-serif text-stone-900 tracking-tighter leading-tight italic">
                {title}
              </h1>
              
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-light text-stone-900">{product.price}</span>
                <span className="text-sm font-bold uppercase tracking-widest text-stone-400 underline decoration-amber-500/30">MAD</span>
              </div>
            </div>

            {/* Color Selection - Unified with Admin */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-6 bg-stone-50/50 p-8 rounded-[2.5rem] border border-stone-100">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-stone-400 uppercase tracking-widest">
                    {isArabic ? "اختر اللون" : "Choisir Couleur"}
                  </span>
                  <AnimatePresence mode="wait">
                    <motion.span 
                      key={selectedColor?.hex}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      className="text-[11px] font-bold text-amber-800 uppercase tracking-tighter"
                    >
                      {selectedColor ? (isArabic ? selectedColor.name_ar : selectedColor.name_en) : ""}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <div className="flex flex-wrap gap-4">
                  {product.colors.map((color: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => handleColorSelect(color)}
                      className={`w-12 h-12 rounded-full transition-all duration-500 relative flex items-center justify-center p-1 ${
                        selectedColor?.hex === color.hex 
                        ? 'ring-1 ring-stone-900 ring-offset-4 scale-110 shadow-lg' 
                        : 'hover:scale-110 border border-white shadow-sm'
                      }`}
                      style={{ backgroundColor: color.hex }}
                    >
                      {selectedColor?.hex === color.hex && (
                        <motion.div layoutId="colorInner" className="w-full h-full rounded-full border-2 border-white/20" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Description Section */}
            <div className="space-y-4">
               <h4 className="text-[10px] font-black text-stone-900 uppercase tracking-[0.3em]">Details</h4>
               <p className="text-lg text-stone-600 leading-relaxed font-serif font-light">
                 {isArabic ? product.description_ar : product.description}
               </p>
            </div>

            {/* CTA */}
            <div className="pt-8">
              <Button 
                onClick={handleAddToCart}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white h-20 rounded-[2rem] gap-4 text-xs font-bold uppercase tracking-[0.3em] shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all active:scale-[0.98]"
              >
                <ShoppingBag className="w-5 h-5" /> 
                {isArabic ? "إضافة إلى الحقيبة" : "Ajouter au Panier"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
