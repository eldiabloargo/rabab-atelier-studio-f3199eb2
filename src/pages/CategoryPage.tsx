import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Plus, ShoppingBag, Sparkles } from "lucide-react";

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
  const [categoryData, setCategoryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { isArabic, t } = useLanguage();

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      setLoading(true);
      const isAll = slug === 'all';
      
      // تحويل الـ slug لعنوان مقروء (مثلا ramadan-collection تولي Ramadan Collection)
      const formattedSlug = slug?.split('-').join(' ');

      // 1. جلب بيانات الكاتيغوري
      if (!isAll && formattedSlug) {
        const { data: catData } = await supabase
          .from("categories")
          .select("*")
          .ilike("name", formattedSlug)
          .single();

        if (catData) {
          setCategoryData(catData);
        } else {
          setCategoryData({ name: formattedSlug, name_ar: formattedSlug });
        }
      } else {
        setCategoryData({
          name: "La Collection",
          name_ar: "المجموعة الكاملة",
          image_url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000"
        });
      }

      // 2. جلب المنتجات بديناميكية
      let query = supabase.from("products").select("*");
      if (!isAll && formattedSlug) {
        query = query.ilike("category", formattedSlug);
      }

      const { data, error } = await query.order("created_at", { ascending: false });
      if (data) setProducts(data as any);
      
      setLoading(false);
    };

    fetchCategoryAndProducts();
  }, [slug, isArabic]);

  const getProductTitle = (p: Product) => (isArabic && p.title_ar ? p.title_ar : p.title);
  const getCategoryName = () => {
    if (!categoryData) return "";
    return isArabic ? (categoryData.name_ar || categoryData.name) : categoryData.name;
  };

  return (
    <main className="min-h-screen bg-[#fafaf9] selection:bg-amber-50">
      
      {/* Header Section - Cinematic Height */}
      <div className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-stone-900">
        <motion.div 
          initial={{ scale: 1.2, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.5 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0"
        >
          {categoryData?.image_url && (
            <img 
              src={categoryData.image_url} 
              className="w-full h-full object-cover blur-[2px]"
              alt=""
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/40 via-transparent to-[#fafaf9]" />
        </motion.div>

        <div className="relative z-10 text-center space-y-8 px-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link
              to="/"
              className={`inline-flex items-center gap-3 text-[10px] font-black text-white/70 hover:text-white transition-all uppercase tracking-[0.5em] ${isArabic ? 'flex-row-reverse' : ''}`}
            >
              <ArrowLeft className={`w-3 h-3 ${isArabic ? 'rotate-180' : ''}`} />
              {t("category.back")}
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex justify-center mb-4">
               <Sparkles className="w-5 h-5 text-amber-400/50" />
            </div>
            <h1 className="text-5xl md:text-8xl font-serif text-white tracking-tighter italic">
              {getCategoryName()}
            </h1>
            <p className="text-amber-200/80 text-[11px] font-black uppercase tracking-[0.6em]">
              {products.length} {isArabic ? "تحفة فنية" : "Pièces d'exception"}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Grid Section */}
      <div className="max-w-[1600px] mx-auto px-6 py-32">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[1, 2, 3, 4, 8].map((n) => (
              <div key={n} className="space-y-4">
                <div className="aspect-[4/5] bg-stone-200/50 rounded-[3rem] animate-pulse" />
                <div className="h-4 w-2/3 bg-stone-200/50 mx-auto rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-40 space-y-8"
          >
             <ShoppingBag className="w-12 h-12 text-stone-200 mx-auto stroke-[1px]" />
             <p className="text-stone-400 font-serif italic text-xl">
               {t("category.empty")}
             </p>
             <Link to="/" className="inline-block px-8 py-4 border border-stone-200 text-[10px] font-black tracking-widest uppercase hover:bg-stone-900 hover:text-white transition-all rounded-full">
               {isArabic ? "استكشاف المجموعات" : "Explorer les collections"}
             </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-10 gap-y-24">
            {products.map((item, index) => {
              const title = getProductTitle(item);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: (index % 4) * 0.1 }}
                >
                  <Link to={`/product/${item.id}`} className="group block">
                    <div className="relative space-y-8">
                      {/* Image Container with Luxury Shadow */}
                      <div className="aspect-[4/5] overflow-hidden rounded-[3.5rem] bg-stone-100 relative shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] transition-all duration-700 group-hover:shadow-[0_40px_80px_-15px_rgba(0,0,0,0.12)] group-hover:-translate-y-3">
                        <img
                          src={item.image_url || "/placeholder.svg"}
                          alt={title}
                          className="w-full h-full object-cover transition-transform duration-[2s] cubic-bezier(0.16, 1, 0.3, 1) group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/10 transition-colors duration-700" />
                        
                        {/* Hover Overlay Button */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                           <div className="bg-white/90 backdrop-blur-md px-8 py-4 rounded-full shadow-2xl scale-90 group-hover:scale-100 transition-transform duration-500">
                              <span className="text-[10px] font-black tracking-[0.2em] text-stone-900 uppercase">
                                {isArabic ? "تفاصيل" : "Découvrir"}
                              </span>
                           </div>
                        </div>
                      </div>

                      {/* Info Section */}
                      <div className="text-center space-y-3">
                        <h3 className="text-lg md:text-xl font-serif text-stone-800 tracking-tight italic group-hover:text-amber-900 transition-colors">
                          {title}
                        </h3>
                        <div className="flex items-center justify-center gap-4">
                          <div className="h-[1px] w-6 bg-stone-100" />
                          <p className="text-[12px] font-black text-amber-800 tracking-[0.15em]">
                            {item.price ? `${item.price} MAD` : t("collection.onDemand")}
                          </p>
                          <div className="h-[1px] w-6 bg-stone-100" />
                        </div>
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
