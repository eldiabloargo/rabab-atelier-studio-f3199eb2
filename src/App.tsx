import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Navbar } from ""@/components/Navlink";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CartProvider } from "@/contexts/CartContext"; // 1. استيراد الكارط بروفايدر
import { lazy, Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";


// Lazy loading components
const Index = lazy(() => import("./pages/Index"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Admin = lazy(() => import("./pages/Admin"));
const Infos = lazy(() => import("./pages/Infos"));
const Expositions = lazy(() => import("./pages/Expositions"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const SurMesure = lazy(() => import("./pages/SurMesure"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        {/* 3. تغليف التطبيق بـ CartProvider هو أهم خطوة */}
        <CartProvider> 
          <Toaster />
          <Sonner />
          <BrowserRouter>
            {/* النافبار غايكون هنا باش يبان فكاع الصفحات */}
            <Navbar /> 
            
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/infos" element={<Infos />} />
                <Route path="/expositions" element={<Expositions />} />
                <Route path="/category/:slug" element={<CategoryPage />} />
                <Route path="/sur-mesure" element={<SurMesure />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </CartProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
