import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Lang = "fr" | "ar";

interface LanguageContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (key: string) => string;
  isArabic: boolean;
}

const translations: Record<string, Record<Lang, string>> = {
  // --- المضمون (خط أحمر - لم يتم لمس أي كلمة) ---
  "nav.artisane": { fr: "L'Artisane", ar: "الحرفية" },
  "nav.ateliers": { fr: "Nos Ateliers", ar: "ورشاتنا" },
  "nav.collection": { fr: "La Collection", ar: "المجموعة" },
  "nav.infos": { fr: "Se Renseigner", ar: "استفسار" },
  "nav.expositions": { fr: "Expositions", ar: "المعارض" },
  "hero.title": { fr: "Rabab Atelier", ar: "Rabab Atelier" },
  "hero.subtitle": { fr: "L'art de sculpter l'émotion", ar: "فن نحت المشاعر" },
  "artisane.title": { fr: "L'Artisane", ar: "الحرفية" },
  "artisane.p1": { fr: "Rabab est une artisane marocaine passionnée par la sculpture. Dans son atelier baigné de lumière, elle façonne le plâtre et la résine pour créer des pièces uniques qui capturent l'essence de l'émotion humaine.", ar: "رباب حرفية مغربية شغوفة بالنحت. في ورشتها المليئة بالضوء، تشكّل الجبس والراتنج لإبداع قطع فريدة تجسّد جوهر المشاعر الإنسانية." },
  "artisane.p2": { fr: "Présente dans les salons d'artisanat marocains, elle partage son savoir-faire à travers des ateliers créatifs pour enfants et adultes — une invitation à découvrir la beauté du geste artisanal.", ar: "تشارك في المعارض الحرفية المغربية، وتنقل خبرتها من خلال ورشات إبداعية للأطفال والكبار — دعوة لاكتشاف جمال الحرف اليدوية." },
  "artisane.explorer": { fr: "EXPLORER", ar: "استكشاف" },
  "ateliers.title": { fr: "Nos Ateliers", ar: "ورشاتنا" },
  "ateliers.p1": { fr: "Nos ateliers sont des espaces de création et de partage. Que vous soyez débutant ou artiste confirmé, venez vivre une expérience unique de sculpture sur plâtre.", ar: "ورشاتنا هي فضاءات للإبداع والمشاركة. سواء كنت مبتدئاً أو فناناً محترفاً، عِش تجربة فريدة في نحت الجبس." },
  "ateliers.p2": { fr: "Chaque session est l'occasion de créer un souvenir tangible — une pièce sculptée de vos mains, imprégnée de votre créativité.", ar: "كل جلسة هي فرصة لصنع ذكرى ملموسة — قطعة منحوتة بيديك، مشبعة بإبداعك." },
  "ateliers.cta": { fr: "Se renseigner →", ar: "← استفسار" },
  "collection.title": { fr: "La Collection", ar: "المجموعة" },
  "collection.inquire": { fr: "Commander / S'informer", ar: "طلب / استفسار" },
  "collection.onDemand": { fr: "Sur demande", ar: "حسب الطلب" },
  "collection.viewAll": { fr: "Voir la collection", ar: "عرض المجموعة" },
  "cat.naissance": { fr: "Cadeaux de naissance", ar: "هدايا المواليد" },
  "cat.naissance.intro": { fr: "Des pièces délicates pour célébrer les premiers instants de vie.", ar: "قطع رقيقة للاحتفال بأولى لحظات الحياة." },
  "cat.ramadan": { fr: "Décorations du Ramadan", ar: "زينة رمضان" },
  "cat.ramadan.intro": { fr: "L'art sacré au service de la spiritualité et de la beauté.", ar: "الفن المقدّس في خدمة الروحانية والجمال." },
  "cat.giftbox": { fr: "Gift Box", ar: "علبة الهدايا" },
  "cat.giftbox.intro": { fr: "Coffrets soigneusement composés pour offrir une émotion sculptée.", ar: "علب مُعدّة بعناية لإهداء مشاعر منحوتة." },
  "expo.title": { fr: "Expositions", ar: "المعارض" },
  "expo.subtitle": { fr: "Présences remarquées", ar: "حضور مميز" },
  "expo.agadir.title": { fr: "Centre d'informations Touristiques Agadir", ar: "مركز الاستعلامات السياحية بأكادير" },
  "expo.agadir.desc": { fr: "Une vitrine d'excellence artisanale au cœur de la capitale du Souss. Rabab Atelier y expose ses créations les plus emblématiques, mêlant tradition et modernité dans un cadre dédié à la découverte du patrimoine marocain.", ar: "واجهة للتميز الحرفي في قلب عاصمة سوس. يعرض Rabab Atelier أعماله الأكثر تميزاً، مزيجاً بين التقليد الحداثة في فضاء مخصص لاكتشاف التراث المغربي." },
  "expo.tantan.title": { fr: "Foire de Moussem de Tan-Tan", ar: "معرض موسم طانطان" },
  "expo.tantan.desc": { fr: "Inscrite au patrimoine immatériel de l'UNESCO, cette foire célèbre les traditions nomades du Sahara. Rabab Atelier y participe en mettant en lumière le savoir-faire sculptural marocain à l'échelle internationale.", ar: "مسجّلة في التراث غير المادي لليونسكو، يحتفي هذا المعرض بتقاليد البدو الصحراوية. يشارك Rabab Atelier فيه بإبراز المهارة النحتية المغربية على المستوى الدولي." },
  "expo.sahara.title": { fr: "Festival International du Sahara", ar: "المهرجان الدولي للصحراء" },
  "expo.sahara.desc": { fr: "Un rendez-vous culturel majeur qui réunit artistes et artisans du monde entier. Rabab Atelier y présente des œuvres inspirées par l'immensité et la spiritualité du désert, un dialogue entre l'art et la nature.", ar: "موعد ثقافي كبير يجمع فنانين وحرفيين من جميع أنحاء العالم. يقدم Rabab Atelier أعمالاً مستوحاة من اتساع وروحانية الصحراء، حوار بين الفن والطبيعة." },
  "footer.rights": { fr: "© 2026 Rabab Atelier. Tous droits réservés.", ar: "© 2026 Rabab Atelier. جميع الحقوق محفوظة." },
  "footer.langToggle": { fr: "العربية", ar: "Français" },
  "footer.langLabel": { fr: "Changer la langue :", ar: ": تغيير اللغة" },
  "infos.title": { fr: "Notre Processus", ar: "مسارنا الإبداعي" },
  "infos.subtitle": { fr: "De l'idée à l'œuvre", ar: "من الفكرة إلى العمل الفني" },
  "infos.step1.title": { fr: "Inspiration", ar: "الإلهام" },
  "infos.step1.desc": { fr: "Chaque pièce naît d'une émotion, d'un moment capturé. L'inspiration vient de la nature, de l'architecture marocaine, et des gestes du quotidien.", ar: "كل قطعة تولد من شعور، من لحظة مُلتقطة. الإلهام يأتي من الطبيعة، والعمارة المغربية، وحركات الحياة اليومية." },
  "infos.step2.title": { fr: "Modelage", ar: "التشكيل" },
  "infos.step2.desc": { fr: "Le plâtre et la résine sont travaillés à la main avec patience et précision. Chaque courbe, chaque texture est intentionnelle.", ar: "يُشكَّل الجبس والراتنج يدوياً بصبر ودقة. كل انحناء وكل ملمس مقصود." },
  "infos.step3.title": { fr: "Finition", ar: "التشطيب" },
  "infos.step3.desc": { fr: "Les finitions — dorure, patine, lissage — donnent vie à la pièce. C'est l'étape où l'émotion prend forme définitive.", ar: "التشطيبات — التذهيب، العتق، التنعيم — تمنح القطعة الحياة. إنها المرحلة التي يتجسّد فيها الشعور بشكل نهائي." },
  "infos.contact": { fr: "Contactez-nous", ar: "تواصلوا معنا" },
  "infos.whatsapp": { fr: "Écrire sur WhatsApp", ar: "مراسلتنا عبر واتساب" },
  "category.back": { fr: "← Retour", ar: "رجوع →" },
  "category.empty": { fr: "Aucun produit dans cette catégorie.", ar: "لا توجد منتجات في هذه الفئة." },
  "loading": { fr: "Chargement...", ar: "جاري التحميل..." },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [lang, setLang] = useState<Lang>("fr");

  const toggleLang = () => setLang((prev) => (prev === "fr" ? "ar" : "fr"));

  // دالة t المحصنة: لو مالقاتش الـ key كترجعو هو نيت بلا ما طفي السيت
  const t = (key: string): string => {
    if (!translations[key]) return key;
    return translations[key][lang] || key;
  };

  const isArabic = lang === "ar";

  // قلب اتجاه الموقع كاملاً بناءً على اللغة
  useEffect(() => {
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
    document.documentElement.lang = lang;
  }, [lang, isArabic]);

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t, isArabic }}>
      <div className={isArabic ? "font-sans" : "font-sans"}>
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
