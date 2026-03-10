import { createBrowserRouter } from "react-router-dom";

import { withMobileLayout } from "./components/layout/MobileWrapper";

import App from "./App";
import Index from "./pages/Index";
import AuthPage from "./pages/auth/AuthPage";
import ProfilePage from "./pages/profile/ProfilePage";
import EditProfilePage from "./pages/profile/EditProfilePage";
import ChangePasswordPage from "./pages/auth/ChangePasswordPage";
import ExplorePage from "./pages/ExplorePage";
import NotFound from "./pages/auth/NotFound";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import MyShopPage from "./pages/shop/MyShopPage";
import ShopDetailPage from "./pages/shop/ShopDetailPage";
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

import { CustomDesignPage } from "./pages/booking/CustomDesignPage";

import CreateServiceItemPage from "./pages/serviceItem/CreateServiceItemPage";
import EditServiceItemPage from "./pages/serviceItem/EditServiceItemPage";
import CreateCollectionPage from "./pages/collection/CreateCollectionPage";
import EditCollectionPage from "./pages/collection/EditCollectionPage";
import CreateLocationPage from "./pages/shop/CreateLocationPage";
import EditLocationPage from "./pages/shop/EditLocationPage";

import CustomerBookingPage from "./pages/booking/CustomerBookingPage";
import DateTimeSelection from "./pages/booking/DateTimeSelection";
import ConfirmBooking from "./pages/booking/ConfirmBooking";
import BookingDetail from "./pages/booking/BookingDetail";
import RescheduleBooking from "./pages/booking/RescheduleBooking";

