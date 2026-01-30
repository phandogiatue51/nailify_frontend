import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import { AuthProvider } from "./components/auth/AuthProvider";

import AuthPage from "./pages/auth/AuthPage";
import ProfilePage from "./pages/auth/ProfilePage";
import EditProfilePage from "./pages/auth/EditProfilePage";

import BookingsPage from "./pages/BookingsPage";
import ExplorePage from "./pages/ExplorePage";
import NotFound from "./pages/auth/NotFound";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import MyShopPage from "./pages/shop/MyShopPage";
import SchedulePage from "./pages/SchedulePage";
import ShopDetailPage from "./pages/shop/ShopDetailPage";

import CreateServiceItemPage from "./pages/serviceItem/CreateServiceItemPage";
import EditServiceItemPage from "./pages/serviceItem/EditServiceItemPage";
import CreateCollectionPage from "./pages/collection/CreateCollectionPage";
import EditCollectionPage from "./pages/collection/EditCollectionPage";
import CreateLocationPage from "./pages/shop/CreateLocationPage";
import EditLocationPage from "./pages/shop/EditLocationPage";
import ChangePasswordPage from "./pages/auth/ChangePasswordPage";
import ServiceItemDetailPage from "./pages/serviceItem/ServiceItemDetailPage";
import CollectionDetailPage from "./pages/collection/CollectionDetailPage";

import NailArtistDashboardPage from "./pages/nailArtist/NailArtistDashboardPage";
import ArtistDetailPage from "./pages/nailArtist/ArtistDetailPage";

import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ShopsManagement from "./pages/admin/ShopsManagement";
import UsersManagement from "./pages/admin/UsersManagement";
import ServicesManagement from "./pages/admin/ServicesManagement";
import CollectionsManagement from "./pages/admin/CollectionsManagement";
import MyNailArtistPage from "./pages/nailArtist/MyNailArtistPage";
import ShopOwnerDashboardPage from "./pages/shop/ShopOwnerDashboardPage";

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
          <Route path="/profile/edit" element={<EditProfilePage />} />

          <Route
            path="/profile/change-password"
            element={<ChangePasswordPage />}
          />
          <Route path="/staff-dashboard" element={<ShopOwnerDashboardPage />} />

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
          <Route
            path="/my-artist/service-items/create/:type"
            element={<CreateServiceItemPage />}
          />
          <Route
            path="/my-artist/service-items/edit/:id"
            element={<EditServiceItemPage />}
          />
          <Route
            path="/my-artist/collections/create"
            element={<CreateCollectionPage />}
          />
          <Route
            path="/my-artist/collections/edit/:id"
            element={<EditCollectionPage />}
          />
          <Route path="/my-artist" element={<MyNailArtistPage />} />

          <Route path="/artist/:id" element={<ArtistDetailPage />} />
          <Route
            path="/artist-dashboard"
            element={<NailArtistDashboardPage />}
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
