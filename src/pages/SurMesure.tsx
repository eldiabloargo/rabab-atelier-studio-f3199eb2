import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Send, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const SurMesure = () => {
  const { isArabic } = useLanguage();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // هنا غايكون الربط مع Supabase أو Email Service
    setTimeout(() => {
      setLoading(false);
      toast({
        title: isArabic ? "تم استلام طلبك" : "Demande reçue",
        description: isArabic ? "سنتواصل معك قريباً لمناقشة التفاصيل." : "Nous vous contacterons bientôt.",
      });
    }, 1500);
  };

  return (
    <main className={`min-h-screen bg-white pt-32 pb-20 ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-2xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center space-y-4 mb-16">
          <div className="flex justify-center">
            <div className="p-3 bg-amber-50 rounded-full text-amber-600">
              <Sparkles size={24} strokeWidth={1.5} />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif italic text-stone-900 tracking-tight">
            {isArabic ? "طلب خاص على ذوقك" : "Création sur Mesure"}
          </h1>
          <p className="text-sm text-stone-400 font-light max-w-md mx-auto leading-relaxed">
            {isArabic 
              ? "شاركنا فكرتك، ألوانك المفضلة، والمناسبة، وسنحول خيالك إلى قطعة فنية ملموسة." 
              : "Partagez votre idée, vos couleurs et l'occasion, nous transformerons votre imagination en réalité."}
          </p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-8 bg-stone-50/30 p-8 md:p-12 rounded-[2.5rem] border border-stone-100">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 px-1">
                {isArabic ? "الاسم الكامل" : "Nom Complet"}
              </label>
              <Input required className="bg-white border-stone-100 rounded-xl h-12 focus:ring-amber-600/20" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 px-1">
                {isArabic ? "رقم الهاتف" : "Téléphone"}
              </label>
              <Input required type="tel" className="bg-white border-stone-100 rounded-xl h-12" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 px-1">
              {isArabic ? "وصف الطلبية" : "Description du projet"}
            </label>
            <Textarea 
              required 
              placeholder={isArabic ? "احكِ لنا عن القطعة التي تحلم بها..." : "Décrivez la pièce de vos rêves..."}
              className="bg-white border-stone-100 rounded-2xl min-h-[150px] resize-none p-4" 
            />
          </div>

          {/* Upload Image (Optional but Luxury) */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400 px-1">
              {isArabic ? "صورة ملهمة (اختياري)" : "Image d'inspiration (Optionnel)"}
            </label>
            <div className="border-2 border-dashed border-stone-100 rounded-2xl p-8 flex flex-col items-center justify-center bg-white hover:border-amber-200 transition-colors cursor-pointer group">
              <Upload className="text-stone-300 group-hover:text-amber-600 transition-colors mb-2" size={20} />
              <span className="text-[10px] text-stone-400">{isArabic ? "ارفع صورة توضيحية" : "Télécharger une image"}</span>
            </div>
          </div>

          <Button 
            disabled={loading}
            className="w-full bg-stone-900 hover:bg-stone-800 text-white h-14 rounded-xl text-[10px] font-bold uppercase tracking-[0.3em] transition-all active:scale-[0.98] shadow-lg shadow-stone-100"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Send size={14} className="mr-2 rtl:ml-2" />
                {isArabic ? "إرسال الطلب" : "Envoyer la demande"}
              </>
            )}
          </Button>
        </form>

      </div>
    </main>
  );
};
