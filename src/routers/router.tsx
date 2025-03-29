import AuthLayout from "@/layouts/auth-layout";
import RootLayout from "@/layouts/root-layout";
import LoginPage from "@/pages/auth/login-page";
import NotFoundPage from "@/pages/error/notfound-page";
import HomePage from "@/pages/home/home-page";
import { useRoutes } from "react-router-dom";
import RegisterPage from "@/pages/auth/register-page";

const AppRoutes = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <AuthLayout />,
      children: [
        { path: "login", element: <LoginPage /> },
        { path: "register", element: <RegisterPage />}
      ],
    },
    {
      path: "/",
      element: <RootLayout />,
      children: [
        { index: true, element: <HomePage /> },
      ],
    },
    { path: "*", element: <NotFoundPage /> },
  ]);

  return routes;
};

export default AppRoutes;
