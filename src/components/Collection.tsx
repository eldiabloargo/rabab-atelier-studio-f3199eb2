import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "motion/react"; // استعملت motion/react كيفما العادة
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Plus } from "lucide-react";

interface Product {
  id: string;
  title: string;
  title_ar: string | null;
  price: string | null;
  image_url: string | null;
  category: string | null;
}

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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className={`min-h-screen bg-white pb-20 ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto px-6 pt-24">
        
        {/* Back Button - Minimal App Style */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[10px] font-bold text-stone-400 hover:text-stone-900 transition-all uppercase tracking-[0.2em] mb-12"
        >
          <ArrowLeft className={`w-4 h-4 ${isArabic ? 'rotate-180' : ''}`} />
          {isArabic ? "الرجوع للرئيسية" : "Back Home"}
        </Link>

        {/* Category Title - Elegant & Subtle */}
        <header className="mb-16 text-center space-y-2">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold font-serif text-stone-900 tracking-tight"
          >
            {categoryName}
          </motion.h1>
          <div className="h-1 w-12 bg-amber-600 mx-auto rounded-full" />
        </header>

        {products.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <p className="text-stone-400 font-light italic">
              {isArabic ? "لا توجد منتجات في هذا القسم حالياً" : "No products in this category yet"}
            </p>
          </div>
        ) : (
          /* Grid - 2 columns on mobile, 3/4 on desktop */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((item) => {
              const title = getTitle(item);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <Link to={`/product/${item.id}`} className="group block">
                    {/* Card Container */}
                    <div className="bg-white rounded-[2.2rem] p-2 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-stone-50 transition-all duration-500 hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)]">
                      
                      {/* Image - App Style Ratio */}
                      <div className="aspect-[4/5] rounded-[1.8rem] overflow-hidden bg-stone-100 relative">
                        <img
                          src={item.image_url || "/placeholder.svg"}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                        />
                        
                        {/* Quick Add Button - App UI Style */}
                        <div className="absolute bottom-3 right-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                           <div className="bg-white p-2 rounded-full shadow-lg text-stone-900 border border-stone-100">
                              <Plus className="w-4 h-4" />
                           </div>
                        </div>
                      </div>

                      {/* Content - Small & Premium Typography */}
                      <div className="p-4 space-y-1 text-center">
                        <h3 className="text-[13px] font-medium text-stone-900 tracking-tight line-clamp-1">
                          {title}
                        </h3>
                        <p className="text-[11px] font-bold text-amber-900 tracking-wide">
                          {item.price ? `${item.price} DH` : (isArabic ? "عند الطلب" : "On Demand")}
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
