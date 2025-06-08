import { Button } from "@/components/ui/button";
import { LayoutDashboard } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/use-auth-store";
import { ADMIN_ROLE } from "@/common";

export default function NotFoundPage() {
  const auth = useAuthStore();
  const isAdmin = auth.isAuthenticated && auth.role === ADMIN_ROLE;
  const redirectPath = isAdmin ? "/admin" : "/";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center bg-black text-white p-6">
      <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
      <p className="text-gray-400 mb-8">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <Button asChild>
        <Link to={redirectPath} className="flex items-center gap-2">
          <LayoutDashboard className="h-4 w-4" />
          Back to {isAdmin ? "Admin Dashboard" : "HomePage"}
        </Link>
      </Button>
    </div>
  );
}
