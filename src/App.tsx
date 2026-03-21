import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CartProvider } from "@/contexts/CartContext";
import { lazy, Suspense, useEffect } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Navbar } from "@/components/Navbar";
import { AnimatePresence, motion } from "framer-motion";


const Index = lazy(() => import("./pages/Index"));
const Expositions = lazy(() => import("./pages/Expositions").then(m => ({ default: m.Expositions })));
const SurMesure = lazy(() => import("./pages/SurMesure").then(m => ({ default: m.SurMesure })));
const Infos = lazy(() => import("./pages/Infos"));
const Checkout = lazy(() => import("./pages/Checkout").then(m => ({ default: m.Checkout })));
const ProductDetail = lazy(() => import("./pages/ProductDetail").then(m => ({ default: m.ProductDetail })));
const CategoryPage = lazy(() => import("./pages/CategoryPage").then(m => ({ default: m.CategoryPage })));
// إضافة الـ Admin (تأكد أن اسم الملف فـ pages هو Admin.tsx)
const Admin = lazy(() => import("./pages/Admin").then(m => ({ default: m.Admin })));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
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
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Index /></PageTransition>} />
        <Route path="/expositions" element={<PageTransition><Expositions /></PageTransition>} />
        <Route path="/infos" element={<PageTransition><Infos /></PageTransition>} />

        <Route path="/sur-mesure" element={<PageTransition><SurMesure /></PageTransition>} />
        <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
        <Route path="/product/:id" element={<PageTransition><ProductDetail /></PageTransition>} />
        <Route path="/category/:slug" element={<PageTransition><CategoryPage /></PageTransition>} />
      
        <Route path="/admin" element={<PageTransition><Admin /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <LanguageProvider>
        <CartProvider>
          <TooltipProvider>
            <AnimatedRoutes />
          </TooltipProvider>
        </CartProvider>
      </LanguageProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
