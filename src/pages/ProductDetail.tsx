import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, MessageCircle, Share2, ShieldCheck, Truck, Sparkles, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

// استيراد Swiper لعرض الصور المتعددة
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, isArabic } = useLanguage();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabase.from("products").select("*").eq("id", id).single();
      if (data) setProduct(data);
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafaf9]">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full" />
    </div>
  );
  
  if (!product) return <div className="text-center py-20 font-sans">Produit introuvable</div>;

  // دمج الصورة الرئيسية مع المعرض في قائمة واحدة
  const allMedia = [
    { type: 'image', url: product.image_url },
    ...(product.images_gallery?.map((url: string) => ({ type: 'image', url })) || []),
    ...(product.video_url ? [{ type: 'video', url: product.video_url }] : [])
  ];

  const title = isArabic && product.title_ar ? product.title_ar : product.title;
  const shortDesc = isArabic && product.description_ar ? product.description_ar : product.description;
  const fullDesc = isArabic && product.full_description_ar ? product.full_description_ar : product.full_description;

  return (
    <main className={`min-h-screen bg-[#fafaf9] pb-20 font-sans ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24">
        
        {/* زر الرجوع */}
        <button 
          onClick={() => navigate(-1)} 
          className="group flex items-center gap-2 text-stone-500 hover:text-stone-900 mb-8 transition-all font-medium"
        >
          <ArrowLeft className={`w-5 h-5 transition-transform group-hover:-translate-x-1 ${isArabic ? 'rotate-180 group-hover:translate-x-1' : ''}`} /> 
          {isArabic ? "رجوع للمجموعة" : "Retour à la collection"}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* الجانب الأيسر: عرض الميديا (Swiper) */}
          <div className="lg:col-span-7 space-y-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              className="relative aspect-[4/5] md:aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl shadow-stone-200 bg-white border border-stone-100"
            >
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                navigation
                pagination={{ clickable: true }}
                className="h-full w-full group"
              >
                {allMedia.map((item, index) => (
                  <SwiperSlide key={index}>
                    {item.type === 'video' ? (
                      <div className="relative h-full w-full bg-black">
                        <video controls className="h-full w-full object-contain">
                          <source src={item.url} type="video/mp4" />
                        </video>
                      </div>
                    ) : (
                      <img 
                        src={item.url} 
                        alt={title} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                      />
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>

            {/* ثقة الزبون (Badges) */}
            <div className="grid grid-cols-3 gap-2 py-4">
               {[
                 { icon: <ShieldCheck className="w-4 h-4" />, text: isArabic ? "جودة ممتازة" : "Qualité Premium" },
                 { icon: <Truck className="w-4 h-4" />, text: isArabic ? "شحن سريع" : "Livraison Rapide" },
                 { icon: <Sparkles className="w-4 h-4" />, text: isArabic ? "صنع يدوي" : "Fait main" }
               ].map((item, i) => (
                 <div key={i} className="flex flex-col items-center justify-center p-3 bg-white rounded-2xl border border-stone-100 text-[10px] md:text-xs text-stone-500 font-bold uppercase tracking-wider gap-2">
                   <div className="text-amber-600">{item.icon}</div>
                   {item.text}
                 </div>
               ))}
            </div>
          </div>

          {/* الجانب الأيمن: المعلومات */}
          <motion.div 
            initial={{ opacity: 0, x: isArabic ? -30 : 30 }} 
            animate={{ opacity: 1, x: 0 }} 
            className="lg:col-span-5 flex flex-col justify-start"
          >
            <div className="sticky top-28 space-y-8">
              <div className="space-y-4">
                <span className="inline-block px-4 py-1.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-widest">
                  {product.category}
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-stone-900 leading-[1.1] font-serif">
                  {title}
                </h1>
                <p className="text-3xl font-medium text-stone-900">
                  {product.price ? `${product.price}` : t("collection.onDemand")}
                </p>
              </div>

              {/* الوصف المختصر */}
              <div className="p-6 bg-white rounded-3xl border border-stone-100 shadow-sm space-y-3">
                <h3 className="font-bold text-stone-800 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-600" />
                  {isArabic ? "لمحة عن المنتج" : "En bref"}
                </h3>
                <p className="text-stone-500 leading-relaxed text-lg italic">
                  "{shortDesc}"
                </p>
              </div>

              {/* التفاصيل الكاملة */}
              {fullDesc && (
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-stone-800 border-b border-stone-100 pb-2">
                    {isArabic ? "التفاصيل والمميزات" : "Détails & Caractéristiques"}
                  </h3>
                  <p className="text-stone-600 leading-relaxed whitespace-pre-line text-base font-light">
                    {fullDesc}
                  </p>
                </div>
              )}

              {/* أزرار التواصل */}
              <div className="pt-6 space-y-4">
                <Button 
                  onClick={() => window.open(`https://wa.me/212679697964?text=Je suis intéressé par: ${title}`, "_blank")}
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white h-16 rounded-2xl gap-3 text-lg font-bold shadow-2xl shadow-stone-200 transition-all active:scale-95"
                >
                  <MessageCircle className="w-6 h-6" /> 
                  {isArabic ? "اطلب عبر واتساب" : "Commander via WhatsApp"}
                </Button>
                
                <button className="w-full flex items-center justify-center gap-2 text-stone-400 hover:text-stone-600 text-sm font-medium transition-colors">
                  <Share2 className="w-4 h-4" /> {isArabic ? "مشاركة مع صديق" : "Partager ce produit"}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

import { FileText } from "lucide-react"; // تأكد من استيراد هاد الأيقونة

export default ProductDetail;
