import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, isArabic } = useLanguage();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabase.from("products").select("*").eq("id", id).single();
      if (data) setProduct(data);
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background text-gold">Loading...</div>;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  const title = isArabic && product.title_ar ? product.title_ar : product.title;
  const description = isArabic && product.description_ar ? product.description_ar : product.description;

  return (
    <main className="min-h-screen bg-background pb-20">
      <div className="max-w-6xl mx-auto px-6 pt-24">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-gold mb-8 transition-colors">
          <ArrowLeft className="w-5 h-5" /> {isArabic ? "رجوع" : "Retour"}
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* تصويرة البروداكت بـ زوم أنيميشن */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-square rounded-3xl overflow-hidden border border-gold/10 shadow-2xl"
          >
            <img src={product.image_url} alt={title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </motion.div>

          {/* المعلومات */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div className="space-y-2">
              <span className="text-gold text-sm tracking-[0.2em] uppercase">{product.category}</span>
              <h1 className="text-4xl font-serif text-foreground">{title}</h1>
              <p className="text-2xl font-sans text-gold-gradient font-light">{product.price || t("collection.onDemand")}</p>
            </div>

            <div className="h-[1px] bg-gold/10 w-full" />

            <div className="space-y-4">
              <h3 className="font-serif text-lg">{isArabic ? "الوصف" : "Description"}</h3>
              <p className="text-muted-foreground leading-relaxed font-sans text-lg whitespace-pre-line">
                {description}
              </p>
            </div>

            <div className="pt-8 flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => window.open(`https://wa.me/212679697964?text=Je suis intéressé par: ${title}`, "_blank")}
                className="flex-1 bg-gold hover:bg-gold-dark text-white h-14 rounded-xl gap-2 text-lg shadow-lg shadow-gold/20"
              >
                <MessageCircle className="w-5 h-5" /> {isArabic ? "اطلب الآن" : "Commander maintenant"}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
};

export default ProductDetail;
