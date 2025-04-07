import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FileText,
  MessageSquare,
  FolderPlus,
  Plus,
  Languages,
  Sparkles,
  ChevronDown,
  PanelLeftClose,
  LogIn
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ACCESS_TOKEN } from "@/common";

export default function AppSidebar() {
  const location = useLocation();
  const pathname = location.pathname;
  const [collapsed, setCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    setIsAuthenticated(!!accessToken);
  }, []);

  const documents = [
    {
      id: "doc1",
      name: "_Building Microservices_Designing Fi...",
      icon: MessageSquare,
    },
    {
      id: "doc2",
      name: "sql_query_optimization_techniques.pdf",
      icon: MessageSquare,
    },
  ];

  if (collapsed) {
    return (
      <div className="black-sidebar-collapsed">
        <Button
          variant="ghost"
          onClick={() => setCollapsed(false)}
          title="Expand sidebar"
        >
          <FileText className="h-5 w-5 text-purple-600"/>
        </Button>
      </div>
    );
  }

  return (
    <div className="black-sidebar h-screen flex flex-col">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-white" />
          <span className="brand-name">ChatEbook</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(true)}
          title="Collapse sidebar"
        >
          <PanelLeftClose className="h-5 w-5 " />
        </Button>
      </div>

      <div className="px-4 space-y-2">
        <Link to={`/`}>
          <Button className="w-full justify-start">
            <Plus className="mr-2 h-4 w-4" />
            New Chat
          </Button>
        </Link>
        <Button className="w-full justify-start">
          <FolderPlus className="mr-2 h-4 w-4" />
          New Folder
        </Button>
      </div>

      {/* Document List */}
      <div className="flex-1 overflow-auto px-4 py-2">
        {documents.map((doc) => (
          <Link to={`/chat/${doc.id}`} key={doc.id}>
            <div
              className={`document-item ${
                pathname === `/pdf/${doc.id}` ? "active" : ""
              }`}
            >
              <doc.icon className="h-4 w-4" />
              <span className="truncate">{doc.name}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Footer */}
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
            {/* Add more languages as needed */}
          </DropdownMenuContent>
        </DropdownMenu>

        {isAuthenticated ? (
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarFallback>Wi</AvatarFallback>
            </Avatar>
            <span>Windy Official</span>
          </div>
        ) : (
          <Link to="/login">
            <Button className="w-full">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </Link>
        )}

        <Button className="w-full">
          <Sparkles className="mr-2 h-4 w-4" />
          Upgrade to Plus
        </Button>
      </div>
    </div>
  );
}
