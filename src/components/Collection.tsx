import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Plus, ArrowRight } from "lucide-react";

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
        .limit(8) // كنبينو غير 8 ف الرئيسية باش يبقاو "Exclusive"
        .order("created_at", { ascending: false });
      if (data) setProducts(data as any);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const getTitle = (p: Product) => (isArabic && p.title_ar ? p.title_ar : p.title);

  return (
    <section id="collection" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header - App Style */}
        <header className="flex justify-between items-end mb-16 px-2">
          <div className="space-y-2">
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-[0.3em]">
              {isArabic ? "المختارات" : "New Arrivals"}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-stone-900 tracking-tight">
              {isArabic ? "مجموعة أتيليه" : "Our Collection"}
            </h2>
          </div>
          <Link to="/collection" className="group flex items-center gap-2 text-[10px] font-bold text-stone-400 hover:text-stone-900 transition-all uppercase tracking-widest">
            {isArabic ? "رؤية الكل" : "View All"}
            <ArrowRight className={`w-3 h-3 transition-transform ${isArabic ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
          </Link>
        </header>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="aspect-[4/5] bg-stone-50 rounded-[2.5rem] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
            {products.map((item, index) => {
              const title = getTitle(item);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link to={`/product/${item.id}`} className="group block">
                    {/* Card Container */}
                    <div className="relative bg-white rounded-[2.8rem] p-2.5 shadow-[0_4px_25px_rgba(0,0,0,0.02)] border border-stone-50 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.06)] hover:-translate-y-1">
                      
                      {/* Image - Mobile App Style Aspect Ratio */}
                      <div className="aspect-[4/5] rounded-[2.2rem] overflow-hidden bg-stone-50 relative">
                        <img
                          src={item.image_url || "/placeholder.svg"}
                          alt={title}
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                          loading="lazy"
                        />
                        
                        {/* Interactive Badge */}
                        <div className="absolute top-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                           <div className="bg-white/90 backdrop-blur-md p-2.5 rounded-full shadow-lg border border-white">
                              <Plus className="w-4 h-4 text-stone-900" />
                           </div>
                        </div>
                      </div>

                      {/* Info - Elegant & Small */}
                      <div className="pt-5 pb-3 px-2 text-center">
                        <h3 className="text-[13px] font-medium text-stone-800 tracking-tight line-clamp-1 mb-1">
                          {title}
                        </h3>
                        <p className="text-[11px] font-bold text-amber-900/70">
                          {item.price ? `${item.price} DH` : (isArabic ? "عند الطلب" : "Price on Request")}
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
    </section>
  );
};

export default Collection;
