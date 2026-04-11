import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { Services } from "../home/Services/Services";
import { AllStaff } from "../home/Staff/AllStaff";
import { Login } from "../pages/auth/Login";
import { Landing } from "../home/landing/Landing";
import { EachStaffDetail } from "../home/Staff/EachStaffDetail";
import { Booking } from "../components/booking/Booking";
import { Gallery } from "../home/gallery/gallery";
import { About } from "../home/About/About";
import { Contact } from "../home/contact/Contact";
import { Register } from "../pages/auth/Register";
import ProtectedRoute from "../components/protectedRoute";
import GuestRoute from "../components/GuestRoute";
import { UserDashboard } from "../components/UserDashboard/UserDashboard";
import { Feedback } from "../pages/Feedback/Feedback";
import { ForgotPassword } from "../pages/auth/ForgotPassword";

// ── Admin imports ─────────────────────────────────────
import { AdminLayout } from "../admin/layouts/AdminLayout";
import { Dashboard } from "../admin/pages/Dashboard";
import { Appointments } from "../admin/pages/Appointments";
import { Services as AdminServices } from "../admin/pages/Services";
import { Staff } from "../admin/pages/Staff";
import { Customers } from "../admin/pages/Customers";
import { Payments } from "../admin/pages/Payments";
import { Gallery as AdminGallery } from "../admin/pages/Gallery";
import { Settings } from "../admin/pages/Settings";
import AdminRoute from "./adminRouter";
import { PrivacyPolicy } from "../components/privacyPolicy";
import { TermsAndConditions } from "../components/termsAndConditions";
import { CancellationPolicy } from "../components/cancellationPolicy";


const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        // errorElement : <ErrorPage/>,
        children: [
            {
                path: "/",
                element: <Landing />
            },
            {
                path: "services",
                element: <Services />
            },
            {
                path: "gallery",
                element: <Gallery />
            },
            {
                path: "staffs",
                element: <AllStaff />
            },
            {
                path: "staffs/:id",
                element: <EachStaffDetail />
            },
            {
                path: "about",
                element: <About />
            },
            {
                path: "contact",
                element: <Contact />
            },
            {
                path: "privacy-policy",
                element: <PrivacyPolicy />
            },
            {
                path: "terms-and-condition",
                element: <TermsAndConditions />
            },
            {
                path: "cancellation-policy",
                element: <CancellationPolicy />
            },
            {
                path: "booking",
                element: (
                    <ProtectedRoute>
                        <Booking />
                    </ProtectedRoute>
                )
            },
            {
                path: "/auth/login",
                element: (
                    <GuestRoute>
                        <Login />
                    </GuestRoute>
                )
            },
            {
                path: "/auth/register",
                element: (
                    <GuestRoute>
                        <Register />
                    </GuestRoute>
                )
            },
            {
                path: "/auth/forgot-password",
                element: (
                    <GuestRoute>
                        <ForgotPassword />
                    </GuestRoute>
                )
            },
            {
                path: "/userDashboard",
                element: (
                    <ProtectedRoute>
                        <UserDashboard />
                    </ProtectedRoute>
                )
            },

            // {
            //     path: "/terms-condition",
            //     element: <TermsCondition />
            // }
        ]
    },
    // ── Feedback page (standalone, no auth) ─────────
    {
        path: "/feedback",
        element: <Feedback />,
    },
    // ── Admin Panel Routes ────────────────────────────
    {
        path: "/admin",
        element: (
            <AdminRoute>
                <AdminLayout />
            </AdminRoute>
        ),
        children: [
            { index: true, element: <Dashboard /> },

            { path: "appointments", element: <Appointments /> },

            { path: "services", element: <AdminServices /> },

            { path: "staff", element: <Staff /> },

            { path: "customers", element: <Customers /> },

            { path: "payments", element: <Payments /> },

            { path: "gallery", element: <AdminGallery /> },

            { path: "settings", element: <Settings /> },
        ],
    }
]

);

export const AppRouter = () => {

    return <RouterProvider router={router}>

    </RouterProvider>
}