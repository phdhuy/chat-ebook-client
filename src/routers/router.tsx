import AuthLayout from "@/layouts/auth-layout";
import NotFoundPage from "@/pages/error/notfound-page";
import HomePage from "@/pages/home/home-page";
import { useRoutes } from "react-router-dom";
import UploadFilePage from "@/pages/upload/upload-file-page";
import EbookViewPage from "@/pages/ebook-view/ebook-view-page";
import SignInPage from "@/pages/auth/sign-in-page";
import SignUpPage from "@/pages/auth/sign-up-page";
import AdminDashboardPage from "@/pages/admin/admin-dashboard";
import AdminUsersPage from "@/pages/admin/admin-users";
import UserRoute from "./user-routes";
import AdminRoute from "./admin-routes";
import AdminDocumentsPage from "@/pages/admin/admin-documents";
import AdminConversationsPage from "@/pages/admin/admin-conversations";
import AdminFeedbackPage from "@/pages/admin/admin-feedbacks";
import LandingPage from "@/pages/landing/landing-page";

const AppRoutes = () => {
  const routes = useRoutes([
      {
      path: "/",
      element: <LandingPage />,
    },
    {
      path: "/",
      element: <AuthLayout />,
      children: [
        { path: "sign-in", element: <SignInPage /> },
        { path: "sign-up", element: <SignUpPage /> },
      ],
    },
    {
      path: "/",
      element: <UserRoute />,
      children: [
        { path: "app", element: <HomePage /> },
        { path: "upload", element: <UploadFilePage /> },
        { path: "chat/:id", element: <EbookViewPage /> },
      ],
    },
    {
      path: "/admin",
      element: <AdminRoute />,
      children: [
        { index: true, element: <AdminDashboardPage /> },
        { path: "users", element: <AdminUsersPage /> },
        { path: "documents", element: <AdminDocumentsPage /> },
        { path: "conversations", element: <AdminConversationsPage /> },
        { path: "feedbacks", element: <AdminFeedbackPage />}
      ],
    },
    { path: "*", element: <NotFoundPage /> },
  ]);

  return routes;
};

export default AppRoutes;
