import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import sculpture1 from "@/assets/sculpture-1.jpg";
import sculpture2 from "@/assets/sculpture-2.jpg";
import sculpture3 from "@/assets/sculpture-3.jpg";

interface Product {
  id: string;
  title: string;
  title_ar: string | null;
  image_url: string | null;
  category: string | null;
}

const CATEGORIES = [
  {
    key: "Cadeaux de naissance",
    slug: "cadeaux-de-naissance",
    labelKey: "cat.naissance",
    introKey: "cat.naissance.intro",
    fallbackImage: sculpture1, // هادي هي الصورة اللي غاتبقى ديما
  },
  {
    key: "Décorations du Ramadan",
    slug: "decorations-du-ramadan",
    labelKey: "cat.ramadan",
    introKey: "cat.ramadan.intro",
    fallbackImage: sculpture2,
  },
  {
    key: "Gift Box",
    slug: "gift-box",
    labelKey: "cat.giftbox",
    introKey: "cat.giftbox.intro",
    fallbackImage: sculpture3,
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export const Collection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const { t, isArabic } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from("products")
        .select("id, title, title_ar, image_url, category")
        .order("created_at", { ascending: false });
      if (data) setProducts(data as unknown as Product[]);
    };
    fetchProducts();
  }, []);

  // حيدنا الدالة القديمة getCategoryImage باش نخدمو بـ fallbackImage ديما

  const next = () => setActiveIndex((i) => (i + 1) % CATEGORIES.length);
  const prev = () => setActiveIndex((i) => (i - 1 + CATEGORIES.length) % CATEGORIES.length);

  return (
    <section id="collection" className="py-32 px-6 bg-background overflow-hidden">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="text-3xl md:text-4xl font-serif text-gold-gradient mb-6 text-center"
        >
          {t("collection.title")}
        </motion.h2>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-center text-muted-foreground font-sans text-sm mb-16 max-w-md mx-auto"
        >
          {isArabic ? "اكتشفوا مجموعاتنا الفريدة" : "Découvrez nos collections uniques"}
        </motion.p>

        {/* Circular Carousel */}
        <div className="relative" ref={containerRef}>
          <div className="flex items-center justify-center gap-6 md:gap-12">
            {/* Left arrow */}
            <button
              onClick={prev}
              className="flex-shrink-0 w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold transition-all duration-300"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Carousel items */}
            <div className="flex items-center justify-center gap-6 md:gap-10">
              {CATEGORIES.map((cat, index) => {
                const isActive = index === activeIndex;
                const distance = Math.abs(index - activeIndex);

                return (
                  <motion.div
                    key={cat.key}
                    animate={{
                      scale: isActive ? 1 : 0.75,
                      opacity: isActive ? 1 : distance > 1 ? 0.3 : 0.5,
                    }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className={`flex flex-col items-center ${isActive ? "z-10" : "z-0"} ${
                      !isActive ? "hidden md:flex" : ""
                    }`}
                  >
                    <p className="text-sm font-serif text-foreground mb-4 text-center tracking-wide">
                      {t(cat.labelKey)}
                    </p>

                    <Link to={`/category/${cat.slug}`}>
                      <div className="relative group cursor-pointer">
                        <div
                          className={`overflow-hidden rounded-full border-2 shadow-lg transition-all duration-500 ${
                            isActive
                              ? "w-64 h-64 md:w-80 md:h-80 border-gold shadow-gold/20" // كبرنا الدوائر هنا
                              : "w-40 h-40 md:w-48 md:h-48 border-border"
                          }`}
                        >
                          <img
                            src={cat.fallbackImage} // التصويرة غاتبقى ديما هي اللي محطوطة ف Assets
                            alt={t(cat.labelKey)}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        </div>
                        {/* Animated arrow */}
                        {isActive && (
                          <motion.div
                            animate={{ y: [0, 6, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute -bottom-8 left-1/2 -translate-x-1/2"
                          >
                            <svg width="20" height="12" viewBox="0 0 20 12" className="text-gold">
                              <path d="M1 1L10 10L19 1" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
                            </svg>
                          </motion.div>
                        )}
                      </div>
                    </Link>

                    <p className="text-xs text-muted-foreground font-sans italic mt-10 max-w-[180px] text-center leading-relaxed">
                      {t(cat.introKey)}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Right arrow */}
            <button
              onClick={next}
              className="flex-shrink-0 w-10 h-10 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-gold hover:border-gold transition-all duration-300"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Dots indicator */}
          <div className="flex justify-center gap-2 mt-12">
            {CATEGORIES.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex ? "bg-gold w-6" : "bg-border"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
