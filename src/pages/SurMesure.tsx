import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { Palette, Send, Sparkles } from "lucide-react";

const SurMesure = () => {
  const { t, isArabic } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    service: "",
    details: ""
  });

  const handleWhatsApp = (e: React.FormEvent) => {
    e.preventDefault();
    const message = isArabic 
      ? `طلب خاص (Sur Mesure):\n- الإسم: ${formData.name}\n- نوع الخدمة: ${formData.service}\n- التفاصيل: ${formData.details}`
      : `Demande Sur Mesure :\n- Nom: ${formData.name}\n- Service: ${formData.service}\n- Détails: ${formData.details}`;
    
    window.open(`https://wa.me/212679697964?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <main className="min-h-screen bg-background py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Sparkles className="mx-auto text-gold mb-4 w-8 h-8" />
          <h1 className="text-4xl font-serif text-gold-gradient mb-4">
            {isArabic ? "طلب خاص - Sur Mesure" : "Création Sur Mesure"}
          </h1>
          <p className="text-muted-foreground font-sans">
            {isArabic 
              ? "صمم قطعة فنية تعكس ذوقك الخاص بلمسة رباب أطليه" 
              : "Créez une pièce unique qui reflète votre style avec la touche Rabab Atelier"}
          </p>
        </motion.div>

        <motion.form 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleWhatsApp}
          className="space-y-6 bg-card p-8 rounded-2xl border border-gold/20 shadow-xl"
        >
          <div className="space-y-2">
            <Label className={isArabic ? "block text-right" : ""}>
              {isArabic ? "الإسم الكامل" : "Nom Complet"}
            </Label>
            <Input 
              required
              className="bg-background/50 border-gold/10"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label className={isArabic ? "block text-right" : ""}>
              {isArabic ? "نوع العمل (جبص، راتنج، لوحة...)" : "Type de travail (Plâtre, Résine...)"}
            </Label>
            <Input 
              required
              className="bg-background/50 border-gold/10"
              value={formData.service}
              onChange={(e) => setFormData({...formData, service: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label className={isArabic ? "block text-right" : ""}>
              {isArabic ? "اشرح لنا فكرتك (الألوان، القياسات...)" : "Décrivez votre idée (Couleurs, Dimensions...)"}
            </Label>
            <Textarea 
              required
              className="bg-background/50 border-gold/10 min-h-[150px]"
              value={formData.details}
              onChange={(e) => setFormData({...formData, details: e.target.value})}
            />
          </div>

          <Button type="submit" className="w-full bg-gold hover:bg-gold-dark text-white gap-2 h-12 text-lg">
            <Send className="w-5 h-5" />
            {isArabic ? "إرسال عبر واتساب" : "Envoyer via WhatsApp"}
          </Button>
        </motion.form>
      </div>
    </main>
  );
};

export default SurMesure;
