import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion"; // تأكد من الـ import
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Plus, LayoutGrid } from "lucide-react";

// ... (Product Interface تبقى كما هي)

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { isArabic } = useLanguage();

  const formatSlug = (s: string) => {
    if (!s) return "";
    return s.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const categoryName = slug ? formatSlug(slug) : "";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true); // مهمة باش فاش تبدل الـ category يطلع الـ loading
      if (!categoryName) { setLoading(false); return; }
      const { data } = await supabase
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
    <main className={`min-h-screen bg-white pb-20 ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto px-6 pt-24">
        
        {/* Navigation Header */}
        <div className="flex justify-between items-center mb-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-[10px] font-bold text-stone-400 hover:text-stone-900 transition-all uppercase tracking-[0.2em]"
          >
            <ArrowLeft className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} />
            {isArabic ? "الرئيسية" : "Home"}
          </Link>
          <div className="text-[10px] font-bold text-stone-300 uppercase tracking-[0.2em] flex items-center gap-2">
            <LayoutGrid className="w-3 h-3" />
            {products.length} {isArabic ? "منتجات" : "Items"}
          </div>
        </div>

        {/* Category Header */}
        <header className="mb-16 text-center">
          <motion.div
            key={categoryName} // باش يعاود الـ animation فاش يتبدل القسم
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3"
          >
            <h1 className="text-3xl md:text-5xl font-bold font-serif text-stone-900 tracking-tight">
              {categoryName}
            </h1>
            <div className="h-0.5 w-8 bg-amber-600 mx-auto rounded-full" />
          </motion.div>
        </header>

        {loading ? (
          /* Skeleton Loader - كيعطي إحساس بالسرعة */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="space-y-4 animate-pulse">
                <div className="aspect-[4/5] bg-stone-100 rounded-[2.2rem]" />
                <div className="h-3 bg-stone-100 rounded w-2/3 mx-auto" />
                <div className="h-3 bg-stone-50 rounded w-1/3 mx-auto" />
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {products.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="py-20 text-center"
              >
                <p className="text-stone-400 font-light italic">
                  {isArabic ? "لا توجد منتجات حالياً" : "Coming soon..."}
                </p>
              </motion.div>
            ) : (
              <motion.div 
                layout
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8"
              >
                {products.map((item) => {
                  const title = getTitle(item);
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Link to={`/product/${item.id}`} className="group block">
                        <div className="bg-white rounded-[2.2rem] p-2 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-stone-50 transition-all duration-500 hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)]">
                          
                          <div className="aspect-[4/5] rounded-[1.8rem] overflow-hidden bg-stone-50 relative">
                            {/* Image Placeholder Background */}
                            <div className="absolute inset-0 bg-stone-100/50 animate-pulse" />
                            <img
                              src={item.image_url || "/placeholder.svg"}
                              alt={title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 relative z-10"
                              onLoad={(e) => (e.currentTarget.style.opacity = "1")}
                              loading="lazy"
                            />
                            
                            <div className="absolute bottom-3 right-3 z-20 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                               <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg text-stone-900 border border-white">
                                  <Plus className="w-4 h-4" />
                               </div>
                            </div>
                          </div>

                          <div className="p-4 space-y-1.5 text-center">
                            <h3 className="text-[12px] md:text-[13px] font-medium text-stone-900 tracking-tight line-clamp-1">
                              {title}
                            </h3>
                            <p className="text-[10px] md:text-[11px] font-bold text-amber-900/80 tracking-widest">
                              {item.price ? `${item.price} DH` : (isArabic ? "عند الطلب" : "Price on Request")}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </main>
  );
};

export default CategoryPage;
