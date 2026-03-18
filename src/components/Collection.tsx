import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { Sparkles } from "lucide-react";

export const Collection = () => {
  const { isArabic, t } = useLanguage();
  const [categories, setCategories] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

      if (!error && data) setCategories(data);
      setLoading(false);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length === 0 || !isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % categories.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [categories, isAutoPlaying]);

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % categories.length);
  };

  const handlePrev = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + categories.length) % categories.length);
  };

  if (loading || categories.length === 0) return null;

  return (
    // تصغير الـ padding من py-32 لـ py-20
    <section id="collection" className="py-20 bg-[#fafaf9] overflow-hidden select-none relative">
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-stone-100 -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        {/* تصغير الـ margin-bottom من mb-20 لـ mb-10 */}
        <header className="mb-10 text-center space-y-4">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="flex items-center justify-center gap-4 text-amber-700/40"
          >
            <div className="h-[1px] w-6 bg-current" />
            <Sparkles size={14} />
            <div className="h-[1px] w-6 bg-current" />
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-serif text-stone-900 tracking-tighter italic">
            L'Art de Vivre
          </h2>
          <p className="text-[9px] font-black text-stone-400 uppercase tracking-[0.5em]">
            {isArabic ? "مجموعات استثنائية" : "Collections D'Exception"}
          </p>
        </header>

        {/* تصغير ارتفاع الكاروسيل من 650px لـ 500px */}
        <div className="relative flex justify-center items-center h-[400px] md:h-[500px] perspective-[2000px]">
          <AnimatePresence mode="popLayout" initial={false}>
            {categories.map((cat, index) => {
              const position = (index - currentIndex + categories.length) % categories.length;
              const isCenter = position === 0;
              const isNext = position === 1;
              const isPrev = position === categories.length - 1;

              if (!isCenter && !isNext && !isPrev) return null;

              return (
                <motion.div
                  key={cat.id}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(_, info) => {
                    if (info.offset.x > 70) handlePrev();
                    if (info.offset.x < -70) handleNext();
                  }}
                  initial={{ opacity: 0, scale: 0.5, x: isNext ? 500 : -500, rotateY: isNext ? -45 : 45 }}
                  animate={{ 
                    opacity: isCenter ? 1 : 0.4, 
                    x: isCenter ? 0 : (isNext ? (window.innerWidth > 768 ? 400 : 250) : (window.innerWidth > 768 ? -400 : -250)), 
                    scale: isCenter ? 1 : 0.6,
                    rotateY: isCenter ? 0 : (isNext ? -25 : 25),
                    zIndex: isCenter ? 30 : 10,
                    filter: isCenter ? "blur(0px)" : "blur(2px)"
                  }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute cursor-grab active:cursor-grabbing preserve-3d"
                >
                  <Link 
                    to={`/category/${cat.name.toLowerCase().replace(/\s+/g, '-')}`} 
                    className={`group relative block aspect-square w-[280px] md:w-[480px] rounded-full p-2 md:p-4 transition-all duration-1000
                      ${isCenter ? 'bg-white shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] border border-stone-100' : 'bg-transparent pointer-events-none'}`}
                  >
                    <div className="relative w-full h-full overflow-hidden rounded-full">
                      <img
                        src={cat.image_url || "/placeholder.svg"}
                        alt={cat.name}
                        className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
                      />

                      <AnimatePresence>
                        {isCenter && (
                          <motion.div 
                            initial={{ opacity: 0 }} 
                            animate={{ opacity: 1 }}
                            // الخلفية خفيفة جداً لضمان وضوح الصورة
                            className="absolute inset-0 bg-stone-900/5 backdrop-blur-[1px] flex flex-col items-center justify-center text-center transition-all duration-700"
                          >
                            <div className="relative px-6 py-8">
                              {/* النص بالذهبي الملكي */}
                              <h3 className="text-[#C5A059] text-2xl md:text-4xl font-serif italic tracking-tighter mb-2 drop-shadow-sm">
                                {isArabic && cat.name_ar ? cat.name_ar : cat.name}
                              </h3>
                              
                              {/* الخط الانسيابي اللي كيتفتح */}
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: "100%" }}
                                transition={{ delay: 0.5, duration: 1, ease: "easeInOut" }}
                                className="h-[1px] bg-[#C5A059]/40 mx-auto"
                              />

                              <div className="flex items-center gap-3 justify-center mt-4">
                                <span className="text-[#C5A059] text-[9px] font-black uppercase tracking-[0.4em] opacity-80">
                                  {isArabic ? "استكشاف" : "Explorer"}
                                </span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <div className="flex flex-col items-center gap-8 mt-4">
          <div className="flex justify-center items-center gap-6">
            <div className="h-[1px] w-12 bg-stone-200" />
            <div className="flex gap-4">
              {categories.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentIndex(i);
                  }}
                  className={`relative h-1.5 transition-all duration-700 rounded-full overflow-hidden ${i === currentIndex ? 'w-10 bg-stone-900' : 'w-1.5 bg-stone-200 hover:bg-stone-300'}`}
                >
                   {i === currentIndex && isAutoPlaying && (
                     <motion.div 
                        initial={{ x: "-100%" }} 
                        animate={{ x: "0%" }} 
                        transition={{ duration: 6, ease: "linear" }}
                        className="absolute inset-0 bg-amber-600/20" 
                      />
                   )}
                </button>
              ))}
            </div>
            <div className="h-[1px] w-12 bg-stone-200" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Collection;
