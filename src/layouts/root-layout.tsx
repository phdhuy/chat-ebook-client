import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/sidebar/app-sidebar";
import "split-pane-react/esm/themes/default.css";
import useCollapseStore from "@/stores/use-collapse-store";

const RootLayout = () => {
  const { isCollapsed, width, toggle } = useCollapseStore();

  return (
    <div className="flex h-screen">
      <div className="bg-black text-white overflow-hidden" style={{ width }}>
        <AppSidebar isCollapsed={isCollapsed} onToggleCollapse={toggle} />
      </div>
      <main className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;