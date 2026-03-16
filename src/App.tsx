import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom"; // زدنا useLocation
import { Toaster as Sonner } from "@/components/ui/sonner"; 
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CartProvider } from "@/contexts/CartContext"; 
import { lazy, Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Navbar } from "@/components/Navbar";
import { AnimatePresence, motion } from "framer-motion"; // زدنا هادو للأنيميشن

// ✅ الـ Lazy Loading ليناسب الـ Named Exports
const Index = lazy(() => import("./pages/Index"));
const CategoryPage = lazy(() => import("./pages/CategoryPage").then(module => ({ default: module.CategoryPage })));
const ProductDetail = lazy(() => import("./pages/ProductDetail").then(module => ({ default: module.ProductDetail })));
const Admin = lazy(() => import("./pages/Admin").then(module => ({ default: module.Admin })));
const Infos = lazy(() => import("./pages/Infos").then(module => ({ default: module.Infos })));
const Expositions = lazy(() => import("./pages/Expositions").then(module => ({ default: module.Expositions })));
const SurMesure = lazy(() => import("./pages/SurMesure").then(module => ({ default: module.SurMesure })));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// Component لتغليف الصفحات بأنيميشن ناعم
const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

// هاد الـ Component ضروري باش الـ AnimatePresence تقرأ الـ Location
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/product/:id" element={<PageTransition><ProductDetail /></PageTransition>} />
        <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
        <Route path="/infos" element={<PageTransition><Infos /></PageTransition>} />
        <Route path="/expositions" element={<PageTransition><Expositions /></PageTransition>} />
        <Route path="/category/:slug" element={<PageTransition><CategoryPage /></PageTransition>} />
        <Route path="/sur-mesure" element={<PageTransition><SurMesure /></PageTransition>} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <CartProvider> 
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Navbar /> 
            <Suspense fallback={<LoadingSpinner />}>
              <AnimatedRoutes /> {/* استعملنا الـ Component الجديد هنا */}
            </Suspense>
          </BrowserRouter>
        </CartProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
