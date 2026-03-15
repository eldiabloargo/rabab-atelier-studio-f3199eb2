import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowRight } from "lucide-react";

interface Product {
  id: string;
  title: string;
  title_ar: string | null;
  price: number | null;
  image_url: string | null;
  category: string | null;
}

export const Collection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { isArabic } = useLanguage();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .limit(8)
        .order("created_at", { ascending: false });
      if (data) setProducts(data as any);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // دالة لتحويل السمية لـ Slug باش يخدم الـ Link مزيان
  const getCategorySlug = (category: string | null) => {
    if (!category) return "all";
    return category.toLowerCase().replace(/\s+/g, '-');
  };

  return (
    <section id="collection" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* Header الأنيق */}
        <header className="flex justify-between items-end mb-20 px-2">
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-amber-700 uppercase tracking-[0.4em] block">
              {isArabic ? "اكتشف عوالمنا" : "Explore Worlds"}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif text-stone-900 tracking-tight">
              {isArabic ? "مجموعاتنا" : "Our Collections"}
            </h2>
          </div>
          <Link to="/collections" className="group flex items-center gap-3 text-[10px] font-bold text-stone-400 hover:text-stone-900 transition-all uppercase tracking-widest">
            {isArabic ? "رؤية الكل" : "View All"}
            <div className="w-8 h-[1px] bg-stone-200 transition-all group-hover:w-12 group-hover:bg-stone-900" />
          </Link>
        </header>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="aspect-[4/6] bg-stone-50 rounded-t-full animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-16">
            {products.map((item, index) => {
              const categorySlug = getCategorySlug(item.category);
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.7 }}
                >
                  {/* الرابط كيدي للـ Category دبا */}
                  <Link to={`/category/${categorySlug}`} className="group block text-center">
                    
                    {/* Arch Shape Container - اللمسة ديالك */}
                    <div className="relative aspect-[4/6] mb-6 overflow-hidden rounded-t-full bg-stone-50 border border-stone-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] transition-all duration-700 group-hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] group-hover:-translate-y-2">
                      <img
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.category || "Collection"}
                        className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                        loading={index < 2 ? "eager" : "lazy"}
                        // @ts-ignore
                        fetchpriority={index < 2 ? "high" : "auto"}
                      />
                      
                      {/* Overlay خفيف كيبان فـ Hover */}
                      <div className="absolute inset-0 bg-stone-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>

                    {/* Collection Label */}
                    <div className="space-y-1">
                      <h3 className="text-[11px] font-bold text-stone-400 uppercase tracking-[0.2em]">
                        {isArabic ? "قسم" : "Collection"}
                      </h3>
                      <p className="text-lg md:text-xl font-serif text-stone-900 group-hover:text-amber-800 transition-colors">
                        {isArabic ? item.category : item.category} {/* هنا تقدر تزيد ترجمة الكاتيكوري إلا بغيتي */}
                      </p>
                      
                      {/* زر Explore صغير */}
                      <div className="pt-4 flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                        <span className="text-[9px] font-bold text-amber-700 border-b border-amber-700/30 pb-1 uppercase tracking-widest">
                          {isArabic ? "استكشف" : "Explore"}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Collection;