import CustomerBookingView from "./pages/profile/CustomerBookingView";
import ErrorBoundary from "./ErrorBoundary";
import { StaffManagement } from "./pages/staff/StaffManagement";
import { StaffDetailPage } from "./pages/staff/StaffDetailPage";
import { CreateStaffPage } from "./pages/staff/CreateStaffPage";
import { EditStaffPage } from "./pages/staff/EditStaffPage";
import NailArtistBookingView from "./pages/nailArtist/NailArtistBookingView";
import ShopBookingView from "./pages/shop/ShopBookingView";
import StaffBookingView from "./pages/staff/StaffBookingView";
import StaffDashboardPage from "./pages/staff/StaffDashboardPage";
import CreateRatingPage from "./pages/booking/RatingPage";
import DetailChatPage from "./pages/conversation/DetailChatPage";
import ChatList from "./pages/conversation/ChatList";
import ProfileInfoPage from "./components/chat/CustomerInfo";
import ShopInfoPage from "./components/chat/ShopInfo";
import CollectionSelectionPage from "./pages/booking/CollectionSelectionPage";
import { GuestBookingPage } from "./pages/booking/GuestBookingPage";
import { UpdateGuestPage } from "./pages/booking/UpdateGuestPage";
import { CreateBlogPostPage } from "./pages/blogPost/CreateBlogPostPage";
import { BlogListPage } from "./pages/blogPost/BlogListPage";
import { EditBlogPostPage } from "./pages/blogPost/EditBlogPostPage";
import { BlogPostDetailPage } from "./pages/blogPost/BlogPostDetailPage";
import { MyBlogPage } from "./pages/blogPost/MyBlogPage";
import RatingManagement from "./pages/admin/RatingManagement";
import InvoiceManagement from "./pages/admin/InvoiceManagement";
import SubscriptionManagement from "./pages/admin/SubscriptionManagement";
import BlogPostManagement from "./pages/admin/BlogPostManagement";
import { BlogPostDetailModal } from "./components/admin/posts/BlogPostDetailModal";
import SuccessPage from "./pages/payment/SuccessPage";
import CancelPage from "./pages/payment/CancelPage";
import InvoiceDetail from "./components/admin/invoices/InvoiceDetail";
import { SubscriptionPage } from "./pages/subscription/SubscriptionPage";
import { MySubscriptionPage } from "./pages/subscription/MySubscriptionPage";
import MyInvoicePage from "./pages/invoice/MyInvoicePage";
import { InvoiceDetailPage } from "./components/invoice/InvoiceDetailPage";
import { ConfirmSubscription } from "./pages/subscription/ConfirmSubscription";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      errorElement: <ErrorBoundary />,
      children: [
        { index: true, element: withMobileLayout(<Index />) },

        { path: "auth", element: <AuthPage /> },
        { path: "profile", element: withMobileLayout(<ProfilePage />) },

        {
          path: "payments/success",
          element: withMobileLayout(<SuccessPage />),
        },
        {
          path: "payments/cancel",
          element: withMobileLayout(<CancelPage />),
        },

        {
          path: "subscription/",
          element: withMobileLayout(<SubscriptionPage />),
        },
        {
          path: "confirm-subscription/:id",
          element: withMobileLayout(<ConfirmSubscription />),
        },

        {
          path: "my-subscription/",
          element: withMobileLayout(<MySubscriptionPage />),
        },
        {
          path: "my-invoice/",
          element: withMobileLayout(<MyInvoicePage />),
        },
        {
          path: "invoices/:id",
          element: withMobileLayout(<InvoiceDetailPage />),
        },

        {
          path: "profile/:id/info",
          element: withMobileLayout(<ProfileInfoPage />),
        },
        {
          path: "shop/:id/info",
          element: withMobileLayout(<ShopInfoPage />),
        },
        {
          path: "chat/:id?",
          element: withMobileLayout(<DetailChatPage />),
        },
        {
          path: "chat/list",
          element: withMobileLayout(<ChatList />),
        },
        {
          path: "profile/edit",
          element: withMobileLayout(<EditProfilePage />),
        },
        {
          path: "profile/change-password",
          element: withMobileLayout(<ChangePasswordPage />),
        },
        {
          path: "profile/bookings",
          element: withMobileLayout(<CustomerBookingView />),
        },

        {
          path: "/blog/",
          element: withMobileLayout(<BlogListPage />),
        },
        {
          path: "/blog/my-blog",
          element: withMobileLayout(<MyBlogPage />),
        },
        {
          path: "/blog/create",
          element: withMobileLayout(<CreateBlogPostPage />),
        },
        {
          path: "/blog/edit/:id",
          element: withMobileLayout(<EditBlogPostPage />),
        },

        {
          path: "admin/blogs/create",
          element: <CreateBlogPostPage />,
        },
        {
          path: "admin/blogs/edit/:id",
          element: <EditBlogPostPage />,
        },
        {
          path: "/blog/detail/:id",
          element: withMobileLayout(<BlogPostDetailPage />),
        },

        {
          path: "shop-dashboard",
          element: withMobileLayout(<ShopOwnerDashboardPage />),
        },

        { path: "my-shop", element: withMobileLayout(<MyShopPage />) },
        {
          path: "my-shop/bookings",
          element: withMobileLayout(<ShopBookingView />),
        },
        {
          path: "my-shop/service-items/create/:type",
          element: withMobileLayout(<CreateServiceItemPage />),
        },
        {
          path: "my-shop/service-items/edit/:id",
          element: withMobileLayout(<EditServiceItemPage />),
        },
        {
          path: "my-shop/collections/create",
          element: withMobileLayout(<CreateCollectionPage />),
        },
        {
          path: "my-shop/collections/edit/:id",
          element: withMobileLayout(<EditCollectionPage />),
        },
        {
          path: "my-shop/locations/create",
          element: withMobileLayout(<CreateLocationPage />),
        },
        {
          path: "my-shop/locations/edit/:id",
          element: withMobileLayout(<EditLocationPage />),
        },

        { path: "my-artist", element: withMobileLayout(<MyNailArtistPage />) },
        {
          path: "my-artist/bookings",
          element: withMobileLayout(<NailArtistBookingView />),
        },
        {
          path: "my-artist/service-items/create/:type",
          element: withMobileLayout(<CreateServiceItemPage />),
        },
        {
          path: "my-artist/service-items/edit/:id",
          element: withMobileLayout(<EditServiceItemPage />),
        },
        {
          path: "my-artist/collections/create",
          element: withMobileLayout(<CreateCollectionPage />),
        },
        {
          path: "my-artist/collections/edit/:id",
          element: withMobileLayout(<EditCollectionPage />),
        },
        {
          path: "/shop/:shopId/custom",
          element: withMobileLayout(<CustomDesignPage />),
        },

        {
          path: "/artist/:id/custom",
          element: withMobileLayout(<CustomDesignPage />),
        },

        { path: "shop/:shopId", element: withMobileLayout(<ShopDetailPage />) },
        { path: "artist/:id", element: withMobileLayout(<ArtistDetailPage />) },

        { path: "explore", element: withMobileLayout(<ExplorePage />) },
        {
          path: "services/:id",
          element: withMobileLayout(<ServiceItemDetailPage />),
        },
        {
          path: "collections/:id",
          element: withMobileLayout(<CollectionDetailPage />),
        },
        {
          path: "verify-email",
          element: withMobileLayout(<VerifyEmail />, false),
        },
        {
          path: "forgot-password",
          element: withMobileLayout(<ForgotPassword />, false),
        },
        {
          path: "reset-password",
          element: withMobileLayout(<ResetPassword />, false),
        },
        {
          path: "artist-dashboard",
          element: withMobileLayout(<NailArtistDashboardPage />),
        },

        {
          path: "/customer-book",
          element: withMobileLayout(<CustomerBookingPage />),
        },

        {
          path: "/booking/collection-selection",
          element: withMobileLayout(<CollectionSelectionPage />),
        },

        {
          path: "/booking/date-time-selection",
          element: withMobileLayout(<DateTimeSelection />),
        },
        {
          path: "/booking/confirm-booking",
          element: withMobileLayout(<ConfirmBooking />),
        },
        {
          path: "/booking/detail/:id",
          element: withMobileLayout(<BookingDetail />),
        },
        {
          path: "/booking/reschedule/:id",
          element: withMobileLayout(<RescheduleBooking />),
        },
        {
          path: "/booking/rating/:bookingId",
          element: withMobileLayout(<CreateRatingPage />),
        },
        {
          path: "/booking/guest",
          element: withMobileLayout(<GuestBookingPage />),
        },
        {
          path: "/booking/update-guest/:bookingId",
          element: withMobileLayout(<UpdateGuestPage />),
        },
        {
          path: "/staff-dashboard",
          element: withMobileLayout(<StaffDashboardPage />),
        },
        {
          path: "/staff-management",
          element: withMobileLayout(<StaffManagement />),
        },
        {
          path: "/staff/bookings",
          element: withMobileLayout(<StaffBookingView />),
        },
        {
          path: "/staff/:id",
          element: withMobileLayout(<StaffDetailPage />),
        },
        {
          path: "/staff/create",
          element: withMobileLayout(<CreateStaffPage />),
        },
        {
          path: "/staff/edit/:id",
          element: withMobileLayout(<EditStaffPage />),
        },

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
            { path: "ratings", element: <RatingManagement /> },
            { path: "blogs", element: <BlogPostManagement /> },
            { path: "blogs/:id", element: <BlogPostDetailModal /> },

            { path: "invoices", element: <InvoiceManagement /> },
            { path: "invoices/:id", element: <InvoiceDetail /> },

            { path: "subscriptions", element: <SubscriptionManagement /> },
            { path: "collections", element: <CollectionsManagement /> },
          ],
        },

        { path: "*", element: withMobileLayout(<NotFound />, false) },
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
