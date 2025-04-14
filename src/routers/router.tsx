import AuthLayout from "@/layouts/auth-layout";
import RootLayout from "@/layouts/root-layout";
import NotFoundPage from "@/pages/error/notfound-page";
import HomePage from "@/pages/home/home-page";
import { useRoutes } from "react-router-dom";
import UploadFilePage from "@/pages/upload/upload-file-page";
import EbookViewPage from "@/pages/view/ebook-view-page";
import SignInPage from "@/pages/auth/sign-in-page";
import SignUpPage from "@/pages/auth/sign-up-page";
import EbookViewLayout from "@/layouts/ebook-view-layout";

const AppRoutes = () => {
  const routes = useRoutes([
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
      element: <RootLayout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "upload", element: <UploadFilePage /> },
      ],
    },
    {
      path: "/",
      element: <EbookViewLayout />,
      children: [
        { path: "chat/:id", element: <EbookViewPage /> }
      ],
    },
    { path: "*", element: <NotFoundPage /> },
  ]);

  return routes;
};

export default AppRoutes;
