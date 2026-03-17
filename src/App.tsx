import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner"; 
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CartProvider } from "@/contexts/CartContext"; 
import { lazy, Suspense, useEffect } from "react"; // زدنا useEffect
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Navbar } from "@/components/Navbar";
import { AnimatePresence, motion } from "framer-motion";

const Index = lazy(() => import("./pages/Index"));
const CategoryPage = lazy(() => import("./pages/CategoryPage").then(module => ({ default: module.CategoryPage })));
const ProductDetail = lazy(() => import("./pages/ProductDetail").then(module => ({ default: module.ProductDetail })));
const Admin = lazy(() => import("./pages/Admin").then(module => ({ default: module.Admin })));
const Infos = lazy(() => import("./pages/Infos").then(module => ({ default: module.Infos })));
const Expositions = lazy(() => import("./pages/Expositions").then(module => ({ default: module.Expositions })));
const SurMesure = lazy(() => import("./pages/SurMesure").then(module => ({ default: module.SurMesure })));
const Checkout = lazy(() => import("./pages/Checkout").then(module => ({ default: module.Checkout })));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

// حل مشكل الـ Scroll فاش كتبدل الصفحة
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      {/* استعملنا location.pathname بوحدو بلا hash باش ما يوقعش Refresh فاش نضغطو على Links داخلية */}
      <Routes location={location} key={location.pathname.split('/')[1] || 'root'}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/expositions" element={<PageTransition><Expositions /></PageTransition>} />
        <Route path="/sur-mesure" element={<PageTransition><SurMesure /></PageTransition>} />
        <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
        <Route path="/product/:id" element={<PageTransition><ProductDetail /></PageTransition>} />
        <Route path="/category/:slug" element={<PageTransition><CategoryPage /></PageTransition>} />
        <Route path="/infos" element={<PageTransition><Infos /></PageTransition>} />
        <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
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
            <ScrollToTop /> {/* مهم جداً باش يبدا السيت من الفوق فاش تبدل الصفحة */}
            <Navbar /> 
            <Suspense fallback={<LoadingSpinner />}>
              <AnimatedRoutes />
            </Suspense>
          </BrowserRouter>
        </CartProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
