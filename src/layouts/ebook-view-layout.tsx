import AppSidebar from "@/components/app-sidebar";
import ChatPage from "@/pages/chat/chat-page";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import SplitPane, { SashContent } from "split-pane-react";
import "split-pane-react/esm/themes/default.css";

const EbookViewLayout = () => {
  const [sizes1, setSizes1] = useState<(string | number)[]>(["50%", "50%"]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const normalSize = 290;
  const collapsedSize = 50;

  const handleToggleCollapse = () => {
    setIsCollapsed((prev) => !prev);
  };

  const sidebarWidth = isCollapsed ? collapsedSize : normalSize;

  return (
    <div className="h-screen flex">
      <div
        className="bg-black text-white overflow-hidden"
        style={{ width: sidebarWidth }}
      >
        <AppSidebar
          isCollapsed={isCollapsed}
          onToggleCollapse={handleToggleCollapse}
        />
      </div>
      <SplitPane
        sizes={sizes1}
        onChange={setSizes1}
        sashRender={(_, active) => <SashContent active={active} />}
        className="flex-1"
      >
        <div className="h-full overflow-auto bg-gray-100 dark:bg-gray-900">
          <Outlet />
        </div>
        <div className="h-full overflow-auto bg-gray-100 dark:bg-gray-900">
          <ChatPage />
        </div>
      </SplitPane>
    </div>
  );
};

export default EbookViewLayout;