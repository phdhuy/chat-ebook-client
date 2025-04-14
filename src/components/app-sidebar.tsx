import { Link, useLocation } from "react-router-dom";
import {
  FileText,
  MessageSquare,
  Plus,
  Languages,
  Sparkles,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  LogIn,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMyProfile } from "@/hooks/use-my-profile";
import { useMyConversation } from "@/hooks/use-my-conversation";
import { useRevokeToken } from "@/hooks/use-revoke-token";

interface AppSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function AppSidebar({ isCollapsed, onToggleCollapse }: AppSidebarProps) {
  const location = useLocation();
  const pathname = location.pathname;
  const { data: profile } = useMyProfile();
  const { data: conversations } = useMyConversation();

  const { mutate: revokeToken, isPending: revoking } = useRevokeToken({
    onSuccess: () => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/sign-in";
    },
    onError: (error) => {
      console.error("Failed to revoke token: ", error);
    },
  });

  const handleSignOut = () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      revokeToken({ refresh_token: refreshToken });
    } else {
      window.location.href = "/sign-in";
    }
  };

  if (isCollapsed) {
    return (
      <div className="black-sidebar-collapsed flex justify-center items-center h-full">
        <Button
          variant="ghost"
          onClick={onToggleCollapse}
          title="Expand sidebar"
        >
          <PanelLeftOpen className="h-5 w-5 text-white" />
        </Button>
      </div>
    );
  }

  return (
    <div className="black-sidebar h-screen flex flex-col">
      <div className="flex items-center justify-between p-4">
        <Link to={`/`}>
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-white" />
            <span className="brand-name truncate">ChatEbook</span>
          </div>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          title="Collapse sidebar"
        >
          <PanelLeftClose className="h-5 w-5 text-white" />
        </Button>
      </div>

      <div className="px-4 space-y-2">
        <Link to={`/upload`}>
          <Button className="w-full justify-start truncate">
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </Link>
      </div>

      <div className="flex-1 overflow-auto px-4 py-2">
        {conversations?.data.map((conversation) => (
          <Link to={`/chat/${conversation.id}`} key={conversation.id}>
            <div
              className={`flex items-center space-x-2 p-2 rounded ${
                pathname === `/chat/${conversation.id}` ? "bg-gray-700" : ""
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              <span className="truncate">{conversation.name}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="footer-section p-4 space-y-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              <div className="flex items-center">
                <Languages className="mr-2 h-4 w-4" />
                <span>EN</span>
              </div>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>English</DropdownMenuItem>
            <DropdownMenuItem>Spanish</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {profile?.data.username ? (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage
                    src={profile?.data.avatar_url}
                    referrerPolicy="no-referrer"
                  />
                  <AvatarFallback>Wi</AvatarFallback>
                </Avatar>
                <span className="truncate">{profile?.data.username}</span>
              </div>
              <Button
                variant="ghost"
                onClick={handleSignOut}
                title="Sign Out"
                disabled={revoking}
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>

            <Button className="w-full">
              <Sparkles className="mr-2 h-4 w-4" />
              Upgrade to Plus
            </Button>
          </>
        ) : (
          <Link to="/sign-in">
            <Button className="w-full">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}