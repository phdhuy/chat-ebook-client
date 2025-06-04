import { useState } from "react";
import {
  Languages,
  ChevronDown,
  Sparkles,
  LogIn,
  Settings,
  ChevronRight,
} from "lucide-react";
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
import type { UserInfoResponse } from "@/api/user-api";

interface SidebarFooterProps {
  profile: UserInfoResponse | null;
  onSignOut: () => void;
}

export function SidebarFooter({ profile, onSignOut }: SidebarFooterProps) {
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="p-4 space-y-3 border-t border-zinc-800/50 bg-gradient-to-t from-zinc-950/50 to-transparent">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center justify-between w-full hover:bg-zinc-800/60 transition-all duration-200 rounded-xl"
          >
            <div className="flex items-center">
              <Languages className="mr-2 h-4 w-4 text-zinc-400" />
              <span className="text-sm">EN</span>
            </div>
            <ChevronDown className="h-4 w-4 text-zinc-400" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {["English", "Vietnamese", "French", "German"].map((lang) => (
            <DropdownMenuItem key={lang}>{lang}</DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {profile ? (
        <>
          <div
            className="group relative flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-zinc-900/60 to-zinc-800/40 border border-zinc-800/50 cursor-pointer transition-all duration-300 hover:from-zinc-800/80 hover:to-zinc-700/60 hover:border-zinc-700/60 hover:shadow-lg hover:shadow-purple-500/10 hover:scale-[1.02] active:scale-[0.98]"
            onClick={() => setProfileModalOpen(true)}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="flex items-center space-x-3 relative z-10">
              <div className="relative">
                <Avatar className="h-10 w-10 ring-2 ring-purple-600/30 group-hover:ring-purple-500/50 transition-all duration-300">
                  <AvatarImage
                    src={profile.avatar_url || "/placeholder.svg"}
                    referrerPolicy="no-referrer"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white font-semibold">
                    {profile.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-900" />
              </div>

              <div className="flex flex-col min-w-0 flex-1">
                <span className="truncate text-sm font-medium text-white group-hover:text-purple-200 transition-colors duration-200">
                  {profile.username}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-zinc-400 group-hover:text-zinc-300 transition-colors duration-200">
                    Free Plan
                  </span>
                  <div className="w-1 h-1 bg-zinc-600 rounded-full" />
                </div>
              </div>
            </div>

            <div className="relative z-10 flex items-center space-x-1">
              <Settings
                className={`h-4 w-4 text-zinc-500 group-hover:text-purple-400 transition-all duration-300 ${
                  isHovered ? "rotate-90" : ""
                }`}
              />
              <ChevronRight
                className={`h-4 w-4 text-zinc-500 group-hover:text-purple-400 transition-all duration-300 ${
                  isHovered ? "translate-x-1" : ""
                }`}
              />
            </div>

            <div className="absolute inset-0 rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 scale-0 group-active:scale-100 transition-transform duration-200 rounded-xl" />
            </div>
          </div>

          <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02] active:scale-[0.98] group">
            <Sparkles className="mr-2 h-4 w-4 group-hover:animate-pulse" />
            Upgrade to Plus
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
          className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02] active:scale-[0.98] group"
        >
          <Link to="/sign-in">
            <LogIn className="mr-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform duration-200" />
            Sign In
          </Link>
        </Button>
      )}
    </div>
  );
}
