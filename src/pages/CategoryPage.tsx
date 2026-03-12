import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, MessageCircle } from "lucide-react";

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

const SLUG_MAP: Record<string, string> = {
  "cadeaux-de-naissance": "Cadeaux de naissance",
  "decorations-du-ramadan": "Décorations du Ramadan",
  "gift-box": "Gift Box",
};

const LABEL_MAP: Record<string, string> = {
  "cadeaux-de-naissance": "cat.naissance",
  "decorations-du-ramadan": "cat.ramadan",
  "gift-box": "cat.giftbox",
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

const CategoryPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { t, isArabic } = useLanguage();

  const categoryName = slug ? SLUG_MAP[slug] : undefined;
  const labelKey = slug ? LABEL_MAP[slug] : undefined;

  useEffect(() => {
    const fetchProducts = async () => {
      if (!categoryName) { setLoading(false); return; }
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("category", categoryName)
        .order("created_at", { ascending: false });
      if (data) setProducts(data as unknown as Product[]);
      setLoading(false);
    };
    fetchProducts();
  }, [categoryName]);

  const getTitle = (p: Product) => (isArabic && p.title_ar ? p.title_ar : p.title);
  const getDesc = (p: Product) => (isArabic && p.description_ar ? p.description_ar : p.description);

  const getWhatsAppUrl = (name: string) => {
    const msg = isArabic
      ? `السلام عليكم، عجبتني هاد التحفة ${name} وبغيت نعرف مزيد من التفاصيل عليها من فضلك.`
      : `Bonjour, je suis intéressé(e) par la pièce ${name}. J'aimerais avoir plus de détails.`;
    return `https://wa.me/212679697964?text=${encodeURIComponent(msg)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-20">
        <Link
          to="/#collection"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold transition-colors mb-12 tracking-widest uppercase font-sans"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("category.back")}
        </Link>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-serif text-gold-gradient text-center mb-16"
        >
          {labelKey ? t(labelKey) : slug}
        </motion.h1>

        {products.length === 0 ? (
          <p className="text-center text-muted-foreground font-sans py-20">
            {t("category.empty")}
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {products.map((item) => {
              const title = getTitle(item);
              const desc = getDesc(item);

              return (
                <motion.div
                  key={item.id}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="group"
                >
                  <div className="luxury-card overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-500">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={item.image_url || "/placeholder.svg"}
                        alt={title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-4 space-y-2 bg-card">
                      <h3 className="font-serif text-foreground text-sm">{title}</h3>
                      {desc && (
                        <p className="text-xs text-muted-foreground font-sans line-clamp-2">{desc}</p>
                      )}
                      <div className="flex items-center justify-between pt-1">
                        <span className="text-xs tracking-wider uppercase text-muted-foreground font-sans">
                          {item.price || t("collection.onDemand")}
                        </span>
                        <a
                          href={getWhatsAppUrl(title)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gold hover:text-gold-dark transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>
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
