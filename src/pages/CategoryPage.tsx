import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, Eye } from "lucide-react";

interface Product {
  id: string;
  title: string;
  title_ar: string | null;
  price: string | null;
  description: string | null;
  description_ar: string | null;
  image_url: string | null;
  category: string | null;
}

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, isArabic } = useLanguage();

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
      if (data) setProducts(data as unknown as Product[]);
      setLoading(false);
    };
    fetchProducts();
  }, [categoryName]);

  const getTitle = (p: Product) => (isArabic && p.title_ar ? p.title_ar : p.title);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <Link
          to="/#collection"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors mb-12 uppercase font-sans tracking-widest"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("category.back")}
        </Link>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-serif text-gold-gradient text-center mb-16"
        >
          {categoryName}
        </motion.h1>

        {products.length === 0 ? (
          <p className="text-center text-muted-foreground font-sans py-20">
            {t("category.empty")}
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((item) => {
              const title = getTitle(item);
              return (
                <motion.div
                  key={item.id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  {/* هنا فين زدنا الـ Link لي كيدي لـ ID البروداكت */}
                  <Link to={`/product/${item.id}`} className="group block">
                    <div className="luxury-card overflow-hidden bg-card rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500 border border-gold/5">
                      <div className="aspect-[4/5] overflow-hidden relative">
                        <img
                          src={item.image_url || "/placeholder.svg"}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          loading="lazy"
                        />
                        {/* Overlay كيبان فـ Hover */}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="bg-white/90 p-3 rounded-full text-gold scale-75 group-hover:scale-100 transition-transform duration-500">
                            <Eye className="w-6 h-6" />
                          </div>
                        </div>
                      </div>
                      <div className="p-4 space-y-2 text-center">
                        <h3 className="font-serif text-foreground text-sm md:text-base line-clamp-1">{title}</h3>
                        <p className="text-xs md:text-sm font-sans text-gold tracking-wider">
                          {item.price || t("collection.onDemand")}
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
