import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner"; 
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CartProvider } from "@/contexts/CartContext"; 
import { lazy, Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Navbar } from "@/components/Navbar";

// ✅ تصحيح الـ Lazy Loading ليناسب الـ Named Exports
const Index = lazy(() => import("./pages/Index")); // هذا غالباً فيه export default Index
const CategoryPage = lazy(() => import("./pages/CategoryPage").then(module => ({ default: module.CategoryPage })));
const ProductDetail = lazy(() => import("./pages/ProductDetail").then(module => ({ default: module.ProductDetail })));
const Admin = lazy(() => import("./pages/Admin").then(module => ({ default: module.Admin })));
const Infos = lazy(() => import("./pages/Infos").then(module => ({ default: module.Infos })));
const Expositions = lazy(() => import("./pages/Expositions").then(module => ({ default: module.Expositions })));
const SurMesure = lazy(() => import("./pages/SurMesure").then(module => ({ default: module.SurMesure })));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

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
