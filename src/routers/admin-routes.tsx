import { ADMIN_ROLE } from "@/common";
import AdminLayout from "@/layouts/admin-layout";
import { useAuthStore } from "@/stores/use-auth-store";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const auth = useAuthStore();

  if (auth.isAuthenticated && auth.role === ADMIN_ROLE) {
    return (
      <AdminLayout>
        <Outlet />
      </AdminLayout>
    );
  }
  return <Navigate to="/" replace />;
};

export default AdminRoute;