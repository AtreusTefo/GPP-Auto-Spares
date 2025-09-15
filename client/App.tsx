import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import PrivacyPolicies from "./pages/PrivacyPolicies";
import TermsAndConditions from "./pages/TermsAndConditions";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./components/AdminDashboard";
import DashboardOverview from "./pages/admin/DashboardOverview";
import ProductsManagement from "./pages/admin/ProductsManagement";
import AddEditProduct from "./pages/admin/AddEditProduct";
import Orders from "./pages/admin/Orders";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { ProductsProvider } from "./contexts/ProductsContext";
import Cart from "./pages/Cart";
import MyProfile from "./pages/MyProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import WhatsAppChatButton from "./components/WhatsAppChatButton";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <ProductsProvider>
          <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy-policies" element={<PrivacyPolicies />} />
              <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/profile" element={<ProtectedRoute><ErrorBoundary><MyProfile /></ErrorBoundary></ProtectedRoute>} />
            
            {/* Admin Routes */}
             <Route path="/admin" element={<ProtectedRoute requireOwner={true}><AdminDashboard /></ProtectedRoute>}>
              <Route index element={<DashboardOverview />} />
              <Route path="dashboard" element={<DashboardOverview />} />
              <Route path="products-management" element={<ProductsManagement />} />
              <Route path="add-product" element={<AddEditProduct />} />
              <Route path="add-product/:id" element={<AddEditProduct />} />
              <Route path="orders" element={<Orders />} />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
            </Routes>
            
            {/* WhatsApp Chat Button - appears on all pages */}
            <WhatsAppChatButton />
          </BrowserRouter>
          </CartProvider>
        </ProductsProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
