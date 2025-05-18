import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NewChatButton() {
  return (
    <div className="px-4">
      <Link to="/upload">
        <Button className="w-full justify-start bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 border-none shadow-md shadow-purple-900/20">
          <Plus className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </Link>
    </div>
  );
}
