// src/app/routes.tsx
import { createBrowserRouter } from "react-router-dom";

import PublicLayout from "../layouts/PublicLayout";
import CustomerLayout from "../layouts/CustomerLayout";
import VendorLayout from "../layouts/VendorLayout";
import AdminLayout from "../layouts/AdminLayout";

import LoginPage from "../pages/public/LoginPage";
import RegisterPage from "../pages/public/RegisterPage";
import ServicesListPage from "../pages/public/ServicesListPage";
import ServiceDetailsPage from "../pages/public/ServiceDetailsPage";

import RequireAuth from "../auth/RequireAuth";
import RequireRole from "../auth/RequireRole";

// ========== Customer ==========
import CstDashboard from "../pages/customer/Dashboard";
import MyBookings from "../pages/customer/MyBookings";
import MyReviews from "../pages/customer/MyReviews";
import Profile from "../pages/customer/Profile";

// ========== Vendor ==========
import VnDashboard from "../pages/vendor/Dashboard";
import MyServices from "../pages/vendor/MyServices";
import MyProducts from "../pages/vendor/MyProducts";
import VendorBookings from "../pages/vendor/VendorBookings";
import VnNotifications from "../pages/vendor/Notifications";

// ========== Admin ==========
import AdDashboard from "../pages/admin/Dashboard";
import CategoriesPage from "../pages/admin/categories/CategoriesPage";
import VendorsPage from "../pages/admin/VendorsPage";
import ServicesPage from "../pages/admin/ServicesPage";
import UsersPage from "../pages/admin/UsersPage";
import ReviewsPage from "../pages/admin/ReviewsPage";
import BroadcastPage from "../pages/admin/BroadcastPage";

export const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: "/", element: <ServicesListPage /> },
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
      { path: "/services/:id", element: <ServiceDetailsPage /> },
    ],
  },

  {
    element: (
      <RequireAuth>
        <CustomerLayout />
      </RequireAuth>
    ),
    children: [
      { path: "/customer", element: <CstDashboard /> },
      { path: "/customer/bookings", element: <MyBookings /> },
      { path: "/customer/reviews", element: <MyReviews /> },
      { path: "/customer/profile", element: <Profile /> },
    ],
  },

  {
    element: (
      <RequireAuth>
        <RequireRole roles={["Vendor"]}>
          <VendorLayout />
        </RequireRole>
      </RequireAuth>
    ),
    children: [
      { path: "/vendor", element: <VnDashboard /> },
      { path: "/vendor/services", element: <MyServices /> },
      { path: "/vendor/products", element: <MyProducts /> },
      { path: "/vendor/bookings", element: <VendorBookings /> },
      { path: "/vendor/notifications", element: <VnNotifications /> },
    ],
  },

  {
    element: (
      <RequireAuth>
        <RequireRole roles={["Admin"]}>
          <AdminLayout />
        </RequireRole>
      </RequireAuth>
    ),
    children: [
      { path: "/admin", element: <AdDashboard /> },
      { path: "/admin/categories", element: <CategoriesPage /> },
      { path: "/admin/vendors", element: <VendorsPage /> },
      { path: "/admin/services", element: <ServicesPage /> },
      { path: "/admin/users", element: <UsersPage /> },
      { path: "/admin/reviews", element: <ReviewsPage /> },
      { path: "/admin/broadcast", element: <BroadcastPage /> },
    ],
  },
]);

export default router;
