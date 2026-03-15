import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

const COLLECTIONS_CONFIG = [
  { id: "cadeau-de-naissance", en: "Cadeau de Naissance", ar: "هدايا المواليد" },
  { id: "decorations-de-ramadan", en: "Décorations de Ramadan", ar: "زينة رمضان" },
  { id: "gift-box", en: "Gift Box", ar: "صناديق الهدايا" }
];

export const Collection = () => {
  const { isArabic } = useLanguage();
  const [collectionImages, setCollectionImages] = useState<Record<string, string>>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchLatestImages = async () => {
      const { data } = await supabase
        .from("products")
        .select("category, image_url")
        .in("category", COLLECTIONS_CONFIG.map(c => c.en))
        .order("created_at", { ascending: false });

      if (data) {
        const images: Record<string, string> = {};
        data.forEach(item => {
          if (item.category && !images[item.category]) {
            images[item.category] = item.image_url || "";
          }
        });
        setCollectionImages(images);
      }
    };
    fetchLatestImages();
  }, []);

  // سيستيم الـ Auto-Scroll: كل 4 ثواني كتبدل الكوليكشن
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % COLLECTIONS_CONFIG.map(c => c.en).length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="collection" className="py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        <header className="mb-24 text-center">
          <motion.span className="text-[10px] font-bold text-amber-700 uppercase tracking-[0.6em] block mb-4">
            {isArabic ? "COLLECTION"}
          </motion.span>
          <h2 className="text-5xl md:text-7xl font-serif text-stone-900 tracking-tighter italic">
            Atelier Rabab
          </h2>
        </header>

        {/* Container ديال السلايدر */}
        <div className="relative flex justify-center items-center h-[500px]">
          <AnimatePresence mode="popLayout">
            {COLLECTIONS_CONFIG.map((col, index) => {
              // حساب الـ Position بالنسبة للدائرة اللي في الوسط
              const position = (index - currentIndex + COLLECTIONS_CONFIG.length) % COLLECTIONS_CONFIG.length;
              
              // كنبينو غير اللي في الوسط (0)، واليمن (1)، واليسار (2)
              const isCenter = position === 0;
              const isRight = position === 1;
              const isLeft = position === 2;

              if (!isCenter && !isRight && !isLeft) return null;

              return (
                <motion.div
                  key={col.id}
                  initial={{ opacity: 0, x: isRight ? 200 : -200, scale: 0.5 }}
                  animate={{ 
                    opacity: isCenter ? 1 : 0.3, 
                    x: isCenter ? 0 : (isRight ? 350 : -350), 
                    scale: isCenter ? 1 : 0.6,
                    zIndex: isCenter ? 10 : 0,
                    filter: isCenter ? "blur(0px)" : "blur(4px)"
                  }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute"
                >
                  <Link 
                    to={`/category/${col.id}`} 
                    className={`block aspect-square w-[300px] md:w-[450px] overflow-hidden rounded-full border-[15px] transition-all duration-700
                      ${isCenter ? 'border-stone-50 shadow-2xl' : 'border-transparent cursor-default pointer-events-none'}`}
                  >
                    <div className="relative w-full h-full">
                      <img
                        src={collectionImages[col.en] || "/placeholder.svg"}
                        alt={col.en}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* الكتابة كتبان غير في الدائرة اللي في الوسط */}
                      {isCenter && (
                        <motion.div 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="absolute inset-0 bg-stone-900/30 flex flex-col items-center justify-center text-center p-8"
                        >
                          <div className="border-y border-white/30 py-6 w-full backdrop-blur-[2px]">
                            <h3 className="text-white text-2xl md:text-4xl font-serif mb-2 tracking-wide">
                              {isArabic ? col.ar : col.en}
                            </h3>
                            <span className="text-amber-200 text-[10px] font-bold uppercase tracking-[0.4em]">
                              {isArabic ? "ادخل الآن" : "Step Inside"}
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Indicator ديال السلايدر تحت الدوائر */}
        <div className="flex justify-center gap-3 mt-12">
          {COLLECTIONS_CONFIG.map((_, i) => (
            <div 
              key={i}
              className={`h-1 transition-all duration-500 rounded-full ${i === currentIndex ? 'w-8 bg-amber-700' : 'w-2 bg-stone-200'}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Collection;
