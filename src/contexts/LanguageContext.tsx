import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "fr" | "ar";

interface LanguageContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (key: string) => string;
  isArabic: boolean;
}

const translations: Record<string, Record<Lang, string>> = {
  // --- الترجمات ديالك (ممنوع اللمس) ---
  "nav.artisane": { fr: "L'Artisane", ar: "الحرفية" },
  "nav.ateliers": { fr: "Nos Ateliers", ar: "ورشاتنا" },
  "nav.collection": { fr: "La Collection", ar: "المجموعة" },
  "nav.infos": { fr: "Se Renseigner", ar: "استفسار" },
  "nav.expositions": { fr: "Expositions", ar: "المعارض" },
  "hero.title": { fr: "Rabab Atelier", ar: "Rabab Atelier" },
  "hero.subtitle": { fr: "L'art de sculpter l'émotion", ar: "فن نحت المشاعر" },
  "artisane.title": { fr: "L'Artisane", ar: "الحرفية" },
  "artisane.p1": { fr: "Rabab est une artisane marocaine...", ar: "رباب حرفية مغربية..." },
  "artisane.p2": { fr: "Présente dans les salons...", ar: "تشارك في المعارض..." },
  "artisane.explorer": { fr: "EXPLORER", ar: "استكشاف" },
  "ateliers.title": { fr: "Nos Ateliers", ar: "ورشاتنا" },
  "ateliers.p1": { fr: "Nos ateliers sont...", ar: "ورشاتنا هي..." },
  "ateliers.p2": { fr: "Chaque session est...", ar: "كل جلسة هي..." },
  "ateliers.cta": { fr: "Se renseigner →", ar: "← استفسار" },
  "collection.title": { fr: "La Collection", ar: "المجموعة" },
  "collection.inquire": { fr: "Commander / S'informer", ar: "طلب / استفسار" },
  "collection.onDemand": { fr: "Sur demande", ar: "حسب الطلب" },
  "collection.viewAll": { fr: "Voir la collection", ar: "عرض المجموعة" },
  "cat.naissance": { fr: "Cadeaux de naissance", ar: "هدايا المواليد" },
  "cat.naissance.intro": { fr: "Des pièces délicates...", ar: "قطع رقيقة..." },
  "cat.ramadan": { fr: "Décorations du Ramadan", ar: "زينة رمضان" },
  "cat.ramadan.intro": { fr: "L'art sacré...", ar: "الفن المقدّس..." },
  "cat.giftbox": { fr: "Gift Box", ar: "علبة الهدايا" },
  "cat.giftbox.intro": { fr: "Coffrets soigneusement...", ar: "علب مُعدّة بعناية..." },
  
  // المعارض - هادو هما المهمين لصفحة Expositions
  "expo.title": { fr: "Expositions", ar: "المعارض" },
  "expo.subtitle": { fr: "Présences remarquées", ar: "حضور مميز" },
  "expo.agadir.title": { fr: "Centre d'informations Touristiques Agadir", ar: "مركز الاستعلامات السياحية بأكادير" },
  "expo.agadir.desc": { fr: "Une vitrine d'excellence artisanale...", ar: "واجهة للتميز الحرفي..." },
  "expo.tantan.title": { fr: "Foire de Moussem de Tan-Tan", ar: "معرض موسم طانطان" },
  "expo.tantan.desc": { fr: "Inscrite au patrimoine...", ar: "مسجّلة في التراث..." },
  "expo.sahara.title": { fr: "Festival International du Sahara", ar: "المهرجان الدولي للصحراء" },
  "expo.sahara.desc": { fr: "Un rendez-vous culturel...", ar: "موعد ثقافي كبير..." },

  "footer.rights": { fr: "© 2026 Rabab Atelier.", ar: "© 2026 Rabab Atelier." },
  "footer.langToggle": { fr: "العربية", ar: "Français" },
  "footer.langLabel": { fr: "Changer la langue :", ar: ": تغيير اللغة" },
  "infos.title": { fr: "Notre Processus", ar: "مسارنا الإبداعي" },
  "category.back": { fr: "← Retour", ar: "رجوع →" },
  "loading": { fr: "Chargement...", ar: "جاري التحميل..." },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("fr");
  const toggleLang = () => setLang((prev) => (prev === "fr" ? "ar" : "fr"));

  // دالة الترجمة الآمنة
  const t = (key: string): string => {
    return translations[key]?.[lang] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t, isArabic: lang === "ar" }}>
      <div dir={lang === "ar" ? "rtl" : "ltr"} className="min-h-screen">
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
