import { useState } from "react";
import AppSidebar from "@/components/app-sidebar";
import { Outlet } from "react-router-dom";
import "split-pane-react/esm/themes/default.css";

const RootLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div className="flex h-screen">
      <AppSidebar
        isCollapsed={isCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />
      <main className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;