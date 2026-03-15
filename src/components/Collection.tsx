import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useMotionValue } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

export const Collection = () => {
  const { isArabic } = useLanguage();
  const [categories, setCategories] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // جلب الكاتيغوريز أوتوماتيكياً من الداتاباز
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name", { ascending: true });

      if (!error && data) {
        setCategories(data);
      }
      setLoading(false);
    };
    fetchCategories();
  }, []);

  // سيستيم الـ Auto-Scroll مع إمكانية التوقيف عند التفاعل
  useEffect(() => {
    if (categories.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % categories.length);
    }, 5000); // 5 ثواني باش الكليان يلحق يشوف
    return () => clearInterval(timer);
  }, [categories]);

  // دالة لتغيير السلايد يدوياً (عن طريق الضغط أو السحب مستقبلاً)
  const handleNext = () => setCurrentIndex((prev) => (prev + 1) % categories.length);
  const handlePrev = () => setCurrentIndex((prev) => (prev - 1 + categories.length) % categories.length);

  if (loading || categories.length === 0) return null;

  return (
    <section id="collection" className="py-24 bg-white overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-6">

        <header className="mb-16 text-center">
          <motion.span 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-[10px] font-black text-amber-700 uppercase tracking-[0.6em] block mb-4"
          >
            {isArabic ? "المجموعات" : "COLLECTIONS"}
          </motion.span>
          <h2 className="text-4xl md:text-6xl font-serif text-stone-900 tracking-tighter italic">
            L'Art de Vivre
          </h2>
        </header>

        {/* السلايدر الديناميكي */}
        <div className="relative flex justify-center items-center h-[450px] md:h-[550px]">
          <AnimatePresence mode="popLayout">
            {categories.map((cat, index) => {
              const position = (index - currentIndex + categories.length) % categories.length;
              
              // الحسابات باش تبان الدائرة فـ الوسط والخرين فـ الجناب
              const isCenter = position === 0;
              const isNext = position === 1;
              const isPrev = position === categories.length - 1;

              // كنبينو فقط 3 دوائر باش الصفحة تبقى خفيفة ومرتبة
              if (!isCenter && !isNext && !isPrev) return null;

              return (
                <motion.div
                  key={cat.id}
                  drag="x" // إمكانية السحب باليد
                  dragConstraints={{ left: 0, right: 0 }}
                  onDragEnd={(_, info) => {
                    if (info.offset.x > 50) handlePrev();
                    if (info.offset.x < -50) handleNext();
                  }}
                  initial={{ opacity: 0, scale: 0.8, x: isNext ? 300 : -300 }}
                  animate={{ 
                    opacity: isCenter ? 1 : 0.35, 
                    x: isCenter ? 0 : (isNext ? (window.innerWidth > 768 ? 400 : 250) : (window.innerWidth > 768 ? -400 : -250)), 
                    scale: isCenter ? 1 : 0.5,
                    zIndex: isCenter ? 20 : 10,
                    filter: isCenter ? "blur(0px)" : "blur(2px)"
                  }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute cursor-grab active:cursor-grabbing"
                >
                  <Link 
                    to={`/category/${cat.name.toLowerCase().replace(/\s+/g, '-')}`} 
                    className={`block aspect-square w-[280px] md:w-[480px] overflow-hidden rounded-full border-[12px] md:border-[20px] transition-all duration-700
                      ${isCenter ? 'border-stone-50 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)]' : 'border-transparent pointer-events-none'}`}
                  >
                    <div className="relative w-full h-full group">
                      <img
                        src={cat.image_url || "/placeholder.svg"}
                        alt={cat.name}
                        className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
                      />

                      {/* معلومات الكاتيغوري (فرنسية/عربية) */}
                      {isCenter && (
                        <motion.div 
                          initial={{ opacity: 0 }} 
                          animate={{ opacity: 1 }}
                          className="absolute inset-0 bg-stone-900/20 flex flex-col items-center justify-center text-center p-8 backdrop-blur-[1px]"
                        >
                          <div className="space-y-2 translate-y-4">
                            <h3 className="text-white text-2xl md:text-4xl font-serif tracking-tight">
                              {cat.name}
                            </h3>
                            <div className="w-10 h-[1px] bg-amber-400 mx-auto opacity-60" />
                            <span className="text-amber-100 text-[9px] font-black uppercase tracking-[0.5em] block pt-2">
                              {isArabic ? "اكتشف" : "DÉCOUVRIR"}
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

        {/* Indicators & Manual Controls */}
        <div className="flex flex-col items-center gap-8 mt-8">
          <div className="flex justify-center gap-3">
            {categories.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`h-1.5 transition-all duration-500 rounded-full ${i === currentIndex ? 'w-10 bg-amber-700' : 'w-2 bg-stone-200'}`}
              />
            ))}
          </div>
          
          <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest animate-pulse">
            {isArabic ? "اسحب للتنقل" : "Glissez pour explorer"}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Collection;
