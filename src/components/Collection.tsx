import { useState, useEffect, useRef } from "react";
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
    <section id="collection" className="py-32 bg-[#fafaf9] overflow-hidden select-none relative">
      {/* Decorative background element */}
      <div className="absolute top-1/2 left-0 w-full h-[1px] bg-stone-100 -z-10" />

      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-20 text-center space-y-4">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="flex items-center justify-center gap-4 text-amber-700/40"
          >
            <div className="h-[1px] w-6 bg-current" />
            <Sparkles size={14} />
            <div className="h-[1px] w-6 bg-current" />
          </motion.div>
          
          <h2 className="text-5xl md:text-7xl font-serif text-stone-900 tracking-tighter italic">
            L'Art de Vivre
          </h2>
          <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.6em]">
            {isArabic ? "مجموعات استثنائية" : "Collections D'Exception"}
          </p>
        </header>

        {/* Cinematic Carousel Space */}
        <div className="relative flex justify-center items-center h-[500px] md:h-[650px] perspective-[2000px]">
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
                    x: isCenter ? 0 : (isNext ? (window.innerWidth > 768 ? 450 : 280) : (window.innerWidth > 768 ? -450 : -280)), 
                    scale: isCenter ? 1 : 0.65,
                    rotateY: isCenter ? 0 : (isNext ? -25 : 25),
                    zIndex: isCenter ? 30 : 10,
                    filter: isCenter ? "blur(0px)" : "blur(4px)"
                  }}
                  transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute cursor-grab active:cursor-grabbing preserve-3d"
                >
                  <Link 
                    to={`/category/${cat.name.toLowerCase().replace(/\s+/g, '-')}`} 
                    className={`group relative block aspect-square w-[300px] md:w-[520px] rounded-full p-3 md:p-5 transition-all duration-1000
                      ${isCenter ? 'bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] border border-stone-100' : 'bg-transparent pointer-events-none'}`}
                  >
                    <div className="relative w-full h-full overflow-hidden rounded-full">
                      <img
                        src={cat.image_url || "/placeholder.svg"}
                        alt={cat.name}
                        className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
                      />

                      {/* Info Overlay with Glassmorphism */}
                      <AnimatePresence>
                        {isCenter && (
                          <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }} 
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute inset-0 bg-stone-900/10 backdrop-blur-[2px] flex flex-col items-center justify-center text-center group-hover:bg-stone-900/30 transition-all duration-700"
                          >
                            <motion.div 
                              initial={{ y: 20 }} animate={{ y: 0 }}
                              className="px-10 py-12 rounded-full border border-white/20 bg-white/10 backdrop-blur-md"
                            >
                              <h3 className="text-white text-3xl md:text-5xl font-serif italic tracking-tighter mb-4">
                                {isArabic && cat.name_ar ? cat.name_ar : cat.name}
                              </h3>
                              <div className="flex items-center gap-3 justify-center">
                                <div className="h-[1px] w-4 bg-amber-400 opacity-50" />
                                <span className="text-amber-100 text-[10px] font-black uppercase tracking-[0.5em]">
                                  {isArabic ? "استكشاف" : "Explorer"}
                                </span>
                                <div className="h-[1px] w-4 bg-amber-400 opacity-50" />
                              </div>
                            </motion.div>
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

        {/* Premium Pagination Controls */}
        <div className="flex flex-col items-center gap-12 mt-12">
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
                  className={`relative h-2 transition-all duration-700 rounded-full overflow-hidden ${i === currentIndex ? 'w-12 bg-stone-900' : 'w-2 bg-stone-200 hover:bg-stone-300'}`}
                >
                   {i === currentIndex && isAutoPlaying && (
                     <motion.div 
                        initial={{ x: "-100%" }} 
                        animate={{ x: "0%" }} 
                        transition={{ duration: 6, ease: "linear" }}
                        className="absolute inset-0 bg-amber-600/30" 
                      />
                   )}
                </button>
              ))}
            </div>
            <div className="h-[1px] w-12 bg-stone-200" />
          </div>

          <div className="flex flex-col items-center gap-3">
             <p className="text-[9px] text-stone-400 font-black uppercase tracking-[0.4em] italic opacity-60">
              {isArabic ? "اسحب لاكتشاف التفاصيل" : "Faites glisser pour explorer"}
            </p>
            <motion.div 
              animate={{ x: [-10, 10, -10] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="h-[1px] w-20 bg-gradient-to-r from-transparent via-amber-300 to-transparent"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Collection;
