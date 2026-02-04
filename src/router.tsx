import { createBrowserRouter } from "react-router-dom";

import { withMobileLayout } from "./components/layout/MobileWrapper";

import App from "./App";
import Index from "./pages/Index";
import AuthPage from "./pages/auth/AuthPage";
import ProfilePage from "./pages/auth/ProfilePage";
import EditProfilePage from "./pages/auth/EditProfilePage";
import ChangePasswordPage from "./pages/auth/ChangePasswordPage";
import BookingsPage from "./pages/booking/BookingPage";
import ExplorePage from "./pages/ExplorePage";
import NotFound from "./pages/auth/NotFound";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import MyShopPage from "./pages/shop/MyShopPage";
import ShopDetailPage from "./pages/shop/ShopDetailPage";
import SchedulePage from "./pages/SchedulePage";
import ServiceItemDetailPage from "./pages/serviceItem/ServiceItemDetailPage";
import CollectionDetailPage from "./pages/collection/CollectionDetailPage";
import AdminLayout from "./components/layout/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UsersManagement from "./pages/admin/UsersManagement";
import ShopsManagement from "./pages/admin/ShopsManagement";
import AdminShopDetailPage from "./components/admin/shop/AdminShopDetailPage";
import ArtistsManagement from "./pages/admin/ArtistManagement";
import AdminArtistDetailPage from "./components/admin/nailArtist/AdminArtistDetailPage";
import ServicesManagement from "./pages/admin/ServicesManagement";
import CollectionsManagement from "./pages/admin/CollectionsManagement";
import NailArtistDashboardPage from "./pages/nailArtist/NailArtistDashboardPage";
import ArtistDetailPage from "./pages/nailArtist/ArtistDetailPage";
import MyNailArtistPage from "./pages/nailArtist/MyNailArtistPage";
import ShopOwnerDashboardPage from "./pages/shop/ShopOwnerDashboardPage";

import CreateServiceItemPage from "./pages/serviceItem/CreateServiceItemPage";
import EditServiceItemPage from "./pages/serviceItem/EditServiceItemPage";
import CreateCollectionPage from "./pages/collection/CreateCollectionPage";
import EditCollectionPage from "./pages/collection/EditCollectionPage";
import CreateLocationPage from "./pages/shop/CreateLocationPage";
import EditLocationPage from "./pages/shop/EditLocationPage";

import BookingPage from "./pages/booking/BookingPage";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        { index: true, element: withMobileLayout(<Index />) },
        { path: "auth", element: withMobileLayout(<AuthPage />, false) },
        { path: "profile", element: withMobileLayout(<ProfilePage />) },
        { path: "profile/edit", element: withMobileLayout(<EditProfilePage />) },
        { path: "profile/change-password", element: withMobileLayout(<ChangePasswordPage />) },
        { path: "staff-dashboard", element: withMobileLayout(<ShopOwnerDashboardPage />) },

        { path: "my-shop", element: withMobileLayout(<MyShopPage />) },
        { path: "my-shop/service-items/create/:type", element: withMobileLayout(<CreateServiceItemPage />) },
        { path: "my-shop/service-items/edit/:id", element: withMobileLayout(<EditServiceItemPage />) },
        { path: "my-shop/collections/create", element: withMobileLayout(<CreateCollectionPage />) },
        { path: "my-shop/collections/edit/:id", element: withMobileLayout(<EditCollectionPage />) },
        { path: "my-shop/locations/create", element: withMobileLayout(<CreateLocationPage />) },
        { path: "my-shop/locations/edit/:id", element: withMobileLayout(<EditLocationPage />) },

        { path: "my-artist", element: withMobileLayout(<MyNailArtistPage />) },
        { path: "my-artist/service-items/create/:type", element: withMobileLayout(<CreateServiceItemPage />) },
        { path: "my-artist/service-items/edit/:id", element: withMobileLayout(<EditServiceItemPage />) },
        { path: "my-artist/collections/create", element: withMobileLayout(<CreateCollectionPage />) },
        { path: "my-artist/collections/edit/:id", element: withMobileLayout(<EditCollectionPage />) },

        { path: "shop/:shopId", element: withMobileLayout(<ShopDetailPage />) },
        { path: "schedule", element: withMobileLayout(<SchedulePage />) },
        { path: "bookings", element: withMobileLayout(<BookingsPage />) },
        { path: "explore", element: withMobileLayout(<ExplorePage />) },
        { path: "services/:id", element: withMobileLayout(<ServiceItemDetailPage />) },
        { path: "collections/:id", element: withMobileLayout(<CollectionDetailPage />) },
        { path: "verify-email", element: withMobileLayout(<VerifyEmail />, false) },
        { path: "forgot-password", element: withMobileLayout(<ForgotPassword />, false) },
        { path: "reset-password", element: withMobileLayout(<ResetPassword />, false) },
        { path: "artist/:id", element: withMobileLayout(<ArtistDetailPage />) },
        { path: "artist-dashboard", element: withMobileLayout(<NailArtistDashboardPage />) },

        { path: "/book", element: withMobileLayout(<BookingPage />) },

        // Admin stays unwrapped
        {
          path: "admin",
          element: <AdminLayout />,
          children: [
            { index: true, element: <AdminDashboard /> },
            { path: "users", element: <UsersManagement /> },
            { path: "shops", element: <ShopsManagement /> },
            { path: "shops/:shopId", element: <AdminShopDetailPage /> },
            { path: "artists", element: <ArtistsManagement /> },
            { path: "artists/:artistId", element: <AdminArtistDetailPage /> },
            { path: "services", element: <ServicesManagement /> },
            { path: "collections", element: <CollectionsManagement /> },
          ],
        },

        { path: "*", element: withMobileLayout(<NotFound />, false) },
      ],
    }

  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  },
);
