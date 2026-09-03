import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "@/layouts/app-layout";
import { AuthLayout } from "@/layouts/auth-layout";
import { ProtectedRoute } from "@/routes/protected-route";
import { HomePage } from "@/pages/home-page";
import { LoginPage } from "@/pages/login-page";
import { RegisterPage } from "@/pages/register-page";
import { BookingPage } from "@/pages/booking-page";
import { BookingConfirmationPage } from "@/pages/booking-confirmation-page";
import { MyBookingsPage } from "@/pages/my-bookings-page";
import { BookingDetailPage } from "@/pages/booking-detail-page";
import { AccountPage } from "@/pages/account-page";
import { NotFoundPage } from "@/pages/not-found-page";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/booking", element: <BookingPage /> },
          { path: "/booking/confirmation/:bookingReference", element: <BookingConfirmationPage /> },
          { path: "/bookings", element: <MyBookingsPage /> },
          { path: "/bookings/:bookingReference", element: <BookingDetailPage /> },
          { path: "/account", element: <AccountPage /> },
        ],
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "/login", element: <LoginPage /> },
      { path: "/register", element: <RegisterPage /> },
    ],
  },
  { path: "*", element: <NotFoundPage /> },
]);
