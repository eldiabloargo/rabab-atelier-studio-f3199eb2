import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, MessageCircle, Share2, ShieldCheck, Truck, Sparkles, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// تعريف الـ Type باش الكود يكون نقي
interface Product {
  id: string;
  title: string;
  title_ar: string;
  description: string;
  description_ar: string;
  full_description: string;
  full_description_ar: string;
  price: number;
  image_url: string;
  images_gallery: string[];
  video_url?: string;
  category: string;
  colors?: string[]; // مصفوفة الألوان مثلاً ["#FF0000", "#000000"]
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, isArabic } = useLanguage();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string>("");

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabase.from("products").select("*").eq("id", id).single();
      if (data) {
        setProduct(data);
        // اختيار أول لون تلقائياً إذا وجد
        if (data.colors && data.colors.length > 0) setSelectedColor(data.colors[0]);
      }
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

  const allMedia = [
    { type: 'image', url: product.image_url },
    ...(product.images_gallery?.map((url: string) => ({ type: 'image', url })) || []),
    ...(product.video_url ? [{ type: 'video', url: product.video_url }] : [])
  ];

  const title = isArabic && product.title_ar ? product.title_ar : product.title;
  const shortDesc = isArabic && product.description_ar ? product.description_ar : product.description;
  const fullDesc = isArabic && product.full_description_ar ? product.full_description_ar : product.full_description;

  // إرسال الطلب مع اللون المختار
  const handleWhatsAppOrder = () => {
    const message = isArabic 
      ? `السلام عليكم، مهتم بطلب: ${title} ${selectedColor ? `بألوان: ${selectedColor}` : ''}`
      : `Bonjour, je suis intéressé par: ${title} ${selectedColor ? `(Couleur: ${selectedColor})` : ''}`;
    window.open(`https://wa.me/212679697964?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <main className={`min-h-screen bg-[#fafaf9] pb-20 font-sans ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 pt-24">
        
        <button onClick={() => navigate(-1)} className="group flex items-center gap-2 text-stone-500 hover:text-stone-900 mb-8 transition-all font-medium">
          <ArrowLeft className={`w-5 h-5 transition-transform group-hover:-translate-x-1 ${isArabic ? 'rotate-180 group-hover:translate-x-1' : ''}`} /> 
          {isArabic ? "رجوع للمجموعة" : "Retour à la collection"}
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* الجانب الأيسر: Swiper */}
          <div className="lg:col-span-7 space-y-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative aspect-square rounded-[2.5rem] overflow-hidden shadow-2xl bg-white border border-stone-100">
              <Swiper modules={[Navigation, Pagination, Autoplay]} navigation pagination={{ clickable: true }} className="h-full w-full group">
                {allMedia.map((item, index) => (
                  <SwiperSlide key={index}>
                    {item.type === 'video' ? (
                      <video controls className="h-full w-full object-contain bg-black"><source src={item.url} type="video/mp4" /></video>
                    ) : (
                      <img src={item.url} alt={title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                    )}
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>

            {/* Badges الثقة */}
            <div className="grid grid-cols-3 gap-2 py-4">
               {[{ icon: <ShieldCheck className="w-4 h-4" />, text: isArabic ? "جودة ممتازة" : "Qualité Premium" },
                 { icon: <Truck className="w-4 h-4" />, text: isArabic ? "شحن سريع" : "Livraison" },
                 { icon: <Sparkles className="w-4 h-4" />, text: isArabic ? "صنع يدوي" : "Fait main" }
               ].map((item, i) => (
                 <div key={i} className="flex flex-col items-center p-3 bg-white rounded-2xl border border-stone-100 text-[10px] text-stone-500 font-bold uppercase gap-2">
                   <div className="text-amber-600">{item.icon}</div>
                   {item.text}
                 </div>
               ))}
            </div>
          </div>

          {/* الجانب الأيمن: المعلومات */}
          <motion.div initial={{ opacity: 0, x: isArabic ? -30 : 30 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-5">
            <div className="sticky top-28 space-y-8">
              <div className="space-y-4">
                <span className="inline-block px-4 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold tracking-widest lowercase">
                  {product.category}
                </span>
                <h1 className="text-4xl font-bold text-stone-900 font-serif leading-tight">{title}</h1>
                <p className="text-3xl font-medium text-amber-900">{product.price} DH</p>
              </div>

              {/* اختيار الألوان - هادي هي الـ Feature اللي كانت ناقصاك */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider">
                    {isArabic ? "اختر اللون:" : "Choisir la couleur:"}
                  </h3>
                  <div className="flex gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === color ? 'border-amber-600 scale-110 shadow-lg' : 'border-transparent'}`}
                        style={{ backgroundColor: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="p-6 bg-stone-50 rounded-3xl border border-stone-100 italic text-stone-600">
                "{shortDesc}"
              </div>

              <div className="pt-6 space-y-4">
                <Button 
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white h-16 rounded-2xl gap-3 text-lg font-bold transition-all active:scale-95 shadow-xl shadow-stone-200"
                >
                  <MessageCircle className="w-6 h-6" /> 
                  {isArabic ? "طلب المنتج الآن" : "Commander maintenant"}
                </Button>
                
                <p className="text-center text-xs text-stone-400">
                  {isArabic ? "سيتم توجيهك مباشرة للواتساب لتأكيد طلبك" : "Vous serez redirigé vers WhatsApp"}
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
