import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import SplitPane, { Pane, SashContent } from "split-pane-react";
import "split-pane-react/esm/themes/default.css";
import AppSidebar from "@/components/app-sidebar";
import ChatPage from "@/pages/chat/chat-page";

const EbookViewLayout = () => {
  const [sizes1, setSizes1] = useState<(string | number)[]>(["50%", "auto"]);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [minSizes, setMinSizes] = useState([700, 600]);

  const normalSize = 290;
  const collapsedSize = 50;

  useEffect(() => {
    const calculateMinSizes = () => {
      const sidebarWidth = isCollapsed ? collapsedSize : normalSize;
      const availableWidth = window.innerWidth - sidebarWidth;

      const leftMin = availableWidth * 0.45;
      const rightMin = availableWidth * 0.3;

      setMinSizes([leftMin, rightMin]);
    };

    calculateMinSizes();

    window.addEventListener("resize", calculateMinSizes);

    return () => window.removeEventListener("resize", calculateMinSizes);
  }, [isCollapsed]);

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
        <Pane minSize={minSizes[0]}>
          <div className="h-full overflow-auto bg-gray-100 dark:bg-gray-900">
            <Outlet />
          </div>
        </Pane>

        <Pane minSize={minSizes[1]}>
          <div className="h-full overflow-auto bg-gray-100 dark:bg-gray-900">
            <ChatPage />
          </div>
        </Pane>
      </SplitPane>
    </div>
  );
};

export default EbookViewLayout;