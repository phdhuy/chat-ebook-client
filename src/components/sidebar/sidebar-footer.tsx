import { useState } from "react";
import { Languages, ChevronDown, Sparkles, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import UserProfileModal from "../modal/user-profile-modal";
import { UserInfoResponse } from "@/api/user-api";

interface SidebarFooterProps {
  profile: UserInfoResponse | null;
  onSignOut: () => void;
}

export function SidebarFooter({ profile, onSignOut }: SidebarFooterProps) {
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  return (
    <div className="p-4 space-y-2 border-t border-zinc-800">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex items-center">
            <Languages className="mr-2 h-4 w-4 text-zinc-400" />
            EN <ChevronDown className="ml-1 h-4 w-4 text-zinc-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {["English", "Vietnamese", "French", "German"].map((lang) => (
            <DropdownMenuItem key={lang}>{lang}</DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      {profile ? (
        <>
          <div
            className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/40 cursor-pointer"
            onClick={() => setProfileModalOpen(true)}
          >
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8 ring-2 ring-purple-600/20">
                <AvatarImage
                  src={profile.avatar_url || "/placeholder.svg"}
                  referrerPolicy="no-referrer"
                />
                <AvatarFallback>
                  {profile.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="truncate text-sm font-medium">
                  {profile.username}
                </span>
                <span className="text-xs text-zinc-500">Free Plan</span>
              </div>
            </div>
          </div>
          <Button
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700"
          >
            <Sparkles className="mr-2 h-4 w-4" /> Upgrade to Plus
          </Button>
          <UserProfileModal
            open={profileModalOpen}
            onOpenChange={setProfileModalOpen}
            profile={profile}
            onSignOut={onSignOut}
          />
        </>
      ) : (
        <Button
          asChild
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700"
        >
          <Link to="/sign-in">
            <LogIn className="mr-2 h-4 w-4" /> Sign In
          </Link>
        </Button>
      )}
    </div>
  );
}
