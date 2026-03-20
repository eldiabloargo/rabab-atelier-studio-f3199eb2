import { useState } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Upload, Palette, Home, Gift, X, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export const SurMesure = () => {
  const { isArabic } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [selectedType, setSelectedType] = useState("tableau");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [vision, setVision] = useState("");

  const serviceTypes = [
    { id: "tableau", label: isArabic ? "لوحة فنية" : "Tableau Art", icon: <Palette size={14} /> },
    { id: "decor", label: isArabic ? "ديكور منزلي" : "Décor Intérieur", icon: <Home size={14} /> },
    { id: "gift", label: isArabic ? "هدية خاصة" : "Cadeau Unique", icon: <Gift size={14} /> },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const typeLabel = serviceTypes.find(t => t.id === selectedType)?.label;
    const baseMsg = isArabic 
      ? `طلب إبداع خاص جديد 🎨\n\nالاسم: ${name}\nالنوع: ${typeLabel}\nالتفاصيل: ${vision}`
      : `Nouvelle demande Sur-Mesure 🎨\n\nNom: ${name}\nType: ${typeLabel}\nDétails: ${vision}`;
    
    const fileMsg = selectedFile 
      ? (isArabic ? `\n\n📎 (لقد اخترت صورة ملهمة: ${selectedFile.name})` : `\n\n📎 (J'ai choisi une image d'inspiration: ${selectedFile.name})`)
      : "";

    const fullMsg = encodeURIComponent(baseMsg + fileMsg);
    const whatsappUrl = `https://wa.me/212679697964?text=${fullMsg}`;

    setTimeout(() => {
      setLoading(false);
      window.open(whatsappUrl, '_blank');
      
      toast({
        title: isArabic ? "تم تجهيز طلبك" : "Votre demande est prête",
        description: isArabic ? "سيتم توجيهك للواتساب لتأكيد الرؤية الفنية." : "Vous allez être redirigé vers WhatsApp.",
        className: "bg-white border-amber-100 font-serif",
      });
    }, 1200);
  };

  return (
    <main className={`min-h-screen bg-[#fafaf9] pt-24 md:pt-40 pb-16 md:pb-24 ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="max-w-3xl mx-auto px-4 md:px-6">

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4 md:space-y-6 mb-12 md:mb-20"
        >
          <div className="inline-flex items-center gap-2 md:gap-3 px-3 py-1.5 md:px-4 md:py-2 bg-amber-50 rounded-full text-amber-700 mb-2">
            <span className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em]">Exclusive Service</span>
          </div>
          <h1 className="text-3xl md:text-6xl font-serif text-stone-900 tracking-tighter leading-tight italic">
            {isArabic ? "إبداع خاص لك" : "Le Sur-Mesure"}
          </h1>
          <p className="text-sm md:text-base text-stone-500 font-light max-w-lg mx-auto leading-relaxed italic px-4">
            {isArabic 
              ? "حول خيالك إلى حقيقة ملموسة. املأ استمارة الإبداع وسنتواصل معك لبناء قطعتك الاستثنائية." 
              : "Transformez votre imagination en réalité. Remplissez le formulaire de création pour donner vie à votre pièce d'exception."}
          </p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit} 
          className="space-y-8 md:space-y-12 bg-white p-6 md:p-16 rounded-[2rem] md:rounded-[3rem] shadow-xl shadow-stone-200/50 border border-stone-100 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-amber-50/50 rounded-full blur-3xl -mr-12 -mt-12 md:-mr-16 md:-mt-16" />

          <div className="space-y-4 md:space-y-6">
            <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-stone-400 block">
              {isArabic ? "نوع الإبداع" : "Type de Création"}
            </label>
            <div className="flex flex-wrap gap-2 md:gap-4">
              {serviceTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setSelectedType(type.id)}
                  className={`flex items-center gap-2 md:gap-3 px-4 py-3 md:px-6 md:py-4 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-bold uppercase tracking-widest transition-all duration-500 border
                    ${selectedType === type.id 
                      ? 'bg-stone-900 text-white border-stone-900 shadow-md scale-[1.02]' 
                      : 'bg-stone-50 text-stone-400 border-transparent hover:border-stone-200'}`}
                >
                  {type.icon}
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-2 md:space-y-3">
              <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-stone-400">
                {isArabic ? "الاسم الكريم" : "Votre Nom"}
              </label>
              <Input 
                required 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-stone-50/50 border-stone-100 rounded-xl md:rounded-2xl h-12 md:h-14 focus:bg-white transition-all text-sm" 
              />
            </div>
            <div className="space-y-2 md:space-y-3">
              <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-stone-400">
                {isArabic ? "رقم الواتساب" : "WhatsApp"}
              </label>
              <Input 
                required 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-stone-50/50 border-stone-100 rounded-xl md:rounded-2xl h-12 md:h-14 focus:bg-white transition-all text-sm" 
              />
            </div>
          </div>

          <div className="space-y-2 md:space-y-3">
            <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-stone-400">
              {isArabic ? "تفاصيل الرؤية الفنية" : "Détails de votre vision"}
            </label>
            <Textarea 
              required 
              value={vision}
              onChange={(e) => setVision(e.target.value)}
              placeholder={isArabic ? "أخبرنا عن الألوان، الحجم..." : "Parlez-nous des couleurs, des dimensions..."}
              className="bg-stone-50/50 border-stone-100 rounded-[1.5rem] md:rounded-[2rem] min-h-[150px] md:min-h-[180px] resize-none p-4 md:p-6 focus:bg-white transition-all text-sm" 
            />
          </div>

          <div className="space-y-4">
            <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.3em] md:tracking-[0.4em] text-stone-400">
              {isArabic ? "صور ملهمة" : "Inspirations Visuelles"}
            </label>
            <div className="relative group">
              {!selectedFile ? (
                <div className="relative border-2 border-dashed border-stone-100 rounded-[1.5rem] md:rounded-[2rem] p-8 md:p-12 flex flex-col items-center justify-center bg-stone-50/30 group-hover:bg-amber-50/30 group-hover:border-amber-200 transition-all duration-700">
                  <input 
                    type="file" 
                    onChange={handleFileChange} 
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                  />
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="text-stone-400 group-hover:text-amber-600 transition-colors" size={18} />
                  </div>
                  <span className="text-[8px] md:text-[10px] font-bold text-stone-400 uppercase tracking-widest">{isArabic ? "إرفاق ملفات" : "Joindre des fichiers"}</span>
                </div>
              ) : (
                <div className="flex items-center justify-between p-4 bg-stone-50 border border-stone-100 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-stone-100 text-amber-600">
                      <Check size={16} />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-stone-800 truncate max-w-[150px]">{selectedFile.name}</p>
                      <p className="text-[8px] text-stone-400 uppercase tracking-tighter">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="p-2 hover:bg-stone-200 rounded-full transition-colors"
                  >
                    <X size={14} className="text-stone-400" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2">
            <Button 
              disabled={loading}
              className="w-full bg-stone-900 hover:bg-amber-900 text-white h-16 md:h-20 rounded-xl md:rounded-[2rem] text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] md:tracking-[0.5em] transition-all duration-700 shadow-xl shadow-stone-200"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <div className="flex items-center gap-3 md:gap-4">
                  <Send size={14} className={`${isArabic ? 'rotate-180' : ''}`} />
                  <span>{isArabic ? "إرسال الطلب الفني" : "Envoyer la Vision"}</span>
                </div>
              )}
            </Button>
          </div>
        </motion.form>
      </div>
    </main>
  );
};
