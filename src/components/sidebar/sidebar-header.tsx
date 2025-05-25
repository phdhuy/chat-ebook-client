import { Link } from "react-router-dom";
import { FileText, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarHeaderProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function SidebarHeader({
  isCollapsed,
  onToggleCollapse,
}: SidebarHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4">
      {!isCollapsed ? (
        <>
          <Link to="/">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-white" />
              <span className="brand-name truncate">ChatEbook</span>
            </div>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="hover:bg-zinc-800 rounded-full h-8 w-8"
          >
            <PanelLeftClose className="h-5 w-5 text-white" />
          </Button>
        </>
      ) : (
        <Button
          variant="ghost"
          onClick={onToggleCollapse}
          title="Expand sidebar"
          className="p-1"
        >
          <PanelLeftOpen className="h-5 w-5 text-white" />
        </Button>
      )}
    </div>
  );
}