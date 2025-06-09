import React from "react";
import { useState } from "react";
import {
  Bell,
  Clock,
  CreditCard,
  ExternalLink,
  LogOut,
  MessageSquare,
  Settings,
  User,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import UsageContent from "../usage-content-page";

interface UserProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile?: {
    username: string;
    email?: string;
    avatar_url?: string;
  };
  onSignOut?: () => void;
}

export default function UserProfileModal({
  open,
  onOpenChange,
  profile,
  onSignOut,
}: UserProfileModalProps) {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1200px] p-0 gap-0 border-none shadow-2xl bg-white dark:bg-zinc-950 rounded-2xl overflow-hidden">
        <DialogHeader className="p-8 border-b border-gray-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900">
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
            Account Settings
          </DialogTitle>
        </DialogHeader>

        <div className="flex h-[600px]">
          <div className="w-[240px] border-r border-gray-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900">
            <nav className="flex flex-col p-4 space-y-2">
              <NavItem
                icon={<User size={20} />}
                label="My Profile"
                active={activeTab === "profile"}
                onClick={() => setActiveTab("profile")}
              />
              <NavItem
                icon={<BarChart3 size={20} />}
                label="API Usage"
                active={activeTab === "usage"}
                onClick={() => setActiveTab("usage")}
              />
              <NavItem
                icon={<Settings size={20} />}
                label="Preferences"
                active={activeTab === "preference"}
                onClick={() => setActiveTab("preference")}
              />
              <NavItem
                icon={<MessageSquare size={20} />}
                label="Response Model"
                active={activeTab === "model"}
                onClick={() => setActiveTab("model")}
              />
              <NavItem
                icon={<CreditCard size={20} />}
                label="Subscription"
                active={activeTab === "subscription"}
                onClick={() => setActiveTab("subscription")}
              />
              <NavItem
                icon={<Clock size={20} />}
                label="Billing History"
                active={activeTab === "billing"}
                onClick={() => setActiveTab("billing")}
              />
              <NavItem
                icon={<Bell size={20} />}
                label="Guide"
                active={activeTab === "guide"}
                onClick={() => setActiveTab("guide")}
                hasExternalLink
              />
            </nav>
            <div className="absolute bottom-0 left-0 w-[240px] p-4 border-t border-gray-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900">
              <NavItem
                icon={<LogOut size={20} />}
                label="Sign Out"
                onClick={() => {
                  if (onSignOut) {
                    onSignOut();
                    onOpenChange(false);
                  }
                }}
                variant="danger"
              />
            </div>
          </div>

          <div className="flex-1 p-8 overflow-y-auto bg-white dark:bg-zinc-950">
            {activeTab === "profile" && <ProfileContent profile={profile} />}
            {activeTab === "usage" && <UsageContent />}
            {activeTab === "preference" && (
              <div className="text-gray-600 dark:text-gray-400">
                Preference settings coming soon...
              </div>
            )}
            {activeTab === "model" && (
              <div className="text-gray-600 dark:text-gray-400">
                Response model settings coming soon...
              </div>
            )}
            {activeTab === "subscription" && (
              <div className="text-gray-600 dark:text-gray-400">
                Subscription settings coming soon...
              </div>
            )}
            {activeTab === "billing" && (
              <div className="text-gray-600 dark:text-gray-400">
                Billing history coming soon...
              </div>
            )}
            {activeTab === "guide" && (
              <div className="text-gray-600 dark:text-gray-400">
                Guide information coming soon...
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function NavItem({
  icon,
  label,
  active = false,
  hasExternalLink = false,
  variant = "default",
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  hasExternalLink?: boolean;
  variant?: "default" | "danger";
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium w-full text-left transition-all duration-200 group",
        active
          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 transform scale-[1.02]"
          : variant === "danger"
          ? "text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/20"
          : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-zinc-800/60 hover:shadow-md"
      )}
      onClick={onClick}
    >
      <span
        className={cn(
          "transition-colors duration-200",
          active
            ? "text-white"
            : "text-gray-500 dark:text-gray-400 group-hover:text-current"
        )}
      >
        {icon}
      </span>
      <span className="font-medium">{label}</span>
      {hasExternalLink && (
        <ExternalLink size={16} className="ml-auto opacity-60" />
      )}
    </button>
  );
}

function ProfileContent({
  profile,
}: {
  profile?: { username: string; email?: string; avatar_url?: string };
}) {
  const firstLetter = profile?.username
    ? profile.username.substring(0, 1).toUpperCase()
    : "U";

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-8">
        <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-blue-500/25">
          {firstLetter}
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300 uppercase tracking-wide">
            Display Name
          </h3>
          <Input
            defaultValue={profile?.username || ""}
            className="max-w-md border-gray-300 dark:border-zinc-700 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl bg-white dark:bg-zinc-900"
          />
        </div>
      </div>

      <Card className="border-gray-200/50 dark:border-zinc-800/50 bg-white dark:bg-zinc-900 shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">
            Account Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Email Address
            </h4>
            <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-zinc-800 px-4 py-3 rounded-lg">
              {profile?.email || "No email provided"}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300 uppercase tracking-wide">
              Password
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Set a unique password to protect your ChatEbook account.
            </p>
            <Button
              variant="outline"
              className="border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl"
            >
              Update Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}