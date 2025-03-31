import { useState } from "react";
import AppSidebar from "@/components/app-sidebar";
import { Outlet } from "react-router-dom";
import SplitPane, { Pane } from "split-pane-react";
import "split-pane-react/esm/themes/default.css";

const RootLayout = () => {
  const [sizes, setSizes] = useState([290, "auto"]);

  return (
    <div style={{ height: "100vh" }}>
      <SplitPane
        split="vertical"
        sizes={sizes}
        onChange={setSizes}
        sashRender={() => <div className="w-1 bg-gray-400 cursor-col-resize" />}
      >
        {/* Sidebar Pane */}
        <Pane minSize={100} maxSize="50%">
          <div className="h-full bg-black text-white">
            <AppSidebar />
          </div>
        </Pane>

        {/* Main Content Pane */}
        <Pane>
          <div className="h-full overflow-auto bg-gray-100 dark:bg-gray-900">
            <Outlet />
          </div>
        </Pane>
      </SplitPane>
    </div>
  );
};

export default RootLayout;