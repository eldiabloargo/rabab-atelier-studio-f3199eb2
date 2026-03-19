import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCart } from "@/contexts/CartContext";
import { ArrowLeft, ShoppingBag, Star, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isArabic, t } = useLanguage();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<any>(null);
  const [activeImage, setActiveImage] = useState<string>("");

  
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
     
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setProduct(data);
        setActiveImage(data.image_url);
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0]);
        }
      }
      setLoading(false);
    };
    fetchProduct();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!product) return null;

  const currentTitle = isArabic && product.title_ar ? product.title_ar : product.title;
  const currentDesc = isArabic && product.description_ar ? product.description_ar : product.description;

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      title: product.title,
      title_ar: product.title_ar,
      price: product.price,
      image: product.image_url,
      selectedColor: selectedColor,
      quantity: 1
    });

    toast({ 
      title: isArabic ? "تمت الإضافة للحقيبة" : "Ajouté au panier",
      className: "bg-white border-stone-100 rounded-xl font-serif italic"
    });
  };

  return (
    <main className="min-h-screen bg-white" dir={isArabic ? 'rtl' : 'ltr'}>
      
      <nav 
        className={`sticky top-[72px] z-[90] w-full px-6 transition-all duration-300 pointer-events-none 
          ${isArabic ? 'flex-row-reverse' : ''}`}
      >
        
        <div className={`flex justify-between items-center w-full max-w-7xl mx-auto py-2`}>
          
          
          <motion.div 
            animate={{ 
              scale: isScrolled ? 0.9 : 1, 
             
              backgroundColor: isScrolled ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0)",
              border: isScrolled ? "1px solid #f2f2f2" : "1px solid transparent",
              borderRadius: isScrolled ? "20px" : "0px",
              paddingLeft: isScrolled ? "16px" : "0px",
              paddingRight: isScrolled ? "16px" : "0px",
              paddingTop: isScrolled ? "6px" : "0px",
              paddingBottom: isScrolled ? "6px" : "0px",
            }}
            transition={{ duration: 0.3 }}
            className={`pointer-events-auto flex items-center gap-2 backdrop-blur-sm shadow-stone-50 
              ${isScrolled ? 'shadow-sm' : ''} ${isArabic ? 'ml-auto' : 'mr-auto'}`}
          >
            <span className="text-[10px] font-bold tracking-[0.3em] text-amber-800 uppercase leading-none">
              Rabab Atelier 
            </span>
          </motion.div>

         
          <motion.button 
            onClick={() => navigate(-1)} 
            animate={{ 
              scale: isScrolled ? 0.9
