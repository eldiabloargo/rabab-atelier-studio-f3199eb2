import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Send, Upload, Palette, Home, Gift } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const SurMesure = () => {
  const { isArabic } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState("tableau");

  const serviceTypes = [
    { id: "tableau", label: isArabic ? "لوحة فنية" : "Tableau Art", icon: <Palette size={14} /> },
    { id: "decor", label: isArabic ? "ديكور منزلي" : "Décor Intérieur", icon: <Home size={14} /> },
    { id: "gift", label: isArabic ? "هدية خاصة" : "Cadeau Unique", icon: <Gift size={14} /> },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // الربط المستقبلي مع Supabase
    setTimeout(() => {
      setLoading(false);
      toast({
        title: isArabic ? "تم استلام رؤيتك الفنية" : "Votre vision a été reçue",
        description: isArabic ? "سنتواصل معك قريباً لمناقشة التفاصيل." : "Nous vous contacterons bientôt pour en discuter.",
        className: "bg-white border-amber-100 font-serif",
      });
    }, 1500);
  };

  return (
    <main className={`min-h-screen bg-[#fafaf9] pt-40 pb-24 ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-3xl mx-auto px-6">

        {/* Cinematic Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 mb-20"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-amber-50 rounded-full text-amber-700 mb-4">
            <Sparkles size={14} />
            <span className="text-[9px] font-black uppercase tracking-[0.3em]">Exclusive Service</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-serif italic text-stone-900 tracking-tighter">
            {isArabic ? "إبداع خاص لك" : "Le Sur-Mesure"}
          </h1>
          
          <p className="text-base text-stone-500 font-light max-w-lg mx-auto leading-relaxed italic">
            {isArabic 
              ? "حول خيالك إلى حقيقة ملموسة. املأ استمارة الإبداع وسنتواصل معك لبناء قطعتك الاستثنائية." 
              : "Transformez votre imagination en réalité. Remplissez le formulaire de création pour donner vie à votre pièce d'exception."}
          </p>
        </motion.div>

        {/* Artisan Form */}
        <motion.form 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit} 
          className="space-y-12 bg-white p-10 md:p-16 rounded-[3rem] shadow-xl shadow-stone-200/50 border border-stone-100 relative overflow-hidden"
        >
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50/50 rounded-full blur-3xl -mr-16 -mt-16" />

          {/* Type Selection */}
          <div className="space-y-6">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400 block">
              {isArabic ? "نوع الإبداع" : "Type de Création"}
            </label>
            <div className="flex flex-wrap gap-4">
              {serviceTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedType(type.id)}
                  className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all duration-500 border
                    ${selectedType === type.id 
                      ? 'bg-stone-900 text-white border-stone-900 shadow-lg scale-105' 
                      : 'bg-stone-50 text-stone-400 border-transparent hover:border-stone-200'}`}
                >
                  {type.icon}
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">
                {isArabic ? "الاسم الكريم" : "Votre Nom"}
              </label>
              <Input required className="bg-stone-50/50 border-stone-100 rounded-2xl h-14 focus:bg-white transition-all" />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">
                {isArabic ? "رقم الواتساب" : "WhatsApp"}
              </label>
              <Input required type="tel" className="bg-stone-50/50 border-stone-100 rounded-2xl h-14 focus:bg-white transition-all" />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">
              {isArabic ? "تفاصيل الرؤية الفنية" : "Détails de votre vision"}
            </label>
            <Textarea 
              required 
              placeholder={isArabic ? "أخبرنا عن الألوان، الحجم، أو المعنى خلف القطعة..." : "Parlez-nous des couleurs, des dimensions أو de l'histoire..."}
              className="bg-stone-50/50 border-stone-100 rounded-[2rem] min-h-[180px] resize-none p-6 focus:bg-white transition-all" 
            />
          </div>

          {/* Luxury Upload Zone */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-stone-400">
              {isArabic ? "صور ملهمة" : "Inspirations Visuelles"}
            </label>
            <div className="relative group cursor-pointer">
              <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-10" />
              <div className="border-2 border-dashed border-stone-100 rounded-[2rem] p-12 flex flex-col items-center justify-center bg-stone-50/30 group-hover:bg-amber-50/30 group-hover:border-amber-200 transition-all duration-700">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="text-stone-400 group-hover:text-amber-600 transition-colors" size={20} />
                </div>
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{isArabic ? "إرفاق ملفات" : "Joindre des fichiers"}</span>
              </div>
            </div>
          </div>

          <Button 
            disabled={loading}
            className="w-full bg-stone-900 hover:bg-amber-900 text-white h-20 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.5em] transition-all duration-700 shadow-2xl shadow-stone-200"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <div className="flex items-center gap-4">
                <Send size={16} className={isArabic ? 'rotate-180' : ''} />
                <span>{isArabic ? "إرسال الطلب الفني" : "Envoyer la Vision"}</span>
              </div>
            )}
          </Button>

          <p className="text-center text-[9px] text-stone-300 font-medium uppercase tracking-[0.3em]">
            {isArabic ? "سيتم الرد في غضون 24 ساعة" : "Réponse sous 24 heures"}
          </p>
        </motion.form>

      </div>
    </main>
  );
};
