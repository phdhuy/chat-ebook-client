import { ACCESS_TOKEN } from "@/common";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const isAuthenticated = !!localStorage.getItem(ACCESS_TOKEN);

  return isAuthenticated ? <Outlet /> : <Navigate to="/sign-in" replace />;
};

export default PrivateRoute;
