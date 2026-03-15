import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

// الخانات اللي حددتي - هادو هما السوارت ديال الربط
const COLLECTIONS_CONFIG = [
  { id: "cadeau-de-naissance", en: "Cadeau de Naissance", ar: "هدايا المواليد" },
  { id: "decorations-de-ramadan", en: "Décorations de Ramadan", ar: "زينة رمضان" },
  { id: "gift-box", en: "Gift Box", ar: "صناديق الهدايا" }
];

export const Collection = () => {
  const { isArabic } = useLanguage();
  const [collectionImages, setCollectionImages] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestImages = async () => {
      try {
        // كنجيبو آخر تصويرة تزادت ف كل Category باش تكون هي الـ Cover
        const { data, error } = await supabase
          .from("products")
          .select("category, image_url")
          .in("category", COLLECTIONS_CONFIG.map(c => c.en))
          .order("created_at", { ascending: false });

        if (error) throw error;

        if (data) {
          const images: Record<string, string> = {};
          // كنعمرو الـ Object بحيث كل Category تاخد أول تصويرة لقاها (الأحدث)
          data.forEach(item => {
            if (item.category && !images[item.category]) {
              images[item.category] = item.image_url || "";
            }
          });
          setCollectionImages(images);
        }
      } catch (err) {
        console.error("Error fetching collection images:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestImages();
  }, []);

  return (
    <section id="collection" className="py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header فخم وبسيط */}
        <header className="mb-24 text-center">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-[10px] font-bold text-amber-700 uppercase tracking-[0.6em] block mb-4"
          >
            {isArabic ? "المجموعات المختارة" : "Curated Collections"}
          </motion.span>
          <h2 className="text-5xl md:text-7xl font-serif text-stone-900 tracking-tighter italic">
            Atelier Rabab
          </h2>
        </header>

        {/* Grid ديال الدوائر الفخمة */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-10 items-center">
          {COLLECTIONS_CONFIG.map((col, index) => {
            const coverImage = collectionImages[col.en] || "/placeholder.svg";

            return (
              <motion.div
                key={col.id}
                initial={{ opacity: 0, scale: 0.8, y: 60 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ 
                  duration: 1, 
                  delay: index * 0.2,
                  ease: [0.16, 1, 0.3, 1] // Custom ease لـ حركة بروفيسيونال
                }}
              >
                <Link 
                  to={`/category/${col.id}`} 
                  className="group relative block aspect-square overflow-hidden rounded-full border-[15px] border-stone-50 shadow-[0_20px_50px_rgba(0,0,0,0.05)] transition-all duration-700 hover:border-amber-50 hover:shadow-[0_30px_70px_rgba(0,0,0,0.1)]"
                >
                  {/* التصويرة اللي جاية من الـ Admin Panel */}
                  <div className="absolute inset-0 bg-stone-100">
                    <img
                      src={coverImage}
                      alt={col.en}
                      className="w-full h-full object-cover transition-transform duration-[2.5s] group-hover:scale-110"
                      loading="lazy"
                    />
                  </div>

                  {/* Overlay & Text - الكتابة وسط التصويرة كيف الفيديو */}
                  <div className="absolute inset-0 bg-stone-900/20 group-hover:bg-stone-900/40 transition-colors duration-500 flex flex-col items-center justify-center text-center p-8">
                    <div className="border-y border-white/30 py-6 w-full backdrop-blur-[2px]">
                      <motion.h3 
                        className="text-white text-2xl md:text-3xl font-serif tracking-wide mb-3 drop-shadow-md"
                      >
                        {isArabic ? col.ar : col.en}
                      </motion.h3>
                      <div className="overflow-hidden h-4">
                        <span className="text-white/90 text-[10px] font-bold uppercase tracking-[0.4em] block transition-transform duration-500 translate-y-0 group-hover:-translate-y-full">
                          {isArabic ? "اكتشف" : "Discover"}
                        </span>
                        <span className="text-amber-200 text-[10px] font-bold uppercase tracking-[0.4em] block transition-transform duration-500 translate-y-0 group-hover:-translate-y-full">
                          {isArabic ? "ادخل الآن" : "Step Inside"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* الـ Ring اللي كيعطي لمسة الفخامة */}
                  <div className="absolute inset-4 border border-white/20 rounded-full scale-100 group-hover:scale-105 transition-transform duration-1000" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Collection;
