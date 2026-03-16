import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Plus, ShoppingBag } from "lucide-react";

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
  const { isArabic } = useLanguage();

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      setLoading(true);
      
      // 1. تحديد واش كنقلبو على كولشي ولا كاتيغوري محددة
      const isAll = slug === 'all';
      const categoryNameFromSlug = slug?.split('-').join(' ');

      // 2. جلب بيانات الكاتيغوري (فقط إيلا ما كانتش "all")
      if (!isAll && categoryNameFromSlug) {
        const { data: catData } = await supabase
          .from("categories")
          .select("*")
          .ilike("name", categoryNameFromSlug)
          .single();

        if (catData) setCategoryData(catData);
      } else {
        // إيلا كانت "all"، نعطيوها عنوان وصورة افتراضية فخمة
        setCategoryData({
          name: isArabic ? "المجموعة الكاملة" : "La Collection",
          image_url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000" // صورة خلفية فخمة للكل
        });
      }

      // 3. جلب المنتجات (اللوجيك الجديد للربط التلقائي)
      let query = supabase.from("products").select("*");

      if (!isAll && categoryNameFromSlug) {
        // إيلا كان كاتيغوري محدد، دير Filter
        query = query.ilike("category", categoryNameFromSlug);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (data) setProducts(data as any);
      setLoading(false);
    };

    fetchCategoryAndProducts();
  }, [slug, isArabic]); // استعملنا slug هنا لضمان تحديث الصفحة فورا

  const getTitle = (p: Product) => (isArabic && p.title_ar ? p.title_ar : p.title);

  return (
    <main className={`min-h-screen bg-white ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>

      {/* Dynamic Header Section */}
      <div className="relative h-[50vh] flex items-center justify-center bg-stone-900 overflow-hidden">
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            className="absolute inset-0"
          >
            {categoryData?.image_url && (
              <img 
                src={categoryData.image_url} 
                className="w-full h-full object-cover blur-sm scale-110"
                alt=""
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-white" />
          </motion.div>
        </AnimatePresence>

        <div className="relative z-10 text-center space-y-6 px-6">
          <Link
            to="/"
            className="inline-flex items-center gap-3 text-[10px] font-bold text-stone-500 hover:text-stone-900 transition-all uppercase tracking-[0.4em]"
          >
            <ArrowLeft className={`w-3 h-3 ${isArabic ? 'rotate-180' : ''}`} />
            {isArabic ? "العودة" : "Retour"}
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-2"
          >
            <h1 className="text-5xl md:text-7xl font-serif text-stone-900 tracking-tighter italic capitalize">
              {categoryData?.name}
            </h1>
            <p className="text-amber-700 text-[10px] font-black uppercase tracking-[0.5em]">
              {products.length} {isArabic ? "قطع مختارة" : "Articles Sélectionnés"}
            </p>
          </motion.div>
          <div className="h-[1px] w-16 bg-amber-600/40 mx-auto" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-24">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="aspect-[4/5] bg-stone-50 rounded-[3rem] animate-pulse" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-32 space-y-6">
             <div className="w-16 h-16 bg-stone-50 rounded-full flex items-center justify-center mx-auto">
                <ShoppingBag className="w-6 h-6 text-stone-200" />
             </div>
             <p className="text-stone-400 font-serif italic text-lg">
               {isArabic ? "هذه المجموعة فارغة حالياً" : "Cette collection est vide pour le moment"}
             </p>
             <Link to="/" className="inline-block text-[10px] font-bold text-amber-700 underline tracking-[0.3em] uppercase">
               {isArabic ? "العودة للرئيسية" : "Retour à l'accueil"}
             </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-16">
            {products.map((item, index) => {
              const title = getTitle(item);
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (index % 4) * 0.1 }}
                >
                  <Link to={`/product/${item.id}`} className="group block">
                    <div className="relative space-y-6">
                      <div className="aspect-[4/5] overflow-hidden rounded-[3rem] bg-stone-50 relative shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-stone-100 transition-all duration-700 group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.08)] group-hover:-translate-y-2">
                        <img
                          src={item.image_url || "/placeholder.svg"}
                          alt={title}
                          className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-stone-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute bottom-6 right-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                           <div className="bg-white p-4 rounded-full shadow-xl">
                              <Plus className="w-5 h-5 text-stone-900" />
                           </div>
                        </div>
                      </div>
                      <div className="text-center space-y-2">
                        <h3 className="text-sm font-serif text-stone-800 tracking-tight italic">
                          {title}
                        </h3>
                        <div className="flex items-center justify-center gap-2">
                          <span className="h-[1px] w-4 bg-stone-200" />
                          <p className="text-[11px] font-black text-amber-800 tracking-widest uppercase">
                            {item.price ? `${item.price} MAD` : (isArabic ? "طلب خاص" : "Sur Mesure")}
                          </p>
                          <span className="h-[1px] w-4 bg-stone-200" />
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
