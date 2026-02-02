import { createBrowserRouter } from "react-router-dom";

import App from "./App";
import Index from "./pages/Index";
import AuthPage from "./pages/auth/AuthPage";
import ProfilePage from "./pages/auth/ProfilePage";
import EditProfilePage from "./pages/auth/EditProfilePage";
import ChangePasswordPage from "./pages/auth/ChangePasswordPage";
import BookingsPage from "./pages/BookingsPage";
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

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        { index: true, element: <Index /> },
        { path: "auth", element: <AuthPage /> },
        { path: "profile", element: <ProfilePage /> },
        { path: "profile/edit", element: <EditProfilePage /> },
        { path: "profile/change-password", element: <ChangePasswordPage /> },
        { path: "staff-dashboard", element: <ShopOwnerDashboardPage /> },

        { path: "my-shop", element: <MyShopPage /> },
        {
          path: "my-shop/service-items/create/:type",
          element: <CreateServiceItemPage />,
        },
        {
          path: "my-shop/service-items/edit/:id",
          element: <EditServiceItemPage />,
        },
        {
          path: "my-shop/collections/create",
          element: <CreateCollectionPage />,
        },
        {
          path: "my-shop/collections/edit/:id",
          element: <EditCollectionPage />,
        },
        { path: "my-shop/locations/create", element: <CreateLocationPage /> },
        { path: "my-shop/locations/edit/:id", element: <EditLocationPage /> },

        // Artist-related routes
        { path: "my-artist", element: <MyNailArtistPage /> },
        {
          path: "my-artist/service-items/create/:type",
          element: <CreateServiceItemPage />,
        },
        {
          path: "my-artist/service-items/edit/:id",
          element: <EditServiceItemPage />,
        },
        {
          path: "my-artist/collections/create",
          element: <CreateCollectionPage />,
        },
        {
          path: "my-artist/collections/edit/:id",
          element: <EditCollectionPage />,
        },

        { path: "shop/:shopId", element: <ShopDetailPage /> },
        { path: "schedule", element: <SchedulePage /> },
        { path: "bookings", element: <BookingsPage /> },
        { path: "explore", element: <ExplorePage /> },
        { path: "services/:id", element: <ServiceItemDetailPage /> },
        { path: "collections/:id", element: <CollectionDetailPage /> },
        { path: "verify-email", element: <VerifyEmail /> },
        { path: "forgot-password", element: <ForgotPassword /> },
        { path: "reset-password", element: <ResetPassword /> },
        { path: "artist/:id", element: <ArtistDetailPage /> },
        { path: "artist-dashboard", element: <NailArtistDashboardPage /> },

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

        { path: "*", element: <NotFound /> },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  },
);
