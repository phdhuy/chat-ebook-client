import { ADMIN_ROLE } from "@/common";
import RootLayout from "@/layouts/root-layout";
import EbookViewLayout from "@/layouts/ebook-view-layout";
import { useAuthStore } from "@/stores/use-auth-store";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const UserRoute = () => {
  const auth = useAuthStore();
  const location = useLocation();

  if (!auth.isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  if (auth.role === ADMIN_ROLE) {
    return <Navigate to="/admin" replace />;
  }

  const isEbookView = location.pathname.startsWith("/chat");
  const Layout = isEbookView ? EbookViewLayout : RootLayout;

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

export default UserRoute;