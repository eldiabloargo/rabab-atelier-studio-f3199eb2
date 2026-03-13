const ProductDetail = lazy(() => import("./pages/ProductDetail"));
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { lazy, Suspense } from "react";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const Index = lazy(() => import("./pages/Index"));
const Admin = lazy(() => import("./pages/Admin"));
const Infos = lazy(() => import("./pages/Infos"));
const Expositions = lazy(() => import("./pages/Expositions"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const SurMesure = lazy(() => import("./pages/SurMesure")); // زدنا هادي هنا
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/" element={<Index />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/infos" element={<Infos />} />
              <Route path="/expositions" element={<Expositions />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/sur-mesure" element={<SurMesure />} /> {/* هي اللخرة قبل NotFound */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
