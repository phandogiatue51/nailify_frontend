import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { AuthProvider } from "./components/auth/AuthProvider";
import AuthPage from "./pages/AuthPage";
import ProfilePage from "./pages/ProfilePage";
import DashboardPage from "./pages/DashboardPage";
import MyShopPage from "./pages/MyShopPage";
import SchedulePage from "./pages/SchedulePage";
import ShopDetailPage from "./pages/ShopDetailPage";
import BookingsPage from "./pages/BookingsPage";
import ExplorePage from "./pages/ExplorePage";
import NotFound from "./pages/NotFound";

import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import CreateServiceItemPage from "./components/shop/CreateServiceItemPage";
import EditServiceItemPage from "./components/shop/EditServiceItemPage";
import CreateCollectionPage from "./components/shop/CreateCollectionPage";
import EditCollectionPage from "./components/shop/EditCollectionPage";
import CreateLocationPage from "./components/shop/CreateLocationPage";
import EditLocationPage from "./components/shop/EditLocationPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import ServiceItemDetailPage from "./pages/ServiceItemDetailPage";
import CollectionDetailPage from "./pages/CollectionDetailPage";

import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ShopsManagement from "./pages/admin/ShopsManagement";
import UsersManagement from "./pages/admin/UsersManagement";
import ServicesManagement from "./pages/admin/ServicesManagement";
import CollectionsManagement from "./pages/admin/CollectionsManagement";
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/services/:id" element={<ServiceItemDetailPage />} />
          <Route path="/collections/:id" element={<CollectionDetailPage />} />
          <Route path="/auth" element={<AuthPage />} />

          <Route path="/profile" element={<ProfilePage />} />
          <Route
            path="/profile/change-password"
            element={<ChangePasswordPage />}
          />

          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/my-shop" element={<MyShopPage />} />
          <Route
            path="/my-shop/service-items/create/:type"
            element={<CreateServiceItemPage />}
          />
          <Route
            path="/my-shop/service-items/edit/:id"
            element={<EditServiceItemPage />}
          />
          <Route
            path="/my-shop/collections/create"
            element={<CreateCollectionPage />}
          />
          <Route
            path="/my-shop/collections/edit/:id"
            element={<EditCollectionPage />}
          />

          <Route
            path="/my-shop/locations/create"
            element={<CreateLocationPage />}
          />
          <Route
            path="/my-shop/locations/edit/:id"
            element={<EditLocationPage />}
          />

          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/shop/:shopId" element={<ShopDetailPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/explore" element={<ExplorePage />} />

          <Route path="/admin/*" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="shops" element={<ShopsManagement />} />
            <Route path="users" element={<UsersManagement />} />
            <Route path="services" element={<ServicesManagement />} />
            <Route path="collections" element={<CollectionsManagement />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
