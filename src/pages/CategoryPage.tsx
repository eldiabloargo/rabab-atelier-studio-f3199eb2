import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Plus } from "lucide-react";

interface Product {
  id: string;
  title: string;
  title_ar: string | null;
  price: number | null;
  image_url: string | null;
  category: string | null;
}

export const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, isArabic } = useLanguage();

  // تحويل الـ slug لـ اسم مطابق للي فـ الـ Admin (Supabase)
  const formatSlug = (s: string) => {
    if (!s) return "";
    return s.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const categoryName = slug ? formatSlug(slug) : "";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      if (!categoryName) return;

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .ilike("category", categoryName)
        .order("created_at", { ascending: false });

      if (data) setProducts(data as any);
      setLoading(false);
    };
    fetchProducts();
  }, [categoryName]);

  const getTitle = (p: Product) => (isArabic && p.title_ar ? p.title_ar : p.title);

  return (
    <main className="min-h-screen bg-white" dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header القسم - بسيط وفخم */}
      <div className="relative h-[40vh] flex items-center justify-center bg-stone-50 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 opacity-20"
        >
          {/* خلفية خفيفة كتعطي ملمس (Texture) */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]" />
        </motion.div>

        <div className="relative z-10 text-center space-y-4 px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[10px] font-bold text-stone-400 hover:text-stone-900 transition-all uppercase tracking-[0.3em] mb-4"
          >
            <ArrowLeft className={`w-3 h-3 ${isArabic ? 'rotate-180' : ''}`} />
            {t("category.back")}
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-serif text-stone-900 tracking-tighter"
          >
            {categoryName}
          </motion.h1>
          <div className="h-[1px] w-12 bg-amber-600 mx-auto mt-6" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-20">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="aspect-[4/5] bg-stone-50 rounded-[2rem] animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 space-y-4">
             <p className="text-stone-400 font-serif italic">{t("category.empty")}</p>
             <Link to="/" className="text-[10px] font-bold text-amber-700 underline tracking-widest uppercase">
               {isArabic ? "العودة للرئيسية" : "Return Home"}
             </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((item, index) => {
              const title = getTitle(item);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={`/product/${item.id}`} className="group block">
                    {/* Card Container - Apple Style */}
                    <div className="relative bg-white rounded-[2.5rem] p-3 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-stone-50 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(0,0,0,0.05)] hover:-translate-y-1">
                      
                      <div className="aspect-[4/5] overflow-hidden rounded-[2rem] bg-stone-50 relative">
                        <img
                          src={item.image_url || "/placeholder.svg"}
                          alt={title}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                          loading={index < 4 ? "eager" : "lazy"}
                        />
                        
                        {/* Interactive Plus Icon */}
                        <div className="absolute bottom-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                           <div className="bg-white/90 backdrop-blur-md p-3 rounded-full shadow-lg">
                              <Plus className="w-4 h-4 text-stone-900" />
                           </div>
                        </div>
                      </div>

                      <div className="pt-6 pb-2 px-2 text-center">
                        <h3 className="text-[13px] font-medium text-stone-800 tracking-tight line-clamp-1 mb-1">
                          {title}
                        </h3>
                        <p className="text-[11px] font-bold text-amber-900/60 tracking-widest uppercase">
                          {item.price ? `${item.price} DH` : (isArabic ? "عند الطلب" : "On Request")}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default CategoryPage; 
