import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, ShoppingBag } from "lucide-react";

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
      const formattedSlug = slug?.split('-').join(' ');

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

      let query = supabase.from("products").select("*");
      if (!isAll && formattedSlug) {
        query = query.ilike("category", formattedSlug);
      }

      const { data } = await query.order("created_at", { ascending: false });
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
    <main className="min-h-screen bg-[#fafaf9] selection:bg-stone-200">
      <div className="relative h-[50vh] flex items-center justify-center overflow-hidden bg-stone-900">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          {categoryData?.image_url && (
            <img 
              src={categoryData.image_url} 
              className="w-full h-full object-cover"
              alt=""
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-stone-900/60 via-stone-900/20 to-[#fafaf9]" />
        </motion.div>

        <div className="relative z-10 text-center space-y-6 px-6 pt-12">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <Link
              to="/"
              className={`inline-flex items-center gap-2 text-[9px] font-bold text-white/80 hover:text-white transition-all uppercase tracking-[0.4em] ${isArabic ? 'flex-row-reverse' : ''}`}
            >
              <ArrowLeft className={`w-3 h-3 ${isArabic ? 'rotate-180' : ''}`} />
              {t("category.back")}
            </Link>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
            <h1 className="text-4xl md:text-7xl font-serif text-white tracking-tight leading-none uppercase">
              {getCategoryName()}
            </h1>
            <div className="flex items-center justify-center gap-4">
               <div className="h-[1px] w-8 bg-amber-400/30" />
               <p className="text-amber-100/90 text-[10px] font-medium uppercase tracking-[0.5em]">
                {products.length} {isArabic ? "قطعة حصرية" : "Pièces Exclusives"}
               </p>
               <div className="h-[1px] w-8 bg-amber-400/30" />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="space-y-4">
                <div className="aspect-[3/4] bg-stone-200/40 rounded-2xl animate-pulse" />
                <div className="h-3 w-1/2 bg-stone-200/40 mx-auto rounded-full animate-pulse" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32 space-y-6">
             <ShoppingBag className="w-10 h-10 text-stone-200 mx-auto stroke-[1px]" />
             <p className="text-stone-400 font-serif text-lg tracking-tight">{t("category.empty")}</p>
             <Link to="/" className="inline-block px-8 py-3 border border-stone-200 text-[9px] font-bold tracking-widest uppercase hover:bg-stone-900 hover:text-white transition-all rounded-full">
               {isArabic ? "العودة للمجموعات" : "Retour aux collections"}
             </Link>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
            {products.map((item, index) => {
              const title = getProductTitle(item);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: (index % 4) * 0.1 }}
                >
                  <Link to={`/product/${item.id}`} className="group block">
                    <div className="space-y-5">
                      <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-[#f5f5f4] relative transition-all duration-700">
                        <img
                          src={item.image_url || "/placeholder.svg"}
                          alt={title}
                          className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/5 transition-colors duration-500" />
                        <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                           <div className="bg-white/95 backdrop-blur-md py-3 text-center rounded-xl shadow-lg border border-stone-100">
                              <span className="text-[9px] font-black tracking-[0.2em] text-stone-900 uppercase">
                                {isArabic ? "رؤية المنتج" : "Voir le Produit"}
                              </span>
                           </div>
                        </div>
                      </div>
                      <div className="text-center space-y-2">
                        <h3 className="text-sm md:text-base font-serif text-stone-800 tracking-tight font-medium uppercase group-hover:text-amber-800 transition-colors">
                          {title}
                        </h3>
                        <p className="text-[11px] font-bold text-amber-900/80 tracking-widest">
                          {item.price ? `${item.price} MAD` : t("collection.onDemand")}
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